# Проектная работа «Веб-Ларёк»

## 📖 Описание проекта

**«Веб-Ларёк»** — учебный проект интернет-магазина для веб-разработчиков.  
Пользователи могут просматривать каталог товаров, добавлять их в корзину и оформлять заказ с выбором способа оплаты и адресом доставки.  
Приложение построено по архитектурному паттерну **MVP (Model–View–Presenter)** и написано на **TypeScript** с использованием **Vite** и модульной SCSS-структуры.

---

## 🧰 Технологии

- **HTML5**
- **SCSS (BEM, модули, миксины)**
- **TypeScript**
- **Vite**
- **ООП / SOLID**
- **MVP-паттерн**
- **EventEmitter (событийная модель)**

---

## 📁 Структура проекта

```
src/
├── api/                   # Классы для работы с API
├── components/            # Компоненты интерфейса (View)
│   ├── base/              # Базовые классы (Component, Api, EventEmitter)
│   └── Models/            # Модели данных (Model)
├── images/                # Графические ресурсы
├── scss/                  # Стили (SCSS, миксины, переменные)
├── types/                 # Типы данных TypeScript
├── utils/                 # Вспомогательные файлы и константы
├── main.ts                # Точка входа приложения
└── index.html             # Главный HTML-файл
```

---

## ⚙️ Установка и запуск

```bash
npm install
npm run start
```

или

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

## 🧩 Архитектура проекта

Приложение реализовано по паттерну **MVP (Model–View–Presenter)**.

### **Model**
Хранит и управляет данными:
- список товаров (`Products`),
- содержимое корзины (`Basket`),
- данные покупателя (`Buyer`).

### **View**
Отвечает за визуальное отображение данных, модальные окна и пользовательские формы.  
Компоненты реализованы на основе базового класса `Component`, взаимодействуют через события.

### **Presenter**
Является посредником между Model и View.  
Обрабатывает события интерфейса, изменяет модели и обновляет представления.

### **Событийная модель**
Взаимодействие между слоями осуществляется через `EventEmitter`, реализующий паттерн «Наблюдатель».

---

## 📦 Типы данных (`src/types/index.ts`)

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

## 🧱 Базовые классы

### `Component`
Базовый класс для всех UI-компонентов.

**Конструктор:**  
`constructor(container: HTMLElement)`

**Методы:**
- `render(data?: Partial<T>): HTMLElement` — отрисовка компонента;
- `setImage(element: HTMLImageElement, src: string, alt?: string): void` — установка изображения.

---

### `Api`
Базовый класс для взаимодействия с сервером.

**Методы:**
- `get(uri: string): Promise<object>` — GET-запрос;
- `post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` — POST-запрос;
- `handleResponse(response: Response): Promise<object>` — проверка ответа сервера.

---

### `EventEmitter`
Реализация паттерна «Наблюдатель» для событийной логики.

**Методы:**
- `on(event, callback)` — подписка на событие;
- `emit(event, data)` — генерация события;
- `trigger(event)` — возврат функции-генератора события.

---

## 🗂 Модели данных (`src/components/Models`)

### `Products` — каталог товаров
- `setItems(items: IShopItem[])` — установка списка товаров  
- `getItems()` — получение всех товаров  
- `getItemById(id: string)` — получение товара по ID  
- `setSelectedItem(item: IShopItem)` — установка выбранного товара  
- `getSelectedItem()` — получение выбранного товара  

---

### `Basket` — корзина покупок
- `addItem(item: IShopItem)` — добавить товар  
- `removeItem(item: IShopItem)` — удалить товар  
- `clear()` — очистить корзину  
- `getTotal()` — общая сумма  
- `getCount()` — количество товаров  
- `hasItem(id: string)` — проверка, есть ли товар  

---

### `Buyer` — данные покупателя
- `setField(field: keyof IBuyer, value: string)` — изменение данных  
- `getData()` — получение данных покупателя  
- `clear()` — очистка данных  
- `validate()` — валидация полей формы  

---

## 🌐 Класс API (`src/api/LarekApi.ts`)

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

## 🧠 Пример использования (`main.ts`)

```ts
import { LarekApi } from "./api/LarekApi";
import { Basket } from "./components/Models/Basket";
import type { IBuyer, IOrder } from "./types";

const api = new LarekApi();
const basket = new Basket();

// Получение каталога
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

## 🧩 UML-диаграмма (описание)

**Классы:**
- `Products`, `Basket`, `Buyer` — наследуют общие принципы Model.
- `Component` — базовый класс для View-компонентов.
- `LarekApi` — расширяет `Api`.
- `EventEmitter` — обеспечивает обмен событиями между слоями.
- `Presenter` — связывает Model и View, управляет состоянием.

```
+--------------------+
|     Presenter      |
+--------------------+
| - models           |
| - views            |
| - api              |
+--------------------+
| + init()           |
| + handleEvents()   |
+--------------------+
        ↑
        │
+---------------+      +-----------------+
|    Models     |      |      Views      |
+---------------+      +-----------------+
| Products      |      | CatalogView     |
| Basket        |      | ModalView       |
| Buyer         |      | FormView        |
+---------------+      +-----------------+
        ↑                     ↑
        └────── EventEmitter ─┘
```

---

## ✅ Критерии готовности проекта

- Проект собирается и запускается через `npm start`.
- Каталог товаров загружается с сервера.
- Корзина корректно считает количество и сумму.
- Формы заказов проходят валидацию.
- Заказ отправляется на сервер.
- Код написан на TypeScript.
- Архитектура соответствует паттерну MVP.
- Есть описание классов, API, типов данных и событий.

---

## 👨‍💻 

**Студент Яндекс Практикума**  
Проект выполнен в рамках курса «Фронтенд-разработчик».
