
/** 
 * Константа описывающая правила по входным данным для полей формы
 * @type { { nameLength: number, emailReg: string, phoneReg: number } } 
 */
export const validationRules = {
    nameLength: 2,
    emailReg: /^.+@[^\.].*\.[a-z]{2,}$/,
    phoneReg: 17
}