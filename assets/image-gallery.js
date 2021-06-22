let imagePopupTemplate = null;

class ImageGallery extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.images = this.querySelectorAll('img');
    this.images.forEach((image) => {
      image.addEventListener('click', this.showPopup)
    })
  }

  disconnectedCallback() {
    this.images.forEach((image) => {
      image.removeEventListener('click', this.showPopup)
    })
  }

  showPopup({currentTarget}) {
    const popup = document.createElement('image-popup');
    popup.img = currentTarget;
    document.body.appendChild(popup);
  }
}

class ImagePopup extends HTMLElement {
  get template() { return imagePopupTemplate && imagePopupTemplate.cloneNode(true) }
  set template(value) { imagePopupTemplate = value}

  constructor() {
    super();
    // If we haven't yet set our template, than we don't want to render this custom element right away,
    // so store its contents and then remove it from the DOM.
    if (this.hasAttribute('init')) this.remove();

    // If the template is contained within the custom element,
    // than its the instance of it that was included in the page response.
    this.template = this.template || this.querySelector('template').content;
  }

  connectedCallback() {
    this.appendChild(this.template);
    this.img && this.appendChild(this.img.cloneNode());
    this.querySelector('[close-button]').addEventListener('click', () => this.remove(), {once: true})
    document.addEventListener('keydown', ({key}) => key === "Escape" && this.remove(), {once: true});
  }
}

customElements.define('image-popup', ImagePopup)
customElements.define('image-gallery', ImageGallery)