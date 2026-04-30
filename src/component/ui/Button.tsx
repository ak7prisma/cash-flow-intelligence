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
  justify?: "center" | "between";
  iconPosition?: "left" | "right";
  showIconBg?: boolean;
}

export default function Button({
  text,
  variant = "primary",
  to,
  icon,
  className = "",
  onClick,
  type = "button",
  justify,
  iconPosition = "right",
  showIconBg = true,
}: Readonly<ButtonProps>) {
  
  const config = VARIANT_CONFIGS[variant];
  const finalJustify = justify ?? (icon ? "between" : "center");
  
  const baseStyles = "w-full transition-all duration-300 active:scale-[0.98] flex items-center";
  const alignmentStyles = finalJustify === "between" ? "justify-between" : "justify-center gap-2";
  const combinedClassName = `${baseStyles} ${config.container} ${alignmentStyles} ${className}`;

  const renderIcon = () => {
    if (!icon) return null;
    
    const iconClasses = showIconBg 
      ? config.icon 
      : config.icon.replaceAll(/(?:[^ ]*:)?(?:bg|p|w|h|rounded)-\S+/g, "").trim();

    return (
      <span className={`flex items-center justify-center transition-transform ${iconClasses}`}>
        {icon}
      </span>
    );
  };

  const renderContent = () => (
    <>
      {iconPosition === "left" && renderIcon()}
      <span className={config.text}>{text}</span>
      {iconPosition === "right" && renderIcon()}
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
