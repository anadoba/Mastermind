/*globalstrict: true*/
/*jshint browser: true */
/*global $: false */
/*devel: true*/

String.prototype.repeat = function (num) {
    return new Array(num + 1).join(this);
};

var DEPTH=0;

var markFunction = function (size) {
      var mark = [];
    var i;
      for (i=0; i < size; i++) {
         mark[mark.length] = $('#column' + (i) + (DEPTH-1)).val();
         console.log('#column' + (i) + (DEPTH-1) +': ' + $('#column' + (i) + (DEPTH-1)).val());
      }

      var markString = "";
      for (i=0; i < size; i++) {
         markString = markString + mark[i] + "/";
      }
    
    return markString;
};

var buttonMarkAction = function (size) {
            $.ajax({
              type: 'GET',
              url: '/mark/' + markFunction(size),
              success: function (result) {
                // wyswietl wynik poprzedniego
                $('#responseArea' + (DEPTH-1)).html("&#9679;".repeat(result.retVal.black) + "<br/>");
                $('#responseArea' + (DEPTH-1)).append("&#9675;".repeat(result.retVal.white) + "<br/>");
                  
                // dorysuj kolejne
                  if (result.retVal.black === size) {
                        $('#gameContent').append(" <div id=\"responseArea" + DEPTH + "\"><h3>" + result.retMsg + "</h3></div>");
                      return;
                  }
                var i;
                for (i=0; i < size; i++) {
                    $('#gameContent').append("<input id=\"column" + i + DEPTH + "\">");
                }
                $('#gameContent').append(" <div id=\"responseArea" + DEPTH + "\"><input type=\"button\" value=\"sprawdź\" id=\"buttonMark\"></div>");
                DEPTH++;
                $('#buttonMark').click(function () {buttonMarkAction(size);});
              }
            });
        };

$(document).ready(function () {
  $('#buttonStartGame').click(function () {
    $.ajax({
      type: 'GET',
      url: '/play/',
      success: function (startGame) {
        var SIZE = startGame.retMsg.size;
        $('#gameContent').append("</br>Rozpoczęto grę z " + SIZE + " kolumnami, obsługującą " + startGame.retMsg.dim + " liczb.</br></br>");
          
        var i;
        for (i=0; i < SIZE; i++) {
            $('#gameContent').append("<input id=\"column" + i + DEPTH + "\">");
        }
        $('#gameContent').append(" <div id=\"responseArea" + DEPTH + "\"><input type=\"button\" value=\"sprawdź\" id=\"buttonMark\"></div>");
        DEPTH++;
          
        $('#buttonMark').click(function () {buttonMarkAction(SIZE);});
          
      }
    });
  });
  
});