import { ICatalogClick } from "../../../../types";
import { categoryMap } from "../../../../utils/constants";
import { ensureElement } from "../../../../utils/utils";
import { MainCard } from "./MainCard";

export class CardCatalog extends MainCard {
    protected cardImage: HTMLImageElement;
    protected cardCategory: HTMLElement;

    constructor(container: HTMLElement, evt?: ICatalogClick) {
        super(container);

        this.cardImage = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.cardCategory = ensureElement<HTMLElement>('.card__category', this.container);
        
        if (evt?.onClick) this.container.addEventListener('click', evt.onClick);
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
}