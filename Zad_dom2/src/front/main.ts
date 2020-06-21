import {getJSON} from "./modulDB.js";
import {dodajSubmit, inicjujTablice, TimerClass, 
	wypelnijStrone, wstawZapis, loadSiteAndCsrf, getCookie} from "./modulWork.js";


export interface Question{
    content : string,
    punish : number
}

let quizSize : number;
let act_quiz_id : number;

// elementy czesto używane nie chce ich za kazdym razem szukac
const elStartowy = document.getElementById("startowy");
const elQuiz = document.getElementById("quiz");
const elOdpowiedz = document.getElementById("odpowiedz") as HTMLInputElement;
const elPoSkonczeniu = document.getElementById("poSkonczeniu");
const elNick = document.getElementById("nick") as HTMLInputElement;

// zmienne globalne
let Interwal;
let aktPyt : number = 0;
let tables = {
	Odpowiedzi : [],
	Statystyki : [],
	Poprawne : [],
	Pytania : [],
	Najlepsi : [],
	Srednio : []
}
const timer : TimerClass = new TimerClass();
let trybSpr : boolean = false;
let wynik : string = "";
let nick : string = "";

loadSiteAndCsrf();

// reinicjalizacja zmiennych
export function odnowGlob(){
	aktPyt = 0;
	elOdpowiedz.value = "";
	timer.setSekundy(0);
	trybSpr = false;
	inicjujTablice(tables.Odpowiedzi, quizSize, "");
	inicjujTablice(tables.Statystyki, quizSize, 0);
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
		tables.Pytania = result;
		quizSize = tables.Pytania.length;
		inicjujTablice(tables.Odpowiedzi, quizSize, "");
		inicjujTablice(tables.Statystyki, quizSize, 0);
		act_quiz_id = quiz_id;
		elStartowy.style.display = "none";
		elQuiz.style.display = "grid";
		wypelnijStrone(aktPyt, tables, trybSpr);
		// o dziwo bez opakowania funkcja pchnijTimer nie widziala swoich atrybutów
		Interwal = setInterval(() => {timer.pchnijTimer(tables.Statystyki, aktPyt);}, 1000);
	}).catch(() => {console.log('error getting questions');});
};

export function przejrzyjQuiz(quiz_id : number){
	getJSON('/quiz/'+ quiz_id).then(result => {
		console.log(result);
		tables.Pytania = result;
		quizSize = tables.Pytania.length;
		act_quiz_id = quiz_id;

		getJSON('/results/' + quiz_id).then(result => {
			console.log(result);
			tables.Odpowiedzi = result.user_ans;
			tables.Statystyki = result.times;
			tables.Poprawne = result.corr_ans;
			tables.Najlepsi = result.best;
			tables.Srednio = result.avg;
			wynik = parseFloat(result.points).toFixed(2);
			elStartowy.style.display = "none";
			elQuiz.style.display = "grid";
	
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
				document.getElementById('skoncz').setAttribute('disabled', 'yes');
				trybSpr = true;
				popup.remove();
				wypelnijStrone(aktPyt, tables, trybSpr);
				wstawZapis(wynik);
			});
		});
		
	}).catch(() => {console.log('error getting questions');});
}

// nastepne pytanie
document.getElementById("dalej").addEventListener('click', () => {
	aktPyt++;
	wypelnijStrone(aktPyt, tables, trybSpr);
});

// poprzednie pytanie
document.getElementById("wstecz").addEventListener('click', () => {
	aktPyt--;
	wypelnijStrone(aktPyt, tables, trybSpr);
});

// anuluj Quiz
document.getElementById("anuluj").addEventListener('click', () => {
	location.reload();
});

// zapisz odpowiedz sprawdz czy mozna skonczyc
elOdpowiedz.addEventListener('input', () => {
	tables.Odpowiedzi[aktPyt] = elOdpowiedz.value;
	for (const odp of tables.Odpowiedzi){
		if(odp === undefined || odp === ""){
			document.getElementById('skoncz').setAttribute('disabled', 'yes');
			return;
		}
	}
	document.getElementById('skoncz').removeAttribute('disabled');
});

document.getElementById('skoncz').addEventListener('click', async () => {
	clearInterval(Interwal);

	let Stats_proc : number[] = [];
	let sum = 0;
	for(const stat of tables.Statystyki){
		sum += stat;
	}
	for(const stat of tables.Statystyki){
		Stats_proc.push(100*stat/sum); 
	}
	const answers = {ans : tables.Odpowiedzi, stats : Stats_proc, _csrf : getCookie('CSRF')}
	const response = await fetch('/quiz/' + act_quiz_id, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
			// 'Content-Type': 'application/x-www-form-urlencoded',
		  },
		body: JSON.stringify(answers)
	});

	const com : string = (await response.json()).com;
	if(com !== "OK"){
		alert(com);
		location.reload();
	}else{
		location.reload();
	}
});
