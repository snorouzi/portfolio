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
    nodes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: DEFAULT_CONFIG.nodeRadius,
      opacity: DEFAULT_CONFIG.nodeOpacity,
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

    for (let i = 0; i < nodesRef.current.length; i++) {
      const node = nodesRef.current[i];
      for (let j = i + 1; j < nodesRef.current.length; j++) {
        const other = nodesRef.current[j];
        const dx = node.x - other.x;
        const dy = node.y - other.y;
        const dSq = dx * dx + dy * dy;
        if (dSq < distSq) {
          const d = Math.sqrt(dSq);
          const opacity = (1 - d / connectionDist) * config.connectionLineOpacity;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(other.x, other.y);
          // Apply opacity to line color
          ctx.strokeStyle = lineColorRef.current.replace(/[\d.]+\)$/, `${opacity})`);
          ctx.lineWidth = config.connectionLineWidth;
          ctx.stroke();
        }
      }
    }

    nodesRef.current.forEach((node) => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fillStyle = nodeColorRef.current;
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

    nodesRef.current.forEach((node) => {
      node.x += node.vx;
      node.y += node.vy;

      if (node.x < 0 || node.x > width) {
        node.vx *= -1;
        node.x = Math.max(0, Math.min(width, node.x));
      }
      if (node.y < 0 || node.y > height) {
        node.vy *= -1;
        node.y = Math.max(0, Math.min(height, node.y));
      }
    });

    draw();
    animationFrameIdRef.current = requestAnimationFrame(() => animateRef.current?.());
  }, [draw]);

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
        animationFrameIdRef.current = requestAnimationFrame(animate);
      } else {
        draw();
      }
    };

    motionQuery.addEventListener('change', handleMotionChange);

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
      draw();
    });

    if (canvasRef.current) {
      resizeObserver.observe(canvasRef.current);
    }

    resizeCanvas();
    draw();
    isInitializedRef.current = true;

    if (!prefersReducedMotionRef.current) {
      animationFrameIdRef.current = requestAnimationFrame(animate);
    }

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange);
      resizeObserver.disconnect();
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
