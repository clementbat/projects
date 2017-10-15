$(document).ready(function () {
  
  var res;

  $('#calc').find('.btn').each(function(i, el){
    $(el).click(function(){
      if($(el).val() == '='){
        $('#res').html(res + '='+Math.round(eval(res)*10000)/10000);
        res = undefined;
      }else if($(el).val() == 'reset'){
        res = undefined;
        $('#res').html('');
      }else{
        if(res){
          res = res + $(el).val();
          $('#res').html(res);
        }else{
          res = $(el).val();
          $('#res').html(res);
        }
      }
    });
  })
});


















