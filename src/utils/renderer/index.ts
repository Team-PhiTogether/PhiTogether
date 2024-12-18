class ChartRenderer {
    name: string;
    displayName: string;
    description: string | null;

    init: Function;
    loadChart: Function;
    loadRespack: Function;
    reset: Function;

    constructor({
        name,
        displayName,
        description,

        init,
        loadChart,
        loadRespack,
        // reset,
    }) {
        this.name = name || "unknown";
        this.displayName = displayName || this.name;
        this.description = description || null;

        this.init = init;
        this.loadChart = loadChart;
        this.loadRespack = loadRespack;
    }
}