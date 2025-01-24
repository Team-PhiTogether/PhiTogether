import { partyMgr } from "@utils/js/partyMgr";

import zh_CN from "./zh_CN";
import zh_TW from "./zh_TW";
import en_US from "./en_US";

// Tips 数组
const tipsArrays = {
    zh_CN,
    en_US,
    zh_TW,
    chooseArrayByLocale() {
        return localStorage.getItem("ptlocale")
            ? (function (arr) {
                  const locale = localStorage.getItem("ptlocale").toString();
                  if (locale.startsWith("zh")) return locale.endsWith("CN") ? arr.zh_CN : arr.zh_TW;
                  else return locale.startsWith("en") ? arr.en_US : arr.zh_CN;
              })(this)
            : this.zh_CN;
    },
};

export const tipsHandler = {
    getTip: function (info) {
        // 从 tipsArray 中随机抽取元素作为返回的 Tip
        const chosenArray = tipsArrays.chooseArrayByLocale().concat(partyMgr.filter.activateTips());
        let randTipRaw = chosenArray[Math.floor(Math.random() * chosenArray.length)];
        let randTipGot,
            erVal = false;
        if (typeof randTipRaw == "function") {
            try {
                randTipGot = randTipRaw(info);
            } catch (e) {
                erVal = true;
            }
        } else {
            randTipGot = randTipRaw;
        }
        // console.log("Got tip: " + randTipGot);
        return erVal ? "" : `${"Tip: " + randTipGot}`;
    },
};
