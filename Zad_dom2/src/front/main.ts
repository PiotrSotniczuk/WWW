import {zapiszWynik, getJSON} from "./modulDB.js";
import {dodajSubmit, inicjujTablice, TimerClass, 
	wypelnijStrone, wstawZapis, loadSiteAndCsrf, getCookie} from "./modulWork.js";


export interface Question{
    content : string,
    punish : number
}

let questions : Question[];
let quizSize : number;
let act_quiz_id : number;

// elementy czesto używane nie chce ich za kazdym razem szukac
const elStartowy = document.getElementById("startowy");
const elQuiz = document.getElementById("quiz");
const elOdpowiedz = document.getElementById("odpowiedz") as HTMLInputElement;
const elPoSkonczeniu = document.getElementById("poSkonczeniu");
const elNick = document.getElementById("nick") as HTMLInputElement;
const elWyslij = document.getElementById('wyslij') as HTMLFormElement;

// zmienne globalne
let Interwal;
let aktPyt : number = 0;
let Odpowiedzi : string[];
let Statystyki : number[];
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
	document.getElementById('skoncz').setAttribute('disabled', 'yes');
	elOdpowiedz.removeAttribute('disabled');
	elPoSkonczeniu.style.display = "none";
}

// strona Quizu
export function startujQuiz(quiz_id : number){
	getJSON('/quiz/'+ quiz_id).then(result => {
		console.log(result);
		questions = result;
		quizSize = questions.length;
		Odpowiedzi = new Array(quizSize);
		Statystyki = new Array(quizSize);
		inicjujTablice(Odpowiedzi, "");
		inicjujTablice(Statystyki, 0);
		act_quiz_id = quiz_id;
		elWyslij.setAttribute('action', '/quiz/' + quiz_id);
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
			document.getElementById('skoncz').setAttribute('disabled', 'yes');
			return;
		}
	}
	document.getElementById('skoncz').removeAttribute('disabled');
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
elWyslij.addEventListener('submit', (event) => {
	clearInterval(Interwal);

	// stworz popup i napisz w nim
	// TODO wynik = policzWynik(timer.getSekundy(), Odpowiedzi, questions);
	let Stats_proc : number[] = [];
	let sum = 0;
	for(const stat of Statystyki){
		sum += stat;
	}
	for(const stat of Statystyki){
		Stats_proc.push(100*stat/sum); 
	}
	const answers = {ans : Odpowiedzi, stats : Stats_proc, _csrf : getCookie('CSRF'+ "heh")}
	fetch('/quiz/' + act_quiz_id, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
			// 'Content-Type': 'application/x-www-form-urlencoded',
		  },
		body: JSON.stringify(answers)
	});
	
	//const popup = document.createElement('div');
	//popup.setAttribute('class', 'block');
	//document.querySelector('body').appendChild(popup);
	//const text = document.createElement('div');
	//text.setAttribute('class', 'block_text');
	//text.innerHTML = "Twój wynik to " + wynik + "pkt";
	//popup.appendChild(text);
//
	//dodajSubmit(popup, 'Zobacz Odpowiedzi').
	//addEventListener('click', () => {
	//	elOdpowiedz.setAttribute('disabled', 'yes');
	//	elSkoncz.setAttribute('disabled', 'yes');
	//	trybSpr = true;
	//	popup.remove();
	//	wypelnijStrone(aktPyt, Odpowiedzi, questions, trybSpr);
	//	wstawZapis(wynik);
	//});
});
