//npx tsc -lib es2016,dom main.ts

//let opoznione = document.getElementById('');
//
//
//function fib(n : number): number{
//    if(n<2) return n;
//    return fib(n-1) + fib(n-2);
//}
//
//function policzFib(ev: MouseEvent){
//    
//}

let formularz = document.getElementById('formularz');
formularz.addEventListener('input',NaprawPrz);


function SprDane(){
    const im = (document.querySelector
    ("div.dane_os input[name='Imie']") as HTMLInputElement).value;
    const nazw = (document.querySelector
    ("div.dane_os input[name='Nazwisko']") as  HTMLInputElement).value;
    const skad = (document.querySelector
    ("select[name='Skad']") as HTMLInputElement).value;
    const dokad = (document.querySelector
    ("select[name='Dokad']") as  HTMLInputElement).value;
    const data = (document.querySelector
    ("input[type='date']") as  HTMLInputElement).value;


    if(im && nazw && skad != dokad && data > Date.now().toString()){
        console.log("dobrze")
        return true;
    }
    console.log("zle");
    return false;
}

function NaprawPrz(ev : InputEvent){
    console.log("jest");
    if(SprDane()){
        document.querySelector("[type='button']").removeAttribute('disabled');
    }else{
        document.querySelector("[type='button']").setAttribute('disabled', 'yes');
    }
}

let potwierdzenie = document.querySelector("input[type='button']");
potwierdzenie.addEventListener('click', Pokaz);

function Pokaz(ev : MouseEvent) {
    console.log("klikniete");

    let rezerwacja = document.createElement('div');
    rezerwacja.setAttribute('class', 'block');
    document.querySelector('body').appendChild(rezerwacja);

    let text = document.createElement('div');
    text.setAttribute('class', 'block_text');

    const im = (document.querySelector
    ("div.dane_os input[name='Imie']") as HTMLInputElement).value;
    const nazw = (document.querySelector
    ("div.dane_os input[name='Nazwisko']") as  HTMLInputElement).value;
    const skad = (document.querySelector
    ("select[name='Skad']") as HTMLInputElement).value;
    const dokad = (document.querySelector
    ("select[name='Dokad']") as  HTMLInputElement).value;
    const data = (document.querySelector
    ("input[type='date']") as  HTMLInputElement).value;
    const godz = (document.querySelector
    ("select[name='Godzina']") as  HTMLInputElement).value;


    text.innerHTML = im + ' ' + nazw + '\n' + skad + ' ' + dokad + '\n' + data + ' ' + godz + '\n';

    rezerwacja.appendChild(text);



}


