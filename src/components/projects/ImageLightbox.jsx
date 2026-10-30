import { useCallback, useEffect, useRef, useState } from 'react';
import { resolveProjectAsset } from '../../lib/assets';

const MIN_SCALE = 1;
const MAX_SCALE = 5;
const ZOOM_STEP = 0.25;

export default function ImageLightbox({
  isOpen,
  onClose,
  src,
  alt,
  triggerRef,
  triggerElement,
  images = [],
  currentIndex = -1,
  onNavigate,
}) {
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const lastFocusedRef = useRef(null);
  const contentRef = useRef(null);
  const imageRef = useRef(null);

  const [scale, setScale] = useState(1);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef({ x: 0, y: 0, translateX: 0, translateY: 0 });

  const resetZoom = useCallback(() => {
    setScale(1);
    setTranslateX(0);
    setTranslateY(0);
    setIsPanning(false);
  }, []);

  const handleZoomIn = useCallback(() => {
    setScale((prev) => Math.min(MAX_SCALE, prev + ZOOM_STEP));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale((prev) => {
      const next = Math.max(MIN_SCALE, prev - ZOOM_STEP);
      if (next === 1) {
        setTranslateX(0);
        setTranslateY(0);
      }
      return next;
    });
  }, []);

  const handleResetZoom = useCallback(() => {
    resetZoom();
  }, [resetZoom]);

  const hasNav = Array.isArray(images) && images.length > 1 && currentIndex >= 0;
  const prevIndex = hasNav ? (currentIndex - 1 + images.length) % images.length : -1;
  const nextIndex = hasNav ? (currentIndex + 1) % images.length : -1;

  const handlePrev = useCallback(() => {
    if (!hasNav) return;
    resetZoom();
    onNavigate?.(prevIndex);
  }, [hasNav, onNavigate, prevIndex, resetZoom]);

  const handleNext = useCallback(() => {
    if (!hasNav) return;
    resetZoom();
    onNavigate?.(nextIndex);
  }, [hasNav, onNavigate, nextIndex, resetZoom]);

  useEffect(() => {
    if (!isOpen) {
      // Return a cleanup that will reset zoom before the next effect runs (when isOpen becomes true)
      return () => {
        resetZoom();
      };
    }

    // isOpen is true
    lastFocusedRef.current = triggerElement || triggerRef?.current || document.activeElement;

    const dialog = dialogRef.current;
    const closeButton = closeButtonRef.current;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === '+' || event.key === '=') {
        event.preventDefault();
        handleZoomIn();
        return;
      }

      if (event.key === '-') {
        event.preventDefault();
        handleZoomOut();
        return;
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        handlePrev();
        return;
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        handleNext();
        return;
      }

      if (event.key === '0') {
        event.preventDefault();
        handleResetZoom();
        return;
      }

      if (event.key === 'Tab' && dialog) {
        const focusableElements = dialog.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const focusableArray = Array.from(focusableElements).filter(
          (el) => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true'
        );

        if (focusableArray.length === 0) {
          event.preventDefault();
          return;
        }

        const first = focusableArray[0];
        const last = focusableArray[focusableArray.length - 1];

        if (event.shiftKey) {
          if (document.activeElement === first) {
            event.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }
      }
    };

    const handleBackdropClick = (event) => {
      if (event.target === dialog || event.target.classList?.contains('image-lightbox__backdrop')) {
        onClose();
      }
    };

    const handleImageClick = (event) => {
      event.stopPropagation();
    };

    document.addEventListener('keydown', handleKeyDown);
    dialog.addEventListener('click', handleBackdropClick);
    const imageElement = imageRef.current || dialog.querySelector('.image-lightbox__image');
    if (imageElement) {
      imageElement.addEventListener('click', handleImageClick);
    }

    // Move focus to close button when opening
    if (closeButton) {
      closeButton.focus();
    }

    // Prevent body scroll while modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      dialog.removeEventListener('click', handleBackdropClick);
      if (imageElement) {
        imageElement.removeEventListener('click', handleImageClick);
      }
      document.body.style.overflow = '';

      // Restore focus to trigger element
      const triggerElement = lastFocusedRef.current;
      if (triggerElement && typeof triggerElement.focus === 'function') {
        triggerElement.focus();
      }

      // Reset zoom in cleanup to avoid setState in effect body
      resetZoom();
    };
  }, [
    isOpen,
    onClose,
    triggerRef,
    triggerElement,
    resetZoom,
    handleZoomIn,
    handleZoomOut,
    handleResetZoom,
    handlePrev,
    handleNext,
  ]);

  const handleWheel = useCallback(
    (event) => {
      if (!isOpen) return;
      event.preventDefault();
      const delta = event.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
      setScale((prev) => {
        const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, prev + delta));
        if (next === 1) {
          setTranslateX(0);
          setTranslateY(0);
        }
        return next;
      });
    },
    [isOpen]
  );

  const handleMouseDown = useCallback(
    (event) => {
      if (scale <= 1) return;
      event.preventDefault();
      setIsPanning(true);
      panStartRef.current = {
        x: event.clientX,
        y: event.clientY,
        translateX,
        translateY,
      };
    },
    [scale, translateX, translateY]
  );

  const handleMouseMove = useCallback(
    (event) => {
      if (!isPanning || scale <= 1) return;
      event.preventDefault();
      const deltaX = event.clientX - panStartRef.current.x;
      const deltaY = event.clientY - panStartRef.current.y;
      setTranslateX(panStartRef.current.translateX + deltaX);
      setTranslateY(panStartRef.current.translateY + deltaY);
    },
    [isPanning, scale]
  );

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  useEffect(() => {
    if (!isPanning) return;
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isPanning, handleMouseMove, handleMouseUp]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!isOpen) {
    return null;
  }

  const assetUrl = resolveProjectAsset(src);
  const displayAlt = alt?.trim() || 'Project image preview';
  const imageSrc = assetUrl || src;

  const imageStyle = {
    transform: `scale(${scale}) translate(${translateX / scale}px, ${translateY / scale}px)`,
    cursor: scale > 1 ? (isPanning ? 'grabbing' : 'grab') : 'default',
  };

  return (
    <dialog ref={dialogRef} className="image-lightbox" aria-label="Image preview" open>
      <div className="image-lightbox__backdrop" onWheel={handleWheel}>
        <div className="image-lightbox__topbar">
          <div className="image-lightbox__controls" role="group" aria-label="Image zoom controls">
            {hasNav && (
              <button
                type="button"
                className="image-lightbox__control"
                onClick={handlePrev}
                aria-label="Previous image"
                title="Previous (Left arrow)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
            )}
            {hasNav && (
              <button
                type="button"
                className="image-lightbox__control"
                onClick={handleNext}
                aria-label="Next image"
                title="Next (Right arrow)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            )}
            <button
              type="button"
              className="image-lightbox__control"
              onClick={handleZoomOut}
              disabled={scale <= MIN_SCALE}
              aria-label="Zoom out"
              title="Zoom out (-)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
            </button>
            <button
              type="button"
              className="image-lightbox__control"
              onClick={handleResetZoom}
              disabled={scale === 1 && translateX === 0 && translateY === 0}
              aria-label="Reset zoom to original"
              title="Original size (0)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="15 3 21 3 21 9" />
                <polyline points="9 21 3 21 3 15" />
                <line x1="21" y1="3" x2="14" y2="10" />
                <line x1="3" y1="21" x2="10" y2="14" />
              </svg>
            </button>
            <button
              type="button"
              className="image-lightbox__control"
              onClick={handleZoomIn}
              disabled={scale >= MAX_SCALE}
              aria-label="Zoom in"
              title="Zoom in (+)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                <line x1="11" y1="8" x2="11" y2="14" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
            </button>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            className="image-lightbox__close"
            onClick={handleClose}
            aria-label="Close image preview"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="image-lightbox__content" ref={contentRef}>
          {imageSrc ? (
            <img
              ref={imageRef}
              src={imageSrc}
              alt={displayAlt}
              className="image-lightbox__image"
              decoding="async"
              style={imageStyle}
              onMouseDown={handleMouseDown}
              draggable={false}
            />
          ) : (
            <img
              ref={imageRef}
              src={src}
              alt={displayAlt}
              className="image-lightbox__image"
              decoding="async"
              style={imageStyle}
              onMouseDown={handleMouseDown}
              draggable={false}
            />
          )}
        </div>
      </div>
    </dialog>
  );
}
