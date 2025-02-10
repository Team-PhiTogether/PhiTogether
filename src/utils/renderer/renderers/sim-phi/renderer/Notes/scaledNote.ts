export class ScaledNote {
    private img: HTMLImageElement | ImageBitmap | HTMLCanvasElement;
    private scale: number;
    public full: (ctx: CanvasRenderingContext2D) => void;
    public head: (ctx: CanvasRenderingContext2D) => void;
    public body: (ctx: CanvasRenderingContext2D, offset: number, length: number) => void;
    public tail: (ctx: CanvasRenderingContext2D, offset: number) => void;

    constructor(
        img: HTMLImageElement | ImageBitmap | HTMLCanvasElement,
        scale: number,
        compacted?: boolean
    ) {
        this.img = img;
        this.scale = scale;
        const dx = (-img.width / 2) * scale;
        const dy = (-img.height / 2) * scale;
        const dw = img.width * scale;
        const dh = img.height * scale;

        this.full = (ctx: CanvasRenderingContext2D): void => ctx.drawImage(img, dx, dy, dw, dh);
        this.head = (ctx: CanvasRenderingContext2D): void => ctx.drawImage(img, dx, 0, dw, dh);
        this.body = (ctx: CanvasRenderingContext2D, offset: number, length: number): void =>
            ctx.drawImage(img, dx, offset, dw, length);
        this.tail = (ctx: CanvasRenderingContext2D, offset: number): void =>
            ctx.drawImage(img, dx, offset - dh, dw, dh);

        if (compacted) {
            this.head = (ctx: CanvasRenderingContext2D): void => ctx.drawImage(img, dx, dy, dw, dh);
            this.tail = (ctx: CanvasRenderingContext2D, offset: number): void =>
                ctx.drawImage(img, dx, offset - dh - dy, dw, dh);
        }
    }
}
