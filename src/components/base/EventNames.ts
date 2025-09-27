// Общий список событий приложения 

export const EVENTS = {
    // МОДЕЛИ
    CATALOG_CHANGED: "catalog:changed", //каталог товаров обновился
    CART_CHANGED: "cart:changed", //корзина
    SELECT_CHANGED: "select:changed", // изменился выбранный товар
    BUYER_CHANGED: "buyer:changed", // обновились данные покупателя

    //КАРТОЧКИ ТОВАРОВ
    CARD_SELECT: "card:select", // выбранная пользователем карточка
    CARD_BUY: "card:buy", // клик по кнопке купить 
    CARD_REMOVE: "card:remove", //удаление карточки товара

    // Корзина
    BASKET_OPEN: "basket:open", // открытие корзины
    BASKET_CHECKOUT: "basket:checkout", //оформление заказа

    // Оформление заказа 
    ORDER_STEP1_NEXT: "order:step1:next", // шаг 1 (адрес + оплата)
    ORDER_STEP2_PAY: "order:step2:pay", // шаг 2 (контакты) , отправка заказа

    // ФОРМЫ
    FORM_CHANGE: /^form:/, // событие,связанное с изменением полей

    // МОДАЛЬНЫЕ ОКНА 
    MODAL_OPENED: "modal:open", // открыли модаку
    MODAL_CLOSED: "modal:close", // закрыли модалку

} as const;