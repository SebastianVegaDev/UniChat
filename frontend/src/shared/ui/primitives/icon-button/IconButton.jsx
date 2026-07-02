import "./IconButton.css";

function IconButton({ icon: Icon, label, variant = "secondary", size = "md", className = "", type = "button", ...props }) {
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