// Допустимые методы HTTP -запросов для отправки данных
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

// Интерфейс для класса API
export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}
// Тип для способов оплаты.
// "" используем для знчения по умолчанию ,когда пользователь еще ничего не выбрал.
export type TPayment = "card" | "cash" | "";

// Интерфейс товара в катологе интернет-магазина.
export interface IShopItem {
    id: string; // уникальный индификатор товара
    description: string; // Описание товара
    image: string; //ссылка на изображение
    title: string; //Название товара
    category: string; // Категория
    price: number | null; //Цена (либо number либо null)
}

// Интерфейс покупателя
export interface ICustomer {
    payment: TPayment; // Способы оплаты
    email: string; //Почта
    phone: string; // Телефон
    address: string; //Адрес доставки
}

// Данные заказа ,которые мы отправляем на сервер
export interface ICheckoutData {
    items: string[]; // Список id товаров
    payment: TPayment; // Способы оплаты
    email: string; //Почта
    phone: string; // Телефон
    address: string; //Адрес доставки
    total: number; // Общая сумма заказа
}

// Результат обработки заказа на сервер 
export interface ICheckoutResponse {
    id: string;  // Уникальный id заказа
    total: number; //Итоговая сумма заказа 
    success: boolean; // true , если заказ успешно принят 
}
// Интерфейс ответа от сервера 
// Общее количество товаров и массив самх товаров
export interface IShopCatalogResponse {
    total: number; //Общее количество товаров
    items: IShopItem[]; // Список товаров 
}

