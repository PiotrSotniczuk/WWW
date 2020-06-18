import {zapiszWynik, getJSON} from "./modulDB.js";
import {dodajSubmit, inicjujTablice, TimerClass, 
	wypelnijStrone, wstawZapis, loadSiteAndCsrf} from "./modulWork.js";


export interface Question{
    content : string,
    punish : number
}

let questions : Question[];
let quizSize : number;

// elementy czesto używane nie chce ich za kazdym razem szukac
const elSkoncz = document.getElementById("skoncz");
const elStartowy = document.getElementById("startowy");
const elQuiz = document.getElementById("quiz");
const elOdpowiedz = document.getElementById("odpowiedz") as HTMLInputElement;
const elPoSkonczeniu = document.getElementById("poSkonczeniu");
const elNick = document.getElementById("nick") as HTMLInputElement;
const elQuizy = document.getElementById('quizy') as HTMLFormElement;

// zmienne globalne
let Interwal;
let aktPyt : number = 0;
const Odpowiedzi : string[] = new Array(quizSize);
const Statystyki : number[] = new Array(quizSize);
inicjujTablice(Odpowiedzi, "");
inicjujTablice(Statystyki, 0);
const timer : TimerClass = new TimerClass();
let trybSpr : boolean = false;
let wynik : number = 0;
let nick : string = "";

loadSiteAndCsrf();

// reinicjalizacja zmiennych
export function odnowGlob(){
	aktPyt = 0;
	elOdpowiedz.value = "";
	timer.setSekundy(0);
	trybSpr = false;
	inicjujTablice(Odpowiedzi, "");
	inicjujTablice(Statystyki, 0);
	nick = "";

	// wyświetlenie strony startowej
	// TODO wyswietlRanking();
	elNick.value = "Twój-nick";
	elStartowy.style.display = "block";
	elQuiz.style.display = "none";
	elSkoncz.setAttribute('disabled', 'yes');
	elOdpowiedz.removeAttribute('disabled');
	elPoSkonczeniu.style.display = "none";
}

// strona Quizu
export function startujQuiz(quiz_id : number){
	getJSON('/quiz/'+ quiz_id).then(result => {
		console.log(result);
		questions = result;
		quizSize = questions.length;
		elStartowy.style.display = "none";
		elQuiz.style.display = "grid";
		wypelnijStrone(aktPyt, Odpowiedzi, questions, trybSpr);
		// o dziwo bez opakowania funkcja pchnijTimer nie widziala swoich atrybutów
		Interwal = setInterval(() => {timer.pchnijTimer(Statystyki, aktPyt);}, 1000);
	}).catch(() => {console.log('error getting questions');});
};

// nastepne pytanie
document.getElementById("dalej").addEventListener('click', () => {
	aktPyt++;
	wypelnijStrone(aktPyt, Odpowiedzi, questions, trybSpr);
});

// poprzednie pytanie
document.getElementById("wstecz").addEventListener('click', () => {
	aktPyt--;
	wypelnijStrone(aktPyt, Odpowiedzi, questions, trybSpr);
});

// anuluj Quiz
document.getElementById("anuluj").addEventListener('click', () => {
	clearInterval(Interwal);
	odnowGlob();
});

// zapisz odpowiedz sprawdz czy mozna skonczyc
elOdpowiedz.addEventListener('input', () => {
	Odpowiedzi[aktPyt] = elOdpowiedz.value;
	for (const odp of Odpowiedzi){
		if(odp === undefined || odp === ""){
			elSkoncz.setAttribute('disabled', 'yes');
			return;
		}
	}
	elSkoncz.removeAttribute('disabled');
});

// zapisz sam wynik
document.getElementById("bezZap").addEventListener('click', () => {
	zapiszWynik(wynik, nick, null, Odpowiedzi);
});

// zapisz ze statystykami
document.getElementById("zZap").addEventListener('click',() => {
	zapiszWynik(wynik, nick, Statystyki, Odpowiedzi);
});

// pokaz popup z wynikiem
elSkoncz.addEventListener('click', () => {
	clearInterval(Interwal);

	// stworz popup i napisz w nim
	// TODO wynik = policzWynik(timer.getSekundy(), Odpowiedzi, questions);
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
		wypelnijStrone(aktPyt, Odpowiedzi, questions, trybSpr);
		wstawZapis(wynik);
	});
});
