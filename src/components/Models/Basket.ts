import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Basket {
    private _items: IProduct[] = [];

    constructor(protected evt: IEvents) {}

    getBasketItems(): IProduct[] {
        return [...this._items];
    }

    addItem(item: IProduct | null): void {
        if (item === null || item.price === null) {
            return;
        }

        if (!this.inBasket(item.id)) {
            this._items = [...this._items, item];
            this.evt.emit('basket:changed', item);
        }
    }

    removeItem(item?: IProduct | null): void {
        if (item) {
            this._items = this._items.filter(p => p.id !== item.id);
            this.evt.emit('basket:changed');
        }
    }

    clearItems(): void {
        this._items = [];
        this.evt.emit('basket:changed');
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