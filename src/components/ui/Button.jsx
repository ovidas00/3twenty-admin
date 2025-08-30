import React from "react";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled = false,
  className = "",
  icon,
  iconPosition = "left",
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-lg cursor-pointer transition-all duration-200";

  const variantClasses = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm hover:shadow-md",
    "primary-dark":
      "bg-blue-800 text-white hover:bg-blue-900 focus:ring-blue-600 shadow-sm hover:shadow-md",
    secondary:
      "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500 shadow-sm hover:shadow-md",
    "secondary-dark":
      "bg-gray-700 text-white hover:bg-gray-800 focus:ring-gray-600 shadow-sm hover:shadow-md",
    success:
      "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-sm hover:shadow-md",
    "success-dark":
      "bg-green-800 text-white hover:bg-green-900 focus:ring-green-600 shadow-sm hover:shadow-md",
    danger:
      "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm hover:shadow-md",
    "danger-dark":
      "bg-red-800 text-white hover:bg-red-900 focus:ring-red-600 shadow-sm hover:shadow-md",
    outline:
      "border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 focus:ring-blue-500",
    "outline-dark":
      "border border-gray-600 bg-transparent text-gray-300 hover:bg-gray-800 focus:ring-blue-500",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-blue-500",
    "ghost-dark":
      "bg-transparent text-gray-300 hover:bg-gray-800 focus:ring-blue-500",
    light:
      "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 focus:ring-blue-500 shadow-sm",
    dark: "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-500 shadow-sm hover:shadow-md",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base",
    xl: "px-6 py-3 text-base",
  };

  const iconSizeClasses = {
    sm: "w-4 h-4",
    md: "w-4 h-4",
    lg: "w-5 h-5",
    xl: "w-5 h-5",
  };

  const disabledClasses =
    disabled || isLoading ? "opacity-50 cursor-not-allowed" : "";

  const buttonClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${disabledClasses}
    ${className}
  `
    .replace(/\s+/g, " ")
    .trim();

  const LoadingSpinner = () => (
    <svg
      className={`animate-spin ${iconSizeClasses[size]}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );

  return (
    <button
      className={buttonClasses}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <LoadingSpinner />}

      {icon && iconPosition === "left" && !isLoading && (
        <span
          className={`${children ? "mr-1.5" : ""} ${iconSizeClasses[size]}`}
        >
          {icon}
        </span>
      )}

      {children}

      {icon && iconPosition === "right" && !isLoading && (
        <span
          className={`${children ? "ml-1.5" : ""} ${iconSizeClasses[size]}`}
        >
          {icon}
        </span>
      )}
    </button>
  );
};

export default Button;
