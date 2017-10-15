$(document).ready(function () {

  function decrement(sec){
    if(sec == 0){
      return 59;
    }else{
      return sec-1;
    }
  }

  var time = {
    'min':25,
    'sec':0,
    'min_break':5,
    'sec_break':0
  }

  function display_sec (sec){
    if(sec<= 9){
      return '0' + sec;
    }else{
      return sec;
    }
  }

  function change_duration(id_moins, id_duration, minute, second, sign){
    $(id_moins).click(function(){
      if(time[minute]>0 && sign =='-'){
        time[minute] = eval(time[minute] + sign + 1);
      }else if(time[minute]<60 && sign =='+'){
        time[minute] = eval(time[minute] + sign + 1);
      }
      
      $(id_duration).val( (time[minute]) +':'+ display_sec(time[second]) );
    });
  }

  change_duration('#moins', '#pomo', 'min', 'sec','-');
  change_duration('#plus', '#pomo', 'min', 'sec', '+');
  change_duration('#moins-break', '#break', 'min_break', 'sec_break','-');
  change_duration('#plus-break', '#break', 'min_break', 'sec_break','+');

  $('#reset').click(function(){
    time.min= 25;
    time.sec= 0;
    time.min_break=5;
    time.sec_break=0;
    $('#pomo').val( time.min+':00' );
    $('#break').val(time.min_break + ':00');

  });
  
$('#pomo').val( time.min+':'+display_sec(time.sec) );
$('#break').val( time.min_break+':'+ display_sec(time.sec_break) );

var tab = {
  'intervalid': undefined,
  'intervalid_break' : undefined,
  'x': false,
  'x_break': false
}



function pomodoro(interval, interval_2, bool, bool_2, main, secondary, minute, second){

  if (!tab[bool]){
    
    tab[bool] = true;
    tab[bool_2] = false;

    clearInterval(tab[interval_2]);

    $(secondary).removeClass('btn-primary').addClass('btn-secondary');
    $(secondary+'-text').removeClass('text-primary').addClass('text-muted');  
    $(main +'-text').removeClass('text-muted').addClass('text-primary');
   
    tab[interval] = setInterval(function(){
  
      if(time[minute] == 0 && time[second] == 0){
        if(main == '#pomo'){
          time[minute] = 25;
        }else{
          time[minute] = 5;
        }
        
        $(main).val(time[minute] +':00');
        compl(main);
      }else{
        if(time[second]== 0){
          time[minute]= decrement(time[minute]);
        }
        time[second]= decrement(time[second]);
        if(time[second]<= 9){
          $(main).val( time[minute]+':0'+time[second]);
        }else{
           $(main).val( time[minute]+':'+time[second]);
        }
      }
    }
    , 1000);
    $(main).removeClass('btn-secondary').addClass('btn-primary');

  }else{    
    clearInterval(tab[interval]);
    $(main+'-text').removeClass('text-primary').addClass('text-muted');
    $(main).removeClass('btn-primary').addClass('btn-secondary');
    tab[bool] = false;
  }
}

$('#pomo').on('click', function(){
  return pomodoro('intervalid','intervalid_break', 'x', 'x_break', '#pomo','#break','min','sec');
});

$('#break').on('click', function(){
  return pomodoro('intervalid_break','intervalid', 'x_break', 'x', '#break','#pomo','min_break','sec_break');
});

function compl(main){
  if(main == '#pomo'){
    pomodoro('intervalid_break','intervalid', 'x_break', 'x', '#break','#pomo','min_break','sec_break');
  }else{
    pomodoro('intervalid','intervalid_break', 'x', 'x_break', '#pomo','#break','min','sec');
  }
}

});



















