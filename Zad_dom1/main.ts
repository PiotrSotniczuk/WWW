// typy
type Pyt = string;
type Odp = number;
type Kara = number;

type IPytanie = [Pyt, Odp, Kara];

interface IQuiz {
    zadania: IPytanie[];
}

// parsowanie danych do quizu
let jsonString: string = `{
    "zadania": [["2 + 3", 5, 5], ["2 -(-24:4)", 8, 20], ["2 * 9", 18, 10], ["4 + 8", 12, 10]]
}`;

let quizData = JSON.parse(jsonString);
console.log(quizData.zadania);

// https://codepen.io/cathydutton/pen/GBcvo
// const tab = new Array(10); do statystyk
// TODO max widh html
// co jk smartfon
// przeskawinaie onclick

let elStartButton = document.querySelector("input[value='Start']");
elStartButton.addEventListener('click', StartQuiz);

let elStartowy = document.getElementById("startowy");
let elQuiz = document.getElementById("quiz");
let elCzas = document.getElementById("czas");
let elNrPytania = document.getElementById("nrPytania");
let elPytanie = document.getElementById("pytanie");

let Interwal;
let akt = 0;

let sekundy = 0;
function pushTimer() {
    sekundy++;
    elCzas.innerHTML = "Czas: " + sekundy.toString() + "sek";
    //statystyki[]++
}

function fillForms(move : number) {
    akt += move;
    elNrPytania.innerHTML = "Nr. Pytania: " + (akt+1).toString() + "/" + quizData.zadania.length;
    elPytanie.innerHTML = quizData.zadania[akt][0] + " = ";

}

function StartQuiz(ev : MouseEvent) {
    console.log("kliknieteee zaczynamy");
    elStartowy.style.display = "none";
    elQuiz.style.display = "grid";
    fillForms(0);
    Interwal = setInterval(pushTimer, 1000);


}



