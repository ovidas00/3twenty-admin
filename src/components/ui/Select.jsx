import React from "react";

const Select = ({
  id,
  name,
  label,
  hideLabel = false,
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
  options = [],
  placeholder = "Select an option",
  ...props
}) => {
  // Base classes for all selects
  const baseClasses =
    "block w-full rounded-lg border focus:outline-none transition duration-200 text-slate-900";

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
    sm: "px-1 py-2.5 text-sm",
    md: "px-1 py-3 text-base",
    lg: "px-1 py-4 text-lg",
  };

  // Disabled/read-only classes
  const stateClasses = disabled
    ? "opacity-60 cursor-not-allowed bg-slate-100"
    : readOnly
    ? "bg-slate-50 cursor-default"
    : "bg-white";

  // Combine classes
  const selectClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${validationClasses[validationState]}
    ${sizeClasses[size]}
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

      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        required={required}
        disabled={disabled}
        className={selectClasses}
        {...props}
      >
        {placeholder && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {validationState === "error" && errorMessage && (
        <p className={errorClasses}>{errorMessage}</p>
      )}
    </div>
  );
};

export default Select;
