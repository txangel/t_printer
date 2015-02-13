//requires jquery (require.js could be used for this)

$(document).ready(function() {
    $("#reload")
        .button()
        .click(function(){
            $("#top").text($("#top").text() + ' loading more...');
            $.ajax({
                type: 'POST',
                url: '/api/reload'
            })
            .done(function(){
                    location.reload();
            })
            .fail(function(res){
                    console.error(res);
                    $("#top").text('Oops, there were no new tweets. Try again later');
            })
        });
});