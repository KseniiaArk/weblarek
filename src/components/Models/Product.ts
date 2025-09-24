import { IProduct } from "../../types";

export class Product {
    private _items: IProduct[] = [];
    private _selectedItem: IProduct | null = null;

    constructor() {
        this._items = [];
        this._selectedItem = null;
    }

    setItems(items: IProduct[]): void {
        this._items = items.map(item => item);
    }

    getItems(): IProduct[] {
        return this._items;
    }

    getItem(id: string): IProduct | null {
      return this._items.find(item => item.id === id) || null;
    }

    setSelectedItem(item: IProduct | null): void {
        this._selectedItem = item;
    }

    getSelectedItem(): IProduct | null {
        return this._selectedItem;
    }
}