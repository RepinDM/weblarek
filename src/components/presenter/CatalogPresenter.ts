// src/components/presenter/CatalogPresenter.ts
import { ProductsModel } from "../models/ProductsModal";
import { Catalog } from "../view/Catalog";
import { IEvents } from "../base/Events";
import { EVENTS } from "../base/EventNames";

export class CatalogPresenter {
    constructor(
        private model: ProductsModel,
        private view: Catalog,
        private events: IEvents
    ) {
        this.events.on(EVENTS.CATALOG_CHANGED, this.updateView.bind(this));
    // делегируем клики от каталога (всплытие событий)
        this.view.getContainer().addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            const btn = target.closest('.card') as HTMLElement | null;
            if (!btn) return;
            const id = btn.dataset.id;
            if (id) {
                this.model.setSelectedProduct(id);
            }
        });
    }

    private updateView() {
        this.view.items = this.model.getItems();
    }
}

