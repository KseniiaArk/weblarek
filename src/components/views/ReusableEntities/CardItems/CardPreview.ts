import { ICatalogClick } from "../../../../types";
import { categoryMap } from "../../../../utils/constants";
import { ensureElement } from "../../../../utils/utils";
import { MainCard } from "./MainCard";

export class CardPreview extends MainCard {
    protected cardImage: HTMLImageElement;
    protected cardCategory: HTMLElement;
    protected cardText: HTMLElement;
    protected cardButton: HTMLButtonElement;

    constructor(container: HTMLElement, evt?: ICatalogClick) {
        super(container);

        this.cardImage = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.cardCategory = ensureElement<HTMLElement>('.card__category', this.container);
        this.cardText = ensureElement<HTMLElement>('.card__text', this.container);
        this.cardButton = ensureElement<HTMLButtonElement>('.card__button', this.container);

        if (evt?.onClick) this.cardButton.addEventListener('click', evt.onClick);
    }

    set image(value: string) {
        this.setImage(this.cardImage, `${value}`, this.title);
    }

    set category(value: string) {
        this.cardCategory.textContent = String(value);
    
        for (const key in categoryMap) {
            this.cardCategory.classList.toggle(categoryMap[key as keyof typeof categoryMap], key === value);
        }
    }

    set description(value: string) {
        this.cardText.textContent = String(value);
    }

    set buttonText(value: string) {
        this.cardButton.textContent = String(value);
    }

    set buttonLocked(value: boolean) {
        this.cardButton.disabled = value;
    }
}