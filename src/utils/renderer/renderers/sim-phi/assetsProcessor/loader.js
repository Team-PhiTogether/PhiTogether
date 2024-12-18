import bitmapUrl from "@renderers/sim-phi/assetsProcessor/external/createImageBitmap.js?url";
import webpUrl from "@renderers/sim-phi/assetsProcessor/external/webp-bundle.js?url";
export const urls = {
    jszip: ["/lib/jszip.js"],
    bitmap: [bitmapUrl],
    webp: [webpUrl],
};

export function loadJS(urls) {
    const arr = Array.from(
        urls instanceof Array ? urls : arguments,
        (i) => new URL(i, location).href
    );
    const args = (function* (arg) {
        yield* arg;
    })(arr);
    const load = (url) =>
        new Promise((resolve, reject) => {
            if (!url)
                return reject(
                    new DOMException(
                        "All urls are invalid\n" + arr.join("\n"),
                        "NetworkError"
                    )
                );
            const script = document.createElement("script");
            script.onload = () => resolve(script);
            script.onerror = () =>
                load(args.next().value)
                    .then((script) => resolve(script))
                    .catch((e) => reject(e));
            script.src = url;
            script.crossOrigin = "anonymous";
            document.head.appendChild(script);
        });
    return load(args.next().value);
}