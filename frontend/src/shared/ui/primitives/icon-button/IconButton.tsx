import "./IconButton.css";
import type { ButtonHTMLAttributes } from "react";
import type { LucideIcon } from "lucide-react";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    icon: LucideIcon;
    label: string;
    variant?: "primary" | "secondary" | "danger" | string;
    size?: "sm" | "md" | "lg" | string;
}

function IconButton({
    icon: Icon,
    label,
    variant = "secondary",
    size = "md",
    className = "",
    type = "button",
    ...props
}: IconButtonProps) {
    const buttonClassName = [
        "icon-button",
        `icon-button-${variant}`,
        `icon-button-${size}`,
        className
    ].filter(Boolean).join(" ");

    return (
        <button className={buttonClassName} type={type} aria-label={label} title={label} {...props}>
            <Icon />
        </button>
    );
}

export default IconButton;
