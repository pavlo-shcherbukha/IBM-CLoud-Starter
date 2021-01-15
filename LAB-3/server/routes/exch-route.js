var express = require('express');
var router = express.Router();
var exchsrvc = require('../controllers/cloudant-srvc');


/* GET users listing. */
router.get('/', function(req, res, next) {
  var l_date = req.query.date
  //var l_param = { exchdate: l_date } ;

  var l_query = {
    selector: {
       exchdt: {$eq: l_date}
    }
  };
 
  exchsrvc.docSelect( l_query )
  .then( result => {
      return  res.status(200).json( result );
  })
  .catch( err => {
    return res.status(500).json( {ok:false, error_code: err.name, error_dsc: err.message } );
  });
 
});

module.exports = router;
