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

type ActiveModal = 'preview' | 'basket' | 'order' | 'success' | null;
const PRODUCTS_LOAD_TIMEOUT = 3000;
const ORDER_SUBMIT_TIMEOUT = 5000;
const localProductImages = import.meta.glob('../svg icon/*.svg', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;
const productImageAliases: Record<string, string> = {
  '5_dots.svg': '5 Dots.svg',
  'shell.svg': 'Shell-1.svg',
  'asterisk_2.svg': 'Asterisk 3.svg',
  'soft_flower.svg': 'Soft Flower.svg',
  'vector_2.svg': 'Vector 2.svg',
  'frame_307.svg': 'Frame 307.svg',
  'leaf.svg': 'Leaf (2).svg',
};

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
let activeModal: ActiveModal = null;

function getImageUrl(image: string): string {
  if (!image) return '';
  if (image.startsWith('http')) return image;
  return `${CDN_URL}/${image.replace(/^\/+/, '')}`;
}

function getLocalProductImageUrl(image: string): string {
  const fileName = image.split('/').pop() ?? '';
  const localFileName = productImageAliases[fileName.toLowerCase()] ?? fileName.replaceAll('_', ' ');
  const localPath = `../svg icon/${localFileName}`;

  return localProductImages[localPath] ?? getImageUrl(image);
}

function withTimeout<T>(promise: Promise<T>, timeout: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      window.setTimeout(() => reject(new Error('Request timeout')), timeout);
    })
  ]);
}

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
    const products = await withTimeout(api.getProducts(), PRODUCTS_LOAD_TIMEOUT);
    // Добавляем CDN URL к изображениям товаров
    const productsWithCDN = products.map(product => ({
      ...product,
      image: getImageUrl(product.image)
    }));
    productsModel.setItems(productsWithCDN);
  } catch {
    // Fallback на демо-данные в случае ошибки
    const fallbackProducts = (apiProducts.items as IShopItem[]).map(product => ({
      ...product,
      image: getLocalProductImageUrl(product.image)
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
  activeModal = 'preview';
  modal.open();
});

// Обработка добавления товара в корзину из превью
events.on(EVENTS.CARD_ADD, (item?: IShopItem) => {
  if (item) {
    cartModel.add(item);
    // Закрываем модальное окно после добавления
    activeModal = null;
    modal.close();
  }
});

function renderBasket(): void {
  const items = cartModel.getItems();
  const total = cartModel.getTotal();
  const basketEl = basketView.render({ items, total });
  modal.setContent(basketEl);
  activeModal = 'basket';
}

// откройте корзину, нажав на кнопку в шапке
headerBasketBtn.addEventListener('click', () => {
  renderBasket();
  modal.open();
});

// удалить товар из корзины (вызвано из BasketItemView)
events.on(EVENTS.CARD_REMOVE, (id?: string) => {
  if (!id) return;
  cartModel.remove(id);
  if (activeModal === 'preview') {
    activeModal = null;
    modal.close();
  }
});

events.on(EVENTS.CART_CHANGED, () => {
  if (activeModal === 'basket') {
    renderBasket();
  }
});

function renderOrderStep1(errors?: Record<string, string>): void {
  const step1El = step1View.render({
    address: buyerModel.getAddress(),
    payment: buyerModel.getPayment(),
    errors
  });
  modal.setContent(step1El);
  activeModal = 'order';
}

function renderOrderStep2(errors?: Record<string, string>): void {
  const step2El = step2View.render({
    email: buyerModel.getEmail(),
    phone: buyerModel.getPhone(),
    errors
  });
  modal.setContent(step2El);
  activeModal = 'order';
}

function showOrderSuccess(total: number): void {
  cartModel.clear();
  buyerModel.reset();
  const successEl = successView.render({ total });
  modal.setContent(successEl);
  activeModal = 'success';
}

// начало оформления заказа (вызывается BasketView)
events.on(EVENTS.BASKET_CHECKOUT, () => {
  renderOrderStep1();
  modal.open();
});

// buyer input changes (from step1/step2 views)
events.on<IBuyerChangedEvent>(EVENTS.BUYER_INPUT_CHANGED, (payload?: IBuyerChangedEvent) => {
  if (!payload) return;
  const { field, value } = payload;
  if (field === 'payment') buyerModel.setPayment(value as IBuyer['payment']);
  if (field === 'address') buyerModel.setAddress(value);
  if (field === 'email') buyerModel.setEmail(value);
  if (field === 'phone') buyerModel.setPhone(value);
});

// шаг 1 следующий
events.on('order:step1:next', () => {
  const errs = buyerModel.validateStep1();
  if (Object.keys(errs).length) {
    renderOrderStep1(errs);
    return;
  }

  renderOrderStep2();
});

// отправить заказ
events.on('order:submit', async () => {
  const errs = buyerModel.validateStep2();
  if (Object.keys(errs).length) {
    renderOrderStep2(errs);
    return;
  }

  const order = {
    items: cartModel.getItems().map(i => i.id),
    payment: buyerModel.getPayment() as ("card" | "cash"),
    address: buyerModel.getAddress(),
    email: buyerModel.getEmail(),
    phone: buyerModel.getPhone()
  };
  const orderTotal = cartModel.getTotal();

  try {
    const res = await withTimeout(api.postOrder(order), ORDER_SUBMIT_TIMEOUT);
    showOrderSuccess(res.total ?? orderTotal);
  } catch {
    renderOrderStep2({ submit: 'Не удалось оформить заказ. Проверьте соединение и попробуйте ещё раз.' });
  }
});

// закрытие окна успеха
events.on(EVENTS.ORDER_SUBMITTED, () => {
  activeModal = null;
  modal.close();
});
