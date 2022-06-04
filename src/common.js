export const COLOURS = {
    YELLOW: 'rgb(252,210,100)',
    MINT: 'rgb(0,213,170)',
    RED: 'rgb(220,46,78)',
    BACKGROUND: 'rgb(18,19,49)'
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