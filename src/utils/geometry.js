export const distance = (currentX, currentY, targetX, targetY) => {
    return Math.sqrt(Math.pow((currentX - targetX), 2) + Math.pow((currentY - targetY), 2))
}

export const shortestAngle = (currentHeading, targetHeading) => {
    if (currentHeading === 180 && targetHeading === 0) {
        return 180
    }
    if (currentHeading === 0 && (targetHeading < 360 && targetHeading > 180)) {
        return targetHeading - 360
    }
    if (currentHeading - targetHeading < -180) {
        return -(currentHeading + 360 - targetHeading)
    }
    if (currentHeading - targetHeading > 180) {
        return targetHeading + 360 - currentHeading
    }
    if (targetHeading - currentHeading === -180) {
        return 180
    }
    return targetHeading - currentHeading
}


const pointOnCorner = (polygon, x, y, i) => {
    return (x === polygon[i].x) && (y === polygon[i].inv_y)
}

const points_not_horizontal = (poly, y, i, j) => {
    return (polygon_point_higher(poly, y, i)) !== (polygon_point_higher(poly, y, j))
}

const polygon_point_higher = (poly, y, i) => {
    return poly[i].inv_y > y
}

const calculate_slope = (poly, x, y, i, j) => {
    const point1_x = poly[i].x
    const point1_y = poly[i].inv_y

    const point2_x = poly[j].x
    const point2_y = poly[j].inv_y

    return (x - point1_x) * (point2_y - point1_y) - (point2_x - point1_x) * (y - point1_y)
}

const pointOnBoundary = (slope) => {
    return slope === 0
}

export const isInsidePolygon = (polygon, x, y) => {
    const numSides = polygon.length
    let j = numSides - 1
    let inside = false

    for (let i = 0; i < numSides; i++) {
        if (pointOnCorner(polygon, x, y, i)) {
            return false
        }

        if (points_not_horizontal(polygon, y, i, j)) {
            const slope = calculate_slope(polygon, x, y, i, j)
            if (pointOnBoundary(slope)) {
                return true
            }
            if ((slope < 0) !== (polygon[j].inv_y < polygon[i].inv_y)) {
                inside = !inside  // Invert location with every traversed edge
            }
        }
        j = i
    }

    return inside
}