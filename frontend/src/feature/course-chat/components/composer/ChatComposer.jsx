import "./ChatComposer.css";
import { Paperclip, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { usePreferenceTexts } from "../../../preferences/context/PreferencesContext.js";
import IconButton from "../../../../shared/ui/primitives/icon-button/IconButton.jsx";
import ChatPhotoPreview from "./ChatPhotoPreview.jsx";
import { canUseComposer } from "../../helpers/chatMessages.js";
import { createPhotoPreviewUrl, isImageFile, revokePhotoPreviewUrl } from "../../helpers/chatAttachments.js";

function ChatComposer({ currentUser, activeChannel, isChatLocked, handleSubmit }) {
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [photoPreviewUrl, setPhotoPreviewUrl] = useState("");
    const photoInputRef = useRef(null);
    const canWrite = canUseComposer({ currentUser, isChatLocked });
    const { chat } = usePreferenceTexts();

    async function onSubmit(event) {
        event.preventDefault();

        const form = event.currentTarget;
        const formData = new FormData(form);
        const body = formData.get("messageBody")?.trim();

        if ((!body && !selectedPhoto) || !canWrite) return;

        await handleSubmit?.({
            channelId: activeChannel.id,
            body: body ?? "",
            photoFile: selectedPhoto
        });

        form.reset();
        clearSelectedPhoto();
    }

    function openPhotoPicker() {
        if (!canWrite) return;

        photoInputRef.current?.click();
    }

    function handlePhotoChange(event) {
        const file = event.target.files?.[0];

        if (!file) return;

        if (!isImageFile(file)) {
            event.target.value = "";
            return;
        }

        revokePhotoPreviewUrl(photoPreviewUrl);
        setSelectedPhoto(file);
        setPhotoPreviewUrl(createPhotoPreviewUrl(file));
    }

    function clearSelectedPhoto() {
        revokePhotoPreviewUrl(photoPreviewUrl);
        setSelectedPhoto(null);
        setPhotoPreviewUrl("");

        if (photoInputRef.current) {
            photoInputRef.current.value = "";
        }
    }

    useEffect(() => {
        return () => {
            revokePhotoPreviewUrl(photoPreviewUrl);
        };
    }, [photoPreviewUrl]);

    return (
        <form className="chat-composer" autoComplete="off" onSubmit={onSubmit}>
            <ChatPhotoPreview
                selectedPhoto={selectedPhoto}
                clearSelectedPhoto={clearSelectedPhoto}
            />

            <div className="chat-composer-clip">
                <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handlePhotoChange}
                    hidden
                />

                <IconButton
                    icon={Paperclip}
                    label={chat.selectPhoto}
                    size="lg"
                    variant="secondary"
                    disabled={!canWrite}
                    onClick={openPhotoPicker}
                />
            </div>

            <input
                name="messageBody"
                className={`chat-composer-input ${!canWrite ? "disabled" : ""}`}
                placeholder={!canWrite ? chat.lockedPlaceholder : chat.messagePlaceholder}
                autoComplete="off"
                disabled={!canWrite}
            />

            <IconButton
                icon={Send}
                label={chat.send ?? "Send"}
                type="submit"
                size="lg"
                variant="primary"
                disabled={!canWrite}
            />
        </form>
    );
}

export default ChatComposer;