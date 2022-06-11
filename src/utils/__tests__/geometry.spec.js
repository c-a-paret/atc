import {distance, shortestAngle} from "../geometry";

describe("distance", () => {
    test("gets distance between points", () => {
        const result = distance(14, 17, 10, 20)

        expect(result).toBe(5)
    })
})

describe('Shortest distance', () => {
    test.each`
        currentHeading | targetHeading | expectedShortestAngle
        ${89} | ${91} | ${2}
        ${91} | ${89} | ${-2}
        ${179} | ${181} | ${2}
        ${181} | ${179} | ${-2}
        ${269} | ${271} | ${2}
        ${271} | ${269} | ${-2}
        ${359} | ${1} | ${2}
        ${1} | ${359} | ${-2}
         
        
        ${270} | ${90} | ${180}   
        ${90} | ${270} | ${180}
        
        ${180} | ${0} | ${180}   
        ${0} | ${180} | ${180}
        
        ${0} | ${10} | ${10}   
        ${10} | ${0} | ${-10} 
        
        ${355} | ${350} | ${-5}
        ${350} | ${355} | ${5}
        
        ${270} | ${180} | ${-90}   
          
        ${0} | ${270} | ${-90}
        ${0} | ${90} | ${90}
           
        ${180} | ${270} | ${90}
        ${180} | ${90} | ${-90}
      `("$currentHeading to $targetHeading should be $expectedShortestAngle degrees away",
        ({currentHeading, targetHeading, expectedShortestAngle}) => {

            const result = shortestAngle(currentHeading, targetHeading)

            expect(result).toBe(expectedShortestAngle)
        });
});
