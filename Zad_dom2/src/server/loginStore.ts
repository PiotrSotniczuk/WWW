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

    changePassword(nick : string, oldPassword : string, newPassword : string) : Promise<boolean>{
        const db = new sqlite.Database(this.baseName);
        const param1 = [sha256(nick)];
        return new Promise((resolve, reject) => {
            db.get(
                `SELECT * FROM users WHERE nick=(?);`, param1, (err, row) => {
                    if(err) {
                        console.log(err.message);
                        reject('DB Error check login');
                        db.close();
                        return;
                    }
                    if(row === undefined || sha256(oldPassword) !== row.password){
                        resolve(false);
                        db.close();
                        return;
                    }
                    const param2 = [sha256(newPassword), sha256(nick)];
                    db.run(`UPDATE users SET password=(?)
                    WHERE nick=(?);`, param2, (err) => {
                        if(err) {
                            console.log(err.message);
                            reject('DB Error set pass');
                            db.close();
                            return;
                        }
                        resolve(true);
                        db.close();
                        return;
                    });
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