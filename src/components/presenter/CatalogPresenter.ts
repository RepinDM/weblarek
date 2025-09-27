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
    }

    private updateView() {
    this.view.items = this.model.getItems();
    }
}
