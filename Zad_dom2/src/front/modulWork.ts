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
export function wstawZapis(wynik : string) : void {
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
	const elStatTw = document.getElementById("statTwoje");
	const elStatIn = document.getElementById("statInnych");
	const elOdpowiedz = document.getElementById("odpowiedz") as HTMLInputElement;
	const quizSize = tables.Pytania.length;
	const elSrednio = document.getElementById("srednio");

	// zmien stan(nr pytania, kare, czerwone tlo)
	elNrPytania.innerHTML = "Nr. Pytania: " + (aktPyt+1).toString() + "/" + quizSize;
	elKara.innerHTML = "Ew. kara: " + tables.Pytania[aktPyt].punish;
	elStatTw.innerHTML = "Spedziłeś tu: " + parseFloat(tables.Statystyki[aktPyt]).toFixed(2) + " s<br>";
	elSrednio.innerHTML = "Inni spedzali tu srednio: ";
	if(isNaN(tables.Srednio[aktPyt])){
		elSrednio.innerHTML += "brak danych<br>";
	}else{
		elSrednio.innerHTML += parseFloat(tables.Srednio[aktPyt]).toFixed(2) + " s<br>";
	}
	elStatIn.innerHTML = "A najlepsi:<br>";
	for(const stat of tables.Najlepsi){
		elStatIn.innerHTML += "<li>" + stat.nick + ": " + parseFloat(stat.points).toFixed(2) + "</li>"
	}

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
	const elNowyQuiz = document.getElementById("nowyQuiz");
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
	elNowyQuiz.innerHTML ='<form method="POST" action="/newQuiz">'+
	'<input type="hidden" name="_csrf" value="'+ csrfCookie +'">'+
	'Write quiz in this format:  <br>'+
	'{"name":"example","questions":[{"content":"0 + 0","answer":0,"punish":0},'+
	'{"content":"3 + 3","answer":6,"punish":3}]} <br>' +
	'<input type="text" name="newQuiz"  style="width:300px"><br>'+
	'<input type="submit" value="Send">'+
	'</form>';
}