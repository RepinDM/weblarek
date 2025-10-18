// src/main.ts
import "./scss/styles.scss";
import { apiProducts } from "./utils/data";
import { API_URL } from "./utils/constants";

import { EventEmitter } from "./components/base/Events";

import { ProductsModel } from "./components/models/ProductsModal";
import { CartModel } from "./components/models/CardModel";
import { BuyerModel } from "./components/models/BuyerModel";
import { LarekApi } from "./components/models/LarekApi";

import { Catalog } from "./components/view/Catalog";
import { BasketView } from "./components/view/BasketView";
import { Modal } from "./components/view/Modal";
import { OrderFormView } from "./components/view/OrderForm";
import { SuccessView } from "./components/view/SuccessView";

import { CatalogPresenter } from "./components/presenter/CatalogPresenter";
import { BasketPresenter } from "./components/presenter/BasketPresenter";

const events = new EventEmitter();

import type { IShopItem } from "./types";

// Модели
const productsModel = new ProductsModel(events);
const cartModel = new CartModel(events);
const buyerModel = new BuyerModel(events);

// Локальные демонстрационные данные
productsModel.setItems(apiProducts.items as IShopItem[]);

// Представления / элементы UI
const gallery = document.querySelector('.gallery') as HTMLElement;
const headerBasketBtn = document.querySelector('.header__basket') as HTMLButtonElement;
const headerCounter = document.querySelector('.header__basket-counter') as HTMLElement;
const modalRoot = document.querySelector('.modal') as HTMLElement;

// Создаём представления, которым нужны контейнеры
const catalogView = new Catalog(gallery);
const basketView = new BasketView(document.createElement('div')); // will render into modal
const modal = new Modal(modalRoot);
const orderForm = new OrderFormView(document.createElement('div'));
const successView = new SuccessView(document.createElement('div'));

// Презентеры
new CatalogPresenter(productsModel, catalogView, events);
new BasketPresenter(cartModel, basketView, events);

// инициализация обновления счётчика в шапке
events.on('cart:counter', (data: any) => {
  headerCounter.textContent = String(data.count ?? 0);
});

// Клик: открыть корзину
headerBasketBtn.addEventListener('click', () => {
  // отрисовать корзину внутри модального окна и открыть его
  const basketEl = basketView.render();
  modal.setContent(basketEl);
  modal.open();

  // навесить делегирование событий для удаления и оформления внутри модального окна
  basketEl.querySelector('.basket__list')?.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest('.basket__item-delete') as HTMLElement;
    if (btn) {
      const id = btn.dataset.id!;
      cartModel.remove(id);
    }
  });

  basketEl.querySelector('.basket__button')?.addEventListener('click', () => {
  // открыть шаг 1 оформления заказа в модальном окне
    const step1 = orderForm.renderStep1({
      address: buyerModel.getAddress(),
      payment: buyerModel.getPayment()
    }, {});
    modal.setContent(step1);

  // подключить обработчики элементов формы
    const cardBtn = step1.querySelector('button[name="card"]') as HTMLButtonElement;
    const cashBtn = step1.querySelector('button[name="cash"]') as HTMLButtonElement;
    const addressInput = step1.querySelector('input[name="address"]') as HTMLInputElement;
    const nextBtn = step1.querySelector('.order__button') as HTMLButtonElement;

    function updateStep1State() {
      const errors = buyerModel.validateStep1();
      nextBtn.disabled = Object.keys(errors).length > 0;
    }

    cardBtn.addEventListener('click', () => {
      buyerModel.setPayment('card');
      cardBtn.classList.add('button_alt-active');
      cashBtn.classList.remove('button_alt-active');
      updateStep1State();
    });
    cashBtn.addEventListener('click', () => {
      buyerModel.setPayment('cash');
      cashBtn.classList.add('button_alt-active');
      cardBtn.classList.remove('button_alt-active');
      updateStep1State();
    });
    addressInput.addEventListener('input', () => {
      buyerModel.setAddress(addressInput.value);
      updateStep1State();
    });

    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const errs = buyerModel.validateStep1();
      if (Object.keys(errs).length) {
  // перерисовать с отображением ошибок
        const step1withErrors = orderForm.renderStep1({
          address: buyerModel.getAddress(),
          payment: buyerModel.getPayment()
        }, errs);
        modal.setContent(step1withErrors);
        return;
      }
  // шаг 2
      const step2 = orderForm.renderStep2({
        email: buyerModel.getEmail(),
        phone: buyerModel.getPhone()
      }, {});
      modal.setContent(step2);

      const emailInput = step2.querySelector('input[name="email"]') as HTMLInputElement;
      const phoneInput = step2.querySelector('input[name="phone"]') as HTMLInputElement;
      const payBtn = step2.querySelector('button[type="submit"]') as HTMLButtonElement;
      payBtn.disabled = true;

      function updateStep2State() {
        const errs = buyerModel.validateStep2();
        payBtn.disabled = Object.keys(errs).length > 0;
      }

      emailInput.addEventListener('input', () => {
        buyerModel.setEmail(emailInput.value);
        updateStep2State();
      });
      phoneInput.addEventListener('input', () => {
        buyerModel.setPhone(phoneInput.value);
        updateStep2State();
      });

      payBtn.addEventListener('click', async (ev) => {
        ev.preventDefault();
        const errs = buyerModel.validateStep2();
        if (Object.keys(errs).length) {
          const step2withErrors = orderForm.renderStep2({
            email: buyerModel.getEmail(),
            phone: buyerModel.getPhone()
          }, errs);
          modal.setContent(step2withErrors);
          return;
        }

  // подготовка заказа
        const order = {
          items: cartModel.getItems().map((i: IShopItem) => i.id),
          payment: buyerModel.getPayment(),
          address: buyerModel.getAddress(),
          email: buyerModel.getEmail(),
          phone: buyerModel.getPhone()
        };

  // отправка на сервер через LarekApi (или мок)
        try {
          const api = new LarekApi(API_URL);
          const res = await api.postOrder(order as any);
          // успех: очистить корзину и данные покупателя
          cartModel.clear();
          buyerModel.reset();
          const successEl = successView.render(`Списано ${res.total ?? 0} синапсов`);
          modal.setContent(successEl);
          // закрыть по клику на кнопку
          successEl.querySelector('.order-success__close')?.addEventListener('click', () => {
            modal.close();
          });
        } catch (err) {
          console.error(err);
          const successEl = successView.render(`Произошла ошибка: ${String(err)}`);
          modal.setContent(successEl);
        }
      });
    });
  });

});
