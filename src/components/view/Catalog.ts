// src/components/view/Catalog.ts
import { Component } from "../base/Component";
import type { IShopItem } from "../../types";

export class Catalog extends Component<IShopItem[]> {
    set items(data: IShopItem[]) {
        this.container.innerHTML = '';
        data.forEach((item) => {
        // Создаём карточку вручную или через шаблон
        const tpl = document.querySelector<HTMLTemplateElement>('#card-catalog')!;
        const el = tpl.content.firstElementChild!.cloneNode(true) as HTMLElement;

        const title = el.querySelector('.card__title') as HTMLElement;
        const price = el.querySelector('.card__price') as HTMLElement;
        const img = el.querySelector('.card__image') as HTMLImageElement;
        const category = el.querySelector('.card__category') as HTMLElement;

        title.textContent = item.title;
        price.textContent = item.price === null ? 'Бесплатно' : `${item.price} синапсов`;
        img.src = item.image;
        category.textContent = item.category;

        // set data-id
        el.dataset.id = item.id;

        this.container.appendChild(el);
        });
    }
}
