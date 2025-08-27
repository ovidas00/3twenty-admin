import React from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

const Alert = ({ type, message, onClose, className = "" }) => {
  const baseStyles = "p-2 rounded-lg border flex items-start gap-3";

  const typeStyles = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
  };

  const iconStyles = {
    success: "text-green-500",
    error: "text-red-500",
  };

  const IconComponent = type === "success" ? CheckCircle : XCircle;

  return (
    <div
      className={`${baseStyles} ${typeStyles[type]} ${className}`}
      role="alert"
    >
      <IconComponent
        className={`w-5 h-5 mt-0.5 flex-shrink-0 ${iconStyles[type]}`}
      />
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-auto p-1 hover:opacity-70 transition-opacity"
          aria-label="Close alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Alert;
