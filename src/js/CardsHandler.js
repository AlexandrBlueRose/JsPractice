import Card from "./Card.js";
/** 
 * Класс логику взаимодействия с API загрузки карточек.
 * @class
 */
export default class CardsHandler {

    /** 
     * Функция загрузки карточек из API hh.ru, по запросу к API выгружается сразу множество карточек, без полного описания.
     * @async
     * 
     * @param {object} cards массив карточек, передается для заполнения
     * @param {number} perPage кол-во загружаемых на странице карточек, за один запрос к API
     * @param {number} page индекс страницы для загрузки карточек, с каждым запросом для загрузки новых карточек увеличивается
     * @param {number} params параметры запроса к API, описываю значение фильтрации посылаемые к API, по которому будут выбираться карточки 
     * @throws {Error}
     */
    async cardApiLoadData(cards, perPage, page, params = {}) {
        const queryParams = Object.entries(params).map(([key, value]) => `&${key}=${value}`).join('');

        try {
            const ApiSettings = await fetch(`https://api.hh.ru/vacancies?per_page=${perPage}&page=${page}${queryParams}`);
            const cardsJson = await ApiSettings.json();

            for (const item of cardsJson.items.entries()) {
                await this.cardFullApiLoadData(item[1].id, cards);
            };
        } catch (err) {
            console.error(err);
        };
    }

    /** 
     * Функция загрузки карточки по заданному ID из API hh.ru, выгружаются все данные карточки, включая ее описание.
     * @async
     * 
     * @param {number} id уникальный идентификатора загружаемой из API каточки
     * @param {object} cards массив каточек для заполнения из API
     * @throws {Error}
     */
    async cardFullApiLoadData(id, cards) {
        try {
            const cardData = await fetch(`https://api.hh.ru/vacancies/${id}`);
            const cardsJson = await cardData.json();

            cards.push(this.cardCompletionAbstract(cardsJson));
        } catch (err) {
            console.error(err);
        };
    }

    /** 
     * Функция создает и заполняет новый объект класса Card.
     * 
     * @param {object} item данные полученные из API для заполнения карточки
     * @return {object} объект класса карточки Card
     */
    cardCompletionAbstract(item) {
        let card = new Card(item.id, item?.name, item?.description, item.employer?.logo_urls?.['240'], {
            form: item?.employment ? item.employment.name : "Not Selected",
            company: item?.employer?.name ? item.employer.name : "Not Selected",
            web: item?.employer?.alternate_url ? item.employer.alternate_url : "Not Selected",
            address: item?.area?.name ? item.area.name : "Not Selected"
        });

        return card;
    }

    /** 
     * Функция добавления карточки на страницу.
     * @async
     * 
     * @param {object} cards массив карточек для вставки
     * @param {number} perPage кол-во загружаемых на странице карточек, за один запрос к API
     * @param {number} page индекс страницы для загрузки карточек, с каждым запросом для загрузки новых карточек увеличивается
     * @param {number} params параметры запроса к API, описываю значение фильтрации посылаемые к API, по которому будут выбираться карточки 
     * @throws {Error}
     */
    async cardAppendOnRoot(cards, perPage, page, params = {}) {
        try {
            await this.cardApiLoadData(cards, perPage, page, params);

            if (cards.length < perPage) {
                document.querySelector('.card-block__load-card').classList.add('visually-hidden');
            }

            for (const card of cards) {
                document.querySelector('.card-block__list').appendChild(card.cardDefinition());
            }
        } catch (err) {
            console.error(err);
        };
    }
}