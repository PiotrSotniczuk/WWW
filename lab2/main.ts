let formularz = document.getElementById('formularz');
formularz.addEventListener('input',NaprawPrz);
formularz.addEventListener('reset', NaprawPrz);

function takeInput(what : string) : string{
    switch (what) {
        case 'imie':
            return (document.querySelector
            ("div.dane_os input[name='Imie']") as HTMLInputElement).value;
        case 'nazwisko':
            return (document.querySelector
            ("div.dane_os input[name='Nazwisko']") as  HTMLInputElement).value;
        case 'skad':
            return (document.querySelector
            ("select[name='Skad']") as HTMLInputElement).value;
        case 'dokad':
            return (document.querySelector
            ("select[name='Dokad']") as  HTMLInputElement).value;
        case 'data':
            return (document.querySelector
            ("input[type='date']") as  HTMLInputElement).value;
    }
}


function SprDane(){
    const data = new Date(takeInput('data'));

    let today = new Date();
    if(takeInput('imie') && takeInput('nazwisko') &&
        takeInput('skad') !== takeInput('dokad') && data >= today){
        console.log("dobrze")
        return true;
    }
    console.log("zle");
    return false;
}

function NaprawPrz(ev : Event){
    console.log("jest");
    if(SprDane() && ev.type !== 'reset'){
        document.querySelector("[type='submit']").removeAttribute('disabled');
    }else{
        document.querySelector("[type='submit']").setAttribute('disabled', 'yes');
    }
}

formularz.addEventListener('submit', Pokaz);
function Pokaz(ev : Event) {
    console.log("klikniete");

    ev.preventDefault();

    let rezerwacja = document.createElement('div');
    rezerwacja.setAttribute('class', 'block');
    document.querySelector('body').appendChild(rezerwacja);

    let text = document.createElement('div');
    text.setAttribute('class', 'block_text');

    const godz = (document.querySelector
    ("select[name='Godzina']") as  HTMLInputElement).value;


    text.innerHTML = takeInput('imie') + ' ' + takeInput('nazwisko') + '\n'
        + takeInput('skad') + ' ' + takeInput('dokad') + '\n' +
        takeInput('data') + ' ' + godz + '\n';

    rezerwacja.appendChild(text);
}


