

function getWikiResults(search) {
    

    $.ajax( {
    url: 'https://en.wikipedia.org/w/api.php',
    dataType: 'json',
    data: {"action": "opensearch","format":"json", "search":search, 'origin':'*'},
    type: 'GET',
    success: function(data) {
       $('h5').each(function(i){
        $( this ).html(data[1][i+1]);
       });

       $('p').each(function(i){
        $( this ).html(data[2][i+1]);
       });

       $('a').each(function(i){
        $( this ).attr('href', data[3][i+1]);
       });
    }
} );
}

$(document).ready(function () {
  
  $('#searchbar').submit(function( event ) {

    getWikiResults($( "input:first" ).val());
    $('#results').removeClass('invisible');
    event.preventDefault();
  });

  $('#random').click(function(){
    window.open('https://en.wikipedia.org/wiki/Special:Random');
  });
  
});


















