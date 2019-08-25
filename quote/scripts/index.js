var quotes = [
      "C’est vrai qu’on vient de jouer contre une équipe qui sont vraiment très forte",
      "C’est beau ce stade Vélodrome qui est toujours plein à domicile comme à l’extérieur",
      "Il fait attention pour qu’on a du peps",
      "Inconsciemment, il faut pas s’endormir",
      "Je pense qu’on espère qu’on va gagner",
      "On est des joueurs qu’on va vite avec le ballon",
      "Au niveau des sensations, je n’ai rien ressenti",
      "C’est vrai que Scolari est un grand joueur",
      "Maintenant il faudra faire avec sans Zizou",
      "J’ai couru jusqu’à quand ce que je pouvais"

    ];

    var colors = [
      "primary",
      "success",
      "danger",
      "warning",
      "info",
      "dark",
    ];



    $(document).ready(function(){
      var al = Math.floor(Math.random() * Math.floor(quotes.length));
      $("#quote").text(quotes[al]);
      var hist=al;
      $("#btnquote").click(function(){
          while(hist == al){//making sure the new al number is the same as the previous one
            al = Math.floor(Math.random() * Math.floor(quotes.length));
          }
          $("#quote").text(quotes[al]);
          
          $("#main").removeClass("bg-" + colors[hist]+" text-"+colors[hist]).addClass("bg-" + colors[al]+" text-"+colors[al]);

          $("#btnquote").removeClass("btn-"+colors[hist]).addClass("btn-"+colors[al]);
          $("#tweet").removeClass("btn-"+colors[hist]).addClass("btn-"+colors[al]);

          hist=al;

      });
      $("#tweet").click(function(){
        $("#tweet").attr("href", "https://twitter.com/intent/tweet?hashtags=quoteOfTheDay&text="+"\""+quotes[hist]+"\" Franck Ribery ");
    });
    });
      