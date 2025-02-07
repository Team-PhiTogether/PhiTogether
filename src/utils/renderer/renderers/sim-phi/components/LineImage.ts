import { imgShader } from "../assetsProcessor/imgProcessor";

export class LineImage {
    private image: ImageBitmap;
    private imageFC: ImageBitmap | null;
    private imageAP: ImageBitmap | null;
    private imageMP: ImageBitmap | null;

    constructor(image: ImageBitmap) {
        this.image = image;
        this.imageFC = null;
        this.imageAP = null;
        this.imageMP = null;
    }
    async getFC() {
        if (!this.imageFC) this.imageFC = await imgShader(this.image, "#a2eeff");
        return this.imageFC;
    }
    async getAP() {
        if (!this.imageAP) this.imageAP = await imgShader(this.image, "#a3ffac");
        return this.imageAP;
    }
    async getMP() {
        if (!this.imageMP) this.imageMP = await imgShader(this.image, "#feffa9");
        return this.imageMP;
    }
}