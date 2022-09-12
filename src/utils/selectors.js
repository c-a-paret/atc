export const randomChoice = (list) => {
    if (!list) {
        return list
    }
    return list[Math.floor(Math.random() * list.length)]
}