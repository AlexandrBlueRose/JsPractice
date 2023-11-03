const arr = ['banana', true, 1, 'car', {}, { a: 1 }, 5, true, true, false, 455, {}]

/** Работа с массивами **/

/** 
 * 1. Увеличивает числа входного массива в 2 раза
 * 
 * @param {object} arr - Объект из любых элементов
 * @returns {object} arr - Объект в котором все числа увеличены в 2 раза
 */
funcMultiplyingNumByTwo = (arr) => arr.map(item => typeof(item) === "number"? item*2 : item);

console.log(funcMultiplyingNumByTwo(arr));

/** 
 * 2. Возвращает объект в котором поля с названиями равными
 * типам данным изначального входного, а полях производится итоговый подсчет
 * кол-ва элементов определенного типа данных
 * 
 * @param {object} arr - Объект из любых элементов
 * @return {object} arr - Объект в котором элем-ты соответствуют типам данных и кол-ву таких элементов в изначальном массиве arr
 */
funcCountTypeArgs = (arr) => 
    arr.reduce((acc, cur) => {
        const itemType = typeof(cur);

        if(acc[itemType]){
            acc[itemType]++;
        }
        else {
            acc[itemType] = 1;
        }
        return acc;
    }, {});

console.log(funcCountTypeArgs(arr));

/** 
 * 3. Возвращает отсортированный объект в порядке булевы, числа, строки, объекты
 * 
 * @param {object} arr - Объект из любых элементов
 * @return {object} arr - Объект в котором элем-ты отсортированы в порядке булевы, числа, строки, объекты
 */
funcSortByType = (arr) => 
    arr.sort((a, b) => {
        if(typeof(a) > typeof(b)){
            return 1;
        }
        else  if(typeof(a) < typeof(b)){
            if(typeof(a) === "object"){
                return 1;
            }
            else {
                return -1;
            }
        }
    });

console.log(funcSortByType(arr));

/** 
 * 4. Функция принимает неограниченное число параметров и возвращает массив в котором каждое число 
 * умножается на общее количество эл-тов входного массива.
 * 
 * @param {object} args - Набор входных параметров любого типа данных
 * @return {object} result - Объект, где каждое число умножается на общее количество входных аргументов
 */
funcMultiplyingByLenArgs = (...args) => args.map(arg => typeof(arg) === "number" ? arg * args.length : arg);

console.log(funcMultiplyingByLenArgs(3, 4, 5, 6, 10));

/** 
 * 5. Функция принимает набор слов и возвращает набор слов отсортированных по количеству повторов этого слова, 
 * если у 2-х слов параметр уникальности одинаковый,
 * то они должны быть отсортированы между собой по алфавиту.
 * 
 * @param {object} words, Массив набора слов
 * @return {object} result, отсортированный набор слов по количеству повторов и если параметр уникальности одинаковый, 
 * то сортировка производится по алфавиту
 */
funcSortRepeatElem = (wordsData) => {
    wordsData = Object.entries(wordsData.sort().reduce((acc, cur) => {
        if(acc[cur]){
            acc[cur]++;  
        }
        else{
            acc[cur] = 1;
        }
        return acc;
    }, {})).sort(([, count1], [, count2]) => count2 - count1);

    return Object.keys(Object.fromEntries(wordsData));
}

console.log(funcSortRepeatElem(['fruit', 'keyboard', 'word', 'word', 'keyboard', 'word', 'fruit', 'banana']))

/** Работа с объектами **/

const obj = { a: 1, b: 2, c: 3, d: 1 };

/** 
 * 1. Функция принимает набор объект пар ключ-значение и вычисляет кол-во ключей.
 * 
 * @param {object} obj, объект пар ключ-значение
 * @return {number} result, кол-во ключей
 **/
funcCountNumKeys = (inputObj) => Object.keys(inputObj).length;

console.log(funcCountNumKeys(obj));

const obj2 = { a: 1, b: 2, c: 3 };

/** 
 * 2. Функция принимает набор массив пар ключ-значение и меняет структуру объекта.
 * 
 * @param {object} obj - объект пар ключ-значение
 * @return {object} result - объект со структурой { a: 1, b: 2, c: 3, d: 4 }, где d = (a + c)
 **/
funcChangeObjStructure = (inputObj) => newObject = {...inputObj, d: inputObj.a + inputObj.c};

console.log(funcChangeObjStructure(obj2));


/** Работа с классами **/

/** 
 * Класс создающий новую абстрактную фигуру.
 * Любые иные не реализованные фигуры должны быть наследниками этого класса.
 */
class Figure{
    
    /** 
    * Площадь фигуры. 
    * @type {number} 
    */
    #area = 0;

    /**
    * Конструктор для создания фигуры
    * @constructor
    * @param {number} figureParams - параметры фигуры для вычисления площади
    */
    constructor(...figureParams){
        this.area = figureParams;
    }

    /** 
    * Возвращает площадь фигуры.
    * @return result, площадь фигуры.
    **/
    getArea(){
        return this.area;
    }
}

/** 
 * Класс создающий новую сущность квадрата.
 */
class Square extends Figure{

    /** 
    * Площадь фигуры. 
    * @type {number} 
    */
    #area = 0;

    /**
    * Конструктор для создания квадрата
    * @constructor
    * @param {number} figureParam - параметры фигуры для вычисления площади
    */
    constructor(figureParam){
        super(figureParam);

        this.area = figureParam*figureParam;
    }

    /** 
    * Возвращает площадь фигуры.
    * @return result, площадь фигуры.
    **/
    getArea(){
        return this.area;
    }
}

/** 
 * Класс создающий новую сущность круга.
 */
class Circle extends Figure{

    /** 
    * Площадь фигуры. 
    * @type {number} 
    */
    #area = 0;

    /**
    * Конструктор для создания круга
    * @constructor
    * @param {number} figureParam - параметры фигуры для вычисления площади
    */
    constructor(figureParam){
        super(figureParam);

        this.area = Math.PI * (figureParam * figureParam);
    }

    /** 
    * Возвращает площадь фигуры.
    * @return result, площадь фигуры.
    **/
    getArea(){
        return this.area;
    }
}

/** 
 * Класс калькулятор суммы площадей фигур.
 */
class AreaCalculator{
    /** 
    * Массив площадей фигур. 
    * @type {number} 
    */
    #figuresArea = 0;

    /**
    * Конструктор для создания круга
    * @constructor
    * @param {number} figuresArea - массив площадей фигур
    */
    constructor(...figuresArea) {
        this.figuresArea = figuresArea;
        
    }
    
    /** 
    * Функция вычисляет сумму площадей фигур.
    * @return result, сумма площадей фигур
    **/
    sum() {
        return this.figuresArea.reduce((sum, current) => sum + current.getArea(), 0);
    }
}

const area = new AreaCalculator(new Square(10), new Circle(5), new Circle(10))
console.log(area.sum());