/*
$(window).bind('beforeunload', function(){
  return 'Leaving will interrupt music playback.';
});
*/

/*
Use anchors to preserve tab location on refresh.
*/
$(function(){
  var hash = window.location.hash;
  hash && $('ul.nav a[href="' + hash + '"]').tab('show');

  $('.side-nav a').click(function (e) {
    $(this).tab('show');
    var scrollmem = $('body').scrollTop();
    window.location.hash = this.hash;
    $('html,body').scrollTop(scrollmem);
  });
});

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
    $('#songurl').change(validateSongurl);
});
function validateSongurl() {
    if($('#songurl').val() == '') {
        $("#addsong").prop("disabled", true);
    }
    else {
        $("#addsong").prop("disabled", false);
    }
}

/* 
Refreshes the library table.
*/
function refreshLibrary() {
    $('#library-table').html('<br/><br/><div class="row">' +
        '<div class="col-lg-4 col-lg-offset-4"><div class="progress progress-striped active">' +
        '<div class="progress-bar progress-bar-info" style="width: 100%"></div></div></div></div>');
    $.ajax({
      url: '/playlist/librarysongs',
      success: function(data) {
        $('#library-table').hide().html(data).fadeIn();
      }
    });
}

/*
Initialized the player volume slider
*/
$(document).ready(function() {
    $('#volume').slider({
        min:0,
        max:100,
        orientation:'horizontal',
        value:100,
    });
    $('.slider').css('width', '125');
});

$(document).ready(function() {
    $.getJSON( "/playlist/getrequests/", function(data) {
        console.log(data);
        $.each(data.songs, function(index, value) {
            addRequestTableRow(value.id, value.title, value.duration, value.link);
        });
    });
});

function addRequestTableRow(id, title, duration, link) {
    $("#norequests").hide();
    if(!($("#sr"+id).length)) {
        $("#requestTable tbody").append(
        "<tr id=\"sr" + id + "\">" +
        "<td>" + title + "</td>" +
        "<td>" + duration + "</td>" +
        "<td></td>" +
        "<td></td>" +
        "<td><a href=\"" + link + "\"><span class=\"glyphicon glyphicon-share-alt\"></a></td>" +
        "<td><span class=\"glyphicon glyphicon-trash\"></td>" +
        "</tr>"
        );
    }
}