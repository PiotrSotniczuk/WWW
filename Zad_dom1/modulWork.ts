import {IQuiz, aktPyt} from "./main.js";
export function appendSubmit(father : HTMLElement, value : string) : HTMLInputElement {
    let submit = document.createElement('input');
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

export function policzWynik(sek : number, Odp : Array<number>, quizData : IQuiz) : number {
    let i;
    let wynik = sek;
    for( i = 0; i < Odp.length; i++){
        if(Odp[i] != quizData.zadania[i][1]){
            wynik += quizData.zadania[i][2];
        }
    }
    return wynik;
}

export function wstawZapis(wynik : number) {
    document.getElementById("poSkonczeniu").style.display = "block";
    document.getElementById("wynikText").innerHTML = "Twój wynik to " + wynik;
}

export class timerClass {
    sekundy : number;
    constructor(){
        this.sekundy = 0;
    }
    pchnijTimer(Statystyki : Array<number>) : void {
        this.sekundy++;
        document.getElementById("czas").innerHTML = "Czas: " + this.sekundy + "sek";
        Statystyki[aktPyt]++;
    }
    getSekundy() : number {
        return this.sekundy;
    }
    setSekundy(sek : number) {
        this.sekundy = sek;
    }
}