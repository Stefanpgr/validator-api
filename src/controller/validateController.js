
const { gte } = require('../helpers/conditions')
const { ResMsg, getJsonRes } = require('../utils')


const validateController = async (req, res, next) => {
  const { rule, data } = req.body

  const field = rule.field.toString()
  const arr = field.split('.')

  if (Array.isArray(data) !== true && typeof data !== 'string') {
    if (!data.hasOwnProperty(arr[0]))
      return ResMsg(res, 400, 'error', `field ${rule.field} is missing from data.`, null)
    if (arr.length > 1) {
      const val = await checkIfFieldExist(arr, data, res)
      if (val) validateConditions(rule, data, res, field)
    } else {
      validateConditions(rule, data, res, field)
    }
  } else {
    validateConditions(rule, data, res, field)
  }

}

const validateConditions = (rule, data, res, field) => {
  const { condition_value } = rule
  const arr = field.split('.')
  const isArray = Array.isArray(data)

  let fieldVal = data?.[arr[0]]?.[arr[1]] || data?.[arr[0]] || data
  Array.isArray(data) ? (fieldVal = data) : null

  switch (rule.condition) {
    case 'gte':
        return gte(fieldVal, rule, field, res, isArray, data)
    //   if (fieldVal >= condition_value) {
    //     resSuccess(res, field, getJsonRes(false, field, fieldVal[field] || fieldVal, rule.condition, condition_value))
    //   } else if (isArray && data[Number(field)] >= condition_value) {
    //     console.log(fieldVal)
    //     resSuccess(res, field, getJsonRes(false, field, fieldVal[field] , rule.condition, condition_value))
    //   } else if ((isArray && !data[Number(field)]) || data.length < field) {
    //     ResMsg(res, 400, 'error', `field ${field} is missing from data`, null)
    //   } else {
    //     resFail(res, field, getJsonRes(true, field, fieldVal[field], rule.condition, condition_value))
    //   }
      break
    case 'neq':
      if (fieldVal !== condition_value) {
        resSuccess(res, field, getJsonRes(false, field, fieldVal, rule.condition, condition_value))
      } else if (isArray && data[Number(field)] !== condition_value) {
        resSuccess(res, field, getJsonRes(false, field, fieldVal[Number(field)], rule.condition, condition_value))
      } else if ((isArray && !data[Number(field)]) || data.length < field) {
        ResMsg(res, 400, 'error', `field ${field} is missing from data`, null)
      } else {
        resFail(res, field, getJsonRes(true, field, fieldVal[field] || fieldVal, rule.condition, condition_value))
      }
      break
    case 'eq':
      if (fieldVal === condition_value) {
        resSuccess(res, field, getJsonRes(false, field, fieldVal, rule.condition, condition_value))
      } else if (isArray && data[Number(field)] === condition_value) {
        resSuccess(res, field, getJsonRes(false, field, fieldVal[Number(field)], rule.condition, condition_value))
      } else if ((isArray && !data[Number(field)]) || data.length < field) {
        ResMsg(res, 400, 'error', `field ${field} is missing from data`, null)
      } else {
        resFail(res, field, getJsonRes(true, field, fieldVal[field] || fieldVal, rule.condition, condition_value))
      }
      break
    case 'gt':
      if (fieldVal > condition_value) {
        resSuccess(res, field, getJsonRes(false, field, fieldVal, rule.condition, condition_value))
      } else if (isArray && data[Number(field)] > condition_value) {
        resSuccess(res, field, getJsonRes(false, field, fieldVal[field], rule.condition, condition_value))
      } else if ((isArray && !data[Number(field)].toString()) || data.length < field) {
        console.log(data[Number(field)])
        ResMsg(res, 400, 'error', `field ${field} is missing from data`, null)
      } else {
        console.log(fieldVal[1])
        resFail(res, field, getJsonRes(true, field, fieldVal[1] || fieldVal, rule.condition, condition_value))
      }
      break
    case 'contains':
      console.log(typeof fieldVal, fieldVal)
      if (isArray && data.length < Number(field)) {
        ResMsg(res, 400, 'error', `field ${rule.field} is missing from data.`, null)
      } else if (typeof fieldVal !== 'string' && !Array.isArray(fieldVal)) {
        resFail(res, field, getJsonRes(true, field, fieldVal[field] || fieldVal, rule.condition, condition_value))
      } else if (fieldVal.includes(condition_value)) {
        console.log(typeof fieldVal, fieldVal)
        resSuccess(res, field, getJsonRes(false, field, fieldVal[field], rule.condition, condition_value))
      } else {

        resFail(res, field, getJsonRes(true, field, fieldVal[field] || fieldVal, rule.condition, condition_value))
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
      throw `field ${arr.join('.')} is missing from data.`
    }
    return true
  } catch (err) {
    return ResMsg(res, 400, 'error', `${err}`, null)
  }
}
module.exports = validateController
