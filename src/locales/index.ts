import * as VueI18n from "vue-i18n";

import zh_CN from "./zh_CN.json";
import zh_TW from "./zh_TW.json";
import en_US from "./en_US.json";

// let locale = "zh_CN";

// if (localStorage.getItem("ptlocale")) {
//   locale = localStorage.getItem("ptlocale") as string;
//   locale = locale.startsWith("en")
//     ? "en_US"
//     : `zh_${
//         (locale.endsWith("HK") || locale.endsWith("TW")) ? "TW" : "CN"
//       }`;
// } else {
//   localStorage.setItem("ptlocale", navigator.language.replace("-", "_"));
// }

const messages = {
    zh_CN,
    zh_TW,
    en_US, //undone
};

const i18n = VueI18n.createI18n({
    locale: "zh_CN",
    fallbackLocale: "zh_CN",
    messages,
});

export default i18n;
