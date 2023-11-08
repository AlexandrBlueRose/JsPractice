/** 
 * Класс создающий новую карточки.
 * @class
 */
export default class Card {
    /** 
     * ID карточки. 
     * @type {number} 
     */
    #id;

    /** 
     * Название вакансии.
     * @type {string} 
     */
    #title;

    /** 
     * Описание вакансии.
     * @type {string} 
     */
    #description;

    /** 
     * Ссылка на лого работодателя разместившего вакансию.
     * @type {string} 
     */
    #logoUrl;

    /** 
     * Объект содержащий данные работодателя:
     * форму работы, название компании, сайт работодателя, адрес.
     * @type {object} 
     */
    #conditions;

    /** 
     * Параметр для сокрытия лого в случае отсутствия ссылки.
     * @type {string} 
     */
    #classOption = '';

    /**
     * Конструктор для создания карточки вакансии.
     * 
     * @constructor
     * @param {number} id - уникальный идентификатор карточки вакансии, по умолчанию 0.
     * @param {string} title - название вакансии, по умолчанию Not Selected.
     * @param {string} description - описание вакансии, по умолчанию Not Selected.
     * @param {string} logoUrl - ссылка на лого компании, по умолчанию пустая строка.
     * @param {object} conditions - Объект содержащий данные работодателя: форму работы, название компании, сайт работодателя, адрес. 
     * По умолчанию все параметры равны Not Selected.
     */
    constructor(id = 0, title = "Not Selected", description = "Not Selected", logoUrl = "",
        conditions = {
            form: "Not Selected",
            company: "Not Selected",
            web: "Not Selected",
            address: "Not Selected"
        }) {
        this.#id = id;
        this.#title = title;
        this.#description = description;
        this.#logoUrl = logoUrl;
        this.#conditions = conditions;
    }

    /**
     * Возвращает значение ID.
     * @return {number} The ID value.
     */
    getId() {
        return this.#id;
    }

    /**
     * Возвращает значение title.
     * @return {string} The title value.
     */
    getTitle() {
        return this.#title;
    }

    /**
     * Возвращает значение description.
     * @return {string} The description value.
     */
    getDescription() {
        return this.#description;
    }

    /**
     * Задает значение description.
     * @property {string} The description value.
     */
    setDescription(description) {
        this.#description = description;
    }


    /**
     * Возвращает значение logoUrl.
     * @return {string} The logoUrl value.
     */
    getLogoUrl() {
        return this.#logoUrl;
    }

    /**
     * Задает значение logoUrl.
     * @property {string} The logoUrl value.
     */
    setLogoUrl(logoUrl) {
        this.#logoUrl = logoUrl;
    }

    /**
     * Возвращает значение conditions.
     * @return {object} The conditions value.
     */
    getConditions() {
        return this.#conditions;
    }

    /**
     * Возвращает данные карточки для добавления на страницу.
     * @return {string} The card definition value.
     */
    cardDefinition() {
        if (!this.#logoUrl) {
            this.#classOption = 'visually-hidden';
        }
        return `
        <div class = "card card-block__item">
          <div class = "card__body">
            <div class = "card__title">

              <div class = "card__header-logo container-header-logo">
                <h3 class = "card__position-title">${this.#title}</h3>
                
                <img class = "card__logo ${this.#classOption}" src = "${this.#logoUrl}" alt = 'Company logo' height = "40px" width = "auto">
              </div>

              <button class = "card__respond-button">Respond</button>
            </div>

            <div class = "card__working-condition">
              <p class = "condition-gray card__form-working-time">
                Form

                <span class = "card__data-working-time">
                  ${this.#conditions.form}
                </span>
              </p>

              <p class = "condition-gray card__company-name">
                Company

                <span class = "card__data-company-name">
                  ${this.#conditions.company}
                </span>
              </p>

              <p class = "condition-gray card__website">
                Web
                <a class = "span card__data-website" href = "${this.#conditions.web}">
                  ${this.#conditions.web}
                </a>
              </p>

              <p class = "condition-gray card__address">
              Address

                <span class = "card__data-address">
                  ${this.#conditions.address}
                </span>
              </p> 
            </div>

            <div class = "card__description">
              ${this.#description}

              <div class = "card__description-footer">
              </div>
            </div>

            <div class = "card__details card__details--down">
              <button class = "link card__details-button" onClick = "onDetailsDescriptionClick(this)">More details</button>
            </div>
          </div>
        </div>
        `;
    }

}