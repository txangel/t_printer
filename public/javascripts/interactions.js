//requires jquery (require.js could be used for this)

$(document).ready(function() {
    $("#reload")
        .button()
        .click(function(){
            location.reload();
        });
});