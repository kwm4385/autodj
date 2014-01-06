/*
$(window).bind('beforeunload', function(){
  return 'Leaving will interrupt music playback.';
});
*/

function getYoutubeID(url) {
    var id = url.match("[\\?&]v=([^&#]*)");
    id = id[1];
    return id;
};

function getYoutubeTitle(url) {
    var video_id= getYoutubeID(url);
    var link = 'http://gdata.youtube.com/feeds/api/videos/'+video_id+'?v=2&alt=jsonc';
    $.ajax({
        type: "GET",
        url: link,
        crossDomain: true,
        contentType: "application/json; charset=utf-8",
        dataType: "jsonp", 
        success: function(data){
            alert(data.data.title);
        } 
    });
};

function getBbyJson()
{
    var video_id= getYoutubeID(url);
    var link = 'http://gdata.youtube.com/feeds/api/videos/'+video_id+'?v=2&alt=jsonc';
    $.ajax({
        type: "GET",
        url: link,
        crossDomain: true,
        contentType: "application/json; charset=utf-8",
        dataType: "jsonp", 
        success: function(data){
            alert(data.data.title);
        } 
    });
}