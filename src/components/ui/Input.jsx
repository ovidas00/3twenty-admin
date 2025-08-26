import React from "react";

const Input = ({
  id,
  name,
  type = "text",
  label,
  hideLabel = false,
  icon: Icon,
  endIcon: EndIcon,
  placeholder = "",
  value,
  onChange,
  onBlur,
  required = false,
  disabled = false,
  readOnly = false,
  variant = "default",
  size = "md",
  validationState = "default", // default, valid, error
  errorMessage,
  className = "",
  containerClassName = "",
  ...props
}) => {
  // Base classes that apply to all inputs
  const baseClasses =
    "block w-full rounded-lg border focus:outline-none transition duration-200 text-slate-900 placeholder-slate-500";

  // Variant classes
  const variantClasses = {
    default:
      "border-slate-300 focus:ring-1 focus:ring-slate-900 focus:border-slate-900",
    primary:
      "border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
    success:
      "border-green-300 focus:ring-2 focus:ring-green-500 focus:border-green-500",
    error:
      "border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500",
    outline:
      "border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm",
  };

  // Validation state classes
  const validationClasses = {
    default: "",
    valid: "border-green-500 focus:ring-green-500 focus:border-green-500",
    error: "border-red-500 focus:ring-red-500 focus:border-red-500",
  };

  // Size classes
  const sizeClasses = {
    sm: "py-2 text-sm",
    md: "py-3 text-base",
    lg: "py-4 text-lg",
  };

  // Padding based on icon presence
  const paddingClasses = Icon ? "pl-10 pr-3" : "px-3";
  const endPaddingClasses = EndIcon ? "pr-10" : "";

  // Disabled and read-only states
  const stateClasses = disabled
    ? "opacity-60 cursor-not-allowed bg-slate-100"
    : readOnly
    ? "bg-slate-50 cursor-default"
    : "bg-white";

  // Combine all classes
  const inputClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${validationClasses[validationState]}
    ${sizeClasses[size]}
    ${paddingClasses}
    ${endPaddingClasses}
    ${stateClasses}
    ${className}
  `
    .replace(/\s+/g, " ")
    .trim();

  // Label classes
  const labelClasses = `
    block text-sm font-medium text-slate-700 mb-2
    ${hideLabel ? "sr-only" : ""}
  `
    .replace(/\s+/g, " ")
    .trim();

  // Error message classes
  const errorClasses = "mt-1 text-sm text-red-600";

  return (
    <div className={containerClassName}>
      {label && (
        <label htmlFor={id} className={labelClasses}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon
              className={`h-5 w-5 ${
                validationState === "error" ? "text-red-500" : "text-slate-400"
              }`}
            />
          </div>
        )}

        <input
          id={id}
          name={name}
          type={type}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={inputClasses}
          placeholder={placeholder}
          {...props}
        />

        {EndIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {EndIcon}
          </div>
        )}
      </div>

      {validationState === "error" && errorMessage && (
        <p className={errorClasses}>{errorMessage}</p>
      )}
    </div>
  );
};

export default Input;
