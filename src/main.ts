// Подключаем стили SCSS
import "./scss/styles.scss";

// Импортируем тестовые данные (локальный каталог товаров)
import { apiProducts } from "./utils/data";

// Модели
import { ProductsModel } from "./components/models/ProductsModal";
import { CartModal } from "./components/models/CardModel";
import { BuyerModel } from "./components/models/BuyerModel";

// UI и события
import { Catalog } from "./components/view/Catalog";
import { Basket } from "./components/view/Basket";
import { CatalogPresenter } from "./components/presenter/CatalogPresenter";
import { BasketPresenter } from "./components/presenter/BasketPresenter";
import { EventEmitter } from "./components/base/Events";
import { EVENTS } from "./components/base/EventNames";

// --- Модели ---
const productsModel = new ProductsModel();
const cartModel = new CartModal();
const buyer = new BuyerModel();

// --- Каталог ---
productsModel.setItems(apiProducts.items);
console.log("Каталог — всего:", productsModel.getItems().length);
console.log("Каталог — первый товар:", productsModel.getItems()[0]);

const firstId = productsModel.getItems()[0]?.id;
productsModel.setSelectedProduct(firstId ?? null);
console.log("Выбранный товар:", productsModel.getSelectedProduct());

// --- Корзина ---
const firstPaidProduct = productsModel.getItems().find(p => p.price != null);
if (firstPaidProduct) cartModel.add(firstPaidProduct);

console.log("Корзина — список:", cartModel.getItems());
console.log("Корзина — кол-во:", cartModel.getCount());
console.log("Корзина — сумма:", cartModel.getTotal());

if (firstPaidProduct) cartModel.remove(firstPaidProduct.id);
console.log("Корзина — после удаления:", cartModel.getItems(), "Кол-во:", cartModel.getCount());

// --- Покупатель ---
const logErrors = (label: string, obj: object) =>
  console.log(label, Object.keys(obj).length ? obj : "нет ошибок");

console.log("Buyer — начальные данные:", {
  payment: buyer.getPayment(),
  address: buyer.getAddress(),
  email: buyer.getEmail(),
  phone: buyer.getPhone()
});
logErrors("Step1 (payment,address):", buyer.validateStep1());
logErrors("Step2 (email,phone):", buyer.validateStep2());

buyer.setPayment("card");
buyer.setAddress("г. Москва, пр-т Мира, 1");
buyer.setEmail("user@example.com");
buyer.setPhone("+7 999 000-00-00");

console.log("Buyer — после заполнения:", {
  payment: buyer.getPayment(),
  address: buyer.getAddress(),
  email: buyer.getEmail(),
  phone: buyer.getPhone()
});
logErrors("Step1:", buyer.validateStep1());
logErrors("Step2:", buyer.validateStep2());

buyer.setAddress("   "); // некорректный адрес
logErrors("Step1 (некорректные значения):", buyer.validateStep1());

buyer.reset();
console.log("Buyer — после reset():", {
  payment: buyer.getPayment(),
  address: buyer.getAddress(),
  email: buyer.getEmail(),
  phone: buyer.getPhone()
});
logErrors("Step1 (payment,address):", buyer.validateStep1());
logErrors("Step2 (email,phone):", buyer.validateStep2());

// --- UI ---
const events = new EventEmitter();

const catalogContainer = document.querySelector('.gallery') as HTMLElement;
const basketContainer = document.querySelector('.basket') as HTMLElement;

const catalog = new Catalog(catalogContainer);
const basket = new Basket(basketContainer);

new CatalogPresenter(productsModel, catalog, events);
new BasketPresenter(cartModel, basket, events);

events.emit(EVENTS.CATALOG_CHANGED, {});

