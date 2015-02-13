var express = require('express');
var router = express.Router();

$.ajax('Test');

//@todo move this out
function extract_term(path) {
  return path.slice(1).toLowerCase();
}


/* GET keyword */
router.get('/[A-z]+', function(req, res, next) {
  var term = extract_term(req.path);
  res.render('index', {
  term: term,
  tweets: ALL_TWEETS.to_render(extract_term(req.path))});

  //ALL_TWEETS.fetch({
  //  success: function(tweets){
  //    res.render('index', {
  //      term: term,
  //      tweets: tweets.to_render(extract_term(req.path))});
  //  },
  //  error: function(response, err) {
  //    console.log(JSON.stringify(err));
  //    res.render('error', {
  //      message: 'Boom boom!',
  //      error: {
  //        status: (err && err.status)  || '???',
  //        stack: (err && err.stack)  || ''
  //      }});
  //  }
  //});
});

//POST reload
router.post('/api/reload', function(req, res, next) {
  ALL_TWEETS.fetch_from_outside()
    .done(function(tweets){
      console.log('We now have ' + _.size(tweets) + ' tweets');
      res.end('OK');
    })
    .fail(function(response) {
      console.log(JSON.stringify(response.responseText));
      res.status(500).json({error: response.responseText});
      res.end('KO');
    });
});




module.exports = router;
