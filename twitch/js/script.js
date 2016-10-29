var users = [
  "FreeCodeCamp",
  "ESL_SC2",
  "OgamingSC2",
  "cretetion",
  "storbeck",
  "habathcx",
  "RobotCaleb",
  "noobs2ninjas",
  "brunofin",
  "comster404"
]

var url = "https://wind-bow.hyperdev.space/twitch-api/";

$( document ).ready( function() {

  $.each(users, function( index, value ){
    $.ajax({
      url: url + 'streams/' + value,
      type: 'GET',
      dataType: 'jsonp'
    })

    .done(function( data, textStatus, jqXHR ) {
      var result = undefined;
      var addClass = undefined;

      if (data.hasOwnProperty('stream')) {
        if (data.stream === null) {
          result = 'OFFLINE';
          addClass = 'off';
        } else {
          result = 'ONLINE';
          result += ': ' + data.stream.channel.status;
          addClass = 'on';
        }
      } else {
        result = 'NOT A MEMBER: ' + data.message;
        addClass = 'not-a-member';
      }

      $( "#results" ).append(
        "<a href='https://www.twitch.tv/" + value +
          "' class='list-group-item " + addClass + "'>" +
          "<h4 class='list-group-item-heading'>" + value + "</h4>" +
          "<p class='list-group-item-text'>" + result  + "</p>" +
          "</a>");

      console.log(data.error);
      console.dir(data);
    })

    .fail(function( xhr, stat, errorThrown ) {
      console.log(errorThrown);
      console.log(stat);
      console.dir(xhr);
    })

    .always(function(data, textStatus, jqXHR) {
      console.log('ajax request complete for: ' + textStatus);
    });

  });


});

