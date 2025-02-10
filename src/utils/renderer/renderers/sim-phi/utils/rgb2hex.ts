export function rgb2hex(rgb: number[]): string {
    const validRGB = rgb.map(value => {
        if (typeof value !== "number" || value < 0 || value > 255) return 255;
        return value;
    });
    const hexValues = validRGB.map(value => {
        const hexValue = value.toString(16).toUpperCase();
        return hexValue.length === 1 ? "0" + hexValue : hexValue;
    });
    const hexColor = "#" + hexValues.join("");
    return hexColor;
}