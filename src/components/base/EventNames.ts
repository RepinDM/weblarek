// Общий список событий приложения 

export const EVENTS = {
    // МОДЕЛИ
    CATALOG_CHANGED: "catalog:changet", //каталог товаров обновился
    CART_CHANGED: "cart:changet", //корзина
    SELECT_CHANGET: "select:changet", // изменился выбранный товар
    BUYER_CHANGET: "buyer:changet", // обновились данные покупателя

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
    FROM_CHANGE: /^form:/, // событие,связанное с изменением полей

    // МОДАЛЬНЫЕ ОКНА 
    MODAL_OPENED: "modal:open", // открыли модаку
    MODAL_CLOSED: "modal:close", // закрыли модалку

} as const;