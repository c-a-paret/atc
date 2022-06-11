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