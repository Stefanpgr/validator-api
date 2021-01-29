const { ResMsg, getJsonRes } = require("../utils")


exports.gte = (fieldVal, rule, field , res, isArray, data) => {
    if (fieldVal >= rule.condition_value) {
        resSuccess(res, field, getJsonRes(false, field, fieldVal[field] || fieldVal, rule.condition, rule.condition_value))
      } else if (isArray && data[Number(field)] >= rule.condition_value) {
        console.log(fieldVal)
        resSuccess(res, field, getJsonRes(false, field, fieldVal[field] , rule.condition, rule.condition_value))
      } else if ((isArray && !data[Number(field)]) || data.length < field) {
        ResMsg(res, 400, 'error', `field ${field} is missing from data`, null)
      } else {
        resFail(res, field, getJsonRes(true, field, fieldVal[field], rule.condition, rule.condition_value))
      }
}

const resSuccess = (res, field, payload) => {
    ResMsg(res, 200, 'success', `field ${field} successfully validated.`, payload)
  }

  const resFail = (res, field, payload) => {
    ResMsg(res, 400, 'error', `field ${field} failed validation.`, payload)
  }
  