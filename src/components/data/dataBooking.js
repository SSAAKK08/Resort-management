import room1 from "../../assets/homeImg/room1.jpg";
import room2 from "../../assets/homeImg/room2.jpg";
import room3 from "../../assets/booking/room3.jpg";
import room4 from "../../assets/booking/room4.jpg";
import room5 from "../../assets/booking/room5.jpg";
import room6 from "../../assets/homeImg/room3.jpg";
// import { IoIosWifi } from "react-icons/io";
// import { MdOutlinePool } from "react-icons/md";



// import room1 from "../../assets/booking/room1.jpg";
// import room1Small1 from "../../assets/booking/room1-small-1.jpg";
// import room1Small2 from "../../assets/booking/room1-small-2.jpg";

// import room2 from "../../assets/booking/room2.jpg";
// import room2Small1 from "../../assets/booking/room2-small-1.jpg";
// import room2Small2 from "../../assets/booking/room2-small-2.jpg";

// import room3 from "../../assets/booking/room3.jpg";
// import room3Small1 from "../../assets/booking/room3-small-1.jpg";
// import room3Small2 from "../../assets/booking/room3-small-2.jpg";

export const roomCategories = [
    "All Rooms",
    "Suite",
    "Villa",
    "Garden Room",
];

export const cardData = [
    {
        id: 1,
        title: "Ocean Azure Suite",
        category: "Suite",

        image: room1,
        // gallery: [room1, room1Small1, room1Small2],
        gallery: [room1, room1, room1],

        price: 540,
        rating: 4.9,
        reviews: 42,

        size: "115 sqm",
        bed: "King Size",
        guests: "2 Adults",
        view: "Private Pool",

        wifi: true,
        pool: true,

        description:
            "Experience the ultimate coastal sanctuary. The Ocean Azure Suite is designed for those who appreciate the finer details of island living. Wake up to panoramic views of the turquoise lagoon, enjoy a morning dip in your private infinity plunge pool, and let our dedicated butler service handle every detail of your stay.",

        amenities: [
            "24/7 Dedicated Butler Service",
            "Walk-in Rain Shower & Tub",
            "Private Terrace with Daybeds",
            "Premium Espresso Machine",
        ],
    },

    {
        id: 2,
        title: "Lagoon Garden Room",
        category: "Garden Room",

        image: room2,
        // gallery: [room2, room2Small1, room2Small2],
        gallery: [room2, room2, room2],

        price: 420,
        rating: 4.7,
        reviews: 30,

        size: "75 sqm",
        bed: "King Size",
        guests: "2 Adults",
        view: "Garden View",

        wifi: true,
        pool: false,

        description:
            "A peaceful garden room surrounded by tropical plants. It offers a spacious bedroom, private terrace, modern bathroom, and relaxing views of the resort garden.",

        amenities: [
            "Daily Housekeeping",
            "Private Garden Terrace",
            "Rain Shower",
            "Coffee and Tea Station",
        ],
    },

    {
        id: 3,
        title: "Royal Azure Villa",
        category: "Villa",

        image: room3,
        // gallery: [room3, room3Small1, room3Small2],
        gallery: [room3, room3, room3],

        price: 850,
        rating: 4.9,
        reviews: 58,

        size: "240 sqm",
        bed: "Super King Size",
        guests: "4 Adults",
        view: "Beach Front",

        wifi: true,
        pool: true,

        description:
            "The Royal Azure Villa offers complete privacy, direct beach access, a private swimming pool, spacious living areas, and personal resort service.",

        amenities: [
            "Private Infinity Pool",
            "Direct Beach Access",
            "Personal Butler Service",
            "Private Dining Area",
        ],
    },

    {
    id: 4,
    title: "Sunset Horizon Suite",
    category: "Suite",

    image: room4,
    gallery: [room4, room4, room4],

    price: 620,
    rating: 4.8,
    reviews: 36,

    size: "130 sqm",
    bed: "King Size",
    guests: "2 Adults",
    view: "Ocean Sunset",

    wifi: true,
    pool: true,

    description:
        "Enjoy breathtaking sunset views from your private balcony. The Sunset Horizon Suite combines elegant interiors with luxurious comfort, perfect for couples seeking a romantic escape.",

    amenities: [
        "Private Balcony",
        "Jacuzzi Bathtub",
        "Mini Bar",
        "Complimentary Breakfast",
    ],
},
{
    id: 5,
    title: "Tropical Family Villa",
    category: "Villa",

    image: room5,
    gallery: [room5, room5, room5],

    price: 980,
    rating: 4.9,
    reviews: 64,

    size: "280 sqm",
    bed: "2 King Beds",
    guests: "6 Adults",
    view: "Private Garden",

    wifi: true,
    pool: true,

    description:
        "Designed for families and groups, this spacious villa features two bedrooms, a private swimming pool, outdoor dining space, and lush tropical surroundings.",

    amenities: [
        "Private Swimming Pool",
        "Outdoor BBQ Area",
        "Family Living Room",
        "24/7 Butler Service",
    ],
},
{
    id: 6,
    title: "Emerald Garden Retreat",
    category: "Garden Room",

    image: room6,
    gallery: [room6, room6, room6],

    price: 460,
    rating: 4.8,
    reviews: 29,

    size: "82 sqm",
    bed: "Queen Size",
    guests: "2 Adults",
    view: "Tropical Garden",

    wifi: true,
    pool: false,

    description:
        "Relax in a peaceful garden retreat surrounded by tropical greenery. Featuring contemporary design, a private terrace, and easy access to the resort's wellness facilities.",

    amenities: [
        "Private Terrace",
        "Smart TV",
        "Coffee Machine",
        "Daily Housekeeping",
    ],
},
];