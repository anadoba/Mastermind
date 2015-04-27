/*jshint node: true */
// ładujemy wykorzystywane moduły
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path'); // uniezależnienie apki od środowiska systemowego, buduwanie ścieżek
var cookieSession = require('cookie-session'); // obsługa sesji za pomocą ciasteczek
var logger = require('morgan');
var errorHandler = require('errorhandler');
// tworzymy i konfigurujemy obiekt aplikacji
var app = express();
var routes = require('./routes'); // obsługa ścieżek
var port = process.env.PORT || 3000; // zmienna systemowa (jeśli jest), a jak nie to 3000
var env = process.env.NODE_ENV || 'development';
var secret = process.env.SECRET || '$uper $ecret';

app.set('views', __dirname + '/views'); // sciezka do widoków
// path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); // sciezka do szablonów
app.set('puzzle', {
    data: [], // układ liczb-kolorów do zganięcia
    size: 5,  // liczba wykorzystywanych „kolumn”
    dim: 9,   // liczba dostępnych kolorów/ liczb
    max: null // maksymalna liczba prób (null – brak ograniczeń)
});

// obsługa danych typu application/json
app.use(bodyParser.json());
// obsługa danych typu application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// obsługa sesji za pomocą ciasteczek
app.use(cookieSession({secret: secret}));
// „serwery statyczne” - pliki ze stylami, skrypt js odpowiedzialny za obsługę interfejsu gry
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components/jquery/dist'))); // kolejna warstwa

if ('development' === env) {
    app.use(logger('dev'));
    app.use(errorHandler());
} else {
    app.use(logger('short'));
}

// jak serwer reaguje na dane polecenia klienta
app.get('/', routes.index);
// /play/[size/m/][dim/n/][max/t/]
app.get(/^\/play\/((size\/(\d+)\/)?(dim\/(\d+)\/)?(max\/(\d+)\/)?)?/, routes.play);
// /mark/n0/…/nk/
app.get(/^\/mark\/((?:\d+\/)+)$/, routes.mark);

// uruchamiamy aplikację
app.listen(port, function () {
    console.log("Serwer nasłuchuje na porcie " + port);
});
