/*globalstrict: true*/
/*jshint browser: true */
/*global $: false */
/*devel: true*/

String.prototype.repeat = function (num) {
    return new Array(num + 1).join(this);
};

var DEPTH=0;
var MAX_DEPTH=0;

var markFunction = function (size) {
    var mark = [];
    var i;
      for (i=0; i < size; i++) {
         mark[mark.length] = $('#column' + (i) + (DEPTH-1)).val();
         //console.log('#column' + (i) + (DEPTH-1) +': ' + $('#column' + (i) + (DEPTH-1)).val());
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

        // jeśli wygrana to koniec
        if (result.retVal.black == size) {
            $('#gameContent').append(" <div id=\"responseArea" + DEPTH + "\"><h3>" + result.retMsg + "</h3></div>");
            return;
        }
        // jeśli koniec ruchów to koniec :)
        if (DEPTH == MAX_DEPTH) {
            $('#gameContent').append(" <div id=\"responseArea" + DEPTH + "\"><h3>" + "Przegrana - koniec ruchów!" + "</h3></div>");
            return;
        }

        // dorysuj kolejne
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

var startFunction = function () {
    var startString = "/play/";
    
    var size = $('#sizeField').val();
    var dim = $('#dimField').val();
    var max = $('#maxField').val();
    
    if (size) {
        startString = startString + "size/" + size + "/";
    }
    if (dim) {
        startString = startString + "dim/" + dim + "/";
    }
    if (max) {
        startString = startString + "max/" + max + "/";
    }
    
    return startString;
};

$(document).ready(function () {
  $('#buttonStartGame').click(function () {
    $.ajax({
      type: 'GET',
      url: startFunction(),
      success: function (startGame) {
        var SIZE = startGame.retMsg.size;
        $('#gameContent').append("</br>Rozpoczęto grę z " + SIZE + " kolumnami, obsługującą " + startGame.retMsg.dim + " liczb," + " max liczba ruchów: " + startGame.retMsg.max + ".</br></br>");
          
        MAX_DEPTH = startGame.retMsg.max;  
          
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