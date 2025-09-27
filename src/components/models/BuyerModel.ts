import type { IEvents } from "../base/Events";

export class BuyerModel {
    private payment: string | null = null;
    private address: string = "";
    private email: string = "";
    private phone: string = "";

    constructor(private events?: IEvents) {}

setPayment(method: string) {
    this.payment = method.trim();
}

setAddress(address: string) {
    this.address = address.trim();
}

setEmail(email: string) {
    this.email = email.trim();
}

setPhone(phone: string) {
    this.phone = phone.trim();
}

getPayment() { return this.payment; }
getAddress() { return this.address; }
getEmail() { return this.email; }
getPhone() { return this.phone; }

reset() {
    this.payment = null;
    this.address = "";
    this.email = "";
    this.phone = "";
}

validateStep1() {
    const errors: Record<string, string> = {};
    if (!this.payment) errors.payment = "Выберите способ оплаты";
    if (!this.address) errors.address = "Введите адрес доставки";
    return errors;
}

validateStep2() {
    const errors: Record<string, string> = {};
    if (!this.email) errors.email = "Введите email";
    if (!this.phone) errors.phone = "Введите телефон";
    return errors;
}
}
