export const initBackgroundLayer = () => {
    const background = document.getElementById("background");
    console.log(background)
    const ctx = background.getContext('2d');
    ctx.fillStyle = 'rgb(18,19,49)';

    background.width = document.body.clientWidth - (document.body.clientWidth * 0.2);
    background.height = document.body.clientHeight;

    ctx.fillRect(0, 0, background.width, background.height)
}

export const initFeaturesLayer = () => {
    const features = document.getElementById("features");
    const featuresContext = features.getContext('2d');

    features.width = document.body.clientWidth - (document.body.clientWidth * 0.2);
    features.height = document.body.clientHeight;

    return featuresContext

}

export const initAeroplaneLayer = () => {
    const aeroplanesLayer = document.getElementById("aeroplanes");
    const planeContext = aeroplanesLayer.getContext('2d');

    aeroplanesLayer.width = document.body.clientWidth - (document.body.clientWidth * 0.2);
    aeroplanesLayer.height = document.body.clientHeight;

    return planeContext
}

export const clearAeroplaneLayer = () => {
    const aeroplanesLayer = document.getElementById("aeroplanes");
    const planeContext = aeroplanesLayer.getContext('2d');

    planeContext.clearRect(0, 0, document.body.clientWidth - (document.body.clientWidth * 0.2), document.body.clientHeight);
}