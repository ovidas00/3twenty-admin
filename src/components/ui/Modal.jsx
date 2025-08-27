import { useEffect, useRef, useCallback } from "react";

const Modal = ({
  title,
  isOpen,
  onClose,
  children,
  className = "",
  closeOnOverlayClick = true,
  showCloseButton = true,
  initialFocusRef,
  ariaLabel,
  size = "md", // sm, md, lg, xl
}) => {
  const modalRef = useRef(null);

  // Size classes mapping
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-xl",
    lg: "max-w-3xl",
    xl: "max-w-5xl",
  };

  // Handle Escape key
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    },
    [isOpen, onClose]
  );

  // Trap focus inside modal
  const trapFocus = useCallback(
    (e) => {
      if (!isOpen || !modalRef.current) return;

      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    },
    [isOpen]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keydown", trapFocus);

    // Prevent body scrolling when modal is open
    if (isOpen) {
      document.body.style.overflow = "hidden";

      // Focus on initial element or first focusable element
      if (initialFocusRef && initialFocusRef.current) {
        initialFocusRef.current.focus();
      } else if (modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        }
      }
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keydown", trapFocus);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleKeyDown, trapFocus, initialFocusRef]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 min-h-screen bg-black/50 z-50 transition-all duration-300 ease-in-out ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={closeOnOverlayClick ? onClose : undefined}
        aria-hidden="true"
      ></div>

      {/* Modal */}
      <div
        ref={modalRef}
        className={`fixed inset-0 z-50 flex items-center justify-center p-3 transition-all duration-300 ease-in-out ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        aria-label={ariaLabel}
      >
        <div
          className={`bg-white rounded-lg shadow-lg w-full overflow-hidden transform transition-all duration-300 ease-in-out ${
            isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
          } ${sizeClasses[size]} ${className}`}
          style={{ transformOrigin: "center" }}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center p-4 border-b border-gray-200">
              {title && (
                <h2 id="modal-title" className="text-xl font-semibold me-auto">
                  {title}
                </h2>
              )}
              {showCloseButton && (
                <button
                  className="p-1 rounded-full cursor-pointer hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={onClose}
                  aria-label="Close modal"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.7"
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="max-h-[70vh] overflow-y-auto p-4">{children}</div>
        </div>
      </div>
    </>
  );
};

export default Modal;
