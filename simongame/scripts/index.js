$(document).ready(function () {
  
  var arr=[];
  var arr_user = [];

  var baseUrl = "https://s3.amazonaws.com/freecodecamp/simonSound";
  var audio = ["1.mp3", "2.mp3", "3.mp3", "4.mp3"];

  var strict;
  var bool = false;

  function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;

    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  function show_arr(array, interval){
    bool = false;
    for(var i = 0 ; i < array.length ; i++){
      if(i==0){
        $('#'+array[i]).removeClass('opacityon');
        new Audio(baseUrl+audio[array[i]]).play();
      }
      doSetTimeout(i, array, interval);
    }
  }

  function doSetTimeout(i, array, interval) {
   window.setTimeout(function() { 
      $('#'+array[i]).addClass('opacityon');
      if(i < array.length-1){
       window.setTimeout(function(){
          $('#'+(array[i+1])).removeClass('opacityon');
          new Audio(baseUrl+audio[array[i+1]]).play();
        },200);
      }else if(i == array.length-1){
        bool=true;
      }
    }, interval*(i+1));
  }


  $('#start').click(function(){
    start();
  });

  $('input[name=strict]').click(function(){
    if($(this).val() == 'on'){
      $(this).val('off');
      $(this).removeClass('btn-primary').addClass('btn-secondary');
    }else{
      $(this).val('on');
      $(this).removeClass('btn-secondary').addClass('btn-primary');
    }
  });

  function start(){
    $('#winner').html('');
    
    if( $('input[name=strict]').val() == 'on' ){
      strict = true;
    }else{
      strict = false;
    }

    var id = window.setTimeout(function() {}, 0);

    while (id--) {
        window.clearTimeout(id);
    }

    for(var i = 0 ; i < 4 ; i++){
      $('#'+i).addClass('opacityon');
    }

    arr=[];
    $('#serie').val(1);
    addtoloop();
    setTimeout(function(){show_arr(arr, 700);},900);
  }

  function addtoloop(){
    var r = Math.floor(Math.random() * 4);
    arr.push(r);
    arr_user = [];
  }

  function clickdisplay(i){
    bool=false;
    $('#'+i).removeClass('opacityon');
    new Audio(baseUrl+audio[i]).play();
    window.setTimeout(function() { 
      $('#'+i).addClass('opacityon');
    }, 300);
  }

  $('#game').find('.btn').each(function(i, el){
    $(el).click(function(){      
      if(bool){

        clickdisplay(i);
        
        arr_user.push(i);

        if(arraysEqual(arr_user, arr.slice(0, arr_user.length))){
          bool=true;
          if(arr_user.length == arr.length){
            bool=false;
            if(arraysEqual(arr_user, arr)){
              if(Number($('#serie').val()) == 20){
                $('#serie').val('WIN!!');
                window.setTimeout(function(){start();},3000);
              }else{
                addtoloop();
                window.setTimeout(function(){
                  show_arr(arr, 700);
                  $('#serie').val(Number($('#serie').val())+1);
                },2000);
              }
            }
          }
        }else{
          
          if(strict){
            window.setTimeout(function(){
              $('#serie').val(serie);
              start();
            },2000);
            var serie = $('#serie').val();
            $('#serie').val('error');
          }else{      
            window.setTimeout(function(){
              show_arr(arr, 700);
              $('#serie').val(serie);
            },2000);
            arr_user=[];
            var serie = $('#serie').val();
            $('#serie').val('error');
          } 
        }
      }
    });
  });
});
















