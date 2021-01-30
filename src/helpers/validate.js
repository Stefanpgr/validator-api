const { body, validationResult } = require('express-validator')
const { ResMsg } = require('../utils')
const conditions = ['eq', 'neq', 'gt', 'gte', 'contains']
exports.bodyValidation = () => [
  body('rule')
    .notEmpty()
    .withMessage('rule is required.')
    .custom((value) => {
      if (typeof value !== 'object') throw new Error('rule should be an object.')
      return true
    }),
  body('rule.field').notEmpty().withMessage('field is required').isString().withMessage('field should be a string'),
  body('rule.condition')
    .notEmpty()
    .withMessage('condition is required')
    .isString()
    .withMessage('condition should be a string').custom((value) => {
        if(!conditions.includes(value)){
            throw new Error('Invalid condition value.')
        }
        return true
    }),
  body('rule.condition_value')
    .notEmpty()
    .withMessage('condition_value is required')
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
