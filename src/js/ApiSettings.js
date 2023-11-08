import CardsHandler from "./CardsHandler.js";

/** 
 * Класс описывающий настройки выгрузки карточек.
 * @class
 */
export default class ApiSettings {

    /** 
     * Набор карточек. 
     * @type {object} 
     */
    #cards;

    /** 
     * Количество карточек для загрузки. 
     * @type {number} 
     */
    #numCardInPage;

    /** 
     * Максимальное кол-во карточек доступных для загрузки, по умолчанию документация API загрузки карточек допускает 2000 объектов для выгрузки. 
     * @type {number} 
     */
    #maxCardLoading;

    /** 
     * Счетчик для подсчета количества выгруженных карточек, вычисляемых по формуле (indexPage * numCardInPage), 
     * произведение которых должно быть меньше заданной верхней границы в maxCardLoading. 
     * @type {number} 
     */
    #indexPage;


    /**
     * Конструктор для инициализации начальных настроек выгрузки карточек вакансий.
     * 
     * @constructor
     * @param {number} numCardInPage - кол-во карточек для загрузки в API, по умолчанию 5.
     * @param {string} maxCardLoading - максимальное кол-во карточек доступных для загрузки для сессии, по умолчанию 2000.
     * @param {string} cards - массив карточек, по умолчанию пустой массив.
     */
    constructor(numCardInPage = 5, maxCardLoading = 2000, cards = []) {
        this.#numCardInPage = numCardInPage;
        this.#maxCardLoading = maxCardLoading;
        this.#cards = cards;
        this.#indexPage = 1;
    }

    /**
     * Возвращает значение numCardInPage.
     * @return {number} The numCardInPage value.
     */
    getNumCardInPage() {
        return this.#numCardInPage;
    }

    /**
     * Возвращает значение maxCardLoading.
     * @return {number} The maxCardLoading value.
     */
    getMaxCardLoading() {
        return this.#maxCardLoading;
    }

    /**
     * Возвращает значение cards.
     * @return {object} The cards value.
     */
    getCards() {
        return this.#cards;
    }

    /**
     * Возвращает значение indexPage.
     * @return {number} The indexPage value.
     */
    getIndexPage() {
        return this.#indexPage;
    }

    /**
     * Увеличивает счетчик количества загруженных страниц карточек.
     */
    indexPageUp() {
        this.#indexPage++;
    }

    /**
     * Сбрасывает счетчик загруженных страниц карточек.
     */
    indexPageReset() {
        this.#indexPage = 1;
    }

    /**
     * Очищает массив карточек.
     */
    clearCards() {
        this.#cards = [];
    }

    /** 
     * Функция загрузки карточек. 
     * @param {object} параметры фильтрации для выгружаемых карточек.
     */
    loadCardData(params = {}) {
        if (this.getIndexPage() * this.getNumCardInPage() <= this.getMaxCardLoading()) {
            const cardHandler = new CardsHandler();

            cardHandler.cardAppendOnRoot(this.getCards(), this.getNumCardInPage(), this.getIndexPage(), params);
            this.indexPageUp();
        } else {
            document.querySelector('.card-block__load-card').classList.add('visually-hidden');
        }
    }
}