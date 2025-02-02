(() => {
    "use strict";
    const t = [
            "_imageBitmapOptions",
            "resizeWidth",
            "resizeHeight",
            "resizeQuality",
            "imageOrientation",
        ],
        e = ["_Blob", "_ImageData", "_SVGBlob", "_SVGImageElement"],
        a = [
            "resizeWidth",
            "resizeHeight",
            "resizeQuality",
            "imageOrientation",
            "premultiplyAlpha",
            "colorSpaceConversion",
        ],
        n = {
            ResizeQuality: ["pixelated", "low", "medium", "high"],
            ImageOrientation: ["none", "flipY"],
        },
        i = {
            COMMON_HEADER: "Failed to execute 'createImageBitmap': ",
            INVALID_STATE_IMAGE: "Provided image was in an invalid state.",
            ARGUMENT_COUNT_1: "At least one argument is required.",
            ARGUMENT_COUNT_N: "%s is not a valid argument count for any overload",
            CROP_RECT_ZERO: "The crop rect width passed to createImageBitmap must be nonzero",
            ALLOCATION_FAILED: "The ImageBitmap could not be allocated.",
            INVALID_SOURCE:
                "Argument 1 could not be converted to any of: HTMLImageElement, SVGImageElement, HTMLCanvasElement, HTMLVideoElement, ImageBitmap, Blob, CanvasRenderingContext2D, ImageData.",
            ENUM: "'%v' is not a valid value for enumeration %e",
            ALLOCATION: "The ImageBitmap couldn't be allocated.",
        },
        r = [
            "HTMLImageElement",
            "SVGImageElement",
            "HTMLVideoElement",
            "HTMLCanvasElement",
            "OffscreenCanvas",
            "ImageBitmap",
        ],
        o = "http://www.w3.org/2000/svg",
        s = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    function h(t) {
        try {
            return t.slice(0, 0), !1;
        } catch (t) {
            return !0;
        }
    }
    const c = new Int32Array(1);
    function l(t) {
        return Number.isFinite(t) ? ((c[0] = t), c[0]) : NaN;
    }
    function g(t) {
        const e = l(t);
        if (isNaN(e)) throw new TypeError("Invalid long value");
        return e;
    }
    function m(t, e) {
        const a = Object.assign(document.createElement("canvas"), {
            width: t,
            height: e,
        }).getContext("2d");
        if (
            t &&
            e &&
            !(function (t) {
                if (t.isContextLost) return t.translate(0, 0), !t.isContextLost();
                let e = !1;
                try {
                    t.fillRect(0, 0, 1, 1), (e = 0 !== t.getImageData(0, 0, 1, 1).data[3]);
                } finally {
                    return t.clearRect(0, 0, 1, 1), e;
                }
            })(a)
        )
            throw new DOMException(i.ALLOCATION, "InvalidStateError");
        return a;
    }
    function u(t) {
        return e => {
            const a = globalThis[e];
            return a && t instanceof a;
        };
    }
    const d = globalThis.createImageBitmap,
        w = !!d && ((...t) => d.call(globalThis, ...t));
    function f(t) {
        const e = new Image();
        return (
            (e.src = t),
            new Promise((t, a) => {
                (e.onload = a => {
                    N(e), t(e);
                }),
                    (e.onerror = t => {
                        const e = new DOMException(i.INVALID_STATE_IMAGE, "InvalidStateError");
                        a(e);
                    });
            })
        );
    }
    function p(t) {
        return f(
            t.getAttribute("href") || t.getAttributeNS("http://www.w3.org/1999/xlink", "href")
        );
    }
    const I = i.COMMON_HEADER;
    function E(t, e, a) {
        const r = n[a],
            o = t[e];
        if (void 0 !== o && !r.includes(o)) {
            const t = i.ENUM.replace("%v", o).replace("%e", a);
            throw new TypeError(t);
        }
    }
    function A(t, ...e) {
        let a,
            [n, r, o, s] = e.map(l);
        const h = (1 === e.length ? e[0] : e[4]) || {},
            c = "resizeWidth" in h && g(h.resizeWidth),
            m = "resizeHeight" in h && g(h.resizeHeight);
        E(h, "resizeQuality", "ResizeQuality"), E(h, "imageOrientation", "ImageOrientation");
        const u = arguments.length;
        if (!u) throw new TypeError(I + i.ARGUMENT_COUNT_1);
        if (u > 2 && u < 5)
            throw (i.ARGUMENT_COUNT_N.replace("%s", u), new TypeError(I + err_count_msg));
        if (u >= 5) {
            if (!o || !s) throw new RangeError(I + i.CROP_RECT_ZERO);
            (n = n || 0), (r = r || 0), (a = { sx: n, sy: r, sw: o, sh: s });
        }
        if (0 === c || 0 === m) {
            const t = I + i.ALLOCATION_FAILED;
            throw new DOMException(t, "InvalidStateError");
        }
        return { cropRect: a, ...h };
    }
    function y(t, ...e) {
        const a = e.length;
        return t.has("_imageBitmapOptions") && [2, 6].includes(a) ? e.slice(0, a - 1) : e;
    }
    function T(t) {
        const e = u(t);
        return e("HTMLImageElement")
            ? { width: t.naturalWidth, height: t.naturalHeight }
            : e("HTMLVideoElement")
              ? { width: t.videoWidth, height: t.videoHeight }
              : e("SVGImageElement")
                ? { width: NaN, height: NaN }
                : e("HTMLCanvasElement") ||
                    e("OffscreenCanvas") ||
                    e("ImageBitmap") ||
                    e("ImageData")
                  ? t
                  : { width: NaN, height: NaN };
    }
    function b(t, e) {
        const a = (function (t, e) {
                const { width: a, height: n } = T(t),
                    { resizeWidth: i, resizeHeight: r } = v(t, e),
                    o = e.cropRect || { sx: 0, sy: 0, sw: a, sh: n },
                    s = { dx: 0, dy: 0, dw: i || Math.abs(o.sw), dh: r || Math.abs(o.sh) },
                    h = (function (
                        t,
                        e,
                        { sx: a, sy: n, sw: i, sh: r },
                        { dx: o, dy: s, dw: h, dh: c }
                    ) {
                        i < 0 && ((a += i), (i = Math.abs(i))),
                            r < 0 && ((n += r), (r = Math.abs(r))),
                            h < 0 && ((o += h), (h = Math.abs(h))),
                            c < 0 && ((s += c), (c = Math.abs(c)));
                        const l = Math.max(a, 0),
                            g = Math.min(a + i, t),
                            m = Math.max(n, 0),
                            u = Math.min(n + r, e),
                            d = h / i,
                            w = c / r;
                        return {
                            sx: l,
                            sy: m,
                            sw: g - l,
                            sh: u - m,
                            dx: a < 0 ? o - a * d : o,
                            dy: n < 0 ? s - n * w : s,
                            dw: (g - l) * d,
                            dh: (u - m) * w,
                        };
                    })(a, n, o, s);
                return (
                    (h.resizeQuality = e.resizeQuality),
                    (h.flipY = "flipY" === e.imageOrientation),
                    (h.width = s.dw),
                    (h.height = s.dh),
                    h
                );
            })(t, e),
            { height: n } = T(t),
            {
                sx: i,
                sy: r,
                sw: o,
                sh: s,
                dx: h,
                dy: c,
                dw: l,
                dh: g,
                flipY: u,
                resizeQuality: d,
            } = a,
            w = m(a.width, a.height),
            f = w.canvas;
        return (
            "pixelated" === d ? (w.imageSmoothingEnabled = !1) : d && (w.imageSmoothingQuality = d),
            w.drawImage(t, i, r, o, s, h, c, l, g),
            u &&
                ((w.globalCompositeOperation = "copy"),
                w.setTransform(1, 0, 0, -1, 0, f.height),
                w.drawImage(f, 0, 0)),
            f
        );
    }
    async function O(t, e) {
        const a = globalThis.URL.createObjectURL(t),
            n = await f(a);
        return globalThis.URL.revokeObjectURL(t), b(n, e);
    }
    async function M(t, e) {
        const { resizeWidth: a, resizeHeight: n } = v(t, e),
            { resizeQuality: i, imageOrientation: r } = e,
            o = e.cropRect || {},
            s = o.sx || 0,
            h = o.sy || 0,
            c = o.sw || t.width,
            l = o.sh || t.height,
            g = c < 0 ? -1 * c - s : -s,
            u = l < 0 ? -1 * l - h : -h,
            d = m(Math.abs(c), Math.abs(l));
        d.putImageData(t, g, u, s, h, c, l);
        const w = "flipY" === r,
            f = a || w;
        let p;
        a
            ? ((p = m(a, n)),
              "pixelated" === i ? (p.imageSmoothingEnabled = !1) : (p.imageSmoothingQuality = i))
            : ((p = d), (d.globalCompositeOperation = "copy"));
        const I = d.canvas,
            E = p.canvas;
        return (
            w && p.setTransform(1, 0, 0, -1, 0, E.height),
            f && p.drawImage(I, 0, 0, I.width, I.height, 0, 0, E.width, E.height),
            E
        );
    }
    function v(t, e) {
        const { width: a, height: n } = T(t);
        let { resizeWidth: i, resizeHeight: r } = e;
        if (void 0 === i && void 0 !== r) {
            const { width: e, height: a } = T(t);
            i = Math.ceil(e * (r / a));
        }
        if (void 0 === r && void 0 !== i) {
            const { width: e, height: a } = T(t);
            r = Math.ceil(a * (i / e));
        }
        return { resizeWidth: i, resizeHeight: r };
    }
    function _() {
        const t = i.COMMON_HEADER + i.INVALID_STATE_IMAGE;
        throw new DOMException(t, "InvalidStateError");
    }
    function N(t) {
        const e = u(t);
        if (e("HTMLCanvasElement") || e("OffscreenCanvas") || e("ImageBitmap"))
            (0 !== t.width && 0 !== t.height) || _();
        else if (e("HTMLImageElement") || e("HTMLVideoElement") || e("SVGImageElement")) {
            const { width: e, height: a } = T(t);
            (0 !== e && 0 !== a) || _();
            let n = !1;
            try {
                n = !m(0, 0).createPattern(t, "no-repeat");
            } catch (t) {
                return "maybe";
            }
            n && _();
        }
        return !0;
    }
    let L = !1;
    const S = (function () {
            if (!w) {
                const a = t.concat(e);
                return new Set(a);
            }
            const a = [B()],
                n = new Set(a.flat()),
                i = t.filter(t => !n.has(t));
            return new Set(i);
        })(),
        C = (async function () {
            if (!w) return (L = !0), S;
            const t = [x(), H(), D(), R()],
                a = await Promise.all(t),
                n = new Set(a.flat());
            return e.filter(t => !n.has(t)).forEach(t => S.add(t)), (L = !0), S;
        })();
    function B() {
        const t = [],
            e = {};
        return (
            a.forEach(a => {
                Object.defineProperty(e, a, {
                    get() {
                        t.push(a);
                    },
                });
            }),
            w(new ImageData(1, 1), e)
                .then(t => t.close())
                .catch(() => {}),
            t.length && t.push("_imageBitmapOptions"),
            t
        );
    }
    async function x() {
        const t = [],
            e = await fetch(s).then(t => t.ok && t.blob());
        try {
            1 === (await w(e)).width && t.push("_Blob");
        } catch (t) {}
        return t;
    }
    async function H() {
        const t = [],
            e = (function (t, e) {
                try {
                    return new ImageData(1, 1);
                } catch (t) {
                    return create2dContext(0, 0).createImageData(1, 1);
                }
            })();
        try {
            1 === (await w(e)).width && t.push("_ImageData");
        } catch (t) {}
        return t;
    }
    async function D() {
        const t = [],
            e = new Blob(
                [
                    `<svg width="1" height="1" xmlns="${o}">\n      <rect width="1" height="1"/>\n    </svg>`,
                ],
                { type: "image/svg+xml" }
            );
        try {
            1 === (await w(e)).width && t.push("_SVGBlob");
        } catch (t) {}
        return t;
    }
    async function R() {
        const t = [];
        if (!("SVGImageElement" in globalThis)) return t;
        const e = t => new Promise(e => setTimeout(e, t)),
            a = document.createElementNS(o, "image");
        a.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", s);
        const n = () => {
            try {
                return N(a), !1;
            } catch (t) {
                return !0;
            }
        };
        let i = 0;
        do {
            await e(10);
        } while (n() && ++i < 300);
        try {
            await w(a), t.push("_SVGImageElement");
        } catch (t) {}
        return t;
    }
    function z(t, e, a) {
        const n = u(a);
        if (n("Blob")) {
            if (t.has("_Blob")) return !0;
            if ("image/svg+xml" === a?.type && t.has("_SVGBlob")) return !0;
        }
        return (
            !(!n("ImageData") || !t.has("_ImageData")) ||
            !(!n("SVGImageElement") || !t.has("_SVGImageElement")) ||
            !!Object.keys(e).some(e => t.has(e))
        );
    }
    function V(t, e) {
        if (L) return !1;
        const a = u(t);
        return ["Blob", "ImageData", "SVGImageElement"].some(a);
    }
    const G = t => Object.getOwnPropertyDescriptor(HTMLCanvasElement.prototype, t);
    function U() {
        throw new TypeError("Illegal Constructor");
    }
    function Q(t) {
        return t instanceof globalThis.ImageBitmap
            ? t
            : w
              ? w(t)
              : (function (t) {
                    return (
                        t instanceof HTMLCanvasElement || (t = b(t)),
                        Object.setPrototypeOf(t, U.prototype),
                        t
                    );
                })(t);
    }
    (U.prototype = Object.create({
        close() {
            G("width").set.call(this, 0), G("height").set.call(this, 0);
        },
        get width() {
            return G("width").get.call(this);
        },
        get height() {
            return G("height").get.call(this);
        },
        get [Symbol.toStringTag]() {
            return "ImageBitmap";
        },
    })),
        w || (globalThis.ImageBitmap = U),
        (globalThis.createImageBitmap = async function (t, ...e) {
            const a = A(...arguments),
                n = V(t) ? await C : S;
            if (0 === n.size) return w(...arguments);
            if (w && !z(n, a, t)) return w(...y(n, ...arguments));
            const o = u(t);
            let s;
            if (
                (r.some(o)
                    ? (N(t),
                      o("SVGImageElement") && (t = await p(t)),
                      o("HTMLImageElement") &&
                          (t.naturalWidth ||
                              t.naturalHeight ||
                              (a.resizeWidth && a.resizeHeight) ||
                              _()),
                      (s = b(t, a)))
                    : o("Blob")
                      ? (s = await O(t, a))
                      : o("ImageData") && (h(t.data.buffer) && _(), (s = await M(t, a))),
                !s)
            )
                throw new TypeError(i.INVALID_SOURCE);
            return await Q(s);
        }),
        (globalThis.createImageBitmap._original = w);
})();
