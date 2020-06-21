import * as sqlite from 'sqlite3';
import { LoginStore } from './loginStore';
import { Question, QuizStore, QuizToAdd} from './quizStore';

sqlite.verbose();

async function createQuizesIfNeeded(db: sqlite.Database): Promise<void> {
    return new Promise((resolve, reject) => {
        db.all(`SELECT COUNT(*) AS cnt FROM sqlite_master WHERE type='table' and name='quizes';`, (err, rows) => {
            if (err) {
                reject('DB Error quiz');
                return;
            }

            if (rows[0].cnt === 1) {
                console.log('Database tables quizes already exist.');
                resolve();
                return;
            }

            db.run(`CREATE TABLE quizes (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              name TEXT UNIQ);`, [], (err1: any) => {
                if (err1) {
                    reject('DB Error quiz');
                    return;
                }
                console.log('Done quizes.');
                resolve();
            });
        });
    })
}

async function createQuestionsIfNeeded(db: sqlite.Database): Promise<void> {
    return new Promise((resolve, reject) => {
        db.all(`SELECT COUNT(*) AS cnt FROM sqlite_master WHERE type='table' and name='questions';`, (err, rows) => {
            if (err) {
                reject('DB Error');
                return;
            }

            if (rows[0].cnt === 1) {
                console.log('Database tables questions already exist.');
                resolve();
                return;
            }

            db.run(`CREATE TABLE questions (
              nr INTEGER NOT NULL,
              content TEXT NOT NULL,
              punish INTEGER NOT NULL,
              answer INTEGER NOT NULL,
              quiz_id INTEGER NOT NULL,
              PRIMARY KEY(quiz_id, nr),
              FOREIGN KEY(quiz_id) REFERENCES quizes(id));`, [], (err1: any) => {
                if (err1) {
                    reject('DB Error');
                    return;
                }
                console.log('Done. questions');
                resolve();
            });
        });
    })
}

async function createUsersIfNeeded(db: sqlite.Database): Promise<void> {
    return new Promise((resolve, reject) => {
        db.all(`SELECT COUNT(*) AS cnt FROM sqlite_master WHERE type='table' and name='users';`, (err, rows) => {
            if (err) {
                reject('DB Error');
                return;
            }

            if (rows[0].cnt === 1) {
                console.log('Database tables user already exist.');
                resolve();
                return;
            }

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

async function createDoneIfNeeded(db: sqlite.Database): Promise<void> {
    return new Promise((resolve, reject) => {
        db.all(`SELECT COUNT(*) AS cnt FROM sqlite_master WHERE type='table' and name='done';`, (err, rows) => {
            if (err) {
                reject('DB Error');
                return;
            }

            if (rows[0].cnt === 1) {
                console.log('Database tables done already exist.');
                resolve();
                return;
            }

            db.run(`CREATE TABLE done (
              user_nick TEXT,
              quiz_id INTEGER,
              start INTEGER,
              ended INTEGER,
              points INTEGER,
              FOREIGN KEY(quiz_id) REFERENCES quizes(id),
			  FOREIGN KEY(user_nick) REFERENCES users(nick),
			  PRIMARY KEY(quiz_id, user_nick));`, [], (err1: any) => {
                if (err1) {
                    reject('DB Error');
                    return;
                }
                console.log('Done. done');
                resolve();
            });
        });
    })
}

async function createResultsIfNeeded(db: sqlite.Database): Promise<void> {
    return new Promise((resolve, reject) => {
        db.all(`SELECT COUNT(*) AS cnt FROM sqlite_master WHERE type='table' and name='results';`, (err, rows) => {
            if (err) {
                reject('DB Error');
                return;
            }

            if (rows[0].cnt === 1) {
                console.log('Database tables results already exist.');
                resolve();
                return;
            }

            db.run(`CREATE TABLE results (
              user_nick TEXT,
              quiz_id INTEGER,
              quest_nr INTEGER,
              user_answer INTEGER,
              milis_spend INTEGER, 
              PRIMARY KEY(quiz_id, quest_nr, user_nick),
              FOREIGN KEY(quiz_id) REFERENCES quizes(id),
              FOREIGN KEY(quest_nr) REFERENCES questions(nr),
              FOREIGN KEY(user_nick) REFERENCES users(nick));`, [], (err1: any) => {
                if (err1) {
                    reject('DB Error');
                    return;
                }
                console.log('Done. results');
                resolve();
            });
        });
    })
}

const myDB = new sqlite.Database('quizes.db');
createQuizesIfNeeded(myDB).then(async () => {
    createQuestionsIfNeeded(myDB).then(async () =>{
        createUsersIfNeeded(myDB).then(async () => {
			createDoneIfNeeded(myDB).then(async () => {
				createResultsIfNeeded(myDB).then(async () => {

            		myDB.close();
            		
            		const loginStore : LoginStore = new LoginStore('quizes.db');

            		loginStore.addUser('user1', 'user1').then(() => {
            		}).catch(() => {
            		    console.log('add user1 in base');
            		});
            		loginStore.addUser('user2', 'user2').then(() => {
            		}).catch(() => {
            		    console.log('add user2 in base');
                    });
                    
                    const quizStore : QuizStore = new QuizStore('quizes.db');
                    
                    let quests : Question[] = []; 
                    for(let i=0; i<6; i++){
                        quests.push({content:"3 + " + i.toString(10),
                        punish: 10,answer: 3+i});    
                    }
                    await quizStore.addQuiz({name: 'poczatkowy', questions: quests});

                    quests = [];
                    for(let i=0; i<5; i++){
                        quests.push({content:"5 + 3 * " + i.toString(10),
                        punish: 5, answer: 5+3*i});
                    }
                    await quizStore.addQuiz({name: 'drugi', questions: quests});

				}).catch(() => {console.log("error results")});
			}).catch(() => {console.log("error done")});	
        }).catch(() => {console.log("error user")});
    }).catch(() => {console.log("error questions")});
}).catch(() => {console.log("error quiz")});