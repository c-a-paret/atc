import {Altitude, Heading, shortestAngle, Speed, Waypoint} from "../Action";
import {MAX_ALTITUDE, MIN_ALTITUDE} from "../../../utils/common";
import {Aeroplane} from "../../Aeroplane/Aeroplane";

describe("Speed", () => {
    test("Creates speed action with decreasing speed", () => {
        let weight = 3;
        let currentSpeed = 300;
        let desiredSpeed = 290;

        const aeroplane = new Aeroplane("BA123", 500, 500, currentSpeed, 90, 5000, weight)

        const action = new Speed(aeroplane, desiredSpeed)

        expect(aeroplane.speed).toBe(300)
        action.apply()
        expect(aeroplane.speed).toBe(299)
        action.apply()
        expect(aeroplane.speed).toBe(298)
    })

    test("Creates speed action with increasing speed", () => {
        let weight = 3;
        let currentSpeed = 295;
        let desiredSpeed = 300;

        const aeroplane = new Aeroplane("BA123", 500, 500, currentSpeed, 90, 5000, weight)

        const action = new Speed(aeroplane, desiredSpeed)

        expect(aeroplane.speed).toBe(295)
        action.apply()
        expect(aeroplane.speed).toBe(296)
        action.apply()
        expect(aeroplane.speed).toBe(297)
    })

    test("Is not valid if the target speed is below 0", () => {
        let desiredSpeed = -12;

        expect(new Speed({speed: 200}, desiredSpeed).isValid()).toBeFalsy()
    })

    test("Is not valid if the target speed is not multiple of 10", () => {
        let desiredSpeed = 207;

        expect(new Speed({speed: 200}, desiredSpeed).isValid()).toBeFalsy()
    })

    test("Is not valid if the target speed is same as current speed", () => {
        let desiredSpeed = 200;

        expect(new Speed({speed: 200}, desiredSpeed).isValid()).toBeFalsy()
    })

    test("Is not valid if the target speed is lower than the minimum speed", () => {
        let desiredSpeed = 10;

        expect(new Speed({speed: 200}, desiredSpeed).isValid()).toBeFalsy()
    })
})

describe("Heading", () => {
    test.each`
    startHeading | targetHeading | firstNewHeading 
    ${0} | ${10} | ${3}
    ${1} | ${11} | ${4}
    ${2} | ${12} | ${5}
    ${3} | ${13} | ${6}
    ${4} | ${14} | ${7}
    ${5} | ${15} | ${8}
    ${6} | ${16} | ${9}
    ${7} | ${17} | ${10}
    ${8} | ${18} | ${11}
    ${9} | ${19} | ${12}
    ${10} | ${20} | ${13}
    ${11} | ${21} | ${14}
    ${12} | ${22} | ${15}
    ${13} | ${23} | ${16}
    ${14} | ${24} | ${17}
    ${15} | ${25} | ${18}
    ${16} | ${26} | ${19}
    ${17} | ${27} | ${20}
    ${18} | ${28} | ${21}
    ${19} | ${29} | ${22}
    ${20} | ${30} | ${23}
    ${21} | ${31} | ${24}
    ${22} | ${32} | ${25}
    ${23} | ${33} | ${26}
    ${24} | ${34} | ${27}
    ${25} | ${35} | ${28}
    ${26} | ${36} | ${29}
    ${27} | ${37} | ${30}
    ${28} | ${38} | ${31}
    ${29} | ${39} | ${32}
    ${30} | ${40} | ${33}
    ${31} | ${41} | ${34}
    ${32} | ${42} | ${35}
    ${33} | ${43} | ${36}
    ${34} | ${44} | ${37}
    ${35} | ${45} | ${38}
    ${36} | ${46} | ${39}
    ${37} | ${47} | ${40}
    ${38} | ${48} | ${41}
    ${39} | ${49} | ${42}
    ${40} | ${50} | ${43}
    ${41} | ${51} | ${44}
    ${42} | ${52} | ${45}
    ${43} | ${53} | ${46}
    ${44} | ${54} | ${47}
    ${45} | ${55} | ${48}
    ${46} | ${56} | ${49}
    ${47} | ${57} | ${50}
    ${48} | ${58} | ${51}
    ${49} | ${59} | ${52}
    ${50} | ${60} | ${53}
    ${51} | ${61} | ${54}
    ${52} | ${62} | ${55}
    ${53} | ${63} | ${56}
    ${54} | ${64} | ${57}
    ${55} | ${65} | ${58}
    ${56} | ${66} | ${59}
    ${57} | ${67} | ${60}
    ${58} | ${68} | ${61}
    ${59} | ${69} | ${62}
    ${60} | ${70} | ${63}
    ${61} | ${71} | ${64}
    ${62} | ${72} | ${65}
    ${63} | ${73} | ${66}
    ${64} | ${74} | ${67}
    ${65} | ${75} | ${68}
    ${66} | ${76} | ${69}
    ${67} | ${77} | ${70}
    ${68} | ${78} | ${71}
    ${69} | ${79} | ${72}
    ${70} | ${80} | ${73}
    ${71} | ${81} | ${74}
    ${72} | ${82} | ${75}
    ${73} | ${83} | ${76}
    ${74} | ${84} | ${77}
    ${75} | ${85} | ${78}
    ${76} | ${86} | ${79}
    ${77} | ${87} | ${80}
    ${78} | ${88} | ${81}
    ${79} | ${89} | ${82}
    ${80} | ${90} | ${83}
    ${81} | ${91} | ${84}
    ${82} | ${92} | ${85}
    ${83} | ${93} | ${86}
    ${84} | ${94} | ${87}
    ${85} | ${95} | ${88}
    ${86} | ${96} | ${89}
    ${87} | ${97} | ${90}
    ${88} | ${98} | ${91}
    ${89} | ${99} | ${92}
    ${90} | ${100} | ${93}
    ${91} | ${101} | ${94}
    ${92} | ${102} | ${95}
    ${93} | ${103} | ${96}
    ${94} | ${104} | ${97}
    ${95} | ${105} | ${98}
    ${96} | ${106} | ${99}
    ${97} | ${107} | ${100}
    ${98} | ${108} | ${101}
    ${99} | ${109} | ${102}
    ${100} | ${110} | ${103}
    ${101} | ${111} | ${104}
    ${102} | ${112} | ${105}
    ${103} | ${113} | ${106}
    ${104} | ${114} | ${107}
    ${105} | ${115} | ${108}
    ${106} | ${116} | ${109}
    ${107} | ${117} | ${110}
    ${108} | ${118} | ${111}
    ${109} | ${119} | ${112}
    ${110} | ${120} | ${113}
    ${111} | ${121} | ${114}
    ${112} | ${122} | ${115}
    ${113} | ${123} | ${116}
    ${114} | ${124} | ${117}
    ${115} | ${125} | ${118}
    ${116} | ${126} | ${119}
    ${117} | ${127} | ${120}
    ${118} | ${128} | ${121}
    ${119} | ${129} | ${122}
    ${120} | ${130} | ${123}
    ${121} | ${131} | ${124}
    ${122} | ${132} | ${125}
    ${123} | ${133} | ${126}
    ${124} | ${134} | ${127}
    ${125} | ${135} | ${128}
    ${126} | ${136} | ${129}
    ${127} | ${137} | ${130}
    ${128} | ${138} | ${131}
    ${129} | ${139} | ${132}
    ${130} | ${140} | ${133}
    ${131} | ${141} | ${134}
    ${132} | ${142} | ${135}
    ${133} | ${143} | ${136}
    ${134} | ${144} | ${137}
    ${135} | ${145} | ${138}
    ${136} | ${146} | ${139}
    ${137} | ${147} | ${140}
    ${138} | ${148} | ${141}
    ${139} | ${149} | ${142}
    ${140} | ${150} | ${143}
    ${141} | ${151} | ${144}
    ${142} | ${152} | ${145}
    ${143} | ${153} | ${146}
    ${144} | ${154} | ${147}
    ${145} | ${155} | ${148}
    ${146} | ${156} | ${149}
    ${147} | ${157} | ${150}
    ${148} | ${158} | ${151}
    ${149} | ${159} | ${152}
    ${150} | ${160} | ${153}
    ${151} | ${161} | ${154}
    ${152} | ${162} | ${155}
    ${153} | ${163} | ${156}
    ${154} | ${164} | ${157}
    ${155} | ${165} | ${158}
    ${156} | ${166} | ${159}
    ${157} | ${167} | ${160}
    ${158} | ${168} | ${161}
    ${159} | ${169} | ${162}
    ${160} | ${170} | ${163}
    ${161} | ${171} | ${164}
    ${162} | ${172} | ${165}
    ${163} | ${173} | ${166}
    ${164} | ${174} | ${167}
    ${165} | ${175} | ${168}
    ${166} | ${176} | ${169}
    ${167} | ${177} | ${170}
    ${168} | ${178} | ${171}
    ${169} | ${179} | ${172}
    ${170} | ${180} | ${173}
    ${171} | ${181} | ${174}
    ${172} | ${182} | ${175}
    ${173} | ${183} | ${176}
    ${174} | ${184} | ${177}
    ${175} | ${185} | ${178}
    ${176} | ${186} | ${179}
    ${177} | ${187} | ${180}
    ${178} | ${188} | ${181}
    ${179} | ${189} | ${182}
    ${180} | ${190} | ${183}
    ${181} | ${191} | ${184}
    ${182} | ${192} | ${185}
    ${183} | ${193} | ${186}
    ${184} | ${194} | ${187}
    ${185} | ${195} | ${188}
    ${186} | ${196} | ${189}
    ${187} | ${197} | ${190}
    ${188} | ${198} | ${191}
    ${189} | ${199} | ${192}
    ${190} | ${200} | ${193}
    ${191} | ${201} | ${194}
    ${192} | ${202} | ${195}
    ${193} | ${203} | ${196}
    ${194} | ${204} | ${197}
    ${195} | ${205} | ${198}
    ${196} | ${206} | ${199}
    ${197} | ${207} | ${200}
    ${198} | ${208} | ${201}
    ${199} | ${209} | ${202}
    ${200} | ${210} | ${203}
    ${201} | ${211} | ${204}
    ${202} | ${212} | ${205}
    ${203} | ${213} | ${206}
    ${204} | ${214} | ${207}
    ${205} | ${215} | ${208}
    ${206} | ${216} | ${209}
    ${207} | ${217} | ${210}
    ${208} | ${218} | ${211}
    ${209} | ${219} | ${212}
    ${210} | ${220} | ${213}
    ${211} | ${221} | ${214}
    ${212} | ${222} | ${215}
    ${213} | ${223} | ${216}
    ${214} | ${224} | ${217}
    ${215} | ${225} | ${218}
    ${216} | ${226} | ${219}
    ${217} | ${227} | ${220}
    ${218} | ${228} | ${221}
    ${219} | ${229} | ${222}
    ${220} | ${230} | ${223}
    ${221} | ${231} | ${224}
    ${222} | ${232} | ${225}
    ${223} | ${233} | ${226}
    ${224} | ${234} | ${227}
    ${225} | ${235} | ${228}
    ${226} | ${236} | ${229}
    ${227} | ${237} | ${230}
    ${228} | ${238} | ${231}
    ${229} | ${239} | ${232}
    ${230} | ${240} | ${233}
    ${231} | ${241} | ${234}
    ${232} | ${242} | ${235}
    ${233} | ${243} | ${236}
    ${234} | ${244} | ${237}
    ${235} | ${245} | ${238}
    ${236} | ${246} | ${239}
    ${237} | ${247} | ${240}
    ${238} | ${248} | ${241}
    ${239} | ${249} | ${242}
    ${240} | ${250} | ${243}
    ${241} | ${251} | ${244}
    ${242} | ${252} | ${245}
    ${243} | ${253} | ${246}
    ${244} | ${254} | ${247}
    ${245} | ${255} | ${248}
    ${246} | ${256} | ${249}
    ${247} | ${257} | ${250}
    ${248} | ${258} | ${251}
    ${249} | ${259} | ${252}
    ${250} | ${260} | ${253}
    ${251} | ${261} | ${254}
    ${252} | ${262} | ${255}
    ${253} | ${263} | ${256}
    ${254} | ${264} | ${257}
    ${255} | ${265} | ${258}
    ${256} | ${266} | ${259}
    ${257} | ${267} | ${260}
    ${258} | ${268} | ${261}
    ${259} | ${269} | ${262}
    ${260} | ${270} | ${263}
    ${261} | ${271} | ${264}
    ${262} | ${272} | ${265}
    ${263} | ${273} | ${266}
    ${264} | ${274} | ${267}
    ${265} | ${275} | ${268}
    ${266} | ${276} | ${269}
    ${267} | ${277} | ${270}
    ${268} | ${278} | ${271}
    ${269} | ${279} | ${272}
    ${270} | ${280} | ${273}
    ${271} | ${281} | ${274}
    ${272} | ${282} | ${275}
    ${273} | ${283} | ${276}
    ${274} | ${284} | ${277}
    ${275} | ${285} | ${278}
    ${276} | ${286} | ${279}
    ${277} | ${287} | ${280}
    ${278} | ${288} | ${281}
    ${279} | ${289} | ${282}
    ${280} | ${290} | ${283}
    ${281} | ${291} | ${284}
    ${282} | ${292} | ${285}
    ${283} | ${293} | ${286}
    ${284} | ${294} | ${287}
    ${285} | ${295} | ${288}
    ${286} | ${296} | ${289}
    ${287} | ${297} | ${290}
    ${288} | ${298} | ${291}
    ${289} | ${299} | ${292}
    ${290} | ${300} | ${293}
    ${291} | ${301} | ${294}
    ${292} | ${302} | ${295}
    ${293} | ${303} | ${296}
    ${294} | ${304} | ${297}
    ${295} | ${305} | ${298}
    ${296} | ${306} | ${299}
    ${297} | ${307} | ${300}
    ${298} | ${308} | ${301}
    ${299} | ${309} | ${302}
    ${300} | ${310} | ${303}
    ${301} | ${311} | ${304}
    ${302} | ${312} | ${305}
    ${303} | ${313} | ${306}
    ${304} | ${314} | ${307}
    ${305} | ${315} | ${308}
    ${306} | ${316} | ${309}
    ${307} | ${317} | ${310}
    ${308} | ${318} | ${311}
    ${309} | ${319} | ${312}
    ${310} | ${320} | ${313}
    ${311} | ${321} | ${314}
    ${312} | ${322} | ${315}
    ${313} | ${323} | ${316}
    ${314} | ${324} | ${317}
    ${315} | ${325} | ${318}
    ${316} | ${326} | ${319}
    ${317} | ${327} | ${320}
    ${318} | ${328} | ${321}
    ${319} | ${329} | ${322}
    ${320} | ${330} | ${323}
    ${321} | ${331} | ${324}
    ${322} | ${332} | ${325}
    ${323} | ${333} | ${326}
    ${324} | ${334} | ${327}
    ${325} | ${335} | ${328}
    ${326} | ${336} | ${329}
    ${327} | ${337} | ${330}
    ${328} | ${338} | ${331}
    ${329} | ${339} | ${332}
    ${330} | ${340} | ${333}
    ${331} | ${341} | ${334}
    ${332} | ${342} | ${335}
    ${333} | ${343} | ${336}
    ${334} | ${344} | ${337}
    ${335} | ${345} | ${338}
    ${336} | ${346} | ${339}
    ${337} | ${347} | ${340}
    ${338} | ${348} | ${341}
    ${339} | ${349} | ${342}
    ${340} | ${350} | ${343}
    ${341} | ${351} | ${344}
    ${342} | ${352} | ${345}
    ${343} | ${353} | ${346}
    ${344} | ${354} | ${347}
    ${345} | ${355} | ${348}
    ${346} | ${356} | ${349}
    ${347} | ${357} | ${350}
    ${348} | ${358} | ${351}
    ${349} | ${359} | ${352}
    ${350} | ${360} | ${353}
    ${351} | ${361} | ${354}
    ${352} | ${362} | ${355}
    ${353} | ${363} | ${356}
    ${354} | ${364} | ${357}
    ${355} | ${365} | ${358}
    ${356} | ${366} | ${359}
    ${357} | ${367} | ${0}
    ${358} | ${368} | ${1}
    ${359} | ${369} | ${2}
    ${360} | ${370} | ${3}    
  `("Turns to $firstNewHeading when facing $startHeading aiming for $targetHeading", ({startHeading, targetHeading, firstNewHeading }) => {
        const aeroplane = new Aeroplane("BA123", 500, 500, 220, startHeading, 5000, 2)

        const action = new Heading(aeroplane, targetHeading)

        expect(aeroplane.heading).toBe(startHeading)
        action.apply()
        expect(aeroplane.heading).toBe(firstNewHeading)
    });

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
  `("$currentHeading to $targetHeading should be $expectedShortestAngle degrees away", ({currentHeading, targetHeading, expectedShortestAngle}) => {
        const result = shortestAngle(currentHeading, targetHeading)

        expect(result).toBe(expectedShortestAngle)
    });


    test("Turning right within circle", () => {
        let currentHeading = 5;
        let desiredHeading = 10;

        const aeroplane = new Aeroplane("BA123", 500, 500, 220, currentHeading, 5000, 2)

        const action = new Heading(aeroplane, desiredHeading)

        expect(aeroplane.heading).toBe(5)
        action.apply()
        expect(aeroplane.heading).toBe(8)
        action.apply()
        expect(aeroplane.heading).toBe(10)
    })

    test("Turning left within circle", () => {
        let currentHeading = 10;
        let desiredHeading = 5;

        const aeroplane = new Aeroplane("BA123", 500, 500, 220, currentHeading, 5000, 2)

        const action = new Heading(aeroplane, desiredHeading)

        expect(aeroplane.heading).toBe(10)
        action.apply()
        expect(aeroplane.heading).toBe(7)
        action.apply()
        expect(aeroplane.heading).toBe(5)
    })

    test("Turning left outside circle", () => {
        let currentHeading = 5;
        let desiredHeading = 355;

        const aeroplane = new Aeroplane("BA123", 500, 500, 220, currentHeading, 5000, 2)

        const action = new Heading(aeroplane, desiredHeading)

        expect(aeroplane.heading).toBe(5)
        action.apply()
        expect(aeroplane.heading).toBe(2)
        action.apply()
        expect(aeroplane.heading).toBe(359)
        action.apply()
        expect(aeroplane.heading).toBe(356)
        action.apply()
        expect(aeroplane.heading).toBe(355)
    })

    test("Turning right outside circle", () => {
        let currentHeading = 355;
        let desiredHeading = 5;

        const aeroplane = new Aeroplane("BA123", 500, 500, 220, currentHeading, 5000, 2)

        const action = new Heading(aeroplane, desiredHeading)

        expect(aeroplane.heading).toBe(355)
        action.apply()
        expect(aeroplane.heading).toBe(358)
        action.apply()
        expect(aeroplane.heading).toBe(1)
        action.apply()
        expect(aeroplane.heading).toBe(4)
        action.apply()
        expect(aeroplane.heading).toBe(5)
    })

    test("Defaults to right turn within circle", () => {
        let currentHeading = 90;
        let desiredHeading = 270;

        const aeroplane = new Aeroplane("BA123", 500, 500, 220, currentHeading, 5000, 2)

        const action = new Heading(aeroplane, desiredHeading)

        expect(aeroplane.heading).toBe(90)
        action.apply()
        expect(aeroplane.heading).toBe(93)
        action.apply()
        expect(aeroplane.heading).toBe(96)
        // etc.
    })

    test("Defaults to right turn from 0 to 180", () => {
        let currentHeading = 0;
        let desiredHeading = 180;

        const aeroplane = new Aeroplane("BA123", 500, 500, 220, currentHeading, 5000, 2)

        const action = new Heading(aeroplane, desiredHeading)

        expect(aeroplane.heading).toBe(0)
        action.apply()
        expect(aeroplane.heading).toBe(3)
        action.apply()
        expect(aeroplane.heading).toBe(6)
        // etc.
    })

    test("Is not valid if the target heading is same as current heading", () => {
        let desiredAltitude = 243;

        expect(new Heading({heading: 243}, desiredAltitude).isValid()).toBeFalsy()
    })

    test("Is not valid if the target heading is less than zero", () => {
        let desiredAltitude = -1;

        expect(new Heading({heading: 243}, desiredAltitude).isValid()).toBeFalsy()
    })

    test("Is not valid if the target heading is greater than 360", () => {
        let desiredAltitude = 361;

        expect(new Heading({heading: 243}, desiredAltitude).isValid()).toBeFalsy()
    })
})

describe("Altitude", () => {
    test("Creates altitude action with increasing altitude", () => {
        let currentAltitude = 1000;
        let desiredAltitude = 1100;

        const aeroplane = new Aeroplane("BA123", 500, 500, 200, 90, currentAltitude, 3)

        const action = new Altitude(aeroplane, desiredAltitude)

        expect(aeroplane.altitude).toBe(1000)
        action.apply()
        expect(aeroplane.altitude).toBe(1020)
        action.apply()
        expect(aeroplane.altitude).toBe(1040)
    })

    test("Creates altitude action with decreasing altitude", () => {
        let currentAltitude = 1100;
        let desiredAltitude = 1000;

        const aeroplane = new Aeroplane("BA123", 500, 500, 200, 90, currentAltitude, 3)

        const action = new Altitude(aeroplane, desiredAltitude)

        expect(aeroplane.altitude).toBe(1100)
        action.apply()
        expect(aeroplane.altitude).toBe(1080)
        action.apply()
        expect(aeroplane.altitude).toBe(1060)
    })

    test("Is not valid if the target altitude is below minimum altitude", () => {
        let desiredAltitude = MIN_ALTITUDE - 1;

        expect(new Altitude({altitude: 3000}, desiredAltitude).isValid()).toBeFalsy()
    })

    test("Is not valid if the target altitude is above max altitude", () => {
        let desiredAltitude = MAX_ALTITUDE + 1;

        expect(new Altitude({altitude: 3000}, desiredAltitude).isValid()).toBeFalsy()
    })

    test("Is not valid if the target altitude is same as current altitude", () => {
        let currentAltitude = 2000;

        expect(new Altitude({altitude: currentAltitude}, currentAltitude).isValid()).toBeFalsy()
    })

    test("Is not valid if the target altitude is not multiple of 100", () => {
        let desiredAltitude = 2116;

        expect(new Altitude({altitude: 3000}, desiredAltitude).isValid()).toBeFalsy()
    })
})

describe("Waypoint", () => {
    test("Turns to face waypoint top right quadrant", () => {
        const aeroplane = new Aeroplane("BA123", 500, 500, 200, 90, 5000, 3)

        const action = new Waypoint(aeroplane, "LAM")

        expect(aeroplane.heading).toBe(90)
        action.apply()
        expect(aeroplane.heading).toBe(87)
        action.apply()
        expect(aeroplane.heading).toBe(84)
    })

    test("Turns to face waypoint bottom right quadrant", () => {
        const aeroplane = new Aeroplane("BA123", 800, 200, 200, 90, 5000, 3)

        const action = new Waypoint(aeroplane, "LAM")

        expect(aeroplane.heading).toBe(90)
        action.apply()
        expect(aeroplane.heading).toBe(93)
        action.apply()
        expect(aeroplane.heading).toBe(96)
    })

    test("Turns to face waypoint top left quadrant", () => {
        const aeroplane = new Aeroplane("BA123", 1000, 400, 200, 90, 5000, 3)

        const action = new Waypoint(aeroplane, "LAM")

        expect(aeroplane.heading).toBe(90)
        action.apply()
        expect(aeroplane.heading).toBe(87)
        action.apply()
        expect(aeroplane.heading).toBe(84)
    })

    test("Turns to face waypoint bottom left quadrant", () => {
        const aeroplane = new Aeroplane("BA123", 1000, 200, 200, 90, 5000, 3)

        const action = new Waypoint(aeroplane, "LAM")

        expect(aeroplane.heading).toBe(90)
        action.apply()
        expect(aeroplane.heading).toBe(93)
        action.apply()
        expect(aeroplane.heading).toBe(96)
    })

    test("Turns to face LAM from starting point", () => {
        const aeroplane = new Aeroplane("BA123", 500, 500, 200, 355, 5000, 3)

        const action = new Waypoint(aeroplane, "LAM")

        expect(aeroplane.heading).toBe(355)
        action.apply()
        expect(aeroplane.heading).toBe(358)
        action.apply()
        expect(aeroplane.heading).toBe(1)
    })

})

