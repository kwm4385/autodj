/*
$(window).bind('beforeunload', function(){
  return 'Leaving will interrupt music playback.';
});
*/


// wait for the DOM to be loaded 
$(document).ready(function() { 
    var options = { 
        clearForm : true,
        success: function(responseText) { 
            alert(responseText); 
        } 
    }; 
    $('#libraryForm').ajaxForm(options);
}); 
