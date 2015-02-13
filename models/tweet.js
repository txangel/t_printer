function flag_matches(string, keywords) {
    return string.split(' ').map(function(word){
        return {string: word, hit: (word.toLowerCase() in keywords)};
    })
}

function get_keywords(word){
    var result = {};
    result[word] = true;
    SYNONYMS[word] && SYNONYMS[word].forEach(function(synonym){
        result[synonym] = true;
    });
    return result;
}

//@todo: Extract
var SYNONYMS = {
    coke: ['coca-cola', 'diet-cola']
};

var Tweet = Backbone.Model.extend({
    defaults: {
        message: '',
        sentiment: -1,
        user_handle: '',
        count: 1
    },

    //better is to use backbone views in the frontend and sync both collections (that way the server keeps data persistent)
    to_render: function(term){
        var result = this.toJSON();

        result.message = flag_matches(result.message, get_keywords(term));

        return result;
    }
});

var TweetList = Backbone.Collection.extend({
    model: Tweet,

    initialize: function() {
        this.sort_key = 'sentiment';
    },

    comparator: function(l, r){
        if(r.get('sentiment') > l.get('sentiment')) return 1;
        if(r.get('sentiment') < l.get('sentiment')) return -1;
        return 0;
    },

    fetch_from_outside: function(){
        var promise = new $.Deferred();
        var self = this;

        $.get('http://adaptive-test-api.herokuapp.com/tweets.json')
            .done(function(raw_tweets) {
                _.each(raw_tweets, function (each) {
                    var candidate = _.pick(each, 'message', 'sentiment', 'user_handle');
                    var duplicate = self.findWhere({message: candidate.message}); //Not sure about this. What if the sentiment is different.
                    //if the id is unique do:
                    //var duplicate = self.findWhere({aa_id: candidate.aa_id});
                    //and add aa_id to the attributes
                    if(duplicate) {
                        duplicate.set('count', duplicate.get('count') + 1);
                    } else {
                        self.add(candidate);
                    }
                });
                promise.resolve(self);
            })
            .fail(function(err){
                promise.reject(err);
            });

        return promise;
    },

    to_render: function(term) {
        return this.filter_matches(term).
            map(function(x){ return x.to_render(term);});
    },

    //@todo: Write and aggregation method
    filter_matches: function(term){
        filtered = this.filter(function(each){
            return each.get('message').toLowerCase().indexOf(term) != -1;
        });
        return new TweetList(filtered);
    }
});


module.exports = {
    Tweet: Tweet,
    TweetList: TweetList
};
