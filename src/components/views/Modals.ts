import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IModalData {
    content?: HTMLElement;
    open?: boolean;
}

export class ModalView extends Component<IModalData> {
    private isOpen = false;
    private pageWrapper: HTMLElement;
    private closeButton: HTMLButtonElement;
    private modalContent: HTMLElement;

    constructor(container: HTMLElement, private evt: IEvents) {
        super(container);

        this.pageWrapper = ensureElement('.page__wrapper');
        this.closeButton = ensureElement('.modal__close', container) as HTMLButtonElement;
        this.modalContent = ensureElement('.modal__content', container);

        this.closeButton.addEventListener('click', this.close.bind(this));
        this.container.addEventListener('click', this.handleOverlayClick.bind(this));
        document.addEventListener('keydown', this.handleKeydown.bind(this));
    }

    private handleOverlayClick(evt: Event): void {
        if (evt.target === this.container) this.close();
    }

    private handleKeydown(evt: KeyboardEvent): void {
        if (this.isOpen && evt.key === 'Escape') this.close();
    }

    setContent(content: HTMLElement): void {
        this.modalContent.replaceChildren(content);
    }

    open(): void {
        this.toggleModal(true);
        this.evt.emit('modal:open');
    }

    close(): void {
        this.toggleModal(false);
        this.evt.emit('modal:close');
    }

    private toggleModal(open: boolean): void {
        this.isOpen = open;
        this.pageWrapper.classList.toggle('page__wrapper_locked', open);
        this.container.classList.toggle('modal_active', open);
    }

    isModalOpen(): boolean {
        return this.isOpen;
    }
}