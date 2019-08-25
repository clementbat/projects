$(document).ready(function () {
  
  game = [0, 0, 0,
  0, 0, 0,
  0, 0, 0];
  
  var x = 'O';
  var o = 'X';

  var interval;
  var timeout;

  function reset(){
    game = [0, 0, 0,
    0, 0, 0,
    0, 0, 0];
    $('#playground').find('.btn-dark').each(function(i, el){
      $(el).val('');
    });
    $('#winner').html('');
  }

  function reset_wtimeout(){
    timeout = setTimeout(function(){
      game = [0, 0, 0,
      0, 0, 0,
      0, 0, 0];
      $('#playground').find('.btn-dark').each(function(i, el){
        $(el).val('');
      });
      $('#winner').html('');
      clearInterval(interval);
      }, 5000);
  }

  $('#reset').click(function(){
    clearTimeout(timeout);
    clearInterval(interval);
    reset();
  });

  $('#rond').click(function(){
    if(!game.includes(1) && !game.includes(2)){
      x = 'O';
      o = 'X';
      $(this).removeClass('btn-secondary').addClass('btn-primary');
      $('#croix').removeClass('btn-primary').addClass('btn-secondary');
    } 
  });

  $('#croix').click(function(){
    if(!game.includes(1) && !game.includes(2)){
      x = 'X';
      o = 'O';
      $(this).removeClass('btn-secondary').addClass('btn-primary');
      $('#rond').removeClass('btn-primary').addClass('btn-secondary');
    }
  });

  function display_timer(string){
    var time = 3;
    interval = setInterval(function(){
      $('#winner').html(string+' ('+time+'s.)');
      time--;
    }, 1000);
    $('#winner').html(string);
  }

  function display_winner(){
    if(winner(game) == 1){
      display_timer('You win !! Congrats !');
      $('#point-player').html(Number($('#point-player').text())+1);
      reset_wtimeout();
    }else if(winner(game) == 2){
      display_timer('The computer wins !! Try again !');
      $('#point-computer').html(Number($('#point-computer').text())+1);
      reset_wtimeout();
    }
  }

  $('#playground').find('.btn-dark').each(function(i, el){
    $(el).click(function(){
      if(winner(game) == 0){
        if($(el).val() == ''){
          $(el).val(x);
        }
        if(game[i] == 0){  
          game[i] = 1;
          if(winner(game)){
            display_winner();
          }else if(almost_winner(2) == 1){
            if(almost_winner(1) == 1){
              var count = 0;
              for(var l = 0; l < game.length ; l++){
                if(game[l] == 0){
                  count = count + 1;
                }
              }
              if(count){
                var r = Math.floor(Math.random() * 10);
                while($('#'+r).val() != ''){
                  r = Math.floor(Math.random() * 10);
                }
                
                game[r] = 2;
                $('#'+r).val(o);
                if(winner(game)){
                  display_winner();
                }
                return;
              }else{
                display_timer('No winner...');
                reset_wtimeout();
                return;
              } 
            }
          }
        }
      }
    });
  });

  win = [[0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]];

  function winner(game){
    for (var j = 0; j < win.length; j++) {
      if( (game[win[j][0]] == 1) && (game[win[j][1]] == 1) && (game[win[j][2]] == 1)){
        return 1;        
      }else if ( (game[win[j][0]] == 2) && (game[win[j][1]] == 2) && (game[win[j][2]] == 2) ){
        return 2;
      }
    }
    return 0;
  }

  function play(a, index){
    $('#'+win[index][a]).val(o);
    game[win[index][a]] = 2;
    if(winner(game)){
      display_winner();
    }
    return;     
  }

  function almost_winner(num){
    for (var j = 0; j < win.length; j++) {
      if( (game[win[j][0]] == num) && (game[win[j][1]] == num)){
        if(game[win[j][2]] == 0){
          play(2,j);
          return;
        }
      }else if( (game[win[j][1]] == num) && (game[win[j][2]] == num) ){
        if(game[win[j][0]] == 0){
          play(0,j);
          return;
        }
      }else if( (game[win[j][0]] == num) && (game[win[j][2]] == num) ){
        if(game[win[j][1]] == 0){
          play(1,j);
          return;
        }
      }
    }
    return 1;
  }
});
















