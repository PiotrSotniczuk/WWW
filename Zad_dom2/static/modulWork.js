export function dodajSubmit(father, value) {
    const submit = document.createElement('input');
    submit.setAttribute('type', 'submit');
    submit.setAttribute('value', value);
    father.appendChild(submit);
    return submit;
}
export function inicjujTablice(tablica, wartosc) {
    for (let i = 0; i < tablica.length; i++) {
        tablica[i] = wartosc;
    }
}
export function policzWynik(sek, Odp, quizData) {
    let i;
    let wynik = sek;
    for (i = 0; i < Odp.length; i++) {
        if (Odp[i] !== quizData.zadania[i][1].toString()) {
            wynik += quizData.zadania[i][2];
        }
    }
    return wynik;
}
export function wstawZapis(wynik) {
    document.getElementById("poSkonczeniu").style.display = "block";
    document.getElementById("wynikText").innerHTML = "Twój wynik to " + wynik;
}
export class TimerClass {
    constructor() {
        this.sekundy = 0;
    }
    pchnijTimer(Statystyki, aktPyt) {
        this.sekundy++;
        document.getElementById("czas").innerHTML = "Czas: " + this.sekundy + "sek";
        Statystyki[aktPyt]++;
    }
    getSekundy() {
        return this.sekundy;
    }
    setSekundy(sek) {
        this.sekundy = sek;
    }
}
export function wypelnijStrone(aktPyt, Odpowiedzi, quizData, trybSpr) {
    const elNrPytania = document.getElementById("nrPytania");
    const elPytanie = document.getElementById("pytanie");
    const elKara = document.getElementById("kara");
    const elOdpowiedz = document.getElementById("odpowiedz");
    const quizSize = Odpowiedzi.length;
    elNrPytania.innerHTML = "Nr. Pytania: " + (aktPyt + 1).toString() + "/" + quizSize;
    elKara.innerHTML = "Ew. kara: " + quizData.zadania[aktPyt][2];
    if (trybSpr === true && Odpowiedzi[aktPyt] !== quizData.zadania[aktPyt][1].toString()) {
        elKara.style.backgroundColor = "red";
    }
    else {
        elKara.style.backgroundColor = "";
    }
    elPytanie.innerHTML = quizData.zadania[aktPyt][0] + " = ";
    if (trybSpr === true) {
        elPytanie.innerHTML += quizData.zadania[aktPyt][1];
    }
    elOdpowiedz.value = Odpowiedzi[aktPyt];
    const elDalej = document.getElementById("dalej");
    const elWstecz = document.getElementById("wstecz");
    if (aktPyt === 0) {
        elWstecz.setAttribute('disabled', 'yes');
    }
    else {
        elWstecz.removeAttribute('disabled');
    }
    if (aktPyt === (quizSize - 1)) {
        elDalej.setAttribute('disabled', 'yes');
    }
    else {
        elDalej.removeAttribute('disabled');
    }
}
//# sourceMappingURL=modulWork.js.map