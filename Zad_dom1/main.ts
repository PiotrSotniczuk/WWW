import {addWynik, wyswietlRanking} from "./modulDB.js";
import {appendSubmit, inicjujTablice, policzWynik, timerClass, wstawZapis} from "./modulWork.js";

// typy
type Pyt = string;
type Odp = number;
type Kara = number;
type IPytanie = [Pyt, Odp, Kara];

export interface IQuiz {
    zadania: IPytanie[];
}

// parsowanie danych do quizu
const jsonString: string = `{
    "zadania": [["2 + 3", 5, 5], ["2 -(-24:4)", 8, 20], ["2 * 9", 18, 10], ["4 + 8", 12, 10]]
}`;

const quizData : IQuiz = JSON.parse(jsonString);
const quizSize : number = quizData.zadania.length;

// elementy przyciskowe i nasluchujace
const elStartButton = document.querySelector("input[value='Start']");
const elDalej = document.getElementById("dalej");
const elWstecz = document.getElementById("wstecz");
const elAnuluj = document.getElementById("anuluj");
const elSkoncz = document.getElementById("skoncz");


// gridy
const elStartowy = document.getElementById("startowy");
const elQuiz = document.getElementById("quiz");

// elementy do wpisywania
const elCzas = document.getElementById("czas");
const elNrPytania = document.getElementById("nrPytania");
const elPytanie = document.getElementById("pytanie");
const elKara = document.getElementById("kara");
const elOdpowiedz = document.getElementById("odpowiedz") as HTMLInputElement;
const elPoSkonczeniu = document.getElementById("poSkonczeniu");
const elZZap = document.getElementById("zZap");
const elBezZap = document.getElementById("bezZap");
const elNick = document.getElementById("nick") as HTMLInputElement;
const elRanking = document.getElementById("ranking");


// zmienne globalne
let Interwal;
export let aktPyt = 0;
let Odpowiedzi = new Array(quizSize);
export let Statystyki = new Array(quizSize);
let timer = new timerClass();
let trybSpr = 0;
let wynik;
let nick = "";

wyswietlRanking(elRanking);
inicjujTablice(Odpowiedzi, "");
inicjujTablice(Statystyki, 0);

function fillForms(move : number) {
    aktPyt += move;
    // zmien stan
    elNrPytania.innerHTML = "Nr. Pytania: " + (aktPyt+1).toString() + "/" + quizSize;
    elKara.innerHTML = "Ew. kara: " + quizData.zadania[aktPyt][2];
    if (trybSpr == 1 &&  Odpowiedzi[aktPyt] != quizData.zadania[aktPyt][1]){
        elKara.style.backgroundColor = "red";
    }else {
        elKara.style.backgroundColor = "";
    }

    // zmien pytanie
    elPytanie.innerHTML = quizData.zadania[aktPyt][0] + " = ";
    if (trybSpr == 1){
        elPytanie.innerHTML += quizData.zadania[aktPyt][1];
    }

    // wpisz jesli juz na to odpowiedzial
    // TODO jakis if?
    elOdpowiedz.value = Odpowiedzi[aktPyt];

    // zablokuj/odblokuj przyciski nawigacji
    if(aktPyt == 0){
        elWstecz.setAttribute('disabled', 'yes');
    }else{
        elWstecz.removeAttribute('disabled');
    }

    if(aktPyt == (quizSize - 1)){
        elDalej.setAttribute('disabled', 'yes');
    }else{
        elDalej.removeAttribute('disabled');
    }

}

elStartButton.addEventListener('click', () => {
    elStartowy.style.display = "none";
    elQuiz.style.display = "grid";
    fillForms(0);
    // o dziwo bez opakowania funkcja pchnijTimer nie widziala swoich atrybutów
    Interwal = setInterval(() => {timer.pchnijTimer(Statystyki);}, 1000);
    nick = elNick.value;
});

elDalej.addEventListener('click', () => {
    fillForms(1);
});

elWstecz.addEventListener('click', () => {
    fillForms(-1);
});

export function odnowGlob(){
    aktPyt = 0;
    elOdpowiedz.value = "";
    timer.setSekundy(0);
    elStartowy.style.display = "block";
    elQuiz.style.display = "none";
    elSkoncz.setAttribute('disabled', 'yes');
    elOdpowiedz.removeAttribute('disabled');
    elAnuluj.removeAttribute('disabled');
    trybSpr = 0;
    inicjujTablice(Odpowiedzi, "");
    inicjujTablice(Statystyki, 0);
    elPoSkonczeniu.style.display = "none";
    nick = "";
    wyswietlRanking(elRanking);
    elNick.value = "nick";
}

elAnuluj.addEventListener('click', () => {
    clearInterval(Interwal);
    odnowGlob();
});

elOdpowiedz.addEventListener('input', () => {
    Odpowiedzi[aktPyt] = elOdpowiedz.value;
    for (let odp of Odpowiedzi){
        if(odp === undefined || odp === ""){
            elSkoncz.setAttribute('disabled', 'yes');
            return;
        }
    }
    elSkoncz.removeAttribute('disabled');
});

elBezZap.addEventListener('click', () => {
    addWynik(wynik, nick, null, new Array(Odpowiedzi));
    console.log("moze sie udalo2" + Odpowiedzi);
});

elZZap.addEventListener('click',() => {
    addWynik(wynik, nick, new Array(Statystyki), (Odpowiedzi));
    console.log("moze sie udalo" + Odpowiedzi);
});


elSkoncz.addEventListener('click', () => {
    clearInterval(Interwal);
    wynik = policzWynik(timer.getSekundy(), Odpowiedzi, quizData);

    let popup = document.createElement('div');

    popup.setAttribute('class', 'block');
    document.querySelector('body').appendChild(popup);
    let text = document.createElement('div');

    text.setAttribute('class', 'block_text');
    text.innerHTML = "Twój wynik to " + wynik + "pkt";

    popup.appendChild(text);

    appendSubmit(popup, 'Zobacz Odpowiedzi').
    addEventListener('click', () => {
        elOdpowiedz.setAttribute('disabled', 'yes');
        elSkoncz.setAttribute('disabled', 'yes');
        elAnuluj.setAttribute('disabled', 'yes');
        trybSpr = 1;
        popup.remove();
        fillForms(0);
        wstawZapis(wynik);
    });

});
