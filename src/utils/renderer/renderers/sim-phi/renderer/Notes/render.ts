import { imgShader, imgPainter, imgSplit } from "../../assetsProcessor/imgProcessor";
import { ScaledNote } from "./scaledNote";
import { simphiPlayer } from "../../playerMain";

interface HitFX {
    effects: ScaledNote[];
    numOfParts: number;
    duration: number;
}

interface NoteRender {
    note: Record<string, ScaledNote>;
    hitFX: Record<string, HitFX>;
    update(name: string, img: ImageBitmap, scale: number, compacted?: boolean): Promise<void>;
    updateFX(
        img: ImageBitmap,
        scale: number,
        limitX?: number,
        limitY?: number,
        hideParts?: boolean,
        duration?: number
    ): Promise<void>;
}

export const noteRender: NoteRender = {
    note: {},
    hitFX: {},
    async update(
        name: string,
        img: ImageBitmap,
        scale: number,
        compacted: boolean = false
    ): Promise<void> {
        this.note[name] = new ScaledNote(img, scale, compacted);
        if (name === "Tap") {
            this.note["TapBad"] = new ScaledNote(await imgPainter(img, "#6c4343"), scale);
        }
    },
    async updateFX(
        img: ImageBitmap,
        scale: number,
        limitX: number,
        limitY: number,
        hideParts: boolean,
        duration?: number
    ): Promise<void> {
        const hitRaw = await imgSplit(img, limitX, limitY);
        const hitPerfect = hitRaw.map(
            async img =>
                new ScaledNote(
                    await imgShader(
                        img,
                        simphiPlayer.tmps.hitPerfectColor || "rgba(255,236,160,0.8823529)"
                    ),
                    scale
                )
        ); //#fce491,#ffeca0e1
        const hitGood = hitRaw.map(
            async img =>
                new ScaledNote(
                    await imgShader(
                        img,
                        simphiPlayer.tmps.hitGoodColor || "rgba(180,225,255,0.9215686)"
                    ),
                    scale
                )
        ); //#9ed5f3,#b4e1ffeb
        img.close();
        this.hitFX["Perfect"] = {
            effects: await Promise.all(hitPerfect),
            numOfParts: hideParts ? 0 : 4,
            duration: duration | 0 || 500,
        };
        this.hitFX["Good"] = {
            effects: await Promise.all(hitGood),
            numOfParts: hideParts ? 0 : 3,
            duration: duration | 0 || 500,
        };
        hitRaw.forEach(img => img.close());
    },
};
