/*
$(window).bind('beforeunload', function(){
  return 'Leaving will interrupt music playback.';
});
*/


// wait for the DOM to be loaded 
$(document).ready(function() { 
    // bind 'myForm' and provide a simple callback function 
    $('#libraryForm').ajaxForm(function(responseText) { 
        alert(responseText); 
    }); 
}); 
