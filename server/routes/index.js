var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/cal', function(req, res, next) {
  res.json(['2015-05-23', '2015-05-22', '2015-05-21']);
});

module.exports = router;
