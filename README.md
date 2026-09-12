# Web Larek

## About

Web Larek is a TypeScript single-page storefront built with Vite. The app shows a product catalog, opens product previews in a modal, manages a cart, and walks the user through a two-step checkout flow.

The project is an educational implementation of a small e-commerce interface with a class-based MVP architecture.

## Features

- Product catalog loaded from the Web Larek API.
- Fallback catalog from local demo data when the API is unavailable.
- Local SVG product icons for fallback data from the `svg icon/` folder.
- Product preview modal with full description, category, image, price, and cart action.
- Cart counter in the header.
- Cart modal with selected products, total price, item removal, and empty-cart state.
- Two-step checkout:
  - payment method and delivery address;
  - email and phone.
- Form buttons become active only when required fields are filled.
- Success modal after checkout with the charged total.
- Modal closing by overlay click and close button.

## Architecture

The app follows MVP.

Model:

- `ProductsModel` stores catalog items and selected product id.
- `CartModel` stores cart items in a `Map<string, IShopItem>`.
- `BuyerModel` stores checkout fields and validates the two checkout steps.
- Models do not work with DOM directly.

View:

- View classes are stored in `src/components/view`.
- They render DOM from templates in `index.html`.
- They emit UI events through `EventEmitter`.
- They do not call the API directly.

Presenter / coordination:

- `CatalogPresenter` listens to catalog changes and renders catalog cards.
- `BasketPresenter` listens to cart changes and updates cart-related state.
- `src/main.ts` wires models, views, presenters, API, and app-level event handlers.

Shared base classes:

- `Component<T>` is the base class for UI components.
- `Api` is the base HTTP client.
- `EventEmitter` is the application event bus.

## Stack

- TypeScript
- Vite
- SCSS
- HTML templates
- Class-based OOP
- MVP
- Native Fetch API

## My Implementation

Important project files:

```text
src/
  components/
    base/
      Api.ts
      Component.ts
      EventNames.ts
      Events.ts
    models/
      BuyerModel.ts
      CardModel.ts
      LarekApi.ts
      ProductsModel.ts
    presenter/
      BasketPresenter.ts
      CatalogPresenter.ts
    view/
      BasketItemView.ts
      BasketView.ts
      CardCatalog.ts
      CardPreview.ts
      Modal.ts
      OrderStep1View.ts
      OrderStep2View.ts
      SuccessView.ts
  types/
    index.ts
  utils/
    constants.ts
    data.ts
  main.ts
svg icon/
  local fallback product icons
```

Core implementation details:

- `LarekApi` extends the base `Api` class and exposes `getProducts()` and `postOrder()`.
- `loadProducts()` uses the API first and falls back to `src/utils/data.ts` after a timeout.
- Fallback products are matched with local SVG assets using `import.meta.glob('../svg icon/*.svg')`.
- Product images from the API use the CDN URL from `CDN_URL`.
- `CardCatalog` and `CardPreview` also have image `onerror` fallbacks.
- Products with `price: null` cannot be added to the cart and show the disabled `Недоступно` button.
- Cart changes update the header counter and the currently open cart modal.
- Checkout event handlers are registered once in `main.ts`, so opening checkout repeatedly does not duplicate subscriptions.
- Successful checkout clears the cart and buyer data, then renders `SuccessView`.
- Failed checkout keeps the cart and buyer data, then shows an error message in the contacts form so the user can retry.

## API / Data Flow

Default API origin:

```text
https://larek-api.nomoreparties.co
```

It can be overridden with:

```text
VITE_API_ORIGIN
```

Endpoints used by the app:

- `GET /api/weblarek/product` — loads products.
- `POST /api/weblarek/order` — sends checkout data.

Product loading flow:

1. `main.ts` calls `LarekApi.getProducts()`.
2. The request is wrapped in a timeout.
3. If the API responds, product images are converted to CDN URLs.
4. If the API fails or times out, local `apiProducts` from `src/utils/data.ts` are used.
5. Fallback image names are mapped to SVG files from `svg icon/`.
6. `ProductsModel.setItems()` emits `catalog:changed`.
7. `CatalogPresenter` renders `CardCatalog` elements into `Catalog`.

Checkout flow:

1. User adds products to `CartModel`.
2. Basket view displays items and total.
3. Step 1 collects payment method and address.
4. Step 2 collects email and phone.
5. `main.ts` builds an `IOrder` object.
6. `LarekApi.postOrder()` sends the order with a timeout.
7. On success, `SuccessView` is rendered and the cart/buyer data are cleared.
8. On failure or timeout, the contacts form displays an error and keeps the current cart and buyer data.

Main data types are defined in `src/types/index.ts`:

- `IShopItem`
- `TPayment`
- `IBuyer`
- `IOrder`
- `IOrderResponse`
- `ICartCounterEvent`
- `IBuyerChangedEvent`

## How To Run

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm start
```

Alternative dev command:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

Type-check only:

```bash
npm run type-check
```

## Known Limitations

- The external API may be unavailable from some environments. The catalog has timeout-based fallback data so browsing remains available.
- Local fallback data currently contains only a small subset of products.
- Checkout requires a successful order API response. If the request fails or times out, the app shows an error and keeps the order data for retry.
- There are no automated UI tests in the project.
- No production deployment URL is configured yet.

## Screenshots

Add project screenshots here:

```text
docs/screenshots/catalog.png
docs/screenshots/product-preview.png
docs/screenshots/cart.png
docs/screenshots/order-success.png
```

## Demo

No deployed demo is configured yet.
