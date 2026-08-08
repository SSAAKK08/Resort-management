import room1 from "../../assets/homeImg/room1.jpg";
import room2 from "../../assets/homeImg/room2.jpg";
import room3 from "../../assets/homeImg/room3.jpg";
import scubaDiving from "../../assets/homeImg/ScubaDiving.jpg"; 
import boatRiding from "../../assets/homeImg/boatRiding.jpg"; 
import swimmingPool from "../../assets/homeImg/swimmingPool.jpg"; 

export const data = [
    {
        id: 1,
        images: room1.src,
        title: "Ocean Azure Suite",
        description: "Unobstructed views of the horizon with aprivate infinity plunge pool and dedicatedbutler service.",
        price: 220
    },
    {
        id: 2,
        images: room2.src,
        title: "Coral Garden Villa",
        description: "Secluded tropical gardens surround thispeaceful retreat featuring an outdoor stone rain shower.",
        price: 370
    },
    {
        id: 3,
        images: room3.src,
        title: "Royal Palm Penthouse",
        description: "The pinnacle of resort living. Spanning the entire top floor with 360-degree views and private chef.",
        price: 120
    },
];

export const Activity = [
    
    {
        id: 1,
        images: boatRiding.src,
        title: "Boat ride",
        description: "Sunset cruises and island hopping."
    },
    {
        id: 2,
        images: scubaDiving.src,
        title: "Scuba diving",
        description: "Discover the hidden treasures of the coral reef."
    },
    {
        id: 3,
        images: swimmingPool.src,
        title: "Swimming",
        description: "Olympic-sized pools and private lagoons."
    }
];




