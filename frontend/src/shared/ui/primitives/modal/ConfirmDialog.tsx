import "./ConfirmDialog.css";
import { Trash2 } from "lucide-react";
import AppButton from "../button/AppButton.jsx";

interface ConfirmDialogProps {
    title: string;
    description: string;
    cancelLabel: string;
    confirmLabel: string;
    onCancel: () => void;
    onConfirm: () => void;
}

function ConfirmDialog({
    title,
    description,
    cancelLabel,
    confirmLabel,
    onCancel,
    onConfirm
}: ConfirmDialogProps) {
    return (
        <div className="confirm-dialog">
            <button className="confirm-dialog-backdrop" type="button" onClick={onCancel} />
            <div className="confirm-dialog-panel">
                <h3>{title}</h3>
                <p>{description}</p>
                <div className="confirm-dialog-actions">
                    <AppButton variant="secondary" onClick={onCancel}>
                        {cancelLabel}
                    </AppButton>
                    <AppButton icon={Trash2} variant="danger" onClick={onConfirm}>
                        {confirmLabel}
                    </AppButton>
                </div>
            </div>
        </div>
    );
}

export default ConfirmDialog;
