import "./ChatPhotoPreview.css";
import { Image, X } from "lucide-react";
import IconButton from "../../../../shared/ui/primitives/icon-button/IconButton.jsx";

function ChatPhotoPreview({ selectedPhoto, clearSelectedPhoto }) {
    if (!selectedPhoto) return null;

    return (
        <div className="chat-photo-preview">
            <Image />
            <span>{selectedPhoto.name}</span>

            <IconButton
                icon={X}
                label="Remove photo"
                size="sm"
                variant="secondary"
                onClick={clearSelectedPhoto}
            />
        </div>
    );
}

export default ChatPhotoPreview;