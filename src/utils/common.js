export const MIN_SPEED = 120;
export const LANDING_SPEED = 140;
export const MIN_APPROACH_SPEED = 200
export const MIN_ALTITUDE = 1000;
export const MAX_ALTITUDE = 40000;
export const ILS_MAX_X = 220
export const ILS_MIN_X = 140

export const COLOURS = {
    YELLOW: 'rgb(255,186,0)',
    MINT: 'rgb(0,213,170)',
    BLUE: 'rgb(4,230,255)',
    BLUE_TRANSPARENT: 'rgb(0,151,255,0.5)',
    RED: 'rgb(253,3,43)',
    RED_TRANSPARENT: 'rgba(220,46,78,0.2)',
    BACKGROUND: 'rgb(8,8,19)',
    WHITE: 'rgb(218,219,243)',
    WHITE_TRANSPARENT: 'rgb(218,219,243,0.5)',
    ORANGE: 'rgb(255,167,7)',
    ORANGE_TRANSPARENT: 'rgb(194,127,6,0.2)',
    GREY: 'rgba(197,197,197,0.25)',
    GREY_TRANSPARENT: 'rgba(197,197,197,0.05)',
}

export const AIRCRAFT = [
    {
        "operator": "British Airways",
        "operatorIATA": "BA",
        "type": "Airbus",
        "class": "A340-400",
        "weight": 3,
    },
    {
        "operator": "Lufthansa",
        "operatorIATA": "LH",
        "type": "Airbus",
        "class": "A321",
        "weight": 2,
    },
    {
        "operator": "Virgin Atlantic",
        "operatorIATA": "VS",
        "type": "Boeing",
        "class": "B747-400",
        "weight": 3,
    },
    {
        "operator": "EasyJet",
        "operatorIATA": "EZ",
        "type": "Airbus",
        "class": "A319",
        "weight": 1,
    },
    {
        "operator": "RyanAir",
        "operatorIATA": "RY",
        "type": "Boeing",
        "class": "B737-300",
        "weight": 2,
    },
    {
        "operator": "Aer Lingus",
        "operatorIATA": "AL",
        "type": "Airbus",
        "class": "A320",
        "weight": 2,
    },
    {
        "operator": "American Airlines",
        "operatorIATA": "AA",
        "type": "Boeing",
        "class": "B777-800",
        "weight": 3,
    }
]

export const getRandomNumberBetween = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export const toRadians = (degrees) => {
    return (Math.PI / 180) * degrees
}

export const toDegrees = (radians) => {
    return (180 * radians) / Math.PI
}

export const round = (number, n) => {
    return Math.round(number * Math.pow(10, n)) / Math.pow(10, n)
}

export const roundToNearest = (number, nearest) => {
    return Math.ceil(number / nearest) * nearest
}

export const distance = (currentX, currentY, targetX, targetY) => {
    return Math.sqrt(Math.pow((currentX - targetX), 2) + Math.pow((currentY - targetY), 2))
}

export const range = (a, b, step) => {
    if (!step) {
        throw 'Step cannot be 0'
    }
    let array = []

    if (b > a) {
        for (let x = a; x < b; x += step) {
            array.push(x)
        }
        return array
    }

    if (a > b) {
        for (let x = a; x > b; x -= step) {
            array.push(x)
        }
        return array
    }

    return []
}