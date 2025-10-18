// src/components/view/Modal.ts
import { Component } from "../base/Component";

export class Modal extends Component<{ active?: boolean }> {
    private closeBtn: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
    // предполагаем что container — .modal
    this.closeBtn = this.container.querySelector('.modal__close') as HTMLElement;

        this.closeBtn?.addEventListener('click', this.close.bind(this));
        this.container.addEventListener('click', this._handleOverlayClick.bind(this));
    }

    setContent(node: HTMLElement) {
        const content = this.container.querySelector('.modal__content') as HTMLElement;
        content.replaceChildren(node);
    }

    open() {
        this.container.classList.add('modal_active');
        document.body.classList.add('modal-open');
    }

    close() {
        this.container.classList.remove('modal_active');
        document.body.classList.remove('modal-open');
    }

    private _handleOverlayClick(e: MouseEvent) {
        if (e.target === this.container) this.close();
    }
}


