import "./FloatingMenu.css";
import type { CSSProperties, MouseEventHandler, ReactNode, RefObject } from "react";

interface FloatingMenuProps {
    children: ReactNode;
    className?: string;
    style?: CSSProperties;
    menuRef?: RefObject<HTMLDivElement | null>;
}

interface FloatingMenuButtonProps {
    children: ReactNode;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    variant?: string;
}

function FloatingMenu({ children, className = "", style, menuRef }: FloatingMenuProps) {
    const menuClassName = ["floating-menu", className].filter(Boolean).join(" ");

    return (
        <div
            ref={menuRef}
            className={menuClassName}
            style={style}
            onClick={(event) => event.stopPropagation()}
        >
            {children}
        </div>
    );
}

export function FloatingMenuButton({ children, onClick, variant = "default" }: FloatingMenuButtonProps) {
    return (
        <button
            className={`floating-menu-button floating-menu-button-${variant}`}
            type="button"
            onClick={onClick}
        >
            {children}
        </button>
    );
}

export default FloatingMenu;
