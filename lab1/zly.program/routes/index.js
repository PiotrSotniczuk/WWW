var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Pole okręgu' });
});

router.get('/najwieksze', function (req, res, next) {
  let pole = +req.query.pole
    , naj = req.app.locals.najwieksze;

  naj.push(pole);
  naj.sort((a,b) => b-a);
  naj = naj.slice(0,3);

  console.log(req.app.locals.najwieksze);
  res.render('najwieksze', {pola: naj});
});

module.exports = router;
