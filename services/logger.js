
const morgan = require('morgan')

const format = '[:date[iso]] :status :method :url : :remote-addr :req[authorization]'

function log(app){
  app.use(morgan(format, {
    skip: function (req, res) { return res.statusCode < 400 }
  }))
}

module.exports = log
