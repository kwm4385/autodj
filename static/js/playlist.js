/*
$(window).bind('beforeunload', function(){
  return 'Leaving will interrupt music playback.';
});
*/

/*
Attach ajax to add library song form.
*/
$(document).ready(function() { 
    var options = { 
        success: function(responseText) { 
            if(responseText.substring(0, 4) == "err-") {
                $("#add-song-group").removeClass("has-success");
                $("#add-song-group").addClass("has-error");
                $("#add-song-label").text(responseText.substring(4));
            } else {
                $("#add-song-group").removeClass("has-error");
                $("#add-song-group").addClass("has-success");
                $("#add-song-label").text(responseText.substring(4));
                $("#songurl").val("");
                refreshLibrary();
            }
            setTimeout(function() {
                $("#add-song-group").removeClass("has-error");
                $("#add-song-group").removeClass("has-success");
                $("#add-song-label").text("");
            }, 5000);
        } 
    }; 
    $('#libraryForm').ajaxForm(options);
}); 

/*
Add key listener to disable add library song button when input is empty.
*/
$(document).ready(function() {
    validateSongurl();
    $('#songurl').keyup(validateSongurl);
});
function validateSongurl() {
    if($('#songurl').val() == '') {
        $("#addsong").prop("disabled", true);
    }
    else {
        $("#addsong").prop("disabled", false);
    }
}
/* End key listener */

function refreshLibrary() {
    $('#library-table').hide();
    $.ajax({
      url: '/playlist/librarysongs',
      success: function(data) {
        $('#library-table').html(data);
        $('#library-table').fadeIn();
      }
    });
}