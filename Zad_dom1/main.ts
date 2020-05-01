// typy
type Pyt = string;
type Odp = number;
type Kara = number;

type IPytanie = [Pyt, Odp, Kara];

interface IQuiz {
    zadania: IPytanie[];
}

// parsowanie danych do quizu
const jsonString: string = `{
    "zadania": [["2 + 3", 5, 5], ["2 -(-24:4)", 8, 20], ["2 * 9", 18, 10], ["4 + 8", 12, 10]]
}`;

const quizData = JSON.parse(jsonString);
const quizSize = quizData.zadania.length;

// https://codepen.io/cathydutton/pen/GBcvo
// const tab = new Array(10); do statystyk
// przeskawinaie onclick

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
const elWstep = document.getElementById("wstep");


// zmienne
let Interwal;
let aktPyt = 0;
let Odpowiedzi = new Array(quizSize);
let sekundy = 0;
let trybSpr = 0;
let wynik;

function pushTimer() {
    sekundy++;
    elCzas.innerHTML = "Czas: " + sekundy.toString() + "sek";
    // TODO statystyki[]++
}

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
    Interwal = setInterval(pushTimer, 1000);
});

elDalej.addEventListener('click', () => {
    fillForms(1);
});

elWstecz.addEventListener('click', () => {
    fillForms(-1);
});

elAnuluj.addEventListener('click', () => {
    clearInterval(Interwal);
    aktPyt = 0;
    Odpowiedzi = new Array(quizSize);
    elOdpowiedz.value = "";
    sekundy = 0;
    elStartowy.style.display = "block";
    elQuiz.style.display = "none";
    elSkoncz.setAttribute('disabled', 'yes');
    // TODO zeruj statystyki
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

function policzWynik() : number{
    let i;
    let wynik = sekundy;
    for( i = 0; i < Odpowiedzi.length; i++){
        if(Odpowiedzi[i] != quizData.zadania[i][1]){
            wynik += quizData.zadania[i][2];
        }
    }
    return wynik;
}

function wstawZapis() {
    let wynikText;
    wynikText = document.createElement('div');
    wynikText.innerHTML = "Twój wynik to " + wynik;
    elWstep.appendChild(wynikText);

    appendSubmit(elWstep, "Zapisz sam wynik");
    // TODO dodaj reakje po kliknieciu
    appendSubmit(elWstep, "Zapisz wynik + Statystyki");
}

function appendSubmit(father : HTMLElement, value : string) : HTMLInputElement{
    let submit = document.createElement('input');
    submit.setAttribute('type', 'submit');
    submit.setAttribute('value', value);
    father.appendChild(submit);
    return submit;
}

elSkoncz.addEventListener('click', () => {
    clearInterval(Interwal);
    wynik = policzWynik();

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
        wstawZapis();
    });

});
/*elStartowy.style.display = "block";
elQuiz.style.display = "none";
elSkoncz.setAttribute('disabled', 'yes');
act=0;
elOdpowiedz.value = "";*/
