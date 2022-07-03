export const element = (tag, classes, id) => {
    const element = document.createElement(tag)
    classes.forEach(cls => {
        element.classList.add(cls)
    })
    element.setAttribute('id', id)
    return element
}

export const div = (classes, id) => {
    return element("div", classes, id)
}

export const p = (classes, id) => {
    return element("p", classes, id)
}