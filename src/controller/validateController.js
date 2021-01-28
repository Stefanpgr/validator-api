const { log } = require('debug')
const { check, validationResult } = require('express-validator')
const { ResMsg, getJsonRes } = require('../utils')

const conditions = ['eq', 'neq', 'gt', 'gte', 'contains']

const validateController = async (req, res, next) => {
  const { rule, data } = req.body
  const arr = rule.field.split('.')
    if (!data.hasOwnProperty(arr[0])) return ResMsg(res, 400, 'error', `field ${rule.field} is missing from data.`, null)

//   const fieldVal1 =  data?.[arr[0]]
//   const fieldVal2 = data?.[arr[0]]?.[arr[1]] 
//   console.log(fieldVal1)
// if(fieldVal1 && fieldVal2){
//     console.log(1)
//     validateConditions(rule, data, res, fieldVal2)
// }else if(!fieldVal2 && !fieldVal1){
//     console.log(2)
//     console.log(!fieldVal2 && !fieldVal1)
  
//     return ResMsg(res, 400, 'error', `field ${rule.field} is missing from data.`, null)
// }else{
//    validateConditions(rule, data, res, fieldVal1)
// }
//   if (fieldVal) {
//     validateConditions(rule, data, res, fieldVal)
//   } else {
//     return ResMsg(res, 400, 'error', `field ${rule.field} is missing from data.`, null)
//   }

    if (arr.length > 1) {
      const val = await checkIfFieldExist(arr, data, res)
      if (val)
      validateConditions(rule, data, res)
    } else {

      validateConditions(rule, data, res)
    }
}

const validateConditions = (rule, data, res) => {
  const { field, condition, condition_value } = rule
  const arr = field.split('.')
    const fieldVal = data?.[arr[0]]?.[arr[1]] || data?.[arr[0]]
// console.log(fieldVal, "jj")
  switch (rule.condition) {
    case 'gte':
      if (fieldVal >= condition_value) {
        resSuccess(res, field, getJsonRes(false, field, fieldVal, rule.condition, condition_value))
      } else {
        resFail(res, field, getJsonRes(true, field, fieldVal, rule.condition, condition_value))
      }
      break
    case 'neq':
      if (fieldVal !== condition_value) {
        resSuccess(res, field, getJsonRes(false, field, fieldVal, rule.condition, condition_value))
      } else {
        resFail(res, field, getJsonRes(true, field, fieldVal, rule.condition, condition_value))
      }
      break
    case 'eq':
      if (fieldVal === condition_value) {
        resSuccess(res, field, getJsonRes(false, field, fieldVal, rule.condition, condition_value))
      } else {
        resFail(res, field, getJsonRes(true, field, fieldVal, rule.condition, condition_value))
      }
      break
    case 'gt':
      if (fieldVal > condition_value) {
        resSuccess(res, field, getJsonRes(false, field, fieldVal, rule.condition, condition_value))
      } else {
        resFail(res, field, getJsonRes(true, field, fieldVal, rule.condition, condition_value))
      }
      break
    case 'contains':
        console.log(typeof fieldVal, fieldVal)
      if (typeof data !== 'object') {

          ResMsg(res, 400, 'error', `field ${rule.field} is missing from data.`, null)
      } else if(typeof fieldVal !== 'string' && !Array.isArray(fieldVal) ){
        resFail(res, field, getJsonRes(true, field, fieldVal, rule.condition, condition_value))
      } else if(fieldVal.includes(condition_value)) {
          console.log(typeof fieldVal, fieldVal)
        resSuccess(res, field, getJsonRes(false, field, fieldVal, rule.condition, condition_value))
        
      }else{
        resFail(res, field, getJsonRes(true, field, fieldVal, rule.condition, condition_value))
      }
      break
    default:
      break
  }
}

const resSuccess = (res, field, payload) => {
  ResMsg(res, 200, 'success', `field ${field} successfully validated.`, payload)
}
const resFail = (res, field, payload) => {
  ResMsg(res, 400, 'error', `field ${field} failed validation.`, payload)
}

const checkIfFieldExist = async (arr, data, res) => {
  try {
      console.log(Object.keys(data[arr[0]]).includes(arr[1]))
      if (!Object.keys(data[arr[0]]).includes(arr[1])) {
        throw `field ${arr[1]} is missing from data.`
      }
      return true

  } catch (err) {
    return ResMsg(res, 400, 'error', `${err}`, null)
  }
}
module.exports = validateController
