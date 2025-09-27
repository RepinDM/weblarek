export class Component<T = any> {
    constructor(protected container: HTMLElement) {}

    render(data?: Partial<T>): HTMLElement {
    return this.container;
    }

    protected setImage(element: HTMLImageElement, src: string, alt?: string) {
    element.src = src;
    if (alt) element.alt = alt;
    }
}
