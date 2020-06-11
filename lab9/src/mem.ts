// klasa mem
export class MemClass {
    id : number;
    name : string;
    url : string;
    priceHist : number[];
    nickHist : string[];

	constructor(id : number, name : string, price : number[], url : string, nick : string[]){
        this.id = id;
        this.name = name;
        this.url = url;
        this.priceHist = price;
        this.nickHist = nick;
    }
}