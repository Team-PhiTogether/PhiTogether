export const createCanvas = (width, height) => {
    const canvas = document.createElement("canvas");
    return Object.assign(canvas, { width, height });
};