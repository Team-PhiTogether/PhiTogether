import { simphiPlayer } from "../playerMain";

export class Filter {
    async change(filterCode: string) {
        if (!filterCode) return;
        const filter = await import("@utils/js/filter.js");
        try {
            const filter0 = new filter.default(filterCode);
            simphiPlayer.filter = (ctx, time, now) => {
                filter0.apply(ctx.canvas);
                ctx.drawImage(filter0.getImage(time, now, simphiPlayer.filterOptions), 0, 0);
            };
        } catch (e) {
            console.error(e);
            simphiPlayer.filter = null;
        }
    }

    disable() {
        simphiPlayer.filter = null;
    }
}