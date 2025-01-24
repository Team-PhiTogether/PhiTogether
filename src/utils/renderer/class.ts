export class ChartRenderer {
    name: string;
    displayName: string;
    description: string | null;

    init: Function;
    load: {
        chart: Function; // url
        respack: Function; // url
    };
    startGameplay: Function; // settings
    reset: Function;

    constructor({
        name,
        displayName,
        description,

        init,
        loadChart,
        loadRespack,
        startGameplay,
        // reset,
    }) {
        this.name = name || "unknown";
        this.displayName = displayName || this.name;
        this.description = description || null;

        this.init = init;
        this.load = {
            chart: loadChart,
            respack: loadRespack,
        };
        this.startGameplay = startGameplay;
    }
}
