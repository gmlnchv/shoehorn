# @chrctr/shoehorn

[![npm version](https://img.shields.io/npm/v/@chrctr/shoehorn.svg)](https://www.npmjs.com/package/@chrctr/shoehorn)
[![license](https://img.shields.io/npm/l/@chrctr/shoehorn.svg)](https://github.com/gmlnchv/shoehorn/blob/main/LICENSE)

A zero-dependency, high-performance Web Component that automatically adjusts the font size of text to perfectly fit its container. Ideal for headlines, banners, and digital signage (DOOH).

## Features

- **Three Fitting Modes:** Fit text to width, height, or a 2D box.
- **Framework Agnostic:** Works in any framework (React, Vue, Svelte) or with no framework at all.
- **Lightweight:** Tiny footprint with zero dependencies.
- **Modern API:** Built with modern browser features like `ResizeObserver` for optimal performance.

## Installation

```bash
npm install @chrctr/shoehorn
```

## Usage

There are two ways to use the component, depending on your project setup.

### 1. With a Bundler (Vite, Webpack, etc.)

Import the component into your main JavaScript or TypeScript file. This will register the `<shoehorn-text>` custom element, making it available throughout your application.

```javascript
// main.js
import '@chrctr/shoehorn';
```

### 2. Via `<script>` Tag

For environments without a build step (like CodePen, basic HTML pages, or some CMS platforms), you can use a CDN like JSDelivr.

```html
<!-- Add this to your HTML file -->
<script type="module" src="[https://cdn.jsdelivr.net/npm/@chrctr/shoehorn/dist/shoehorn.esm.js](https://cdn.jsdelivr.net/npm/@chrctr/shoehorn/dist/shoehorn.esm.js)"></script>
```

### Example

Once the component is registered, you can use it directly in your HTML.

```html
<div style="width: 800px; height: 150px; border: 2px solid #333;">
  <shoehorn-text>
    This text will scale to fit!
  </shoehorn-text>
</div>
```

## API

Control the behavior of the component using these HTML attributes.

| Attribute     | Type      | Default   | Description                                                                                             |
|---------------|-----------|-----------|---------------------------------------------------------------------------------------------------------|
| `mode`        | `string`  | `"width"` | Sets the fitting algorithm. Can be `"width"`, `"height"`, or `"box"`.                                       |
| `min-size`    | `number`  | `16`      | The minimum font size in pixels that the text can shrink to.                                              |
| `max-size`    | `number`  | `512`     | The maximum font size in pixels that the text can grow to.                                                |

### Modes

#### `mode="width"` (Default)
Scales the text to fill the full width of the container on a single line. The height will adjust automatically.

```html
<div style="width: 100%; height: 120px;">
  <shoehorn-text mode="width">Fills the width</shoehorn-text>
</div>
```

#### `mode="height"`
Scales the text to fill the full height of the container on a single line. The text may overflow its container's width if it is too long.

```html
<div style="width: 400px; height: 150px;">
  <shoehorn-text mode="height">Fills the height</shoehorn-text>
</div>
```

#### `mode="box"

The `resize` method allows manual triggering of the resize logic. This can be useful in scenarios where the parent element's size changes programmatically. It calls the existing `fit` method with the `sync` option set to `true`, ensuring that the resizing occurs immediately.
Scales the text to be as large as possible without overflowing the container's width OR height, wrapping lines as needed. This is the most powerful mode for fitting text into a fixed-size box.

```html
<div style="width: 350px; height: 250px;">
  <shoehorn-text mode="box" min-size="12">
    This text fits perfectly inside the entire box.
  </shoehorn-text>
</div>
```

## Contributing

Contributions are welcome! If you have a feature request, bug report, or pull request, please open an issue on the [GitHub repository](https://github.com/gmlnchv/shoehorn).

## License

This project is licensed under the MIT License.
