var express = require('express');
var router = express.Router();

$.ajax('Test');

//@todo move this out
function extract_term(path) {
  return path.slice(1).toLowerCase();
}



var Tweet = require('../models/tweet');
var all_tweets = new Tweet.TweetList();

/* GET home page. */
router.get('/[A-z]+', function(req, res, next) {
  var term = extract_term(req.path);
  all_tweets.fetch({
    success: function(tweets){
      res.render('index', {
        term: term,
        tweets: tweets.to_render(extract_term(req.path))});
    },
    error: function(response, err) {
      console.log(JSON.stringify(err));
      res.render('error', {
        message: 'Boom boom!',
        error: {
          status: (err && err.status)  || '???',
          stack: (err && err.stack)  || ''
        }});
    }
  });

});

module.exports = router;
