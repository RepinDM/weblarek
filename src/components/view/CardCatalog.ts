
import { Component } from "../base/Component";
import { categoryMap } from "../../utils/constants";
import type { IShopItem } from "../../types";
import type { IEvents } from "../base/Events";
import { EVENTS } from "../base/EventNames";

/**
 * CardCatalog — рендерит карточку товара и эмитит событие при клике.
 * Сигнатура render согласована с Component: render(data?: Partial<T>)
 */
export class CardCatalog extends Component<IShopItem> {
    constructor(container: HTMLElement, private events?: IEvents) {
    super(container);
    }

    render(data?: Partial<IShopItem>): HTMLElement {
    const item = data as IShopItem | undefined;
    const tpl = document.querySelector<HTMLTemplateElement>('#card-catalog')!;
    const el = tpl.content.firstElementChild!.cloneNode(true) as HTMLElement;

    if (!item) {
      // если данных нет — вернуть пустую карточку
        return el;
    }

    const title = el.querySelector('.card__title') as HTMLElement;
    const price = el.querySelector('.card__price') as HTMLElement;
    const img = el.querySelector('.card__image') as HTMLImageElement;
    const category = el.querySelector('.card__category') as HTMLElement;

    title.textContent = item.title;
    price.textContent = item.price === null ? 'Бесплатно' : `${item.price} синапсов`;
    img.src = item.image || '';
    img.alt = item.title ?? '';

    const modifier = categoryMap[item.category as keyof typeof categoryMap] || 'card__category_other';
    category.className = `card__category ${modifier}`;
    category.textContent = item.category;

    el.dataset.id = item.id;

    el.addEventListener('click', () => {
      // эмитим событие для открытия превью товара
        this.events?.emit(EVENTS.PRODUCT_PREVIEW, item);
    });

    return el;
    }
}
