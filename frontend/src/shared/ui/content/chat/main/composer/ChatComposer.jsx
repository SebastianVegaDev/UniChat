import "./ChatComposer.css";
import { Image, Paperclip, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { usePreferenceTexts } from "../../../../../../feature/preferences/context/PreferencesContext.js";

function ChatComposer({ currentUser, activeChannel, isChatLocked, handleSubmit }) {
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [photoPreviewUrl, setPhotoPreviewUrl] = useState("");
    const photoInputRef = useRef(null);
    const isComposerDisabled = isChatLocked && currentUser.role !== "teacher";
    const { chat } = usePreferenceTexts();

    async function onSubmit(e) {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const body = formData.get("messageBody")?.trim();

        if ((!body && !selectedPhoto) || isComposerDisabled) return;

        const messageData = {
            channelId: activeChannel.id,
            body: body ?? "",
            photoFile: selectedPhoto
        };

        await handleSubmit?.(messageData);

        form.reset();
        clearSelectedPhoto();
    }

    function openPhotoPicker() {
        if (isComposerDisabled) return;

        photoInputRef.current?.click();
    }

    function handlePhotoChange(event) {
        const file = event.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            event.target.value = "";
            return;
        }

        setSelectedPhoto(file);
        setPhotoPreviewUrl(URL.createObjectURL(file));
    }

    function clearSelectedPhoto() {
        setSelectedPhoto(null);
        setPhotoPreviewUrl("");

        if (photoInputRef.current) {
            photoInputRef.current.value = "";
        }
    }

    useEffect(() => {
        return () => {
            if (photoPreviewUrl) {
                URL.revokeObjectURL(photoPreviewUrl);
            }
        };
    }, [photoPreviewUrl]);

    return (
        <form className="chat-content-main-toolbar" autoComplete="off" onSubmit={onSubmit}>
            {selectedPhoto && (
                <div className="chat-content-main-toolbar-photo-preview">
                    <Image />
                    <span>{selectedPhoto.name}</span>
                    <button type="button" onClick={clearSelectedPhoto} aria-label="Remove photo">
                        <X />
                    </button>
                </div>
            )}
            <div className="chat-content-main-toolbar-clip-wrapper">
                <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handlePhotoChange}
                    hidden
                />
                <button
                    type="button"
                    className="chat-content-main-toolbar-clip"
                    disabled={isComposerDisabled}
                    onClick={openPhotoPicker}
                    title={chat.selectPhoto}
                >
                    <Paperclip />
                </button>
            </div>
            <input
                name="messageBody"
                className={`chat-content-main-toolbar-input ${isComposerDisabled ? "disabled" : ""}`}
                placeholder={isComposerDisabled ? chat.lockedPlaceholder : chat.messagePlaceholder}
                autoComplete="off"
                disabled={isComposerDisabled}
            />
            <button className="chat-content-main-toolbar-send" type="submit" disabled={isComposerDisabled}>
                <Send />
            </button>
        </form>
    );
}

export default ChatComposer;
