import { IProduct } from "../../types";

export class Basket {
    private _items: IProduct[] = [];

    constructor() {
        this._items = [];
    }

    getBasketItems(): IProduct[] {
        return this._items;
    }

    addItem(item: IProduct | null): void {
        if (item && !this.inBasket(item.id)) {
            this._items.push(item);
        }
    }

    removeItem(item?: IProduct | null): void {
        if (item) {
            this._items = this._items.filter(p => p.id !== item.id);
        } 
    }

    clearItems(): void {
        this._items = [];
    }

    getTotalPrice(): number {
        return this._items.reduce((sum, p) => sum + (p.price ?? 0), 0)
    }

    getItemsAmount(): number {
        return this._items.length;
    }

    inBasket(id: string): boolean {
        return this._items.some(item => item.id === id);
    }
}