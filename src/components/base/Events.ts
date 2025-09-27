export type EventName = string | RegExp;

export interface IEvents {
    on<T extends object>(event: EventName, callback: (data: T) => void): void;
    emit<T extends object>(event: string, data?: T): void;
}

export class EventEmitter implements IEvents {
private _events = new Map<EventName, Set<Function>>();

    on<T extends object>(event: EventName, callback: (data: T) => void): void {
    if (!this._events.has(event)) {
        this._events.set(event, new Set());
    }
    this._events.get(event)!.add(callback);
}

emit<T extends object>(event: string, data?: T): void {
    this._events.forEach((callbacks, key) => {
    if (typeof key === "string" && key === event) {
        callbacks.forEach((cb) => cb(data));
    }
    if (key instanceof RegExp && key.test(event)) {
        callbacks.forEach((cb) => cb(data));
    }
    });
}
}
