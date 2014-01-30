/*
$(window).bind('beforeunload', function(){
  return 'Leaving this page interrupt music playback.';
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
document.addEventListener("DOMContentLoaded", function () {
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
}, false);

/*
Add key listener to disable add library song button when input is empty.
*/
document.addEventListener("DOMContentLoaded", function () {
    validateSongurl();
    $('#songurl').keyup(validateSongurl);
    $('#songurl').change(validateSongurl);
}, false);
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
document.addEventListener("DOMContentLoaded", function () {
    $('#volume').slider({
        min:0,
        max:100,
        orientation:'horizontal',
        value:100,
    });
    $('.slider').css('width', '125');
}, false);

/*
Retrives the user's request playlist and updates the table.
*/
function fetchRequests() {
    $("#loader").show();
    $.getJSON( "/playlist/getrequests/", function(data) {

        // Add new songs to the table
        $.each(data.songs, function(index, value) {
            addRequestTableRow(value.id, index + 1, value.title, value.duration, value.url);
        });

        // Remove songs that are no longer on the playlist
        requestRows = $('#requestTable tbody').children('tr');
        $.each(requestRows, function(index, value) {
            found = false;
            $.each(data.songs, function(sindex, svalue) {
                if(value.id.substring(2) == svalue.id) {
                    found = true;
                }
            });
            if(!found) {
                value.remove();
            }
        });

        $("#loader").fadeOut();
    });
}
function fetchRequestsInitial() {
    $("#loader").show();
    $.getJSON( "/playlist/getrequests/", function(data) {

        // Add new songs to the table
        $.each(data.songs, function(index, value) {
            addRequestTableRow(value.id, index + 1, value.title, value.duration, value.url);
        });

        // Remove songs that are no longer on the playlist
        requestRows = $('#requestTable tbody').children('tr');
        $.each(requestRows, function(index, value) {
            found = false;
            $.each(data.songs, function(sindex, svalue) {
                if(value.id.substring(2) == svalue.id) {
                    found = true;
                }
            });
            if(!found) {
                value.remove();
            }
        });
        queueNextSong();
        pauseSong();
        $("#loader").fadeOut();
    });
}
document.addEventListener("DOMContentLoaded", function () {
    fetchRequestsInitial();
    $("#skip").click(skipSong);
    setInterval(fetchRequests, 5000);
}, false);

/*
Attach keyboard shortcut listeners
*/
document.addEventListener("DOMContentLoaded", function () {
    $(document).keypress(function(event) {
      if (event.which == 32) {
         event.preventDefault();
         $("#playpause").click();
      }
    });
}, false);

/*
Adds a row to the request table
*/
function addRequestTableRow(id, index, title, duration, link) {
    if(!($("#sr"+id).length)) {
        $("#norequests").hide();
        $("#requestTable tbody").append(
        "<tr id=\"sr" + id + "\">" +
        "<td>" + index + "</td>" +
        "<td>" + title + "</td>" +
        "<td>" + duration + "</td>" +
        "<td></td>" +
        "<td></td>" +
        "<td class=\"songlink\"><a href=\"" + link + "\"><span class=\"glyphicon glyphicon-share-alt\"></a></td>" +
        "<td><span class=\"glyphicon glyphicon-trash\"></td>" +
        "</tr>"
        );
    }
}
var player;
function queueNextSong() {
    var nextURL;
    nextRequest = $('#requestTable tbody').find("tr:first");
    nextURL = "https://www.youtube.com/watch?v=ZlTAFkubtSM";
    if(nextRequest.length) {
        console.log("playing requests");
        nextURL = nextRequest.children(".songlink").children("a").attr("href");
    } else {
        console.log("playing library");
        nextURL = pickLibrarySong();
    }
    player = Popcorn.smart(
               '#musicplayer',
               nextURL + '&controls=0');

    player.on('ended', function() {
        endSong();  
    });
    player.on('loadeddata', function() {
        player.volume($('#volume').slider().data('slider').getValue() / 100);
    });
    player.on('volumechange', function() {
        if(player.volume() == 0) {
            $("#volumeicon").removeClass();
            $("#volumeicon").addClass('glyphicon glyphicon-volume-off');
        } else if(player.volume() > 0.4) {
            $("#volumeicon").removeClass();
            $("#volumeicon").addClass('glyphicon glyphicon-volume-up');
        } else {
            $("#volumeicon").removeClass();
            $("#volumeicon").addClass('glyphicon glyphicon-volume-down');
        }
    });

    $('#volume').slider()
      .on('slide', function(ev){
        player.volume(ev.value / 100);
    });

    $('videothumb').attr("src", "http://img.youtube.com/vi/" + getparam(nextURL, "v") + "/0.jpg");

    unpauseSong();
    //$("#musicplayer").hide();
}

/*
Chooses and random song from the user's library and returns the url.
*/
function pickLibrarySong() {
    $("#loader").show();
    var url;
    $.ajax({
        url: "/playlist/getlibrary/",
        type: 'GET',
        async: false,
        success: function(data) {
            rand = Math.floor(Math.random() * data.songs.length);
            console.log(data.songs[rand].url);
            url = data.songs[rand].url;
            $("#loader").fadeOut();
        }
    });
    return url;
}

/*
Pauses the current song
*/
function pauseSong() {
    player.pause();
    $("#playpause").unbind();
    $("#playpause").click(unpauseSong);
    $("#playpause").html('<span class="glyphicon glyphicon-play"></span>');
    $("#playpause").removeClass("disabled");
}

/*
Unpauses the current song
*/
function unpauseSong() {
    player.play();
    $("#playpause").unbind();
    $("#playpause").click(pauseSong);
    $("#playpause").html('<span class="glyphicon glyphicon-pause"></span>');
    $("#playpause").removeClass("disabled");
}

/*
Skips the current song
*/
function skipSong() {
    console.log("skip");
    endSong();
}

/*
Actions preformed at the end of each song
*/
function endSong() {
    $('#requestTable tbody').find("tr:first").remove();
    console.log("ended");
    player.destroy();
    $('#musicplayer').html("");
    queueNextSong();
}

/*
Gets a parameter from a url by name.
*/
function getparam(url, name) {
    var params = url.substr(url.indexOf("?")+1);
    var sval = "";
    params = params.split("&");
    for (var i=0; i<params.length; i++) {
        temp = params[i].split("=");
        if ( [temp[0]] == name ) { 
            sval = temp[1]; 
        }
    }
    return sval;
}