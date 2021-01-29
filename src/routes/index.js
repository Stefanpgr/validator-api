const express = require('express')
const {ResMsg } = require('../utils')
const {validate, bodyValidation, isObject, checkFields} = require('../helpers/validate')
const validateController = require('../controller/validateController')


const Router = express.Router()

Router.get('/', (req, res) => {
    const data = {
        name: "Daniel Agoziem",
        github: "@stefanpgr",
        email: "danielagoziem@gmail.com",
        mobile: "07064703005",
        twitter: "@stefanpgr"
      }
    ResMsg(res,200,'success', "My Rule-Validation API", data)
  
})

Router.post('/validate-rule',bodyValidation(), validate, validateController)

// Router.use(userRoutes)
// Router.use(AdminRoutes)
module.exports = Router
