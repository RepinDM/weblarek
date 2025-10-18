
export class Component<T = any> {
    protected container: HTMLElement;

    constructor(container: HTMLElement) {
        this.container = container;
    }

    // Публичный аксессор для внешнего кода (презентеров) чтобы получить контейнер
    public getContainer(): HTMLElement {
        return this.container;
    }

    render(_data?: Partial<T>): HTMLElement {
        return this.container;
    }

    protected setImage(img: HTMLImageElement, src: string, alt?: string) {
        img.src = src;
        if (alt) img.alt = alt;
    }
}
