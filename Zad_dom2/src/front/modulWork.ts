import {Question} from "./main.js";
import { wyswietlListe } from "./modulDB.js";

// dodaj przycisk do rodzica
export function dodajSubmit(father : HTMLElement, value : string) : HTMLInputElement {
	const submit = document.createElement('input');
	submit.setAttribute('type', 'submit');
	submit.setAttribute('value', value);
	father.appendChild(submit);
	return submit;
}

export function inicjujTablice ( tablica : any[], length, wartosc) {
	for(let i=0; i<length; i++){
		tablica.push(wartosc);
	}
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
export function wypelnijStrone(aktPyt : number, tables : any, trybSpr : boolean) : void {
	const elNrPytania = document.getElementById("nrPytania");
	const elPytanie = document.getElementById("pytanie");
	const elKara = document.getElementById("kara");
	const elOdpowiedz = document.getElementById("odpowiedz") as HTMLInputElement;
	const quizSize = tables.Pytania.length;

	// zmien stan(nr pytania, kare, czerwone tlo)
	elNrPytania.innerHTML = "Nr. Pytania: " + (aktPyt+1).toString() + "/" + quizSize;
	elKara.innerHTML = "Ew. kara: " + tables.Pytania[aktPyt].punish;
	// TODO
	if (trybSpr === true &&  tables.Odpowiedzi[aktPyt] !== tables.Poprawne[aktPyt]){
		elKara.style.backgroundColor = "red";
	}else {
		elKara.style.backgroundColor = "";
	}

	// zmien pytanie
	elPytanie.innerHTML = tables.Pytania[aktPyt].content + " = ";
	if (trybSpr === true){
		elPytanie.innerHTML += tables.Poprawne[aktPyt];
	}

	// wpisz jesli juz na to odpowiedzial
	elOdpowiedz.value = tables.Odpowiedzi[aktPyt];

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

export function getCookie(cname) : string {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for(var i = 0; i <ca.length; i++) {
	  var c = ca[i];
	  while (c.charAt(0) == ' ') {
		c = c.substring(1);
	  }
	  if (c.indexOf(name) == 0) {
		return c.substring(name.length, c.length);
	  }
	}
	return "";
  }

export function loadSiteAndCsrf(){
	const username : string = getCookie('USER_LOGGED');
	const elLogin = document.getElementById("logowanie");
	const csrfCookie : string = getCookie('CSRF');
	document.getElementById("quiz").style.display = "none";
	if(username.length > 0){
		document.getElementById("startowy").style.display = "block";
		elLogin.innerHTML = "<a href='/logout'> WYLOGUJ </a>" + username +
		'<form method="POST" action="/changePass">'+
			'<input type="hidden" name="_csrf" value="'+ csrfCookie +'">'+
			'Hasło:<input type="password" name="oldPass"><br>'+
			'Nowe Hasło:<input type="password" name="newPass"><br>'+
			'<input type="submit" value="Zmień">'+
		'</form>';
		wyswietlListe();
	}else{
		document.getElementById("startowy").style.display = "none";
		elLogin.innerHTML = '<form method="POST" action="/login">'+
			'<input type="hidden" name="_csrf" value="'+ csrfCookie +'">'+
			'Login:<input type="text" name="nick"><br>'+
			'Password:<input type="password" name="password"><br>'+
			'<input type="submit" value="Login">'+
		'</form>';
	}
}