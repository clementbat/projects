

var users = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];

$('a').each(function(i, el) {
  $.getJSON('https://wind-bow.gomix.me/twitch-api/streams/'+users[i]+'?callback=?', function(data) {
    $(el).attr('href', 'https://go.twitch.tv/'+users[i]);
    $(el).find('h5').html(users[i]);
    if(data.stream == null){
      $(el).find('p').html('offline');
    }else{
      $(el).find('p').html('online: '+data.stream.channel.status);
      $(el).css('background-color','green');
      $(el).css('color','white');
    }
  });
});



















