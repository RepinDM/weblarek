// ---------------------------
// Тип товара в магазине
// ---------------------------
export interface IShopItem {
    id: string;
    title: string;
    description: string;
    category: string;
    image: string;
    price: number | null; // null = бесплатный товар
}

// ---------------------------
// Тип способа оплаты
// ---------------------------
export type TPayment = "card" | "cash";

// ---------------------------
// Данные покупателя (форма)
// ---------------------------
export interface IBuyer {
    payment: TPayment | "";
    address: string;
    email: string;
    phone: string;
}

// ---------------------------
// Заказ (отправляется на сервер)
// ---------------------------
export interface IOrder {
    items: string[]; // список id товаров
    payment: TPayment;
    address: string;
    email: string;
    phone: string;
}

// ---------------------------
// Ответ от сервера на заказ
// ---------------------------
export interface IOrderResponse {
    id: string;     // id заказа
    total: number;  // сумма заказа
}

// ---------------------------
// Типы для событий
// ---------------------------
export interface ICartCounterEvent {
  count: number;
}

export interface IBuyerChangedEvent {
  field: keyof IBuyer;
  value: string;
}

// ---------------------------
// Общий тип для событий
// ---------------------------
export type EventName = string | RegExp;