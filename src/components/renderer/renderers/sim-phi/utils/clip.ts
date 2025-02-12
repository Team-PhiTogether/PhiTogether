export function clip(num: number): number {
    if (num < 0) return 0;
    if (num > 1) return 1;
    return num;
}
