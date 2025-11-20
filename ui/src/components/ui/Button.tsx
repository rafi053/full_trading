import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";
import clsx from "clsx";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children?: ReactNode;
  variant?: "primary" | "secondary" | "danger" | "success" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: ReactNode;
}

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  className,
  disabled,
  ...props
}: ButtonProps) => {
  const variantClasses = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-700 hover:bg-gray-600 text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    success: "bg-green-600 hover:bg-green-700 text-white",
    ghost: "bg-transparent hover:bg-gray-800 text-gray-300",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.05 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.95 }}
      className={clsx(
        "rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : icon ? (
        <>
          {icon}
          {children}
        </>
      ) : (
        children
      )}
    </motion.button>
  );
};
