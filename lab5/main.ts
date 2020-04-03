console.log("Ależ skomplikowany program!");
function zaloguj(...komunikaty: string[]) {
    console.log("Ależ skomplikowany program!", ...komunikaty);
}

zaloguj("Ja", "cię", "nie", "mogę");

let jsonString: string = `{
    "piloci": [
        "Pirx",
        "Exupery",
        "Idzikowski",
        "Główczewski"
    ],
    "lotniska": {
        "WAW": ["Warszawa", [3690, 2800]],
        "NRT": ["Narita", [4000, 2500]],
        "BQH": ["Biggin Hill", [1802, 792]],
        "LBG": ["Paris-Le Bourget", [2665, 3000, 1845]]
    }
}`;

interface ILotnisko {
    [city: string] : [string, number[]]
}

type Pilot = string;

interface ILiniaLotnicza {
    piloci: Pilot[];
    lotniska: ILotnisko[];
}

let dataStructure: ILiniaLotnicza = JSON.parse(jsonString);
console.log(dataStructure.piloci.length);

function sprawdzDaneLiniiLotniczej(dane: any): boolean {
    if(typeof(dane) === "object"){
        if(dane.piloci && typeof(dane.piloci)){
            
        }else{
            return false;
        }
    }
    return false;
}