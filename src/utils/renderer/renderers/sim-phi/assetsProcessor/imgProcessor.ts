import { canvasRGBA as StackBlurCanvasRGBA } from "stackblur-canvas";
import { createCanvas } from "../utils/canvas";

async function imgBlur(img: ImageBitmap): Promise<ImageBitmap> {
    const canvas = createCanvas(img.width * 0.9, img.height * 0.9);
    canvas.style.cssText += ";overflow:hidden;";
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    if (typeof ctx.filter === "string") {
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

async function imgShader(
    img: ImageBitmap,
    color: string,
    returnCanvas: boolean = false,
    limit: number = 512
): Promise<ImageBitmap | HTMLCanvasElement> {
    const dataRGBA = hex2rgba(color);
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext("2d", { willReadFrequently: true }) as CanvasRenderingContext2D;
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

async function imgPainter(
    img: ImageBitmap,
    color: string,
    limit: number = 512
): Promise<ImageBitmap> {
    const dataRGBA = hex2rgba(color);
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext("2d", { willReadFrequently: true }) as CanvasRenderingContext2D;
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

async function imgSplit(
    img: ImageBitmap,
    limitX?: number,
    limitY?: number
): Promise<ImageBitmap[]> {
    limitX = Math.floor(limitX || Math.min(img.width, img.height));
    limitY = Math.floor(limitY || limitX);
    const arr: Promise<ImageBitmap>[] = [];
    for (let dy = 0; dy < img.height; dy += limitY) {
        for (let dx = 0; dx < img.width; dx += limitX) {
            arr.push(createImageBitmap(img, dx, dy, limitX, limitY));
        }
    }
    return Promise.all(arr);
}

function hex2rgba(color: string): Uint8ClampedArray {
    const ctx = createCanvas(1, 1).getContext("2d") as CanvasRenderingContext2D;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    return ctx.getImageData(0, 0, 1, 1).data;
}

function rgba2hex(...rgba: number[]): string {
    return (
        "#" +
        rgba.map(i => ("00" + Math.round(Number(i) * 255 || 0).toString(16)).slice(-2)).join("")
    );
}

export { imgBlur, imgShader, imgPainter, imgSplit, hex2rgba, rgba2hex };
