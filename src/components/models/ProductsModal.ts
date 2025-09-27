import type { IShopItem } from "../../types";
import type { IEvents } from "../base/Events";
import { EVENTS } from "../base/EventNames";

export class ProductsModel {
  private items: IShopItem[] = [];
  private selectedProductId: string | null = null;

  constructor(private events?: IEvents) {}

  setItems(items: IShopItem[]) {
    this.items = items;
    this.events?.emit(EVENTS.CATALOG_CHANGED, {});
  }

  getItems(): IShopItem[] {
    return this.items;
  }

  setSelectedProduct(id: string | null) {
    this.selectedProductId = id;
  }

  getSelectedProduct(): IShopItem | null {
    return this.items.find(p => p.id === this.selectedProductId) || null;
  }
}
