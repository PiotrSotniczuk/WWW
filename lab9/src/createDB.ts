import * as sqlite from 'sqlite3';

sqlite.verbose();

async function createMemeTableMemIfNeeded(db: sqlite.Database): Promise<void> {
    return new Promise((resolve, reject) => {
        db.all(`SELECT COUNT(*) AS cnt FROM sqlite_master WHERE type='table' and name='memes';`, (err, rows) => {
            if (err) {
                reject('DB Error mem');
                return;
            }

            if (rows[0].cnt === 1) {
                console.log('Database tables mem already exist.');
                resolve();
                return;
            }

            console.log('Creating database tables mem...');
            db.run(`CREATE TABLE memes (
              id INTEGER PRIMARY KEY,
              name TEXT,
              url TEXT,
              last_id INTEGER);`, [], (err1: any) => {
                if (err1) {
                    reject('DB Error mem');
                    return;
                }
                console.log('Done mem.');
                resolve();
            });
        });
    })
}

async function createMemeTablesPricesIfNeeded(db: sqlite.Database): Promise<void> {
    return new Promise((resolve, reject) => {
        db.all(`SELECT COUNT(*) AS cnt FROM sqlite_master WHERE type='table' and name='prices';`, (err, rows) => {
            if (err) {
                reject('DB Error');
                return;
            }

            if (rows[0].cnt === 1) {
                console.log('Database tables price already exist.');
                resolve();
                return;
            }

            console.log('Creating database tables prices...');
            db.run(`CREATE TABLE prices (
              id INTEGER,
              price INTEGER NOT NULL,
              mem_id INTEGER,
              PRIMARY KEY(mem_id, id),
              FOREIGN KEY(mem_id) REFERENCES memes(id));`, [], (err1: any) => {
                if (err1) {
                    reject('DB Error');
                    return;
                }
                console.log('Done. price');
                resolve();
            });
        });
    })
}

const myDB = new sqlite.Database('memes.db');
createMemeTableMemIfNeeded(myDB).then(async () => {
    console.log("Mem table ended");
    createMemeTablesPricesIfNeeded(myDB).then(async () =>{
        console.log("Price table ended");
    });
});