export const tween = {
    easeInSine: (pos: number) => 1 - Math.cos((pos * Math.PI) / 2),
    easeOutSine: (pos: number) => Math.sin((pos * Math.PI) / 2),
    easeOutCubic: (pos: number) => 1 + (pos - 1) ** 3,
    easeIOCubic: (pos: number) => ((pos *= 2) < 1 ? pos ** 3 : (pos - 2) ** 3 + 2) / 2,
    easeInCubic: (pos: number) => pos ** 3, //9
    ease10: (pos: number) => 1 - (pos - 1) ** 4, //10
    ease15: (pos: number) => pos ** 5, //15
};
