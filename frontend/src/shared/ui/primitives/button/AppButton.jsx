import "./AppButton.css";

function AppButton({ children, icon: Icon, variant = "primary", size = "md", className = "", type = "button", ...props }) {
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