import { MemClass } from "./mem";

// klasa memStore
export class MemStore {
    memesArr : MemClass[];

	constructor(){
        this.memesArr = [];
    }
    addMeme(meme : MemClass) : void{
        this.memesArr.push(meme);
    }
    get allMemes() : MemClass[]{
        return this.memesArr.slice();
    }
    get mostExpensive() : MemClass[]{
        return this.memesArr.sort((a,b) => b.price - a.price).slice(0,3);
    }

    getMemeById(idStr : string) : MemClass{
        // TODO throw
        const memId = +idStr;
       for (const iterator of this.memesArr) {
           if(iterator.id === memId){
               return iterator;
           }
       }
       return null;
    }
}