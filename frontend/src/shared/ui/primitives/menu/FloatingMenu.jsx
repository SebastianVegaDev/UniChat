import "./FloatingMenu.css";

function FloatingMenu({ children, className = "", style, menuRef }) {
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

export function FloatingMenuButton({ children, onClick, variant = "default" }) {
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