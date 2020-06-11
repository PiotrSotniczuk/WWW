import { MemClass } from "./mem";
import * as sqlite from 'sqlite3';

class NoSuchMemError extends Error {
    constructor(message : string) {
      super(message); // (1)
      this.name = "NoSuchMemError"; // (2)
    }
  }

// klasa memStore
// tslint:disable-next-line: max-classes-per-file
export class MemStore {
    baseName: string;

	constructor(baseName : string){
        this.baseName = baseName;
    }
    addMeme(meme : MemClass) : Promise<void>{
        const db = new sqlite.Database(this.baseName);
        return new Promise((resolve, reject) => {
            db.exec(
                `BEGIN TRANSACTION;
                INSERT INTO memes (id, name, url, last_nr)
                VALUES (${meme.id}, '${meme.name}', '${meme.url}', 1);
                INSERT INTO prices (nr, price, mem_id, nick)
                VALUES (1, ${meme.priceHist[0]}, ${meme.id}, "init");
                COMMIT;`,
                (err) => {
                    if(err) {
                        console.log(err.message);
                        reject(`DB Error probably mem with this id exist`);
                        db.close();
                        return;
                    }
                    resolve();
                    db.close();
                });
            });
    }
    get mostExpensive() : Promise<MemClass[]>{
        const db = new sqlite.Database(this.baseName);
        return new Promise((resolve, reject) => {
            db.all(`SELECT m.id, m.name, m.url, p.price FROM memes m
            INNER JOIN prices p ON m.last_nr = p.nr AND m.id = p.mem_id
            ORDER BY p.price DESC
            LIMIT 3;`, (err, rows) => {
                if(err) {
                    console.log(err.message);
                    reject('DB Error mostExpensive');
                    db.close();
                    return;
                }
                const memes = [];
                for (const row of rows) {
                    memes.push(new MemClass(row.id, row.name, [row.price], row.url, [""]));
                }
                resolve(memes);
                db.close();
            });
        });
    }

    getMemeById(idStr : string) : Promise<MemClass>{
        const db = new sqlite.Database(this.baseName);
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM memes m
            INNER JOIN prices p
            ON m.id = ${idStr} AND m.id = p.mem_id
            ORDER BY p.nr DESC;`, (err, rows) => {
                if(err) {
                    console.log(err.message);
                    reject('DB Error getById');
                    db.close();
                    return;
                }

                if(rows.length === 0){
                    throw new NoSuchMemError("no id=" + idStr);
                }

                const id = rows[0].id;
                const name = rows[0].name;
                const url = rows[0].url;
                const prices : number[] = [];
                const nicks : string[] = [];

                for (const row of rows) {
                    prices.push(row.price);
                    nicks.push(row.nick);
                }
                resolve(new MemClass(id, name, prices, url, nicks));
                db.close();
            });
        });
    }

    changePrice(idStr : string, newPrice : number, nick : string) : Promise<void>{
        const db = new sqlite.Database(this.baseName);
        return new Promise((resolve, reject) => {
            db.exec(`BEGIN TRANSACTION;
            INSERT INTO prices (nr, price, mem_id, nick)
            VALUES ((SELECT last_nr FROM memes WHERE id = ${idStr}) + 1, ${newPrice}, ${idStr}, '${nick}');
            UPDATE memes SET last_nr = (SELECT last_nr FROM memes WHERE id = ${idStr}) + 1
            WHERE id = ${idStr};
            COMMIT;`, (err) => {
                if(err) {
                    console.log(err.message);
                    reject('DB Error changePrice');
                    db.close();
                    return;
                }
                resolve();
                db.close();
            });
        });
    }

}