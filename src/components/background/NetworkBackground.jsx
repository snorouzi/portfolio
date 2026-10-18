import { useCallback, useEffect, useRef } from 'react';

const DEFAULT_CONFIG = {
  nodeCountDesktop: 60,
  nodeCountTablet: 35,
  nodeCountMobile: 18,
  maxNodeCount: 80,
  connectionDistance: 140,
  nodeRadius: 1.5,
  nodeOpacity: 0.6,
  connectionLineWidth: 0.6,
  connectionLineOpacity: 0.16,
  movementSpeed: 0.12,
  maxDevicePixelRatio: 2,
  enableDepthEffect: true,
  enableMouseInteraction: true,
  perspectiveStrength: 0.08,
  ambientDrift: 0.06,
  parallaxStrength: 6,
  maxParallaxOffset: 8,
  interactionRadius: 120,
  interactionStrength: 4,
  pointerSmoothing: 0.12,
};

const getNodeCount = (width, config) => {
  if (width <= 640) {
    return config.nodeCountMobile;
  }
  if (width <= 1024) {
    return config.nodeCountTablet;
  }
  return config.nodeCountDesktop;
};

const createNodes = (width, height, count, baseMovementSpeed) => {
  const nodes = [];
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = baseMovementSpeed * (0.3 + Math.random() * 0.7);
    const z = 0.25 + Math.random() * 0.75;
    const baseSpeed = speed * (0.7 + z * 0.6);
    const phase = Math.random() * Math.PI * 2;
    nodes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: Math.cos(angle) * baseSpeed,
      vy: Math.sin(angle) * baseSpeed,
      z,
      phase,
      radius: DEFAULT_CONFIG.nodeRadius,
      opacity: DEFAULT_CONFIG.nodeOpacity,
      dispX: 0,
      dispY: 0,
      targetDispX: 0,
      targetDispY: 0,
    });
  }
  return nodes;
};

export default function NetworkBackground({ config = DEFAULT_CONFIG, className = '' }) {
  const canvasRef = useRef(null);
  const animationFrameIdRef = useRef(null);
  const nodesRef = useRef([]);
  const canvasSizeRef = useRef({ width: 0, height: 0, dpr: 1 });
  const nodeColorRef = useRef('rgba(112, 65, 196, 0.5)');
  const lineColorRef = useRef('rgba(112, 65, 196, 0.16)');
  const prefersReducedMotionRef = useRef(false);
  const isInitializedRef = useRef(false);
  const pointerRef = useRef({ x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, active: false });

  const updateColors = useCallback(() => {
    try {
      const root = document.documentElement;
      const styles = getComputedStyle(root);
      const nodeColor = styles.getPropertyValue('--network-node-color').trim();
      const lineColor = styles.getPropertyValue('--network-line-color').trim();
      if (nodeColor) nodeColorRef.current = nodeColor;
      if (lineColor) lineColorRef.current = lineColor;
    } catch {
      nodeColorRef.current = 'rgba(112, 65, 196, 0.5)';
      lineColorRef.current = 'rgba(112, 65, 196, 0.16)';
    }
  }, []);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, config.maxDevicePixelRatio);
    const width = Math.floor(rect.width);
    const height = Math.floor(rect.height);

    if (
      canvas.width === width * dpr &&
      canvas.height === height * dpr &&
      canvasSizeRef.current.width === width
    ) {
      return;
    }

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvasSizeRef.current = { width, height, dpr };

    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const targetCount = Math.min(getNodeCount(width, config), config.maxNodeCount);
    const currentCount = nodesRef.current.length;
    if (currentCount !== targetCount) {
      if (targetCount > currentCount) {
        const extra = createNodes(width, height, targetCount - currentCount, config.movementSpeed);
        nodesRef.current.push(...extra);
      } else {
        nodesRef.current = nodesRef.current.slice(0, targetCount);
      }
    }

    nodesRef.current.forEach((node) => {
      if (node.x > width) node.x = width * Math.random();
      if (node.y > height) node.y = height * Math.random();
      if (node.x < 0) node.x = 0;
      if (node.y < 0) node.y = 0;
      node.dispX = 0;
      node.dispY = 0;
      node.targetDispX = 0;
      node.targetDispY = 0;
    });
  }, [config]);
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { width, height } = canvasSizeRef.current;

    ctx.clearRect(0, 0, width, height);

    const connectionDist = config.connectionDistance;
    const distSq = connectionDist * connectionDist;
    const maxParallax = config.maxParallaxOffset;
    const parallaxX = -config.parallaxStrength * (pointerRef.current.x - 0.5) * maxParallax;
    const parallaxY = -config.parallaxStrength * (pointerRef.current.y - 0.5) * maxParallax;
    const ptr = pointerRef.current;

    for (let i = 0; i < nodesRef.current.length; i++) {
      const node = nodesRef.current[i];
      for (let j = i + 1; j < nodesRef.current.length; j++) {
        const other = nodesRef.current[j];
        const npx = node.x + parallaxX * node.z + node.dispX;
        const npy = node.y + parallaxY * node.z + node.dispY;
        const opx = other.x + parallaxX * other.z + other.dispX;
        const opy = other.y + parallaxY * other.z + other.dispY;
        const dx = npx - opx;
        const dy = npy - opy;
        const dSq = dx * dx + dy * dy;
        if (dSq < distSq) {
          const d = Math.sqrt(dSq);
          let opacity = (1 - d / connectionDist) * config.connectionLineOpacity;
          if (config.enableMouseInteraction) {
            const cx = (npx + opx) / 2;
            const cy = (npy + opy) / 2;
            const cdx = cx - ptr.tx * width;
            const cdy = cy - ptr.ty * height;
            const cd = Math.sqrt(cdx * cdx + cdy * cdy);
            if (cd < config.interactionRadius * 0.7) {
              const factor = 1 - cd / (config.interactionRadius * 0.7);
              opacity *= 1 + factor * 0.3;
            }
          }
          if (opacity < 0) opacity = 0;
          ctx.beginPath();
          ctx.moveTo(npx, npy);
          ctx.lineTo(opx, opy);
          ctx.strokeStyle = lineColorRef.current.replace(/[\d.]+\)$/, `${opacity})`);
          ctx.lineWidth = config.connectionLineWidth * (0.8 + node.z * 0.4);
          ctx.stroke();
        }
      }
    }

    nodesRef.current.forEach((node) => {
      const px = node.x + parallaxX * node.z + node.dispX;
      const py = node.y + parallaxY * node.z + node.dispY;
      const depthScale = config.enableDepthEffect ? 0.7 + node.z * 0.6 : 1;
      const radius = node.radius * depthScale;
      const depthOpacity = config.enableDepthEffect
        ? node.opacity * (0.8 + node.z * 0.2)
        : node.opacity;
      ctx.beginPath();
      ctx.arc(px, py, radius, 0, Math.PI * 2);
      ctx.fillStyle = nodeColorRef.current.replace(/[\d.]+\)$/, `${depthOpacity})`);
      ctx.fill();
    });
  }, [config]);
  const animateRef = useRef(null);
  const animate = useCallback(() => {
    if (prefersReducedMotionRef.current) {
      draw();
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const { width, height } = canvasSizeRef.current;

    const t = Date.now();
    const ptrSmooth = config.pointerSmoothing;
    pointerRef.current.x += (pointerRef.current.tx - pointerRef.current.x) * ptrSmooth;
    pointerRef.current.y += (pointerRef.current.ty - pointerRef.current.y) * ptrSmooth;

    nodesRef.current.forEach((node) => {
      const drift = config.enableDepthEffect
        ? config.ambientDrift * (0.6 + node.z * 0.8)
        : config.ambientDrift;
      const osc = Math.sin((t / 10000 + node.phase) * (0.5 + node.z * 0.5));
      node.x += node.vx + osc * drift;
      node.y += node.vy + Math.cos((t / 12000 + node.phase) * (0.4 + node.z * 0.4)) * drift * 0.5;

      if (node.x < 0 || node.x > width) {
        node.vx *= -1;
        node.x = Math.max(0, Math.min(width, node.x));
      }
      if (node.y < 0 || node.y > height) {
        node.vy *= -1;
        node.y = Math.max(0, Math.min(height, node.y));
      }

      if (config.enableMouseInteraction) {
        const dx = node.x - pointerRef.current.tx * width;
        const dy = node.y - pointerRef.current.ty * height;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const r = config.interactionRadius * (0.8 + (1 - node.z) * 0.4);
        if (dist < r && dist > 0.0001) {
          const strength = (1 - dist / r) * config.interactionStrength * (0.5 + (1 - node.z) * 0.5);
          const nx = dx / dist;
          const ny = dy / dist;
          node.targetDispX = nx * strength;
          node.targetDispY = ny * strength;
        } else {
          node.targetDispX = 0;
          node.targetDispY = 0;
        }
      } else {
        node.targetDispX = 0;
        node.targetDispY = 0;
      }
      node.dispX += (node.targetDispX - node.dispX) * 0.08;
      node.dispY += (node.targetDispY - node.dispY) * 0.08;
    });

    draw();
    animationFrameIdRef.current = requestAnimationFrame(() => animateRef.current?.());
  }, [config, draw]);
  useEffect(() => {
    animateRef.current = animate;
  }, [animate]);

  useEffect(() => {
    updateColors();
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotionRef.current = motionQuery.matches;

    const handleMotionChange = (e) => {
      prefersReducedMotionRef.current = e.matches;
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
      if (!e.matches) {
        animationFrameIdRef.current = requestAnimationFrame(() => animateRef.current?.());
      } else {
        draw();
      }
    };

    motionQuery.addEventListener('change', handleMotionChange);

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
      draw();
    });

    const handlePointerMove = (e) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      pointerRef.current.tx = Math.max(0, Math.min(1, x));
      pointerRef.current.ty = Math.max(0, Math.min(1, y));
    };
    const handlePointerLeave = () => {
      pointerRef.current.tx = 0.5;
      pointerRef.current.ty = 0.5;
    };

    const canvasEl = canvasRef.current;
    if (canvasEl) {
      resizeObserver.observe(canvasEl);
      canvasEl.addEventListener('pointermove', handlePointerMove, { passive: true });
      canvasEl.addEventListener('pointerleave', handlePointerLeave);
      canvasEl.addEventListener('pointerout', handlePointerLeave);
    }
    window.addEventListener('pointerleave', handlePointerLeave);

    resizeCanvas();
    draw();
    isInitializedRef.current = true;

    if (!prefersReducedMotionRef.current) {
      animationFrameIdRef.current = requestAnimationFrame(() => animateRef.current?.());
    }

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange);
      resizeObserver.disconnect();
      if (canvasEl) {
        canvasEl.removeEventListener('pointermove', handlePointerMove);
        canvasEl.removeEventListener('pointerleave', handlePointerLeave);
        canvasEl.removeEventListener('pointerout', handlePointerLeave);
      }
      window.removeEventListener('pointerleave', handlePointerLeave);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [animate, draw, resizeCanvas, updateColors]);

  useEffect(() => {
    if (isInitializedRef.current) {
      resizeCanvas();
      draw();
    }
  }, [config, draw, resizeCanvas]);

  return (
    <canvas ref={canvasRef} className={`network-background ${className}`} aria-hidden="true" />
  );
}
