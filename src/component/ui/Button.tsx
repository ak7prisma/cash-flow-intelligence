import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { VARIANT_CONFIGS } from "../../utils/buttonVariant";

interface ButtonProps {
  text: string;
  variant?: "primary" | "secondary" | "ghost";
  to?: string;
  icon?: ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export default function Button({
  text,
  variant = "primary",
  to,
  icon,
  className = "",
  onClick,
  type = "button",
}: Readonly<ButtonProps>) {
  
  const config = VARIANT_CONFIGS[variant];
  
  const baseStyles = "w-full transition-all duration-300 active:scale-[0.98] flex items-center";
  const alignmentStyles = icon ? "justify-between" : "justify-center";
  const combinedClassName = `${baseStyles} ${config.container} ${alignmentStyles} ${className}`;

  const renderContent = () => (
    <>
      <span className={config.text}>{text}</span>
      {icon && (
        <span className={`flex items-center justify-center transition-transform ${config.icon}`}>
          {icon}
        </span>
      )}
    </>
  );

  if (to) {
    return (
      <NavLink to={to} onClick={onClick} className={combinedClassName}>
        {renderContent()}
      </NavLink>
    );
  }

  return (
    <button type={type} onClick={onClick} className={combinedClassName}>
      {renderContent()}
    </button>
  );
}
