import { CardBase } from "./CardBase";
import { categoryMap } from "../../utils/constants";

type CategoryKey = keyof typeof categoryMap;

interface CatalogItem {
    title: string;
    price: number | null;
    image?: string | null;
    category: CategoryKey | string;
    [key: string]: any;
}

export class CardCatalog extends CardBase {
    render(data: CatalogItem) {
        const tpl = document.querySelector<HTMLTemplateElement>('#card-catalog')!;
        const el = tpl.content.firstElementChild!.cloneNode(true) as HTMLElement;

        const title = el.querySelector('.card__title') as HTMLElement;
        const price = el.querySelector('.card__price') as HTMLElement;
        const img = el.querySelector('.card__image') as HTMLImageElement;
        const category = el.querySelector('.card__category') as HTMLElement;

        title.textContent = data.title;
        price.textContent = data.price === null ? 'Бесплатно' : `${data.price} синапсов`;
    img.src = data.image ?? '';
    img.alt = data.title ?? '';
    // модификатор
    const modifier = categoryMap[data.category as CategoryKey] || 'card__category_other';
        category.className = `card__category ${modifier}`;
        category.textContent = data.category;

    // сделать всю карточку кликабельной
        el.addEventListener('click', () => {
        const ev = new CustomEvent('card:click', { detail: data });
        el.dispatchEvent(ev);
        });

        return el;
    }
}