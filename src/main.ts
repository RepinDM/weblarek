import "./scss/styles.scss";
import { apiProducts } from "./utils/data";
import { API_URL, CDN_URL } from "./utils/constants";

import { EventEmitter } from "./components/base/Events";

import { ProductsModel } from "./components/models/ProductsModel";
import { CartModel } from "./components/models/CardModel";
import { BuyerModel } from "./components/models/BuyerModel";
import { LarekApi } from "./components/models/LarekApi";

import { Catalog } from "./components/view/Catalog";
import { BasketView } from "./components/view/BasketView";
import { Modal } from "./components/view/Modal";
import { OrderStep1View } from "./components/view/OrderStep1View";
import { OrderStep2View } from "./components/view/OrderStep2View";
import { SuccessView } from "./components/view/SuccessView";
import { CardPreview } from "./components/view/CardPreview";

import { CatalogPresenter } from "./components/presenter/CatalogPresenter";
import { BasketPresenter } from "./components/presenter/BasketPresenter";

import { EVENTS } from "./components/base/EventNames";

const events = new EventEmitter();

import { IShopItem, IBuyer, ICartCounterEvent, IBuyerChangedEvent } from "./types";

// models
const productsModel = new ProductsModel(events);
const cartModel = new CartModel(events);
const buyerModel = new BuyerModel(events);

// единый API
const api = new LarekApi(API_URL);

// UI containers
const gallery = document.querySelector('.gallery') as HTMLElement;
const headerBasketBtn = document.querySelector('.header__basket') as HTMLButtonElement;
const headerCounter = document.querySelector('.header__basket-counter') as HTMLElement;
const modalRoot = document.querySelector('.modal') as HTMLElement;

// views
const catalogView = new Catalog(gallery);
const basketView = new BasketView(document.createElement('div'), events);
const modal = new Modal(modalRoot);
const step1View = new OrderStep1View(document.createElement('div'), events);
const step2View = new OrderStep2View(document.createElement('div'), events);
const successView = new SuccessView(document.createElement('div'), events);

// presenters
new CatalogPresenter(productsModel, catalogView, events);
new BasketPresenter(cartModel, basketView, events);

// обновление счетчика header 
events.on<ICartCounterEvent>('cart:counter', (data?: ICartCounterEvent) => {
  headerCounter.textContent = String(data?.count ?? 0);
});

// Загружаем данные с сервера
async function loadProducts() {
  try {
    const products = await api.getProducts();
    // Добавляем CDN URL к изображениям товаров
    const productsWithCDN = products.map(product => ({
      ...product,
      image: product.image ? `${CDN_URL}/${product.image}` : product.image
    }));
    productsModel.setItems(productsWithCDN);
  } catch (error) {
    console.error('Ошибка загрузки товаров:', error);
    // Fallback на демо-данные в случае ошибки
    const fallbackProducts = (apiProducts.items as IShopItem[]).map(product => ({
      ...product,
      image: product.image ? `${CDN_URL}/${product.image}` : product.image
    }));
    productsModel.setItems(fallbackProducts);
  }
}

loadProducts();

// Обработка открытия превью товара
events.on(EVENTS.PRODUCT_PREVIEW, (item?: IShopItem) => {
  if (!item) return;
  
  // Создаем представление для превью
  const previewContainer = document.createElement('div');
  const cartItemsSet = new Set(cartModel.getItems().map(i => i.id));
  const cardPreview = new CardPreview(previewContainer, events, cartItemsSet);
  const previewElement = cardPreview.render(item);
  
  // Устанавливаем контент в модальное окно и открываем его
  modal.setContent(previewElement);
  modal.open();
});

// Обработка добавления товара в корзину из превью
events.on(EVENTS.CARD_ADD, (item?: IShopItem) => {
  if (item) {
    cartModel.add(item);
    // Закрываем модальное окно после добавления
    modal.close();
  }
});


// откройте корзину, нажав на кнопку в шапке
headerBasketBtn.addEventListener('click', () => {
  const items = cartModel.getItems();
  const total = cartModel.getTotal();
  const basketEl = basketView.render({ items, total });
  modal.setContent(basketEl);
  modal.open();
});

// удалить товар из корзины (вызвано из BasketItemView)
events.on(EVENTS.CARD_REMOVE, (id?: string) => {
  if (!id) return;
  cartModel.remove(id);
});

// начало оформления заказа (вызывается BasketView)
events.on(EVENTS.BASKET_CHECKOUT, () => {
  // шаг 1 рендеринга
  const step1El = step1View.render({
    address: buyerModel.getAddress(),
    payment: buyerModel.getPayment()
  });
  modal.setContent(step1El);
  modal.open();

  // шаг 1 следующий
  events.on('order:step1:next', () => {
    const errs = buyerModel.validateStep1();
    if (Object.keys(errs).length) {
      const s = step1View.render({
        address: buyerModel.getAddress(),
        payment: buyerModel.getPayment(),
        errors: errs
      });
      modal.setContent(s);
      return;
    }

    // шаг 2 рендеринга
    const step2El = step2View.render({
      email: buyerModel.getEmail(),
      phone: buyerModel.getPhone()
    });
    modal.setContent(step2El);
  });

  // buyer data changes (from step1/step2 views)
  events.on<IBuyerChangedEvent>(EVENTS.BUYER_CHANGED, (payload?: IBuyerChangedEvent) => {
    if (!payload || !payload.field) return;
    const { field, value } = payload;
    if (field === 'payment') buyerModel.setPayment(value as IBuyer['payment']);
    if (field === 'address') buyerModel.setAddress(value);
    if (field === 'email') buyerModel.setEmail(value);
    if (field === 'phone') buyerModel.setPhone(value);
  });

  // данные о покупателе изменились (на этапах 1 и 2)
  events.on('order:step2:validate', () => {
    const errs = buyerModel.validateStep2();
    events.emit('order:step2:setButton', Object.keys(errs).length === 0);
  });

  // отправить заказ
  events.on('order:submit', async () => {
    const errs = buyerModel.validateStep2();
    if (Object.keys(errs).length) {
      const s = step2View.render({
        email: buyerModel.getEmail(),
        phone: buyerModel.getPhone(),
        errors: errs
      });
      modal.setContent(s);
      return;
    }

    const order = {
      items: cartModel.getItems().map(i => i.id),
      payment: buyerModel.getPayment() as ("card" | "cash"),
      address: buyerModel.getAddress(),
      email: buyerModel.getEmail(),
      phone: buyerModel.getPhone()
    };

    try {
      const res = await api.postOrder(order);
      cartModel.clear();
      buyerModel.reset();
      const successEl = successView.render({ total: res.total ?? 0 });
      modal.setContent(successEl);
    } catch (err) {
      console.error('Ошибка при оформлении заказа:', err);
      // В случае ошибки показываем окно успешного завершения с нулевой суммой
      const successEl = successView.render({ total: 0 });
      modal.setContent(successEl);
    }
  });

  //  к успеху
  events.on(EVENTS.ORDER_SUBMITTED, () => {
    modal.close();
  });
});