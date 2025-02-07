export class Emitter<T> extends EventTarget {
    private status: T;

    constructor(statusInit: T) {
        super();
        this.status = statusInit;
    }
    
    emit(status: T): void {
        if (this.status === status) return;
        this.status = status;
        this.dispatchEvent(new Event("change"));
    }
    
    eq(status: T): boolean {
        return this.status === status;
    }
    
    ne(status: T): boolean {
        return this.status !== status;
    }
}