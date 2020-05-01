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
console.log(quizData.zadania);

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


// zmienne
let Interwal;
let aktPyt = 0;
let Odpowiedzi = new Array(quizSize);
let sekundy = 0;

function pushTimer() {
    sekundy++;
    elCzas.innerHTML = "Czas: " + sekundy.toString() + "sek";
    // TODO statystyki[]++
}

function fillForms(move : number) {
    Odpowiedzi[aktPyt] = elOdpowiedz.value;
    console.log(elOdpowiedz.value);
    aktPyt += move;
    // zmien stan
    elNrPytania.innerHTML = "Nr. Pytania: " + (aktPyt+1).toString() + "/" + quizSize;
    elKara.innerHTML = "Ew. kara: " + quizData.zadania[aktPyt][2];

    // zmien pytanie
    elPytanie.innerHTML = quizData.zadania[aktPyt][0] + " = ";

    // wpisz jesli juz na to odpowiedzial
    elOdpowiedz.value = Odpowiedzi[aktPyt];

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

elStartButton.addEventListener('click', StartQuiz);
function StartQuiz(ev : MouseEvent) {
    console.log("kliknieteee zaczynamy");
    elStartowy.style.display = "none";
    elQuiz.style.display = "grid";
    fillForms(0);
    Interwal = setInterval(pushTimer, 1000);
}

elDalej.addEventListener('click', fillDalej);
function fillDalej(ev : MouseEvent) {
    fillForms(1);
}

elWstecz.addEventListener('click', fillWstecz);
function fillWstecz(ev : MouseEvent) {
    fillForms(-1);
}

