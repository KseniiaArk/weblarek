import { IProduct } from "../../../../types";
import { ensureElement } from "../../../../utils/utils";
import { Component } from "../../../base/Component";

export type CardData = Partial<IProduct> & {
    index: number;
}

export abstract class MainCard extends Component<CardData> {
    protected cardTitle: HTMLElement;
    protected cardPrice: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this.cardTitle = ensureElement<HTMLElement>('.card__title', this.container);
        this.cardPrice = ensureElement<HTMLElement>('.card__price', this.container);
    }

    set title(value: string) {
        this.cardTitle.textContent = String(value);
    }

    set price(value: number | null) {
        this.cardPrice.textContent = value === null ? 'Бесценно' : `${value} синапсов`;
    }
}