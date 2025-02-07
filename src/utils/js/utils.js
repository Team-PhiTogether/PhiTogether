"use strict";
//utils
export const Utils = {
    /**@this {HTMLElement} */
    copyText() {
        const _this = this;
        const isHTMLElement = _this instanceof HTMLElement;
        const isHTMLInputElement = _this instanceof HTMLInputElement;
        const isHTMLTextAreaElement = _this instanceof HTMLTextAreaElement;
        let data = "";
        if (isHTMLInputElement || isHTMLTextAreaElement) {
            _this.focus();
            _this.select();
            data = _this.value;
        } else if (isHTMLElement) {
            const selection = self.getSelection();
            const range = document.createRange();
            range.selectNodeContents(_this);
            selection.removeAllRanges();
            selection.addRange(range);
            data = _this.textContent;
        } else return Promise.reject();
        if (navigator.clipboard) return navigator.clipboard.writeText(data);
        return Promise[document.execCommand("copy") ? "resolve" : "reject"]();
    },
    /**@this {HTMLElement} */
    setText(str = "") {
        const _this = this;
        const isHTMLElement = _this instanceof HTMLElement;
        const isHTMLInputElement = _this instanceof HTMLInputElement;
        const isHTMLTextAreaElement = _this instanceof HTMLTextAreaElement;
        if (isHTMLInputElement || isHTMLTextAreaElement) _this.value = str;
        else if (isHTMLElement) _this.textContent = str;
        else return Promise.reject();
        return Promise.resolve();
    },
    cnymd(time) {
        const d = new Date(time * 1e3);
        return `${d.getFullYear()}${d.getMonth() + 1}${d.getDate()}`;
    },
    loadJS: str =>
        new Promise(resolve => {
            const script = document.createElement("script");
            script.onload = resolve;
            script.onerror = resolve;
            try {
                const url = new URL(str);
                script.src = url.href;
                script.crossOrigin = "anonymous";
            } catch (_) {
                script.textContent = String(str);
            }
            document.head.appendChild(script);
        }),
    lazyload(func, ...args) {
        if (document.readyState === "complete") return func(...args);
        return new Promise(resolve => {
            const listener = () => {
                self.removeEventListener("load", listener);
                resolve(func(...args));
            };
            self.addEventListener("load", listener);
        });
    },
    /**@param {string} str */
    escapeHTML(str) {
        return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;");
    },
    /**@type {(familyName:string,{...options}?:{})=>Promise<void>} */
    addFont() {},
    throttle(func, wait) {
        let timer = null;
        return function () {
            let context = this,
                args = [...arguments];
            if (timer) return;
            timer = setTimeout(function () {
                func.apply(context, args);
                timer = null;
            }, wait);
        };
    },
};
//fuck safe
{
    let percent = 0;
    const _ = localStorage;
    if (_.setItem == "function (a,b){}") {
        delete _.setItem;
        // Object.defineProperty(_, 'setItem', { value: function(a, b) { _[a] = b } });
        percent += 20;
    }
    if (_.getItem == "function (a){return null}") {
        delete _.getItem;
        // Object.defineProperty(_, 'getItem', { value: function(a) { return _[a] } });
        percent += 20;
    }
    if (_.removeItem == "function (a){}") {
        delete _.removeItem;
        // Object.defineProperty(_, 'removeItem', { value: function(a) { delete _[a] } });
        percent += 20;
    }
    if (_.clear == "function (){}") {
        delete _.clear;
        // Object.defineProperty(_, 'removeItem', { value: function() { Object.keys(_).forEach(v => delete _[v]) } });
        percent += 20;
    }
    if (_.key == "function (a){return null}") {
        delete _.key;
        // Object.defineProperty(_, 'key', { value: function(a) { return Object.keys(_)[a] } });
        percent += 20;
    }
    self.isIncognito = percent;
}

/* dateformat*/

(function () {
    // Defining locale
    Date.shortMonths = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
    Date.longMonths = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    Date.shortDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    Date.longDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    // Defining patterns
    var replaceChars = {
        // Day
        d: function () {
            var d = this.getDate();
            return (d < 10 ? "0" : "") + d;
        },
        D: function () {
            return Date.shortDays[this.getDay()];
        },
        j: function () {
            return this.getDate();
        },
        l: function () {
            return Date.longDays[this.getDay()];
        },
        N: function () {
            var N = this.getDay();
            return N === 0 ? 7 : N;
        },
        S: function () {
            var S = this.getDate();
            return S % 10 === 1 && S !== 11
                ? "st"
                : S % 10 === 2 && S !== 12
                  ? "nd"
                  : S % 10 === 3 && S !== 13
                    ? "rd"
                    : "th";
        },
        w: function () {
            return this.getDay();
        },
        z: function () {
            var d = new Date(this.getFullYear(), 0, 1);
            return Math.ceil((this - d) / 86400000);
        },
        // Week
        W: function () {
            var target = new Date(this.valueOf());
            var dayNr = (this.getDay() + 6) % 7;
            target.setDate(target.getDate() - dayNr + 3);
            var firstThursday = target.valueOf();
            target.setMonth(0, 1);
            if (target.getDay() !== 4) {
                target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
            }
            var retVal = 1 + Math.ceil((firstThursday - target) / 604800000);

            return retVal < 10 ? "0" + retVal : retVal;
        },
        // Month
        F: function () {
            return Date.longMonths[this.getMonth()];
        },
        m: function () {
            var m = this.getMonth();
            return (m < 9 ? "0" : "") + (m + 1);
        },
        M: function () {
            return Date.shortMonths[this.getMonth()];
        },
        n: function () {
            return this.getMonth() + 1;
        },
        t: function () {
            var year = this.getFullYear();
            var nextMonth = this.getMonth() + 1;
            if (nextMonth === 12) {
                year = year++;
                nextMonth = 0;
            }
            return new Date(year, nextMonth, 0).getDate();
        },
        // Year
        L: function () {
            var L = this.getFullYear();
            return L % 400 === 0 || (L % 100 !== 0 && L % 4 === 0);
        },
        o: function () {
            var d = new Date(this.valueOf());
            d.setDate(d.getDate() - ((this.getDay() + 6) % 7) + 3);
            return d.getFullYear();
        },
        Y: function () {
            return this.getFullYear();
        },
        y: function () {
            return ("" + this.getFullYear()).substr(2);
        },
        // Time
        a: function () {
            return this.getHours() < 12 ? "am" : "pm";
        },
        A: function () {
            return this.getHours() < 12 ? "AM" : "PM";
        },
        B: function () {
            return Math.floor(
                ((((this.getUTCHours() + 1) % 24) +
                    this.getUTCMinutes() / 60 +
                    this.getUTCSeconds() / 3600) *
                    1000) /
                    24
            );
        },
        g: function () {
            return this.getHours() % 12 || 12;
        },
        G: function () {
            return this.getHours();
        },
        h: function () {
            var h = this.getHours();
            return ((h % 12 || 12) < 10 ? "0" : "") + (h % 12 || 12);
        },
        H: function () {
            var H = this.getHours();
            return (H < 10 ? "0" : "") + H;
        },
        i: function () {
            var i = this.getMinutes();
            return (i < 10 ? "0" : "") + i;
        },
        s: function () {
            var s = this.getSeconds();
            return (s < 10 ? "0" : "") + s;
        },
        v: function () {
            var v = this.getMilliseconds();
            return (v < 10 ? "00" : v < 100 ? "0" : "") + v;
        },
        // Timezone
        e: function () {
            return Intl.DateTimeFormat().resolvedOptions().timeZone;
        },
        I: function () {
            var DST = null;
            for (var i = 0; i < 12; ++i) {
                var d = new Date(this.getFullYear(), i, 1);
                var offset = d.getTimezoneOffset();

                if (DST === null) DST = offset;
                else if (offset < DST) {
                    DST = offset;
                    break;
                } else if (offset > DST) break;
            }
            return (this.getTimezoneOffset() === DST) | 0;
        },
        O: function () {
            var O = this.getTimezoneOffset();
            return (
                (-O < 0 ? "-" : "+") +
                (Math.abs(O / 60) < 10 ? "0" : "") +
                Math.floor(Math.abs(O / 60)) +
                (Math.abs(O % 60) === 0
                    ? "00"
                    : (Math.abs(O % 60) < 10 ? "0" : "") + Math.abs(O % 60))
            );
        },
        P: function () {
            var P = this.getTimezoneOffset();
            return (
                (-P < 0 ? "-" : "+") +
                (Math.abs(P / 60) < 10 ? "0" : "") +
                Math.floor(Math.abs(P / 60)) +
                ":" +
                (Math.abs(P % 60) === 0
                    ? "00"
                    : (Math.abs(P % 60) < 10 ? "0" : "") + Math.abs(P % 60))
            );
        },
        T: function () {
            var tz = this.toLocaleTimeString(navigator.language, {
                timeZoneName: "short",
            }).split(" ");
            return tz[tz.length - 1];
        },
        Z: function () {
            return -this.getTimezoneOffset() * 60;
        },
        // Full Date/Time
        c: function () {
            return this.format("Y-m-d\\TH:i:sP");
        },
        r: function () {
            return this.toString();
        },
        U: function () {
            return Math.floor(this.getTime() / 1000);
        },
    };

    // Simulates PHP's date function
    window.Date.prototype.format = function (format) {
        var date = this;
        return format.replace(/(\\?)(.)/g, function (_, esc, chr) {
            return esc === "" && replaceChars[chr] ? replaceChars[chr].call(date) : chr;
        });
    };
}).call(this);

export function parseURL(url) {
    let tmp = url.substr(url.indexOf("//") + 2);
    let host = tmp.substr(0, tmp.indexOf("/"));
    let tmp2 = tmp.substr(tmp.indexOf("/"));
    let qm = tmp2.indexOf("?");
    let path, queryParam;
    if (qm < 0) {
        path = tmp2;
        queryParam = undefined;
    } else {
        path = tmp2.substr(0, qm);
        queryParam = tmp2.substr(qm);
    }

    return {
        path,
        host,
        queryParam,
    };
}

export function getQueryObject(search) {
    let query = search.substring(1);
    let vars = query.split("&");
    let res = {};
    for (var i = 0; i < vars.length; i++) {
        let pair = vars[i].split("=");
        res[pair[0]] = decodeURIComponent(pair[1]);
    }
    return res;
}

window.Math.standardDeviation = arr =>
    Math.sqrt(
        arr.reduce((a, b) => a + (b - arr.reduce((a, b) => a + b) / arr.length) ** 2, 0) /
            arr.length
    );

const html = e => e[0];

window.dataLayer = window.dataLayer || [];
function gtag() {
    dataLayer.push(arguments);
}
gtag("js", new Date());
gtag("config", "G-NVFVE35LMW");
window.gtagLoaded = true;

window.Utils = Utils;
window.parseURL = parseURL;
window.getQueryObject = getQueryObject;
window.html = html;
