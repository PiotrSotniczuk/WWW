import * as sqlite from 'sqlite3';
const sha256 = require('sha256');

export class LoginStore {
    baseName: string;

	constructor(baseName : string){
        this.baseName = baseName;
    }
    addUser(nick : string, password : string) : Promise<void>{
        const db = new sqlite.Database(this.baseName);
        const param = [sha256(nick), sha256(password)];
        return new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO users (nick, password)
                VALUES ((?), (?));`, param, (err) => {
                    if(err) {
                        console.log(err.message);
                        reject(`DB Error probably this nick exist`);
                        db.close();
                        return;
                    }
                    resolve();
                    db.close();
                });
            });
    }

    loginUser(nick : string, password : string) : Promise<boolean>{
        const db = new sqlite.Database(this.baseName);
        const param = [sha256(nick)];
        return new Promise((resolve, reject) => {
            db.get(
                `SELECT * FROM users WHERE nick=(?);`, param,
                 (err, row) => {
                    if(err) {
                        console.log(err.message);
                        reject('DB Error check login');
                        db.close();
                        return;
                    }
                    if(row !== undefined && sha256(password) === row.password){
                        resolve(true);
                    }else{
                        resolve(false);
                    }
                    db.close();
                });
            })
    }
}