import { zapiszWynik, wyswietlRanking } from "./modulDB.js";
import { dodajSubmit, inicjujTablice, policzWynik, TimerClass, wypelnijStrone, wstawZapis } from "./modulWork.js";
const jsonString = `{
    "zadania": [["2 + 3", 5, 5], ["2 -(-24:4)", 8, 20], ["2 * 9", 18, 10], ["4 + 8", 12, 10]]
}`;
const quizData = JSON.parse(jsonString);
const quizSize = quizData.zadania.length;
const elSkoncz = document.getElementById("skoncz");
const elStartowy = document.getElementById("startowy");
const elQuiz = document.getElementById("quiz");
const elOdpowiedz = document.getElementById("odpowiedz");
const elPoSkonczeniu = document.getElementById("poSkonczeniu");
const elNick = document.getElementById("nick");
let Interwal;
let aktPyt = 0;
const Odpowiedzi = new Array(quizSize);
const Statystyki = new Array(quizSize);
inicjujTablice(Odpowiedzi, "");
inicjujTablice(Statystyki, 0);
const timer = new TimerClass();
let trybSpr = false;
let wynik = 0;
let nick = "";
wyswietlRanking();
export function odnowGlob() {
    aktPyt = 0;
    elOdpowiedz.value = "";
    timer.setSekundy(0);
    trybSpr = false;
    inicjujTablice(Odpowiedzi, "");
    inicjujTablice(Statystyki, 0);
    nick = "";
    wyswietlRanking();
    elNick.value = "Twój-nick";
    elStartowy.style.display = "block";
    elQuiz.style.display = "none";
    elSkoncz.setAttribute('disabled', 'yes');
    elOdpowiedz.removeAttribute('disabled');
    elPoSkonczeniu.style.display = "none";
}
document.querySelector("input[value='Start']").addEventListener('click', () => {
    elStartowy.style.display = "none";
    elQuiz.style.display = "grid";
    wypelnijStrone(aktPyt, Odpowiedzi, quizData, trybSpr);
    Interwal = setInterval(() => { timer.pchnijTimer(Statystyki, aktPyt); }, 1000);
    nick = elNick.value;
});
document.getElementById("dalej").addEventListener('click', () => {
    aktPyt++;
    wypelnijStrone(aktPyt, Odpowiedzi, quizData, trybSpr);
});
document.getElementById("wstecz").addEventListener('click', () => {
    aktPyt--;
    wypelnijStrone(aktPyt, Odpowiedzi, quizData, trybSpr);
});
document.getElementById("anuluj").addEventListener('click', () => {
    clearInterval(Interwal);
    odnowGlob();
});
elOdpowiedz.addEventListener('input', () => {
    Odpowiedzi[aktPyt] = elOdpowiedz.value;
    for (const odp of Odpowiedzi) {
        if (odp === undefined || odp === "") {
            elSkoncz.setAttribute('disabled', 'yes');
            return;
        }
    }
    elSkoncz.removeAttribute('disabled');
});
document.getElementById("bezZap").addEventListener('click', () => {
    zapiszWynik(wynik, nick, null, Odpowiedzi);
});
document.getElementById("zZap").addEventListener('click', () => {
    zapiszWynik(wynik, nick, Statystyki, Odpowiedzi);
});
elSkoncz.addEventListener('click', () => {
    clearInterval(Interwal);
    wynik = policzWynik(timer.getSekundy(), Odpowiedzi, quizData);
    const popup = document.createElement('div');
    popup.setAttribute('class', 'block');
    document.querySelector('body').appendChild(popup);
    const text = document.createElement('div');
    text.setAttribute('class', 'block_text');
    text.innerHTML = "Twój wynik to " + wynik + "pkt";
    popup.appendChild(text);
    dodajSubmit(popup, 'Zobacz Odpowiedzi').
        addEventListener('click', () => {
        elOdpowiedz.setAttribute('disabled', 'yes');
        elSkoncz.setAttribute('disabled', 'yes');
        trybSpr = true;
        popup.remove();
        wypelnijStrone(aktPyt, Odpowiedzi, quizData, trybSpr);
        wstawZapis(wynik);
    });
});
//# sourceMappingURL=main.js.map