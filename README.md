# Проектная работа "Веб-ларёк"

**Стек:** HTML, SCSS, TypeScript, Vite  

## Структура проекта

- `src/` — исходные файлы проекта  
- `src/components/` — папка с компонентами интерфейса  
- `src/components/Models/` — папка с моделями данных  
- `src/components/base/` — базовый код (Component, Api, EventEmitter)  
- `src/types/index.ts` — файл с типами данных  
- `src/utils/constants.ts` — файл с константами  
- `src/utils/data.ts` — тестовые данные для моделей  
- `src/main.ts` — точка входа приложения  
- `index.html` — HTML главной страницы  
- `src/scss/styles.scss` — корневой файл стилей  

---

## Установка и запуск

Установка зависимостей и запуск проекта:

```bash
npm install
npm run start
````

или через Yarn:

```bash
yarn
yarn start
```

### Сборка проекта

```bash
npm run build
```

или

```bash
yarn build
```

---

# Интернет-магазин «Web-Larёk»

«Web-Larёk» — интернет-магазин с товарами для веб-разработчиков.
Пользователи могут просматривать товары, добавлять их в корзину, оформлять заказ с выбором способа оплаты и доставкой. Сайт использует модальные окна для работы с товарами и корзиной, обеспечивает валидацию данных пользователя и отправку заказов на сервер.

---

## Архитектура приложения

Применяемый паттерн: **MVP (Model-View-Presenter)**

* **Model** — хранение и управление данными (каталог товаров, корзина, покупатель).
* **View** — представление, отвечает за отображение данных и модальные окна.
* **Presenter** — связывает Model и View, обрабатывает события пользователя и логику приложения.

### Взаимодействие классов

* Модели и представления используют события (EventEmitter).
* Презентер подписывается на события моделей и представлений и выполняет действия (например, добавление товара в корзину или оформление заказа).

---

## Типы данных (`types/index.ts`)

```ts
export interface IShopItem {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  price: number | null;
}

export interface IBuyer {
  payment: "card" | "cash" | "";
  address: string;
  email: string;
  phone: string;
}

export interface IOrder {
  items: string[];
  payment: "card" | "cash";
  address: string;
  email: string;
  phone: string;
}

export interface IOrderResponse {
  id: string;
  total: number;
}

export type EventName = string | RegExp;
```

---

## Базовые классы

### Класс `Component`

Базовый класс для всех компонентов интерфейса.

* **Конструктор:** `constructor(container: HTMLElement)` — принимает корневой DOM элемент.
* **Поля:** `container: HTMLElement` — корневой элемент компонента.
* **Методы:**

  * `render(data?: Partial<T>): HTMLElement` — отображает данные в интерфейсе;
  * `setImage(element: HTMLImageElement, src: string, alt?: string): void` — утилитарный метод для `<img>`.

### Класс `Api`

Содержит базовую логику работы с сервером.

* **Конструктор:** `constructor(baseUrl: string, options: RequestInit = {})`
* **Поля:** `baseUrl`, `options`
* **Методы:**

  * `get(uri: string): Promise<object>` — GET-запрос;
  * `post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` — POST-запрос;
  * `handleResponse(response: Response): Promise<object>` — проверка ответа сервера.

### Класс `EventEmitter`

Реализует паттерн «Наблюдатель».

* **Поля:** `_events: Map<string | RegExp, Set<Function>>` — хранит подписки на события.
* **Методы:**

  * `on<T extends object>(event: EventName, callback: (data: T) => void): void` — подписка на событие;
  * `emit<T extends object>(event: string, data?: T): void` — генерация события;
  * `trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` — возвращает функцию генерации события.

---

## Классы моделей данных (`components/Models`)

### 1. `Products` — каталог товаров

* **Поля:**

  * `items: IShopItem[]` — все товары
  * `selectedItem: IShopItem | null` — выбранный товар для просмотра
* **Методы:**

  * `setItems(items: IShopItem[]): void`
  * `getItems(): IShopItem[]`
  * `getItemById(id: string): IShopItem | undefined`
  * `setSelectedItem(item: IShopItem): void`
  * `getSelectedItem(): IShopItem | null`

### 2. `Basket` — корзина покупок

* **Поля:** `items: IShopItem[]`
* **Методы:**

  * `getItems(): IShopItem[]`
  * `addItem(item: IShopItem): void`
  * `removeItem(item: IShopItem): void`
  * `clear(): void`
  * `getTotal(): number`
  * `getCount(): number`
  * `hasItem(id: string): boolean`

### 3. `Buyer` — данные покупателя

* **Поля:** `payment`, `address`, `email`, `phone`
* **Методы:**

  * `setField(field: keyof IBuyer, value: string): void`
  * `getData(): IBuyer`
  * `clear(): void`
  * `validate(): Partial<Record<keyof IBuyer, string>>`

---

## Класс коммуникационного слоя (`api/LarekApi.ts`)

```ts
import { Api } from "../base/Api";
import type { IShopItem, IOrder, IOrderResponse } from "../../types";

export class LarekApi extends Api {
  getProducts(): Promise<IShopItem[]> {
    return this.get("/products") as Promise<IShopItem[]>;
  }

  postOrder(order: IOrder): Promise<IOrderResponse> {
    return this.post("/order", order) as Promise<IOrderResponse>;
  }
}
```

---

## Пример использования (`main.ts`)

```ts
import { LarekApi } from "./api/LarekApi";
import { Basket } from "./components/Models/Basket";
import type { IBuyer, IOrder } from "./types";

const api = new LarekApi();
const basket = new Basket();

// Получение товаров
api.getProducts().then(products => console.log("Каталог товаров:", products));

// Пример оформления заказа
const buyerData: IBuyer = {
  payment: "card",
  address: "ул. Пушкина, д. 1",
  email: "user@example.com",
  phone: "+79001234567",
};

const order: IOrder = {
  items: basket.getItems().map(item => item.id),
  payment: buyerData.payment,
  address: buyerData.address,
  email: buyerData.email,
  phone: buyerData.phone,
};

api.postOrder(order).then(response => console.log("Заказ отправлен:", response));
```

---


