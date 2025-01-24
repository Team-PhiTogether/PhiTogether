import { canvasRGBA as StackBlurCanvasRGBA } from "stackblur-canvas";
import { createCanvas } from "../utils/canvas.js";

/**
 * 图片模糊(css filter或StackBlur)
 * @param {ImageBitmap} img
 */
function imgBlur(img) {
    const canvas = createCanvas(img.width * 0.9, img.height * 0.9);
    canvas.style.cssText += ";overflow:hidden;";
    const ctx = canvas.getContext("2d");
    if (typeof ctx.filter == "string") {
        ctx.filter = "blur(60px)";
        ctx.drawImage(img, -img.width * 0.05, -img.height * 0.05);
    } else {
        const w = canvas.width;
        const h = canvas.height;
        ctx.drawImage(img, -img.width * 0.05, -img.height * 0.05);

        StackBlurCanvasRGBA(canvas, 0, 0, w, h, Math.ceil(Math.min(w, h) * 0.1));
    }
    return createImageBitmap(canvas);
}

/**
 * 给图片上色(limit用于解决iOS的InvalidStateError)
 * @param {ImageBitmap} img
 */
function imgShader(img, color, returnCanvas = false, limit = 512) {
    const dataRGBA = hex2rgba(color);
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext("2d", { willReadFrequently: true }); //warning
    ctx.drawImage(img, 0, 0);
    for (let dy = 0; dy < img.height; dy += limit) {
        for (let dx = 0; dx < img.width; dx += limit) {
            const imgData = ctx.getImageData(dx, dy, limit, limit);
            for (let i = 0; i < imgData.data.length / 4; i++) {
                imgData.data[i * 4] *= dataRGBA[0] / 255;
                imgData.data[i * 4 + 1] *= dataRGBA[1] / 255;
                imgData.data[i * 4 + 2] *= dataRGBA[2] / 255;
                imgData.data[i * 4 + 3] *= dataRGBA[3] / 255;
            }
            ctx.putImageData(imgData, dx, dy);
        }
    }
    if (returnCanvas) return canvas;
    return createImageBitmap(canvas);
}

/**
 * 给图片纯色(limit用于解决iOS的InvalidStateError)
 * @param {ImageBitmap} img
 */
function imgPainter(img, color, limit = 512) {
    const dataRGBA = hex2rgba(color);
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext("2d", { willReadFrequently: true }); //warning
    ctx.drawImage(img, 0, 0);
    for (let dy = 0; dy < img.height; dy += limit) {
        for (let dx = 0; dx < img.width; dx += limit) {
            const imgData = ctx.getImageData(dx, dy, limit, limit);
            for (let i = 0; i < imgData.data.length / 4; i++) {
                imgData.data[i * 4] = dataRGBA[0];
                imgData.data[i * 4 + 1] = dataRGBA[1];
                imgData.data[i * 4 + 2] = dataRGBA[2];
                imgData.data[i * 4 + 3] *= dataRGBA[3] / 255;
            }
            ctx.putImageData(imgData, dx, dy);
        }
    }
    return createImageBitmap(canvas);
}

/**
 * 切割图片
 * @param {ImageBitmap} img
 * @param {number} [limitX]
 * @param {number} [limitY]
 */
function imgSplit(img, limitX, limitY) {
    limitX = Math.floor(limitX) || Math.min(img.width, img.height);
    limitY = Math.floor(limitY) || limitX;
    const arr = [];
    for (let dy = 0; dy < img.height; dy += limitY) {
        for (let dx = 0; dx < img.width; dx += limitX) {
            arr.push(createImageBitmap(img, dx, dy, limitX, limitY));
        }
    }
    return Promise.all(arr);
}

//十六进制color转rgba数组
function hex2rgba(color) {
    const ctx = createCanvas(1, 1).getContext("2d");
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    return ctx.getImageData(0, 0, 1, 1).data;
}

//rgba数组(0-1)转十六进制
function rgba2hex(...rgba) {
    return (
        "#" +
        rgba.map(i => ("00" + Math.round(Number(i) * 255 || 0).toString(16)).slice(-2)).join("")
    );
}

export { imgBlur, imgShader, imgPainter, imgSplit, hex2rgba, rgba2hex };
