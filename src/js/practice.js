// Чтобы проверить, выполняй скрипты в консоли браузера
// по очереди каждый, если все сразу выполнить может забаговать консоль(у Firefox)
const arr = ['banana', true, 1, 'car', {}, { a: 1 }, 5, true, true, false, 455, {}]
//Работа с массивами
//1. Написать новую функцию, которая вернет новый массив, где все числа массива arr
//будут увеличены в 2 раза
let res = arr.map(item => typeof(item) === "number"? item*2 : item);

console.log(res)
//2.Написать новую функцию, которая вернет объект, в котором будут поля с названиями
//равными типам данным, а в полях будет итоговый подсчет кол-ва элементов в массиве
//arr
let res2 = arr.reduce(function(accumulator, item) {
  if(accumulator[typeof(item)]){
      accumulator[typeof(item)]++;
  }
  else{
    accumulator[typeof(item)] = 1;
  }
  return accumulator;
}, {})

console.log(res2);

//3. Написать функцию, которая отсортирует массив следующим образом: булевы, числа,
//строки, объекты
let res3 = arr.sort(function(a, b){
    if(typeof(a) > typeof(b)){
        return 1;
    }
    else  if(typeof(a) < typeof(b)){
        if(typeof a == "object"){
            return 1;
        }
        else {
            return -2;
        }
    }
})

console.log(res3);

//4. Написать функцию, которая принимает неограниченное число параметров и
//возвращает массив, в котором каждое число умножается на общее количество
//параметров.
let res4 = function(...a){
    return a.map(item => item * a.length);
}

console.log(res4(3, 4, 5, 6, 10));

//5
//Написать функцию, которая принимает массив слов, а выводит массив уникальных
//слов отсортированных по количеству повторов этого слова, если у 2х слов параметр
//уникальности одинаковый, то они должны быть отсортированы между собой по
//алфавиту.
let newArr = function(...a){
    let b = a.sort().reduce(function(accumulator, item) {
        if(accumulator[item]){
            accumulator[item]++;
            
        }
        else{
            accumulator[item] = 1;//инициализация чтобы определить кол-во
        }
        return accumulator;
    }, {});
    b = Object.entries(b)
    .sort(([,a],[,b]) => b - a)
    .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
    return Object.keys(b);
}

console.log(newArr('fruit', 'keyboard', 'word', 'word', 'keyboard', 'word', 'fruit', 'banana'))

//Работа с объектами
//1. Написать функцию, которая посчитает количество ключей
const obj = { a: 1, b: 2, c: 3, d: 1 };
const qty= Object.keys(obj).length;
console.log(qty) // 4

//2. Написать функцию, которая конвертнет исходный объект в новый по структуре ниже
const obj2 = { a: 1, b: 2, c: 3 };
const newObj = {...obj2, d: obj2.a + obj2.c};
console.log(newObj) // { a: 1, b: 2, c: 3, d: 4 }, где d = (a + c)

//Рабата с классами
//1. Создать AreaCalculator класс, который будет считать площади фигур. Дополнительно
//создать 2 класса: Square и Circle.
class Figure{
    #area = 0;
    constructor(...a){
        this.area = a;
    }
    getArea(){
        return this.area;
    }
}
class Square extends Figure{
    #area = 0;
    constructor(a){
        super(a);
        this.area = a*a;
    }
    getArea(){
        return this.area;
    }
}

class Circle extends Figure{
    #area = 0;
    constructor(r){
        super(r);
        this.area = Math.PI * (r * r);
    }
    getArea(){
        return this.area;
    }
}

class AreaCalculator{
    constructor(...figures){
        this.figures = figures;
        
    }
    
    sum(){
        return this.figures.reduce((sum, current) => sum + current.getArea(), 0);
    }
}

const area = new AreaCalculator(new Square(10), new Circle(5), new Circle(10))
console.log(area.sum())

//Тут все задания кроме Итогового, по заданию, Итоговое делается после верстки в 3 пункте практики, поэтому приложу его по завершении практики