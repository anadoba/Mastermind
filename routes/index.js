/*jshint node: true */
// poniżej użylismy krótszej (niż na wykładzie) formy
// module.exports ==> exports
exports.index = function (req, res) {
    req.session.puzzle = req.session.puzzle || req.app.get('puzzle');
    res.render('index', {
        title: 'Mastermind'
    });
};

exports.play = function (req, res) {
    var newGame = function () {
        var i, data = [],
            puzzle = req.session.puzzle;
        for (i = 0; i < puzzle.size; i += 1) {
            data.push(Math.floor(Math.random() * puzzle.dim));
        }
        req.session.puzzle.data = data; // każda sesja ma własną grę
        return {
            // czy udało się, czy nie
            // potwierdzenie wartości size, dim i max
            "retMsg": {
                "size": puzzle.size,
                "dim": puzzle.dim,
                "max": puzzle.max
            }
        };
    };
    // poniższa linijka jest zbędna (przy założeniu, że
    // play zawsze używany będzie po index) – w końcowym
    // rozwiązaniu można ją usunąć.
    req.session.puzzle = req.session.puzzle || req.app.get('puzzle');
    /*
     * req.params[2] === wartość size
     * req.params[4] === wartość dim
     * req.params[6] === wartość max
     */
    if (req.params[2]) {
        req.session.puzzle.size = req.params[2];
    }
    if (req.params[4]) {
        req.session.puzzle.dim = req.params[4];
    }
    if (req.params[6]) {
        req.session.puzzle.max = req.params[6];
    }
    res.json(newGame());
};

exports.mark = function (req, res) {
    var markAnswer = function () {
        var move = req.params[0].split('/');
        move = move.slice(0, move.length - 1);
        console.log(req.session.puzzle.data);
        console.log(move);
        
        var black_dots = 0; // dobre liczby na dobrych miejscach
        var white_dots = 0; // dobre liczby na złych miejscach
        
        var i = 0;
        var j = 0;
        
        for (i=0; i<move.length; i++) {
            for (j=0; j<move.length; j++) {
                if (req.session.puzzle.data[i] === parseInt(move[j])) {
                    if (i === j) {
                        black_dots++;
                    } else {
                        white_dots++; // białych za dużo, jak dana liczba się powtarza
                    }
                }
            }
        }
        
        var wiadomosc = "";
        if (black_dots == req.session.puzzle.size) {
            wiadomosc = "Gratulacje! Koniec gry";  
        } else {
            wiadomosc = "Graj dalej";
        }
        
        return {
            "retVal": {
                "black": black_dots,
                "white": white_dots
            },
            "retMsg": wiadomosc
        };
    };
    res.json(markAnswer());
};
