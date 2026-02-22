//
// Add custom template locals (variables available in all templates) here.
//
// This file exports an Express middleware function that sets values
// on res.locals. These values are then available in all Nunjucks templates.
//
// For example:
//
// module.exports = function (req, res, next) {
//   res.locals.myVariable = 'Hello'
//   next()
// }

module.exports = function (req, res, next) {
  // Add your custom locals here

  next()
}
