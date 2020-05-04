import * as sqlite3 from 'sqlite3';

function zalozBaze() {
    sqlite3.verbose();
    let db = new sqlite3.Database('baza.db');
    db.run('CREATE TABLE wyswietlenia (sciezka VARCHAR(255), liczba INT);');
    db.close();
    console.log("zalozona");
}

zalozBaze();