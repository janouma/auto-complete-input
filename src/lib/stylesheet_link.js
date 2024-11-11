const { HTMLElement, customElements } = window

class StylesheetLink extends HTMLElement {
  static observedAttributes = ['src']

  set src (src) {
    this.#loadStyles(src)
  }

  get src () {
    return this.#stylesheet?.getAttribute('href')
  }

  connectedCallback () {
    this.style.display = 'contents'
  }

  attributeChangedCallback (_, __, src) {
    return this.#loadStyles(src)
  }

  #stylesheet
  #loadSequence

  #clearStyles () {
    if (this.#stylesheet) {
      this.removeChild(this.#stylesheet)
      this.#stylesheet = undefined
    }
  }

  async #loadStyles (src) {
    this.#loadSequence ??= Promise.resolve()

    if (src) {
      try {
        this.#loadSequence = this.#loadSequence
          .then(() => fetch(src))

        await this.#loadSequence

        if (!this.#stylesheet) {
          this.#stylesheet = document.createElement('link')
          this.#stylesheet.setAttribute('rel', 'stylesheet')
          this.appendChild(this.#stylesheet)
        }

        this.#stylesheet.setAttribute('href', src)
      } catch (cause) {
        console.error(new Error(`unable to load stylesheet '${src}'`, { cause }))
        this.#clearStyles()
      }
    } else {
      this.#clearStyles()
    }
  }
}

customElements.define('stylesheet-link', StylesheetLink)
