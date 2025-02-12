export class HitEvents<T> extends Array<T> {
    constructor({ updateCallback = (_: T) => {}, iterateCallback = (_: T) => {} } = {}) {
        super();
        this.update = this.defilter.bind(this, updateCallback);
        this.animate = this.iterate.bind(this, iterateCallback);
    }

    update: (predicate: (value: T) => boolean) => this;
    animate: (callback: (item: T) => void) => void;

    defilter(predicate: (value: T) => boolean): this {
        let i = this.length;
        while (i--) predicate(this[i]) && this.splice(i, 1);
        return this;
    }

    iterate(callback: (item: T) => void): void {
        for (const i of this) callback(i);
    }

    add(value: T): void {
        this[this.length] = value;
    }

    clear(): void {
        this.length = 0;
    }
}
