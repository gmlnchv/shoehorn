export class Shoehorn extends HTMLElement {
    private _active: boolean = true;
    private _currentFontSize: number = 0;
    private _rafId: number = 0;

    // We need a direct reference to the span that wraps the text
    private _textWrapper!: HTMLSpanElement;
    private _resizeObserver!: ResizeObserver;
    private _mutationObserver!: MutationObserver;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot!.innerHTML = `
          <style>
            :host {
              display: block;
              width: 100%;
              height: 100%;
            }
            .text {
              display: inline-block;
            }
          </style>
          <span class="text">
            <slot></slot>
          </span>
        `;
    }

    get mode(): 'width' | 'height' | 'box' {
        const mode = this.getAttribute('mode');
        if (mode === 'height' || mode === 'box') return mode;
        return 'width';
    }

    get minSize(): number { return this._getFloatAttribute('min-size', 16); }
    get maxSize(): number { return this._getFloatAttribute('max-size', 512); }

    connectedCallback(): void {
        // Get the reference to the text wrapper when the component connects
        this._textWrapper = this.shadowRoot!.querySelector('.text')!;
        this._resize = this._resize.bind(this);

        this._resizeObserver = new ResizeObserver(this._resize);
        this._resizeObserver.observe(this);

        this._mutationObserver = new MutationObserver(this._resize);
        this._mutationObserver.observe(this, { childList: true, characterData: true, subtree: true  });

        this.fit({ sync: true });
    }

    disconnectedCallback(): void {
        this._resizeObserver.disconnect();
        this._mutationObserver.disconnect();
    }

    fit(options: { sync?: boolean } = { sync: false }): void {
        if (!this._active) return;
        if (options.sync) return this._resize();
        window.cancelAnimationFrame(this._rafId);
        this._rafId = window.requestAnimationFrame(this._resize);
    }

    freeze(): void { this._active = false; }
    unfreeze(): void { this._active = true; this.fit(); }

    private _resize(): void {
        if (!this.isConnected) return;

        const previousFontSize = this._currentFontSize;
        let newFontSize: number;

        // Use the correct text wrapper for all measurements and styling
        const wrapper = this._textWrapper;

        switch (this.mode) {
            case 'box':
                wrapper.style.whiteSpace = 'normal';
                let low = this.minSize, high = this.maxSize, lastFit = low;
                while (low <= high) {
                    let mid = Math.floor((low + high) / 2);
                    wrapper.style.fontSize = `${mid}px`;
                    if (wrapper.scrollHeight > this.clientHeight) {
                        high = mid - 1;
                    } else {
                        lastFit = mid;
                        low = mid + 1;
                    }
                }
                newFontSize = lastFit;
                break;

            case 'height':
                wrapper.style.whiteSpace = 'nowrap';
                newFontSize = this.clientHeight;
                break;

            case 'width':
            default:
                wrapper.style.whiteSpace = 'nowrap';
                const fz = previousFontSize || this.minSize;
                wrapper.style.fontSize = `${fz}px`;
                const ratio = this.clientWidth / wrapper.scrollWidth;
                newFontSize = fz * ratio;
                break;
        }

        newFontSize = Math.max(this.minSize, Math.min(newFontSize, this.maxSize));
        wrapper.style.fontSize = `${newFontSize}px`;
        this._currentFontSize = newFontSize;

        this.dispatchEvent(new CustomEvent('fit', {
            detail: { newValue: newFontSize, oldValue: previousFontSize, mode: this.mode }
        }));
    }

    private _getFloatAttribute(name: string, defaultValue: number): number {
        return this.hasAttribute(name) ? parseFloat(this.getAttribute(name)!) : defaultValue;
    }
}

customElements.define('shoehorn-text', Shoehorn);