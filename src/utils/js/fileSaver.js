// fileSaver.js
import saveAs from "file-saver";

export function downloadText(fileName, text, type = "plain/text") {
    if (window.nativeApi) {
        window.nativeApi.saveAs.bind(window.nativeApi)(text, fileName);
    } else if (
        window.webkit &&
        window.webkit.messageHandlers &&
        window.webkit.messageHandlers.downloadText
    ) {
        window.webkit.messageHandlers.downloadText.postMessage({
            fileName,
            text,
        });
    } else {
        saveAs(new Blob([text], { type }), fileName);
    }
}
