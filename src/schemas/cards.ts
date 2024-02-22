import Joi from 'joi';

const luhnCheck = (value: string) => {
  let sum = 0;
  for (let i = 0; i < value.length; i++) {
    let intVal = parseInt(value.substr(i, 1));
    if (i % 2 === 0) {
      intVal *= 2;
      if (intVal > 9) {
        intVal = 1 + (intVal % 10);
      }
    }
    sum += intVal;
  }
  return sum % 10 === 0;
};



export default {

  cards: Joi.object().keys({
    card_number: Joi.string().creditCard().custom((value: string, helpers: { error: (arg0: string) => any; }) => {
      if (!luhnCheck(value)) {
        return helpers.error('any.invalid');
      }
      return value;
    }),
    cvv: Joi.string().pattern(/^[0-9]{3,4}$/).required(),
    expiration_month: Joi.string().length(2).pattern(/^(0[1-9]|1[0-2])$/).required(),
    expiration_year: Joi.number().integer().min(new Date().getFullYear()).max(new Date().getFullYear() + 5).required(),
    email: Joi.string().email({ tlds: { allow: false } })
  }),

}