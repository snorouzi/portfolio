import { useCallback, useEffect, useRef } from 'react';
import { resolveProjectAsset } from '../../lib/assets';

export default function ImageLightbox({ isOpen, onClose, src, alt, triggerRef, triggerElement }) {
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const lastFocusedRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    lastFocusedRef.current = triggerElement || triggerRef?.current || document.activeElement;

    const dialog = dialogRef.current;
    const closeButton = closeButtonRef.current;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
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
    const imageElement = dialog.querySelector('.image-lightbox__image');
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
    };
  }, [isOpen, onClose, triggerRef, triggerElement]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!isOpen) {
    return null;
  }

  const assetUrl = resolveProjectAsset(src);
  const displayAlt = alt?.trim() || 'Project image preview';

  return (
    <dialog ref={dialogRef} className="image-lightbox" aria-label="Image preview" open>
      <div className="image-lightbox__backdrop">
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
        <div className="image-lightbox__content">
          {assetUrl ? (
            <img
              src={assetUrl}
              alt={displayAlt}
              className="image-lightbox__image"
              decoding="async"
            />
          ) : (
            <img src={src} alt={displayAlt} className="image-lightbox__image" decoding="async" />
          )}
        </div>
      </div>
    </dialog>
  );
}
