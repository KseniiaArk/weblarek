import { IBuy } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

interface IBasket {
    items: HTMLElement[];
    total: number;
}

export class BasketView extends Component <IBasket> {
    protected title: HTMLElement;
    protected list: HTMLElement;
    protected button: HTMLButtonElement;
    protected price: HTMLElement;

    constructor(container: HTMLElement, evt?: IBuy) {
        super(container);
        this.title = ensureElement<HTMLElement>('.modal__title', this.container);
        this.list = ensureElement<HTMLElement>('.basket__list', this.container);
        this.button = ensureElement<HTMLButtonElement>('.basket__button', this.container);
        this.price = ensureElement<HTMLElement>('.basket__price', this.container);

        if (evt?.onBuy) this.button.addEventListener('click', evt.onBuy);
    }

    set items(value: HTMLElement[]) {
        const isEmpty = value.length === 0;
        this.list.innerHTML = '';

        if (isEmpty) {
            this.list.innerHTML = '<div class="basket__empty">Корзина пуста</div>';
        } else {
            this.list.replaceChildren(...value);
        }

        this.buttonDisabled = isEmpty;
        this.buttonText = 'Оформить';
    }

    set buttonText(value: string) {
        this.button.textContent = String(value);
    }

    set buttonDisabled(value: boolean) {
        this.button.disabled = value;
    }

    set total(value: number) {
        this.price.textContent = `${value} синапсов`;
    }
}