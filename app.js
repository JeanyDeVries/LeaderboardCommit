require('dotenv').config()
const express = require('express')
const indexRoute = require('./routes/index')
//const projectsRoute = require('./routes/projects')

module.exports = express()
  .set('view engine', 'ejs')
  .set('views', './views')

  .use('/', indexRoute)
  //.use('/projects', projectsRoute)
