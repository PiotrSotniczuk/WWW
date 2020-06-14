import * as sqlite from 'sqlite3';
import { MemStore } from './memStore';
import { MemClass } from './mem';
import { LoginStore } from './loginStore';

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
              last_nr INTEGER);`, [], (err1: any) => {
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
              nr INTEGER,
              price INTEGER NOT NULL,
              mem_id INTEGER,
              nick TEXT,
              PRIMARY KEY(mem_id, nr),
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

async function createUserIfNeeded(db: sqlite.Database): Promise<void> {
    return new Promise((resolve, reject) => {
        db.all(`SELECT COUNT(*) AS cnt FROM sqlite_master WHERE type='table' and name='users';`, (err, rows) => {
            if (err) {
                reject('DB Error');
                return;
            }

            if (rows[0].cnt === 1) {
                console.log('Database tables price already exist.');
                resolve();
                return;
            }

            console.log('Creating database users...');
            db.run(`CREATE TABLE users (
              nick TEXT PRIMARY KEY,
              password TEXT);`, [], (err1: any) => {
                if (err1) {
                    reject('DB Error');
                    return;
                }
                console.log('Done. users');
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
        createUserIfNeeded(myDB).then(async () => {
            console.log("user table ended");
            myDB.close();
            console.log("add data");

            const store : MemStore = new MemStore('memes.db');
            const loginStore : LoginStore = new LoginStore('memes.db');

            store.addMeme(new MemClass(10, 'Gold', [100],
            'https://i.redd.it/h7rplf9jt8y21.png', [""])).then( () => {
                console.log('addMeme Gold OK');
            }).catch(() => {
                console.log('addMeme Gold in base');
            });

            store.addMeme(new MemClass(9, 'Platinium', [1100],
            'http://www.quickmeme.com/img/90/90d3d6f6d527a64001b79f4e13bc61912842d4a5876d17c1f011ee519d69b469.jpg', [""]))
            .then(() => {
                console.log('addMeme Plat OK');
            }).catch(() => {
                console.log('addMeme Plat in base');
            });

            store.addMeme(new MemClass(8, 'Elite', [120],
            'https://i.imgflip.com/30zz5g.jpg', [""])).then(() => {
                console.log('addMeme Elite OK');
            }).catch(() => {
                console.log('addMeme Elite in base');
            });

            store.addMeme(new MemClass(7, 'Bronze', [700],
            'http://www.gazetamiedzyszkolna.pl/wp-content/uploads/2016/02/macgyver-MEM-752x440.png', [""])).then(() => {
                console.log('addMeme Bronze OK');
            }).catch(() => {
                console.log('addMeme Bronze in base');
            });

            store.addMeme(new MemClass(6, 'Sad', [999],
            'https://i.pinimg.com/236x/6d/ee/bc/6deebc8a47ecfaf39cc8a8574a77599f.jpg', [""])).then(() => {
                console.log('addMeme Sad OK');
            }).catch(() => {
                console.log('addMeme Sad in base');
            });

            loginStore.addUser('user', 'user').then(() => {
                console.log('add user OK');
            }).catch(() => {
                console.log('add user in base');
            });

            loginStore.addUser('admin', 'admin').then(() => {
                console.log('add admin OK');
            }).catch(() => {
                console.log('add admin in base');
            });
        });
    });
});