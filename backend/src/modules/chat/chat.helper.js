export function getChatPhotoData(file) {
    if (!file) return {};

    return {
        attachmentType: "photo",
        attachmentUrl: `/uploads/chat/${file.filename}`,
        attachmentName: file.originalname
    };
}
