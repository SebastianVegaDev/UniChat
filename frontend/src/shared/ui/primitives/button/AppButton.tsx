import "./AppButton.css";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface AppButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    icon?: LucideIcon;
    variant?: "primary" | "secondary" | "danger" | string;
    size?: "sm" | "md" | "lg" | string;
}

function AppButton({
    children,
    icon: Icon,
    variant = "primary",
    size = "md",
    className = "",
    type = "button",
    ...props
}: AppButtonProps) {
    const buttonClassName = [
        "app-button",
        `app-button-${variant}`,
        `app-button-${size}`,
        className
    ].filter(Boolean).join(" ");

    return (
        <button className={buttonClassName} type={type} {...props}>
            {Icon && <Icon />}
            <span>{children}</span>
        </button>
    );
}

export default AppButton;
