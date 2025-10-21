import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IHeaderData {
    counter: number;
}

export class HeaderView extends Component<IHeaderData> {
    protected counterElement: HTMLElement;
    protected basketButton: HTMLButtonElement;

    constructor(conteiner: HTMLElement, protected evt: IEvents) {
        super(conteiner);

        this.counterElement = ensureElement<HTMLElement>('.header__basket-counter', this.container);
        this.basketButton = ensureElement<HTMLButtonElement>('.header__basket', this.container);

        this.basketButton.addEventListener('click', () => {
            this.evt.emit('basket:open');
        });
    }

    set counter(value: number) {
        this.counterElement.textContent = String(value);
    }
}