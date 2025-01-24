// PZv1
export interface SongMeta<fileType = string> {
    id: string | number;
    composer: string;
    illustrator: string;
    name: string;
    song: fileType;
    illustration: fileType;
    edition?: string | null;
    bpm?: number | null;
    duration?: string | null;
    preview_start?: string | null;
    preview_end?: string | null;
    previewStart?: string | null;
    previewEnd?: string | null;
    charts?: ChartMeta[] | null;
    isFromPhiZone?: boolean;
    isFromURL?: boolean;
    origin?: SongMeta;
}
export interface ChartMeta<songType = string | SongMeta, fileType = string> {
    id: string | number;
    level: string;
    difficulty: number;
    chart: fileType;
    ranked?: boolean | null;
    charter: string;
    notes?: number | null;
    song: songType;
    assets?: string;
    assetsNum?: number | null;
    for?: string;
    like_count?: number | null;
    isFromPhiZone?: boolean;
    isFromURL?: boolean;
    origin?: ChartMeta;
}

// PZv2
export interface SongMetav2 {
    id: string;
    title: string;
    editionType: number;
    edition: string | null;
    authorName: string;
    file: string;
    illustration: string;
    illustrator: string;
    description: string;
    accessibility: number;
    isHidden: boolean;
    isLocked: boolean;
    lyrics: string | null;
    bpm: number;
    minBpm: number;
    maxBpm: number;
    offset: number | null;
    license: string | null;
    isOriginal: boolean;
    duration: string;
    previewStart: string;
    previewEnd: string;
    chartLevels: ChartLevel[];
    ownerId: number;
    dateCreated: string;
    dateUpdated: string;
    commentCount: number;
    likeCount: number;
    dateLiked: string | null;
}
interface ChartLevel {
    levelType: number;
    count: number;
}

export interface ChartMetav2 {
    id: string;
    title: string | null;
    levelType: number;
    level: string;
    difficulty: number;
    format: number;
    file: string;
    authorName: string;
    illustration: string | null;
    illustrator: string | null;
    description: string | null;
    accessibility: number;
    isHidden: boolean;
    isLocked: boolean;
    isRanked: boolean;
    noteCount: number;
    score: number;
    rating: number;
    ratingOnArrangement: number;
    ratingOnFeel: number;
    ratingOnVisualEffects: number;
    ratingOnCreativity: number;
    ratingOnConcord: number;
    ratingOnImpression: number;
    songId: string;
    ownerId: number;
    dateCreated: string;
    dateUpdated: string;
    playCount: number;
    commentCount: number;
    likeCount: number;
    dateLiked: string | null;
}
