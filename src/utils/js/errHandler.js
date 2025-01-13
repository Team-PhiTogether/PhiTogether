import shared from "./shared";
import { spMsgHandler } from "./msgHandler.js";
import {
    getConstructorName,
} from "../js/common.js";

const errsToReport = [];

/** @param {Error} error */
const sysError = (e, error, message) => {
    const type = getConstructorName(error);
    // if (message==='Script error.') return;
    let message2 = String(error);
    let detail = String(error);
    if (error instanceof Error) {
        const stack = error.stack || "Stack not available";
        if (error.name === type) message2 = error.message;
        else message2 = `${error.name}: ${error.message}`;
        const idx = stack.indexOf(message2) + 1;
        if (idx) detail = `${message2}\n${stack.slice(idx + message2.length)}`;
        else detail = `${message2}\n    ${stack.split("\n").join("\n    ")}`; //Safari
    }
    if (message) message2 = message;
    const errMessage = `[${type}] ${message2.split("\n")[0]}`;
    const errDetail = `[${type}] ${detail}`;
    if (/(orientation|Decoding)/.test(errMessage)) return;
    shared.game.loadHandler.r();
    spMsgHandler.sendError(errMessage, Utils.escapeHTML(errDetail));

    try {
        const formData = new FormData();
    
        formData.append("page", shared.game.ptmain.$route.fullPath);
        formData.append("file", e.filename);
        formData.append("msg", error.message);
        formData.append("stack", error.stack);
        formData.append("ver", window.spec.thisVersion);
        formData.append("uid", shared.game.ptmain.gameConfig.account.userBasicInfo ? shared.game.ptmain.gameConfig.account.userBasicInfo.id.toString() : "0");
    
        if (navigator.onLine)
            fetch(`https://api.phitogether.realtvop.top/errReport`, {
                method: 'POST',
                body: formData,
            })
                .catch(e => e);
        else
            errsToReport.push(formData);
    } catch (err) {
        // shit
        console.log(err);
    }
};
self.addEventListener("error", (e) => sysError(e, e.error, e.message));
self.addEventListener("unhandledrejection", (e) => sysError(e, e.reason));
// window.addEventListener("error", e => {
//     try {
//         const formData = new FormData();
    
//         formData.append("page", shared.game.ptmain.$route.fullPath);
//         formData.append("file", e.filename);
//         formData.append("msg", e.error.message);
//         formData.append("stack", e.error.stack);
//         formData.append("ver", window.spec.thisVersion);
//         formData.append("uid", shared.game.ptmain.gameConfig.account.userBasicInfo ? shared.game.ptmain.gameConfig.account.userBasicInfo.id.toString() : "0");
    
//         if (navigator.onLine)
//             fetch(`https://api.phitogether.realtvop.top/errReport`, {
//                 method: 'POST',
//                 body: formData,
//             })
//                 .catch(e => e);
//         else
//             errsToReport.push(formData);
//     } catch (err) {
//         // shit
//         console.log("emm");
//     }
// });

window.addEventListener("online", () => {
    for (const formData of errsToReport) {
        try {
            if (formData) {
                fetch(`https://api.phitogether.realtvop.top/errReport`, {
                    method: 'POST',
                    body: formData,
                })
                    .then(() => errsToReport[errsToReport.indexOf(formData)] = null)
                    .catch(e => e);
            }
        } catch (err) {
            // damn
        }
    }
});

window.addEventListener("load", (event) => {
    fetch(`https://api.phitogether.realtvop.top/t/o`)
        .catch(e => e);
});
// window.addEventListener("beforeunload", (event) => {
//     // Cancel the event as stated by the standard.
//     event.preventDefault();
//     // Chrome requires returnValue to be set.
//     event.returnValue = "";

//     try {
//         const formData = new FormData();
    
//         formData.append("lastFor", performance.now());
//         formData.append("uid", shared.game.ptmain.gameConfig.account.userBasicInfo ? shared.game.ptmain.gameConfig.account.userBasicInfo.id.toString() : "0");
    
//         // fetch(`https://api.phitogether.realtvop.top/t/c`, {
//         //     method: 'POST',
//         //     body: formData,
//         // })
//         //     .catch(e => e);
//         const xhr = new XMLHttpRequest();
    
//         xhr.open("POST", "https://api.phitogether.realtvop.top/t/c", false);
//         xhr.send(formData);
//     } catch (e) { }
// });