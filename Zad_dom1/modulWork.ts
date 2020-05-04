import {IQuiz} from "./main.js";

// dodaj przycisk do rodzica
export function dodajSubmit(father : HTMLElement, value : string) : HTMLInputElement {
	const submit = document.createElement('input');
	submit.setAttribute('type', 'submit');
	submit.setAttribute('value', value);
	father.appendChild(submit);
	return submit;
}

export function inicjujTablice ( tablica, wartosc) {
	for(let i=0; i<tablica.length; i++){
		tablica[i] = wartosc;
	}
}

export function policzWynik(sek : number, Odp : string[], quizData : IQuiz) : number {
	let i;
	let wynik = sek;
	for( i = 0; i < Odp.length; i++){
		if(Odp[i] !== quizData.zadania[i][1].toString()){
			wynik += quizData.zadania[i][2];
		}
	}
	return wynik;
}

// pokazuje wynik w lewym gornym rogu
export function wstawZapis(wynik : number) : void {
	document.getElementById("poSkonczeniu").style.display = "block";
	document.getElementById("wynikText").innerHTML = "Twój wynik to " + wynik;
}

// klasa obslugujaca timer
export class TimerClass {
	sekundy : number;
	constructor(){
		this.sekundy = 0;
	}
	pchnijTimer(Statystyki : number[], aktPyt : number) : void {
		this.sekundy++;
		document.getElementById("czas").innerHTML = "Czas: " + this.sekundy + "sek";
		Statystyki[aktPyt]++;
	}
	getSekundy() : number {
		return this.sekundy;
	}
	setSekundy(sek : number) : void {
		this.sekundy = sek;
	}
}

// wypelnia strone aktualnym pytaniem
export function wypelnijStrone(aktPyt : number,
                               Odpowiedzi : string[], quizData : IQuiz, trybSpr : boolean) : void {
	const elNrPytania = document.getElementById("nrPytania");
	const elPytanie = document.getElementById("pytanie");
	const elKara = document.getElementById("kara");
	const elOdpowiedz = document.getElementById("odpowiedz") as HTMLInputElement;
	const quizSize = Odpowiedzi.length;

	// zmien stan(nr pytania, kare, czerwone tlo)
	elNrPytania.innerHTML = "Nr. Pytania: " + (aktPyt+1).toString() + "/" + quizSize;
	elKara.innerHTML = "Ew. kara: " + quizData.zadania[aktPyt][2];
	if (trybSpr === true &&  Odpowiedzi[aktPyt] !== quizData.zadania[aktPyt][1].toString()){
		elKara.style.backgroundColor = "red";
	}else {
		elKara.style.backgroundColor = "";
	}

	// zmien pytanie
	elPytanie.innerHTML = quizData.zadania[aktPyt][0] + " = ";
	if (trybSpr === true){
		elPytanie.innerHTML += quizData.zadania[aktPyt][1];
	}

	// wpisz jesli juz na to odpowiedzial
	elOdpowiedz.value = Odpowiedzi[aktPyt];

	// zablokuj/odblokuj przyciski nawigacji
	const elDalej = document.getElementById("dalej");
	const elWstecz = document.getElementById("wstecz");
	if(aktPyt === 0){
		elWstecz.setAttribute('disabled', 'yes');
	}else{
		elWstecz.removeAttribute('disabled');
	}
	if(aktPyt === (quizSize - 1)){
		elDalej.setAttribute('disabled', 'yes');
	}else{
		elDalej.removeAttribute('disabled');
	}
}