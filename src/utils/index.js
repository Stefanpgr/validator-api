/**
 * Send Response
 * @param {object} res express response Object
 * @param {number} statusCode HTTP status code
 * @param {string} status Status type ('success'||''error')
 * @param {string} message info to the user
 * @param {object} data object of data for user
 */
exports.ResMsg = (res, statusCode = 200, status, message, data = null) => {
    res.status(statusCode).json({
        message,
        status,
        data,
    });
  };
  
exports.getJsonRes = (err, fieldName, fieldValue, condition, conditionVal) => {
    const validation = {
        error: err,
        field: fieldName,
        field_value: fieldValue,
        condition: condition,
        condition_value: conditionVal
      }
    return {validation}
}

