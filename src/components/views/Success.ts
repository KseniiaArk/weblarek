import { ISuccession } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

interface ISuccessData {
    total: number;
}

export class SuccessView extends Component<ISuccessData> {
    protected description: HTMLElement;
    protected button: HTMLButtonElement;

    constructor(container: HTMLElement, evt?: ISuccession) {
        super(container);

        this.description = ensureElement<HTMLElement>('.order-success__description', this.container);
        this.button = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

        if (evt?.onClose) {
            this.button.addEventListener('click', evt.onClose);
        }
    }

    set total(sum: number) {
        this.description.textContent = `Списано ${sum} синапсов`;
    }
}