export interface ChartPlayInfo {
    name: string | null;
    composer: string | null;
    illustrator: string | null;
    charter: string | null;
    difficultyString: string | null;
}

export const ChartPlayInfoDefaults: ChartPlayInfo = {
    name: "unknown",
    composer: "unknown",
    illustrator: "unknown",
    charter: "unknown",
    difficultyString: "SP Lv.?",
}