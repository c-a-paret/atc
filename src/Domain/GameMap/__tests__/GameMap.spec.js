import {GameMap} from "../GameMap";

describe('Runway existence', () => {
    let map;

    beforeEach(() => {
        map = new GameMap({
            features: {
                runways: [
                    {
                        start: {
                            label: "4C",
                        },
                        end: {
                            label: "220L",
                        }
                    }
                ]
            }
        })
    })

    test('Gets existing runway', () => {
        expect(map.runwayExists("4C")).toBeTruthy()
    })

    test('Does not get non-existent runway', () => {
        expect(map.runwayExists("12R")).toBeFalsy()
    })
})

describe('Runway information', () => {
    let map;

    beforeEach(() => {
        map = new GameMap({
            features: {
                runways: [
                    {
                        start: {
                            label: "4C",
                            key: "Value1"
                        },
                        end: {
                            label: "22L",
                            key: "Value2"
                        }
                    }
                ]
            }
        })
    })

    test('Gets existing runway start', () => {
        const result = map.getRunwayInfo("4C");
        expect(result.key).toBe("Value1")
    })

    test('Gets existing runway end', () => {
        const result = map.getRunwayInfo("22L");
        expect(result.key).toBe("Value2")
    })

    test('Returns null ofr non-existent runway', () => {
        expect(map.getRunwayInfo("12R")).toBeNull()
    })
})