
import { ProductsModel } from "../models/ProductsModal";
import { Catalog } from "../view/Catalog";
import { CardCatalog } from "../view/CardCatalog";
import type { IEvents } from "../base/Events";
import { EVENTS } from "../base/EventNames";
import type { IShopItem } from "../../types";

/**
 * Presenter не работает с DOM напрямую.
 * Он создаёт view-элементы карточек (через CardCatalog.render)
 * и отдаёт их в Catalog.render.
 */
export class CatalogPresenter {
    constructor(
    private model: ProductsModel,
    private view: Catalog,
    private events: IEvents
    ) {
    this.events.on(EVENTS.CATALOG_CHANGED, this.updateView.bind(this));

    // реакция на превью продукта (view эмитит EVENTS.PRODUCT_PREVIEW)
    this.events.on(EVENTS.PRODUCT_PREVIEW, (item?: IShopItem) => {
        if (!item) return;
        this.model.setSelectedProduct(item.id);
    });
    }

    private updateView() {
    const items = this.model.getItems();
    const elements: HTMLElement[] = items.map(item => {
        const container = document.createElement('div');
        const card = new CardCatalog(container, this.events);
        return card.render(item);
    });
    this.view.render(elements);
    }
}
