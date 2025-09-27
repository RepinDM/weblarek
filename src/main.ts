import "./scss/styles.scss";
import { apiProducts } from "./utils/data";

import { ProductsModel } from  "./components/models/ProductsModal";
import { CartModel } from "./components/models/CardModel";
import { BuyerModel } from "./components/models/BuyerModel";

import { Catalog } from "./components/view/Catalog";
import { Basket } from "./components/view/Basket";

import { CatalogPresenter } from "./components/presenter/CatalogPresenter";
import { BasketPresenter } from "./components/presenter/BasketPresenter";

import { EventEmitter } from "./components/base/Events";
import { EVENTS } from "./components/base/EventNames";

// --- Events ---
const events = new EventEmitter();

// --- Models ---
const productsModel = new ProductsModel(events);
const cartModel = new CartModel(events);
const buyerModel = new BuyerModel(events);

// --- Views ---
const catalogView = new Catalog(document.querySelector('.catalog')!);
const basketView = new Basket(document.querySelector('.basket')!);

// --- Presenters ---
new CatalogPresenter(productsModel, catalogView, events);
new BasketPresenter(cartModel, basketView, events);

// --- Init ---
// Локальные данные (для разработки)
productsModel.setItems(apiProducts.items);
events.emit(EVENTS.CATALOG_CHANGED, {});

// --- Если нужен API ---
import { LarekApi } from "./components/models/LarekApi";
import { API_URL } from "./utils/constants";
const larekApi = new LarekApi(API_URL);
(async () => {
  const items = await larekApi.getProducts();
  productsModel.setItems(items);
  events.emit(EVENTS.CATALOG_CHANGED, {});
})();
