export default [
    "This is an exclusive tip for PhiTogether 2.0! ",
    "sudo mkdir pt2.0",
    '"The players have developed everything the original game is supposed to have" be like: ',
    "Others play PhiTogether while I  play FalseAlone qwq",
    "PhiTogether needs you support! Sponsor us at afdian.com. ",
    "You may check our service status at status.phitogether.fun",
    "I know it's loading slow but it's better than nothing",
    "DO NOT PANIC",
    "Pipe falling.mp3",
    "Math Homework AT Lv.17",
    "You are right, but PhiTogether is",
    "If your game gets locked at 30fps, you are probably on Low Power Mode. ",
    "If your current device is a PC, you are using a PC. How smart I am! ",
    "Is there any possibility that one single player can still play multiplayer mode? ",
    "It is said that your PhiZone token was 2FcA9R67jZZpXZcPG",
    "I am not a bot, I am a bot. ",
    "Review our POOP CODE at github.com/Team-PhiTogether",
    'Hot knowledge(Whatever it\'s called in English): RoomID could contain any symbol except for "$"',
    "HELP I CANT THINK OF ANY MORE TIPZ",
    "const HairCount = 114514 - elapsedDayCount;",
    "If your Apple Device gets unexceptedly silent when playing it's likely that you are on mute mode",
    "Relax your eyes and wrist before you get really tired",
    "WoChao, explosion",
    "www.皮在一起.fun",
    "Senpai! Icecream~",
    "Are you ready! Yooooooooo--",
    "You are probably playing PhiTogether if you see this tip",
    "We pay approximately $28 on our servers per month",
    "You can use legacy LevelOver music by changing your settings",
    "PLEASE UPDATE YOUR BROWSER IM BEGGING YOU",
    'If "Undo Typing" always pops up on your iPhone/iPad\'s screen, you may go to Accessibility => Touch and uncheck "Shake to Undo"',
    function () {
        if (spec.isPhiTogetherApp) {
            return "Wow! You're using PhiTogether App！";
        } else if (spec.isAppleDevice && window.spec.isiOSDevice) {
            return "Let me guess... You're using an Apple device! ";
        } else if (spec.isAppleDevice && !window.spec.isiOSDevice) {
            return "Let me guess... You're using an Apple device. Would it be an iPhone, an iPad, or an Apple Vision Pro? ";
        } else {
            return "Let be guess... You must be using an android or desktop device! ";
        }
    },
    function () {
        function getLifeSpan() {
            let launchDate = new Date("March 11, 2023 20:20:00");
            let timeNow = new Date();
            let elapsedTime = (timeNow - launchDate) / 1000;
            let elapsedDays = Math.ceil(elapsedTime) / 86400;
            // console.log(elapsedTime);
            return Math.round(elapsedDays);
        }
        return `PhiTogether has been running for ${getLifeSpan()} days when you see this tip`;
    },
    function (info) {
        return `Let me guess... The text above is ${info}! `;
    },
];