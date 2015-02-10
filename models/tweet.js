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
        user_handle: ''
    },

    //@todo: Use views
    to_render: function(term){
        var result = this.toJSON();

        result.message = flag_matches(result.message, get_keywords(term));

        return result;
    }
});

var TweetList = Backbone.Collection.extend({
    model: Tweet,
    url: 'http://adaptive-test-api.herokuapp.com/tweets.json',
    comparator: function(l, r){
        if(r.sentiment > l.sentiment) return 1;
        if(r.sentiment < l.sentiment) return -1;
        return 0;
    },

    parse: function(response){
        return _.map(response, function(each){
            return _.pick(each, 'message', 'sentiment', 'user_handle');
        });
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
