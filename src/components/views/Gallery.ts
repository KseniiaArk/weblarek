import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

interface IGalleryData {
    catalog: HTMLElement[];
}

export class GalleryView extends Component<IGalleryData> {
    protected catalogElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);

        this.catalogElement = ensureElement<HTMLElement>('.gallery', this.container);
    }

    set catalog(items: HTMLElement[]) {
        this.catalogElement.replaceChildren(...items);
    }
}