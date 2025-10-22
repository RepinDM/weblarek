import { Component } from "../base/Component";
import { categoryMap } from "../../utils/constants";
import type { IShopItem } from "../../types";
import type { IEvents } from "../base/Events";
import { EVENTS } from "../base/EventNames";

export class CardPreview extends Component<IShopItem> {
    private addButton: HTMLButtonElement | null = null;
    private isInCart: boolean = false;

    constructor(container: HTMLElement, private events?: IEvents, private cartItems?: Set<string>) {
        super(container);
    }

    render(data?: Partial<IShopItem>): HTMLElement {
        const item = data as IShopItem | undefined;
        const tpl = document.querySelector<HTMLTemplateElement>('#card-preview')!;
        const el = tpl.content.firstElementChild!.cloneNode(true) as HTMLElement;

        if (!item) {
            return el;
        }

        const title = el.querySelector('.card__title') as HTMLElement;
        const price = el.querySelector('.card__price') as HTMLElement;
        const img = el.querySelector('.card__image') as HTMLImageElement;
        const category = el.querySelector('.card__category') as HTMLElement;
        const description = el.querySelector('.card__text') as HTMLElement;
        this.addButton = el.querySelector('.card__button') as HTMLButtonElement;

        title.textContent = item.title;
        description.textContent = item.description;
        price.textContent = item.price === null ? 'Бесплатно' : `${item.price} синапсов`;
        img.src = item.image || '';
        img.alt = item.title ?? '';

        const modifier = categoryMap[item.category as keyof typeof categoryMap] || 'card__category_other';
        category.className = `card__category ${modifier}`;
        category.textContent = item.category;

        // Проверяем, есть ли товар в корзине
        this.isInCart = this.cartItems?.has(item.id) || false;
        this.updateButtonState();

        // Обработчик добавления/удаления из корзины
        if (this.addButton) {
            this.addButton.addEventListener('click', () => {
                if (this.isInCart) {
                    this.events?.emit(EVENTS.CARD_REMOVE, item.id);
                } else {
                    this.events?.emit(EVENTS.CARD_ADD, item);
                }
            });
        }

        return el;
    }

    private updateButtonState(): void {
        if (this.addButton) {
            this.addButton.textContent = this.isInCart ? 'Удалить из корзины' : 'В корзину';
        }
    }
}