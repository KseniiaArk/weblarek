import { IDeleteFromBasket } from "../../../../types";
import { ensureElement } from "../../../../utils/utils";
import { MainCard } from "./MainCard"

export class CardBasket extends MainCard {
    protected itemIndex: HTMLElement;
    protected itemDelete: HTMLButtonElement;

    constructor(container: HTMLElement, evt?: IDeleteFromBasket) {
        super(container);

        this.itemIndex = ensureElement<HTMLElement>('.basket__item-index', this.container)
        this.itemDelete = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

        if (evt?.onDelete) this.itemDelete.addEventListener('click', evt.onDelete);
    }

    set index(value: number) {
        this.itemIndex.textContent = String(value);
    }
}