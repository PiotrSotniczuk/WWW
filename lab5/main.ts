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

function sprawdzDaneLiniiLotniczej(dane: any): boolean {
    if(typeof(dane) !== "object"){
        return false;
    }
    if(dane.piloci && Array.isArray(dane.piloci)){
        for (const iterator of dane.piloci) {
            if(typeof(iterator) !== "string"){
               return false;
            }
        }
    }else{
        return false;
    }

    if(dane.lotniska && typeof(dane.lotniska) === "object"){
        for (const key in dane.lotniska) {
            if (typeof(key) === "string") {
                
            }else{
                return false;
            }
        }
    }else{
        return false;
    }

    return true;
}
let dataStructure: ILiniaLotnicza;

dataStructure = JSON.parse(jsonString);

if(sprawdzDaneLiniiLotniczej(dataStructure)) {
    console.log("dobry");
}else{
    console.log("zly");
}
