export function getSpeechText(text = "") {
    return text
        .replace(/[*_`#>]/g, "")
        .replace(/^- /gm, "")
        .replace(/\n{2,}/g, ". ")
        .replace(/\n/g, ". ")
        .replace(/  +/g, " ")
        .trim()
        .split(/[.!?]+/)
        .map((sentence) => sentence.trim())
        .filter((sentence) => sentence.length > 0)
        .join(". ");
}

export function getAudioUrlFromBase64(audioBase64, contentType = "audio/mpeg") {
    const byteCharacters = atob(audioBase64);
    const byteNumbers = Array.from(byteCharacters, (character) => character.charCodeAt(0));
    const byteArray = new Uint8Array(byteNumbers);
    const audioBlob = new Blob([byteArray], { type: contentType });

    return URL.createObjectURL(audioBlob);
}