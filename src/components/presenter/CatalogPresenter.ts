import { ProductsModel } from "../models/ProductsModel";
import { Catalog } from "../view/Catalog";
import { CardCatalog } from "../view/CardCatalog";
import type { IEvents } from "../base/Events";
import { EVENTS } from "../base/EventNames";
import type { IShopItem } from "../../types";

export class CatalogPresenter {
    constructor(
    private model: ProductsModel,
    private view: Catalog,
    private events: IEvents
) {
    this.events.on(EVENTS.CATALOG_CHANGED, this.updateView.bind(this));

    // реакция на превью продукта
    this.events.on(EVENTS.PRODUCT_PREVIEW, (item?: IShopItem) => {
        if (!item) return;
        // УПРОЩЕНО: больше не нужно устанавливать выбранный продукт
        // this.model.setSelectedProduct(item.id); - удалено
    });
}

private updateView() {
    const items: IShopItem[] = this.model.getItems();
    const elements: HTMLElement[] = items.map(item => {
        const container = document.createElement('div');
        const card = new CardCatalog(container, this.events);
        return card.render(item);
    });
    this.view.render(elements);
    }
}