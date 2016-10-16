$( document ).ready(function() {

  $( "#search" ).click(function() {
    //https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=apple
    //https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=buckminster%20fuller
    // where apple = the search term
    $( "tbody" ).append(devlog2( $( "#searchTerm" ).val()));
  });

  $( "tbody" ).append(devlog2("jQuery ready event finished"));
});  // end of ready event


function devlog(text) {
  var result = "<div class='row col-md-12 text-center'>";
  result += text;
  result += "</div>";
  return result;
}
function devlog2(text) {
  var result = "<tr><td>";
  result += text;
  return result;
}
