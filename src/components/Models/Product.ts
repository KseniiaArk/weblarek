import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Products {
    private _items: IProduct[] = [];
    private _selectedItem: IProduct | null = null;

    constructor(protected evt: IEvents) {
        this._items = [];
        this._selectedItem = null;
    }

    setItems(items: IProduct[]): void {
        this._items = [...items];
        this.evt.emit('catalog:changed');
    }

    getItems(): IProduct[] {
        return this._items;
    }

    getItem(id: string): IProduct | null {
      return this._items.find(item => item.id === id) || null;
    }

    setSelectedItem(item: IProduct | null): void {
        this._selectedItem = item;

        if (item) this.evt.emit('product:selected', item);
    }

    getSelectedItem(): IProduct | null {
        return this._selectedItem;
    }
}