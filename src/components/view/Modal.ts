// import { Component } from "../base/Component";

// export class Modal extends Component<{ content: HTMLElement }> {
//     protected _closeButton: HTMLButtonElement;
//     protected _content: HTMLElement;

//     constructor(container: HTMLElement) {
//         super(container);
//         this._closeButton = this.container.querySelector('.modal__close') as HTMLButtonElement;
//         this._content = this.container.querySelector('.modal__content') as HTMLElement;
        
//         this._closeButton.addEventListener('click', this.close.bind(this));
//         this.container.addEventListener('click', this._handleOverlayClick.bind(this));
//     }

//     set content(value: HTMLElement) {
//         this._content.replaceChildren(value);
//     }

//     open() {
//         this.container.classList.add('modal_active');
//         document.body.classList.add('modal-open');
//     }

//     close() {
//         this.container.classList.remove('modal_active');
//         document.body.classList.remove('modal-open');
//     }

//     private _handleOverlayClick(event: MouseEvent) {
//         if (event.target === this.container) {
//             this.close();
//         }
//     }
// }

