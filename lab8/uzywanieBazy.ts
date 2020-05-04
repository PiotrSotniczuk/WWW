import * as sqlite3 from "sqlite3";

function wpiszDane() {


    sqlite3.verbose();
    let db = new sqlite3.Database('baza.db');
    db.run('INSERT INTO wyswietlenia (sciezka, liczba) VALUES ("a", 1), ("b",2);');
    console.log("wpisano");
    db.close();
}

wpiszDane();

sqlite3.verbose();
let db = new sqlite3.Database('baza.db');

db.all('SELECT sciezka, liczba FROM wyswietlenia;', [], (err, rows) => {
    if (err) throw(err);

    for(let {sciezka, liczba} of rows) {
        console.log(sciezka, '->', liczba);
    }
    db.close();
});

