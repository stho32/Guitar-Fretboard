/// <reference path='./jquery.d.ts' />
/*
TODO:
- Noten definieren über Notenbezeichnung und Oktave
- Darstellung der Note in Notenlinien und Tab?
- Ausblendung aller Noten, die nicht zum Schema gehören, z.B. C-Dur
- Angabe eines Offsets für die Darstellung (z.B. ab 7ten Bund)
- Darstellung der nächsten 7 Zeilen (nächste erreichbare Noten)
DOING:
DONE:
*/
var noten = [];
noten[0] = "C";
noten[1] = "C#";
noten[2] = "D";
noten[3] = "D#";
noten[4] = "E";
noten[5] = "F";
noten[6] = "F#";
noten[7] = "G";
noten[8] = "G#";
noten[9] = "A";
noten[10] = "A#";
noten[11] = "B";

/*
Ein Steg hat n Saiten
*/
var Steg = (function () {
    function Steg(anzahlBuende) {
        this.Saite = [];
        this.Saite.push(new Saite(new Note(4, 1), anzahlBuende));
        this.Saite.push(new Saite(new Note(9, 1), anzahlBuende));
        this.Saite.push(new Saite(new Note(2, 2), anzahlBuende));
        this.Saite.push(new Saite(new Note(7, 2), anzahlBuende));
        this.Saite.push(new Saite(new Note(11, 2), anzahlBuende));
        this.Saite.push(new Saite(new Note(4, 3), anzahlBuende));
    }
    return Steg;
})();

/*
Saiten sind Listen von Bünden
*/
var Saite = (function () {
    function Saite(ersteNote, anzahlBuende) {
        this.Buende = [];
        this.Buende.push(ersteNote);

        var aktuelleNote = ersteNote.Weiterzaehlen();

        for (var i = 0; i < anzahlBuende - 1; i++) {
            this.Buende.push(aktuelleNote);
            aktuelleNote = aktuelleNote.Weiterzaehlen();
        }
    }
    return Saite;
})();

var Note = (function () {
    function Note(note, oktave) {
        this.note = 0;
        this.oktave = 0;
        this.note = note;
        this.oktave = oktave;
    }
    Note.prototype.Weiterzaehlen = function () {
        var temp = new Note(this.note, this.oktave);
        temp.note += 1;
        if (temp.note > 11) {
            temp.note = 0;
            temp.oktave += 1;
        }
        return temp;
    };

    Note.prototype.AlsText = function () {
        var gruenMarkieren = $("#gruen").val().split(",");
        var orangeMarkieren = $("#orange").val().split(",");
        var rotMarkieren = $("#rot").val().split(",");

        if (this.MarkierungswunschEnthaelt(gruenMarkieren, this.note, this.oktave)) {
            return "<div class=\"btn btn-success\">" + noten[this.note] + this.oktave.toString() + "</div>";
        }

        if (this.MarkierungswunschEnthaelt(orangeMarkieren, this.note, this.oktave)) {
            return "<div class=\"btn btn-warning\">" + noten[this.note] + this.oktave.toString() + "</div>";
        }

        if (this.MarkierungswunschEnthaelt(rotMarkieren, this.note, this.oktave)) {
            return "<div class=\"btn btn-danger\">" + noten[this.note] + this.oktave.toString() + "</div>";
        }

        return "<div class=\"btn btn-default\">" + noten[this.note] + this.oktave.toString() + "</div>";
    };

    Note.prototype.MarkierungswunschEnthaelt = function (markierungsliste, note, oktave) {
        for (var i = 0; i < markierungsliste.length; i++) {
            if (noten[note] == markierungsliste[i]) {
                return true;
            }
            if (noten[note] + oktave.toString() == markierungsliste[i]) {
                return true;
            }
        }
        return false;
    };
    return Note;
})();

function istBundSichtbar(bund) {
    if ($("#buende").val() == "")
        return true;

    var sichtbareBuende = $("#buende").val().split(",");

    if (sichtbareBuende.length == 0)
        return true;

    /*
    Wenn wir einen Bünde-Filter haben,
    dann zeigen wir nur die Bünde an, die
    genannt werden.
    */
    var gefunden = false;
    for (var j = 0; j < sichtbareBuende.length; j++) {
        if (sichtbareBuende[j] == bund.toString()) {
            return true;
        }
    }

    return false;
}

function Fretboard() {
    var anzahlBuende = 20;
    var steg = new Steg(anzahlBuende);

    var ergebnis = "";

    ergebnis += "<table class=\"table table-bordered\">";

    ergebnis += "<tr>";
    for (var i = 0; i < anzahlBuende; i++) {
        if (!istBundSichtbar(i))
            continue;

        ergebnis += "<th>" + i + "</th>";
    }
    ergebnis += "</tr>";

    for (var i = 0; i < steg.Saite.length; i++) {
        ergebnis += "<tr>";

        for (var j = 0; j < steg.Saite[i].Buende.length; j++) {
            if (!istBundSichtbar(j))
                continue;
            ergebnis += "<td>" + steg.Saite[i].Buende[j].AlsText() + "</td>";
        }

        ergebnis += "</tr>";
    }

    ergebnis += "</table>";

    return ergebnis;
}

$(document).ready(function () {
    $("#fretboard").html(Fretboard());
    $("#gruen").keyup(function () {
        $("#fretboard").html(Fretboard());
    });
    $("#orange").keyup(function () {
        $("#fretboard").html(Fretboard());
    });
    $("#rot").keyup(function () {
        $("#fretboard").html(Fretboard());
    });
    $("#buende").keyup(function () {
        $("#fretboard").html(Fretboard());
    });
});
