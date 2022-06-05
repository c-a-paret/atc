export const MIN_SPEED = 120;
export const MIN_ALTITUDE = 1000;
export const MAX_ALTITUDE = 40000;

export const COLOURS = {
    YELLOW: 'rgb(252,210,100)',
    MINT: 'rgb(0,213,170)',
    BLUE: 'rgb(0,151,255)',
    RED: 'rgb(220,46,78)',
    RED_TRANSPARENT: 'rgba(220,46,78,0.2)',
    BACKGROUND: 'rgb(18,19,49)',
    WHITE: 'rgb(218,219,243)',
    ORANGE: 'rgb(194,127,6)',
    ORANGE_TRANSPARENT: 'rgb(194,127,6,0.2)',

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
    }
]

export const getRandomNumberBetween = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export const toRadians = (degrees) => {
    return (Math.PI / 180) * degrees
}

export const round = (number, n) => {
    return Math.round(number * Math.pow(10, n)) / Math.pow(10, n)
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