

const { body, validationResult, check } = require('express-validator')
const {ResMsg} = require('../utils')

exports.bodyValidation = () => [
  body('rule').notEmpty().withMessage('rule is required.').custom((value) => {
    if(typeof value !== 'object') throw new Error('rule should be an object.')
    return true;
}).custom((value) => {
    const validFields = ["field", "condition", "condition_value"]
    validFields.map((el) => {
        if(!value.hasOwnProperty(el)){
            throw new Error(`${el} is required.`)
        }
    })
      return true
}),
  body('data').notEmpty().withMessage('data is required.')
]



exports.validate = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }
  const err = errors.array()
  
//   console.log(req.body)
  return ResMsg(res, 400, 'error', err[0].msg, null)
}
