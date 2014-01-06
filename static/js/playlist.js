/*
$(window).bind('beforeunload', function(){
  return 'Leaving will interrupt music playback.';
});
*/

function secondsToHMS(time) {
    var mins = ~~(time / 60);
    var secs = time % 60;
    var hrs = ~~(time / 3600);
    var mins = ~~((time % 3600) / 60);
    var secs = time % 60;
    ret = "";
    if (hrs > 0)
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
};

function getYoutubeID(url) {
    var id = url.match("[\\?&]v=([^&#]*)");
    id = id[1];
    return id;
};

function getYoutubeData(url, id) {
    var video_id= getYoutubeID(url);
    var link = 'http://gdata.youtube.com/feeds/api/videos/'+video_id+'?v=2&alt=jsonc';
    $.ajax({
        type: "GET",
        url: link,
        crossDomain: true,
        contentType: "application/json; charset=utf-8",
        dataType: "jsonp", 
        success: function(data){
            $("#" + id + "-title p").text(data.data.title);
            $("#" + id + "-duration p").text(secondsToHMS(data.data.duration));
        } 
    });
};
