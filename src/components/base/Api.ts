export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export class Api {
constructor(
    protected baseUrl: string,
    protected options: RequestInit = {}
) {}

protected handleResponse(response: Response): Promise<object> {
    if (!response.ok) {
    return Promise.reject(`Ошибка: ${response.status}`);
    }
    return response.json();
}

public get(uri: string): Promise<object> {
    return fetch(`${this.baseUrl}${uri}`, {
    ...this.options,
    method: 'GET',
    }).then(this.handleResponse);
}

public post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object> {
    return fetch(`${this.baseUrl}${uri}`, {
    ...this.options,
    method,
    body: JSON.stringify(data),
    }).then(this.handleResponse);
}
}
