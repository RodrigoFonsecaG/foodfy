class addNewField {
  constructor(container, fields, button) {
    this.container = document.querySelector(container);
    this.button = document.querySelector(button);
    this.fields = fields

    this.addField = this.addField.bind(this);
  }

  addField() {
    this.field = document.querySelectorAll(this.fields)

    const newField = this.field[this.field.length - 1].cloneNode(true);

    // Não adiciona um novo input se o último tem um valor vazio
    if (newField.children[0].value == '') return false;

    // Deixa o valor do input vazio
    newField.children[0].value = '';
    this.container.appendChild(newField);
  }

  buttonEvent() {
    this.button.addEventListener('click', this.addField);
  }

  init() {
    this.buttonEvent();
  }
}

const ingredients = new addNewField('.ingredients', '.ingredient', '.add-ingredient');
ingredients.init();

const preparation = new addNewField('.preparations', '.preparation', '.add-preparation');
preparation.init();


