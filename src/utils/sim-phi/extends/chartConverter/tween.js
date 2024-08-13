/**@type {((pos:number)=>number)[]} */
export const tween = [null, null,
    pos => Math.sin(pos * Math.PI / 2), //2
    pos => 1 - Math.cos(pos * Math.PI / 2), //3
    pos => 1 - (pos - 1) ** 2, //4
    pos => pos ** 2, //5
    pos => (1 - Math.cos(pos * Math.PI)) / 2, //6
    pos => ((pos *= 2) < 1 ? pos ** 2 : -((pos - 2) ** 2 - 2)) / 2, //7
    pos => 1 + (pos - 1) ** 3, //8
    pos => pos ** 3, //9
    pos => 1 - (pos - 1) ** 4, //10
    pos => pos ** 4, //11
    pos => ((pos *= 2) < 1 ? pos ** 3 : ((pos - 2) ** 3 + 2)) / 2, //12
    pos => ((pos *= 2) < 1 ? pos ** 4 : -((pos - 2) ** 4 - 2)) / 2, //13
    pos => 1 + (pos - 1) ** 5, //14
    pos => pos ** 5, //15
    pos => 1 - 2 ** (-10 * pos), //16
    pos => 2 ** (10 * (pos - 1)), //17
    pos => Math.sqrt(1 - (pos - 1) ** 2), //18
    pos => 1 - Math.sqrt(1 - pos ** 2), //19
    pos => (2.70158 * pos - 1) * (pos - 1) ** 2 + 1, //20
    pos => (2.70158 * pos - 1.70158) * pos ** 2, //21
    pos => ((pos *= 2) < 1 ? (1 - Math.sqrt(1 - pos ** 2)) : (Math.sqrt(1 - (pos - 2) ** 2) + 1)) / 2, //22
    pos => pos < 0.5 ? (14.379638 * pos - 5.189819) * pos ** 2 : (14.379638 * pos - 9.189819) * (pos - 1) ** 2 + 1, //23
    pos => 1 - 2 ** (-10 * pos) * Math.cos(pos * Math.PI / .15), //24
    pos => 2 ** (10 * (pos - 1)) * Math.cos((pos - 1) * Math.PI / .15), //25
    pos => ((pos *= 11) < 4 ? pos ** 2 : pos < 8 ? (pos - 6) ** 2 + 12 : pos < 10 ? (pos - 9) ** 2 + 15 : (pos - 10.5) ** 2 + 15.75) / 16, //26
    pos => 1 - tween[26](1 - pos), //27
    pos => (pos *= 2) < 1 ? tween[26](pos) / 2 : tween[27](pos - 1) / 2 + .5, //28
    pos => pos < 0.5 ? 2 ** (20 * pos - 11) * Math.sin((160 * pos + 1) * Math.PI / 18) : 1 - 2 ** (9 - 20 * pos) * Math.sin((160 * pos + 1) * Math.PI / 18) //29
];