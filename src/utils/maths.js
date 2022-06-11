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