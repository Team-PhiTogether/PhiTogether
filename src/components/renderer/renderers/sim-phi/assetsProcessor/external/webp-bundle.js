!(function (A, I) {
    "object" == typeof exports && "object" == typeof module
        ? (module.exports = I())
        : "function" == typeof define && define.amd
          ? define([], I)
          : "object" == typeof exports
            ? (exports.webp = I())
            : (A.webp = I());
})(self, () =>
    (() => {
        var A = {
                395: A => {
                    var I,
                        g =
                            ((I =
                                "undefined" != typeof document && document.currentScript
                                    ? document.currentScript.src
                                    : void 0),
                            function (A) {
                                var g, B;
                                (A = void 0 !== (A = A || {}) ? A : {}).ready = new Promise(
                                    function (A, I) {
                                        (g = A), (B = I);
                                    }
                                );
                                var Q,
                                    C,
                                    E,
                                    i = Object.assign({}, A),
                                    o = [],
                                    e = (A, I) => {
                                        throw I;
                                    },
                                    t = !1,
                                    a = "";
                                t
                                    ? (a = self.location.href)
                                    : "undefined" != typeof document &&
                                      document.currentScript &&
                                      (a = document.currentScript.src),
                                    I && (a = I),
                                    (a =
                                        0 !== a.indexOf("blob:")
                                            ? a.substr(
                                                  0,
                                                  a.replace(/[?#].*/, "").lastIndexOf("/") + 1
                                              )
                                            : ""),
                                    (Q = A => {
                                        try {
                                            var I = new XMLHttpRequest();
                                            return (
                                                I.open("GET", A, !1), I.send(null), I.responseText
                                            );
                                        } catch (I) {
                                            var g = NA(A);
                                            if (g)
                                                return (function (A) {
                                                    for (var I = [], g = 0; g < A.length; g++) {
                                                        var B = A[g];
                                                        B > 255 &&
                                                            (SA &&
                                                                w(
                                                                    !1,
                                                                    "Character code " +
                                                                        B +
                                                                        " (" +
                                                                        String.fromCharCode(B) +
                                                                        ")  at offset " +
                                                                        g +
                                                                        " not in 0x00-0xFF."
                                                                ),
                                                            (B &= 255)),
                                                            I.push(String.fromCharCode(B));
                                                    }
                                                    return I.join("");
                                                })(g);
                                            throw I;
                                        }
                                    }),
                                    t &&
                                        (E = A => {
                                            try {
                                                var I = new XMLHttpRequest();
                                                return (
                                                    I.open("GET", A, !1),
                                                    (I.responseType = "arraybuffer"),
                                                    I.send(null),
                                                    new Uint8Array(I.response)
                                                );
                                            } catch (I) {
                                                var g = NA(A);
                                                if (g) return g;
                                                throw I;
                                            }
                                        }),
                                    (C = (A, I, g) => {
                                        var B = new XMLHttpRequest();
                                        B.open("GET", A, !0),
                                            (B.responseType = "arraybuffer"),
                                            (B.onload = () => {
                                                if (
                                                    200 == B.status ||
                                                    (0 == B.status && B.response)
                                                )
                                                    I(B.response);
                                                else {
                                                    var Q = NA(A);
                                                    Q ? I(Q.buffer) : g();
                                                }
                                            }),
                                            (B.onerror = g),
                                            B.send(null);
                                    });
                                var n,
                                    r = A.print || console.log.bind(console),
                                    s = A.printErr || console.warn.bind(console);
                                function D(A) {
                                    D.shown || (D.shown = {}),
                                        D.shown[A] || ((D.shown[A] = 1), s(A));
                                }
                                Object.assign(A, i),
                                    (i = null),
                                    A.arguments && (o = A.arguments),
                                    A.thisProgram && A.thisProgram,
                                    A.quit && (e = A.quit),
                                    A.wasmBinary && (n = A.wasmBinary);
                                var G,
                                    h = A.noExitRuntime || !0;
                                "object" != typeof WebAssembly &&
                                    V("no native wasm support detected");
                                var y,
                                    c = !1;
                                function w(A, I) {
                                    A || V(I);
                                }
                                function d(I) {
                                    return A["_" + I];
                                }
                                var F,
                                    S,
                                    f,
                                    k,
                                    N,
                                    R,
                                    u,
                                    Y =
                                        "undefined" != typeof TextDecoder
                                            ? new TextDecoder("utf8")
                                            : void 0;
                                function H(A, I, g) {
                                    for (var B = I + g, Q = I; A[Q] && !(Q >= B); ) ++Q;
                                    if (Q - I > 16 && A.subarray && Y)
                                        return Y.decode(A.subarray(I, Q));
                                    for (var C = ""; I < Q; ) {
                                        var E = A[I++];
                                        if (128 & E) {
                                            var i = 63 & A[I++];
                                            if (192 != (224 & E)) {
                                                var o = 63 & A[I++];
                                                if (
                                                    (E =
                                                        224 == (240 & E)
                                                            ? ((15 & E) << 12) | (i << 6) | o
                                                            : ((7 & E) << 18) |
                                                              (i << 12) |
                                                              (o << 6) |
                                                              (63 & A[I++])) < 65536
                                                )
                                                    C += String.fromCharCode(E);
                                                else {
                                                    var e = E - 65536;
                                                    C += String.fromCharCode(
                                                        55296 | (e >> 10),
                                                        56320 | (1023 & e)
                                                    );
                                                }
                                            } else C += String.fromCharCode(((31 & E) << 6) | i);
                                        } else C += String.fromCharCode(E);
                                    }
                                    return C;
                                }
                                function U(A, I) {
                                    return A ? H(f, A, I) : "";
                                }
                                function m(A, I, g, B) {
                                    if (!(B > 0)) return 0;
                                    for (var Q = g, C = g + B - 1, E = 0; E < A.length; ++E) {
                                        var i = A.charCodeAt(E);
                                        if (
                                            (i >= 55296 &&
                                                i <= 57343 &&
                                                (i =
                                                    (65536 + ((1023 & i) << 10)) |
                                                    (1023 & A.charCodeAt(++E))),
                                            i <= 127)
                                        ) {
                                            if (g >= C) break;
                                            I[g++] = i;
                                        } else if (i <= 2047) {
                                            if (g + 1 >= C) break;
                                            (I[g++] = 192 | (i >> 6)), (I[g++] = 128 | (63 & i));
                                        } else if (i <= 65535) {
                                            if (g + 2 >= C) break;
                                            (I[g++] = 224 | (i >> 12)),
                                                (I[g++] = 128 | ((i >> 6) & 63)),
                                                (I[g++] = 128 | (63 & i));
                                        } else {
                                            if (g + 3 >= C) break;
                                            (I[g++] = 240 | (i >> 18)),
                                                (I[g++] = 128 | ((i >> 12) & 63)),
                                                (I[g++] = 128 | ((i >> 6) & 63)),
                                                (I[g++] = 128 | (63 & i));
                                        }
                                    }
                                    return (I[g] = 0), g - Q;
                                }
                                function l(A) {
                                    for (var I = 0, g = 0; g < A.length; ++g) {
                                        var B = A.charCodeAt(g);
                                        B >= 55296 &&
                                            B <= 57343 &&
                                            (B =
                                                (65536 + ((1023 & B) << 10)) |
                                                (1023 & A.charCodeAt(++g))),
                                            B <= 127
                                                ? ++I
                                                : (I += B <= 2047 ? 2 : B <= 65535 ? 3 : 4);
                                    }
                                    return I;
                                }
                                function J(I) {
                                    (F = I),
                                        (A.HEAP8 = S = new Int8Array(I)),
                                        (A.HEAP16 = k = new Int16Array(I)),
                                        (A.HEAP32 = N = new Int32Array(I)),
                                        (A.HEAPU8 = f = new Uint8Array(I)),
                                        (A.HEAPU16 = new Uint16Array(I)),
                                        (A.HEAPU32 = R = new Uint32Array(I)),
                                        (A.HEAPF32 = u = new Float32Array(I)),
                                        (A.HEAPF64 = new Float64Array(I));
                                }
                                A.INITIAL_MEMORY;
                                var L,
                                    M = [],
                                    p = [],
                                    K = [],
                                    q = !1,
                                    b = 0;
                                function x() {
                                    return h || b > 0;
                                }
                                var v = 0,
                                    Z = null,
                                    W = null;
                                function T(I) {
                                    v++, A.monitorRunDependencies && A.monitorRunDependencies(v);
                                }
                                function O(I) {
                                    if (
                                        (v--,
                                        A.monitorRunDependencies && A.monitorRunDependencies(v),
                                        0 == v && (null !== Z && (clearInterval(Z), (Z = null)), W))
                                    ) {
                                        var g = W;
                                        (W = null), g();
                                    }
                                }
                                function V(I) {
                                    A.onAbort && A.onAbort(I),
                                        s((I = "Aborted(" + I + ")")),
                                        (c = !0),
                                        (y = 1),
                                        (I += ". Build with -s ASSERTIONS=1 for more info.");
                                    var g = new WebAssembly.RuntimeError(I);
                                    throw (B(g), g);
                                }
                                (A.preloadedImages = {}), (A.preloadedAudios = {});
                                var X,
                                    z,
                                    P,
                                    j,
                                    _ = "data:application/octet-stream;base64,";
                                function $(A) {
                                    return A.startsWith(_);
                                }
                                function AA(A) {
                                    try {
                                        if (A == X && n) return new Uint8Array(n);
                                        var I = NA(A);
                                        if (I) return I;
                                        if (E) return E(A);
                                        throw "both async and sync fetching of the wasm failed";
                                    } catch (A) {
                                        V(A);
                                    }
                                }
                                function IA(I) {
                                    for (; I.length > 0; ) {
                                        var g = I.shift();
                                        if ("function" != typeof g) {
                                            var B = g.func;
                                            "number" == typeof B
                                                ? void 0 === g.arg
                                                    ? BA(B)()
                                                    : BA(B)(g.arg)
                                                : B(void 0 === g.arg ? null : g.arg);
                                        } else g(A);
                                    }
                                }
                                $(
                                    (X =
                                        "data:application/octet-stream;base64,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AQVBAAsLxAEBA38gACgCGEEATARAAkACQCAAKAIEBEBBgNUAIQEMAQsgACgCFARAQYTVACEBDAELIAAoAjQgACgCCGxBAEwNASAAKAJMIQIDQCAAKAJEIAFqIAIgAUECdCIDaigCADoAACAAKAJMIgIgA2pBADYCACABQQFqIgEgACgCNCAAKAIIbEgNAAsMAQsgACABKAIAEQAACyAAIAAoAhggACgCHGo2AhggACAAKAJEIAAoAkhqNgJEIAAgACgCQEEBajYCQAsLoAEBAn8CQCAFQQBMDQAgBUEBayEHIAVBA3EiBgRAA0AgAiAAIAQQESADaiECIAAgAWohACAFQQFrIQUgBkEBayIGDQALCyAHQQNJDQADQCACIAAgBBARIANqIAAgAWoiACAEEBEgA2ogACABaiIAIAQQESADaiAAIAFqIgAgBBARIANqIQIgACABaiEAIAVBBEohBiAFQQRrIQUgBg0ACwsLUgECf0Hg0AAoAgAiASAAQQNqQXxxIgJqIQACQCACQQAgACABTRsNACAAPwBBEHRLBEAgABAKRQ0BC0Hg0AAgADYCACABDwtB4NYAQTA2AgBBfwtvAQF/IwBBgAJrIgUkAAJAIARBgMAEcQ0AIAIgA0wNACAFIAFB/wFxIAIgA2siAkGAAiACQYACSSIBGxAPGiABRQRAA0AgACAFQYACEB0gAkGAAmsiAkH/AUsNAAsLIAAgBSACEB0LIAVBgAJqJAAL1AEBAn8gAARAIAAoAqABEBIgACgCrAEQEiAAKAKoARAuIABB/ABqECUgAEGIAWoQJSAAQgA3AqgBIABCADcCoAEgAEIANwKYASAAQgA3ApABIABCADcCiAEgAEIANwKAASAAQgA3AnggACgCEBASIABBADYCECAAKAKwAUEASgRAA0AgACABQRRsaiICKALEARASIAJBADYCxAEgAUEBaiIBIAAoArABSA0ACwsgAEEANgKEAiAAQQA2ArABIAAoAogCEBIgAEEANgIMIABBADYCiAILCxcAIAAtAABBIHFFBEAgASACIAAQKxoLC44BAgJ/An4CQCAAUEUEQEKAgPz/ByAAgCEEIAGtIgUgAH5C/////w9WDQEgBCAFVA0BCwJAAn9BACAApyICRQ0AGiACrSABrX4iAKciAyABIAJyQYCABEkNABpBfyADIABCIIinGwsiAhAqIgFFDQAgAUEEay0AAEEDcUUNACABQQAgAhAPGgsgASECCyACC78BAgV/An4CQCAAKAIUIgJBCEgEQCACIQEMAQsgACgCECIDIAAoAgwiASABIANJGyEEA0AgAyAERgRAIAIhAQwCCyAAIAApAwBCCIgiBjcDACAAKAIIIANqMQAAIQcgACACQQhrIgE2AhQgACADQQFqIgM2AhAgACAHQjiGIAaENwMAIAJBD0ohBSABIQIgBQ0ACwsCQCAAKAIYRQRAIAAoAhAgACgCDEcNASABQcEASA0BCyAAQoCAgIAQNwIUCwu8BQETfyADQQBKBEAgAUF9bCERQQAgAWshEkEAIAFBAXQiE2shFCAEQQF0QQFyIRVBlM8AKAIAIQtBjM8AKAIAIQ9BmM8AKAIAIRADQCADIQRBACEIAkAgFUGYzwAoAgAiAyAAIAFrLQAAIgwgAC0AACIJa2otAABBAnQgAyAAIAFBAXQiDWstAAAiByAAIAFqLQAAIgprai0AAGpIDQAgAyAAIAFBAnRrLQAAIAAgAUF9bGotAAAiDmtqLQAAIAVKDQAgAyAOIAdrai0AACAFSg0AIAMgByAMa2otAAAgBUoNACADIAAgAUEDbGotAAAgACANai0AACIHa2otAAAgBUoNACADIAcgCmtqLQAAIAVKDQAgAyAKIAlrai0AACAFTCEICwJAIAhFDQACQCAGIBAgACAUaiIJLQAAIgMgACASaiINLQAAIghrai0AAE4EQCAQIAAgAWoiDi0AACIHIAAtAAAiCmtqLQAAIAZMDQELQZDPACgCACIDQYzPACgCACAAIAFBAXRrLQAAIAAgAWotAABraiwAACAALQAAIgggACABayIHLQAAIgprQQNsaiIMQQRqQQN1aiwAACEJIAdBlM8AKAIAIgcgAyAMQQNqQQN1aiwAACAKamotAAA6AAAgACAHIAggCWtqLQAAOgAADAELIAAgE2oiFi0AACEXIAAgEWoiGCALIA8gDyADIAdraiwAACAKIAhrQQNsamosAAAiDEEJbEE/akEHdSIZIBgtAABqai0AADoAACAJIAsgAyAMQRJsQT9qQQd1Iglqai0AADoAACANIAsgCCAMQRtsQT9qQQd1IgNqai0AADoAACAAIAsgCiADa2otAAA6AAAgDiALIAcgCWtqLQAAOgAAIBYg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AXEbKAIAEQUACyADQYD+A3EEQCAHQYAFaiANQaTSAEGs0gAgA0GA1AJxGygCABEFAAsgACgCpAJBAWsgCkoEQCAFIAIpAIgENwAAIAUgAikAkAQ3AAggBSACKQCoBjcAECAFIAIpALgGNwAYCyAAKALkESEHIAAoAuARIQYgACgC7BEhCSAAKALcESIDIAAoAugRIAxsIAhqQQR0IgVqIgQgCykAADcAACAEIAspAAg3AAggAyAFIAAoAugRamoiBCACKQBINwAAIAQgAikAUDcACCADIAUgACgC6BFBAXRqaiIEIAIpAGg3AAAgBCACKQBwNwAIIAMgBSAAKALoEUEDbGpqIgQgAikAiAE3AAAgBCACKQCQATcACCADIAUgACgC6BFBAnRqaiIEIAIpAKgBNwAAIAQgAikAsAE3AAggAyAFIAAoAugRQQVsamoiBCACKQDIATcAACAEIAIpANABNwAIIAMgBSAAKALoEUEGbGpqIgQgAikA6AE3AAAgBCACKQDwATcACCADIAUgACgC6BFBB2xqaiIEIAIpAIgCNwAAIAQgAikAkAI3AAggAyAFIAAoAugRQQN0amoiBCACKQCoAjcAACAEIAIpALACNwAIIAMgBSAAKALoEUEJbGpqIgQgAikAyAI3AAAgBCACKQDQAjcACCADIAUgACgC6BFBCmxqaiIEIAIpAOgCNwAAIAQgAikA8AI3AAggAyAFIAAoAugRQQtsamoiBCACKQCIAzcAACAEIAIpAJADNwAIIAMgBSAAKALoEUEMbGpqIgQgAikAqAM3AAAgBCACKQCwAzcACCADIAUgACgC6BFBDWxqaiIEIAIpAMgDNwAAIAQgAikA0AM3AAggAyAFIAAoAugRQQ5samoiBCACKQDoAzcAACAEIAIpAPADNwAIIAMgBSAAKALoEUEPbGpqIgMgAikAiAQ3AAAgAyACKQCQBDcACCAGIAkgEmwgCEEDdGoiA2ogAikAyAQ3AAAgAyAHaiACKQDYBDcAACAGIAAoAuwRIANqaiACKQDoBDcAACAHIAAoAuwRIANqaiACKQD4BDcAACAGIAAoAuwRQQF0IANqaiACKQCIBTcAACAHIAAoAuwRQQF0IANqaiACKQCYBTcAACAGIAAoAuwRQQNsIANqaiACKQCoBTcAACAHIAAoAuwRQQNsIANqaiACKQC4BTcAACAGIAAoAuwRQQJ0IANqaiACKQDIBTcAACAHIAAoAuwRQQJ0IANqaiACKQDYBTcAACAGIAAoAuwRQQVsIANqaiACKQDoBTcAACAHIAAoAuwRQQVsIANqaiACKQD4BTcAACAGIAAoAuwRQQZsIANqaiACKQCIBjcAACAHIAAoAuwRQQZsIANqaiACKQCYBjcAACAGIAAoAuwRQQdsIANqaiACKQCoBjcAACAHIAAoAuwRQQdsIANqaiACKQC4BjcAACAIQQFqIgggACgCoAJIDQALCwuMLgELfyMAQRBrIgskAAJAAkACQAJAAkACQAJAAkACQAJAAkAgAEH0AU0EQEGM2AAoAgAiB0EQIABBC2pBeHEgAEELSRsiBkEDdiICdiIBQQNxBEAgAUF/c0EBcSACaiIEQQN0IgFBvNgAaigCACIDQQhqIQACQCADKAIIIgIgAUG02ABqIgFGBEBBjNgAIAdBfiAEd3E2AgAMAQsgAiABNgIMIAEgAjYCCAsgAyAEQQN0IgFBA3I2AgQgASADaiIBIAEoAgRBAXI2AgQMDAsgBkGU2AAoAgAiCk0NASABBEACQEECIAJ0IgBBACAAa3IgASACdHEiAEEAIABrcUEBayIAIABBDHZBEHEiAnYiAUEFdkEIcSIAIAJyIAEgAHYiAUECdkEEcSIAciABIAB2IgFBAXZBAnEiAHIgASAAdiIBQQF2QQFxIgByIAEgAHZqIgRBA3QiAEG82ABqKAIAIgMoAggiASAAQbTYAGoiAEYEQEGM2AAgB0F+IAR3cSIHNgIADAELIAEgADYCDCAAIAE2AggLIANBCGohACADIAZBA3I2AgQgAyAGaiICIARBA3QiASAGayIEQQFyNgIEIAEgA2ogBDYCACAKBEAgCkEDdiIBQQN0QbTYAGohBUGg2AAoAgAhAwJ/IAdBASABdCIBcUUEQEGM2AAgASAHcjYCACAFDAELIAUoAggLIQEgBSADNgIIIAEgAzYCDCADIAU2AgwgAyABNgIIC0Gg2AAgAjYCAEGU2AAgBDYCAAwMC0GQ2AAoAgAiCUUNASAJQQAgCWtxQQFrIgAgAEEMdkEQcSICdiIBQQV2QQhxIgAgAnIgASAAdiIBQQJ2QQRxIgByIAEgAHYiAUEBdkECcSIAciABIAB2IgFBAXZBAXEiAHIgASAAdmpBAnRBvNoAaigCACIBKAIEQXhxIAZrIQQgASECA0ACQCACKAIQIgBFBEAgAigCFCIARQ0BCyAAKAIEQXhxIAZrIgIgBCACIARJIgIbIQQgACABIAIbIQEgACECDAELCyABKAIYIQggASABKAIMIgNHBEAgASgCCCIAQZzYACgCAEkaIAAgAzYCDCADIAA2AggMCwsgAUEUaiICKAIAIgBFBEAgASgCECIARQ0DIAFBEGohAgsDQCACIQUgACIDQRRqIgIoAgAiAA0AIANBEGohAiADKAIQIgANAAsgBUEANgIADAoLQX8hBiAAQb9/Sw0AIABBC2oiAEF4cSEGQZDYACgCACIJRQ0AQQAgBmshBAJAAkACQAJ/QQAgBkGAAkkNABpBHyAGQf///wdLDQAaIABBCHYiACAAQYD+P2pBEHZBCHEiAnQiACAAQYDgH2pBEHZBBHEiAXQiACAAQYCAD2pBEHZBAnEiAHRBD3YgASACciAAcmsiAEEBdCAGIABBFWp2QQFxckEcagsiB0ECdEG82gBqKAIAIgJFBEBBACEADAELQQAhACAGQQBBGSAHQQF2ayAHQR9GG3QhAQNAAkAgAigCBEF4cSAGayIFIARPDQAgAiEDIAUiBA0AQQAhBCACIQAMAwsgACACKAIUIgUgBSACIAFBHXZBBHFqKAIQIgJGGyAAIAUbIQAgAUEBdCEBIAINAAsLIAAgA3JFBEBBACEDQQIgB3QiAEEAIABrciAJcSIARQ0DIABBACAAa3FBAWsiACAAQQx2QRBxIgJ2IgFBBXZBCHEiACACciABIAB2IgFBAnZBBHEiAHIgASAAdiIBQQF2QQJxIgByIAEgAHYiAUEBdkEBcSIAciABIAB2akECdEG82gBqKAIAIQALIABFDQELA0AgACgCBEF4cSAGayIBIARJIQIgASAEIAIbIQQgACADIAIbIQMgACgCECIBBH8gAQUgACgCFAsiAA0ACwsgA0UNACAEQZTYACgCACAGa08NACADKAIYIQcgAyADKAIMIgFHBEAgAygCCCIAQZzYACgCAEkaIAAgATYCDCABIAA2AggMCQsgA0EUaiICKAIAIgBFBEAgAygCECIARQ0DIANBEGohAgsDQCACIQUgACIBQRRqIgIoAgAiAA0AIAFBEGohAiABKAIQIgANAAsgBUEANgIADAgLIAZBlNgA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QQAgAEEAShtB4ClqLQAAbEEDdiIFNgKkBgsCQCADKALABiIAQQxOBEAgAygCxAYhAQwBCyADIAYgAEEAIABBAEobQeApai0AAGxBA3YiATYCxAYLIAEgBXIhAAJAIAMoAuAGIgFBDE4EQCADKALkBiEBDAELIAMgBiABQQAgAUEAShtB4ClqLQAAbEEDdiIBNgLkBgsgACABciEAAkAgAygCgAciAUEMTgRAIAMoAoQHIQYMAQsgAyAGIAFBACABQQBKG0HgKWotAABsQQN2IgY2AoQHCyAAIAZyRQ0AIANBqARqQaDJAEHcARARGiADQoCAgIDwAzcCoAQgA0GAAjYChAYgA0EBNgKcBAsgAyAEKAI0IgA2AsQSIAMgAEHkAEwEfyAAQQBODQFBAAVB5AALNgLEEgtBACEAIA1BMGohEEEAIQECQCADRQ0AAn8gEEUEQCADKAIADQIgA0ECNgIAIANBxQs2AgggA0EEaiEmQQAMAQsgAygCBEUEQCADIBAQO0UNAgsgA0EEaiEmAn8CQAJAAkAgECgCMCIERQ0AIBAgBBEGAA0AIAMoAgBFBEAgA0GYCTYCCCADQQY2AgAgA0EANgIECyADKAIAIQQMAQsCQAJ/AkACfyAQKAJEBEAgA0EANgKEEkEADAELQQIhBSADKAKEEiIEQewpai0AACEBIARBAkYNASAECyEFIAMgECgCTCABayIGQQR1NgKoAiADIBAoAlQgAWsiBEEEdTYCrAIgBkEASARAIANBADYCqAILIARBAE4NAiADQawCagwBCyADQQA2AqgCIANBrAJqC0EANgIACyADIAFBD2oiASAQKAJYakEEdSIGNgK0AiADIAMoAqACIgQgASAQKAJQakEEdSIBIAEgBEobNgKwAiADKAKkAiIBIAZIBEAgAyABNgK0AgtBACEEIAVBAEwNACADKAJoIQsCQCADKAJERQRAAn8gCwRAIAMsAHgiASADKAJwDQEaIAMoAjwgAWoMAQsgAygCPAsiBEEASiIBRQRAIANBADoAiBIgA0GMEmpBADoAACADQYoSakEAOgAADAILQQIgBEE/IARBP0gbIgRBACABGyIGQQ5KIAZBJ0obIQggBkEBdCEFIAMoAkAiAUEATARAIANBixJqIAg6AAAgA0GKEmpBADoAACADQY8SaiAIOgAAIANBiRJqIARB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AnANARogAygCPCABagwBCyADKAI8CyIEQQBKIgFFBEAgA0GUEmpBADoAACADQZISakEAOgAAIANBkBJqQQA6AAAMAQtBAiAEQT8gBEE/SBsiBEEAIAEbIgZBDkogBkEnShshCCAGQQF0IQUgAygCQCIBQQBMBEAgA0GTEmogCDoAACADQZISakEAOgAAIANBlxJqIAg6AAAgA0GREmogBEEBIARBAUobIgE6AAAgA0GVEmogAToAACADQZASaiABIAVqIgE6AAAgA0GUEmogAToAAAwBCyADQZMSaiAIOgAAIANBkhJqQQA6AAAgA0GXEmogCDoAACADQZESakEJIAFrIgQgBkECQQEgAUEESht2IgEgASAEShsiAUEBIAFBAUobIgE6AAAgA0GVEmogAToAACADQZASaiABIAVqIgE6AAAgA0GUEmogAToAAAsgA0GWEmpBAToAAAJAAn8gCwRAIAMsAHoiASADKAJwDQEaIAMoAjwgAWoMAQsgAygCPAsiBEEASiIBRQRAIANBnBJqQQA6AAAgA0GaEmpBADoAACADQZgSakEAOgAADAELQQIgBEE/IARBP0gbIgRBACABGyIGQQ5KIAZBJ0obIQggBkEBdCEFIAMoAkAiAUEATARAIANBmxJqIAg6AAAgA0GaEmpBADoAACADQZ8SaiAIOgAAIANBmRJqIARBASAEQQFKGyIBOgAAIANBnRJqIAE6AAAgA0GYEmogASAFaiIBOgAAIANBnBJqIAE6AAAMAQsgA0GbEmogCDoAACADQZoSakEAOgAAIANBnxJqIAg6AAAgA0GZEmpBCSABayIEIAZBAkEBIAFBBEobdiIBIAEgBEobIgFBASABQQFKGyIBOgAAIANBnRJqIAE6AAAgA0GYEmogASAFaiIBOgAAIANBnBJqIAE6AAALIANBnhJqQQE6AAACQAJ/IAsEQCADLAB7IgEgAygCcA0BGiADKAI8IAFqDAELIAMoAjwLIgRBAEoiAUUEQCADQaQSakEAOgAAIANBohJqQQA6AAAgA0GgEmpBADoAAAwBC0ECIARBPyAEQT9IGyIEQQAgARsiBkEOSiAGQSdKGyEIIAZBAXQhBSADKAJAIgFBAEwEQCADQaMSaiAIOgAAIANBohJqQQA6AAAgA0GnEmogCDoAACADQaESaiAEQQEgBEEBShsiAToAACADQaUSaiABOgAAIANBoBJqIAEgBWoiAToAACADQaQSaiABOgAADAELIANBoxJqIAg6AAAgA0GiEmpBADoAACADQacSaiAIOgAAIANBoRJqQQkgAWsiBCAGQQJBASABQQRKG3YiASABIARKGyIBQQEgAUEBShsiAToAACADQaUSaiABOgAAIANBoBJqIAEgBWoiAToAACADQaQSaiABOgAACwwBCyAEDAELIANBphJqQQE6AABBAAtFBEACQAJ/QQAhASADQQA2ApgBQQEhDwJAAkAgAygClAFBAEoEQCADQfwAakG8zwAoAgARBgBFDQEgAyADQbQBajYCjAEgAyADNgKIASADQRI2AoQBQQNBAiADKAKEEkEAShshDwsgAyAPNgKcAQwBCyADKAIARQRAIANBigs2AgggA0EBNgIAIANBADYCBAtBAAwBCyADKAKgAiIRQQJ0IhdBAUECIAMoApQBIgtBAEwbbEEAIAMoAoQSIhZBAEobIQggEUEFdCIEIA9BBHQiBiAWQewpai0AAGpBA2xBAm1sIQwgEUEBdEECaiEOIBFBAkEBIAtBAkYbbEGgBmwhCQJAIAMoAqwSBH4gAzMBMiADMwEwfgVCAAsiKCAMrSAIrSAJrSAOrSAErSAXrXx8fHx8fCInQsAGfELg////D1YNACADKALwESEFAkACQCAnQt8GfCInIAM1AvQRVgRAIAUQEiADQQA2AvQRIAMgJ0EBEBQiBTYC8BEgBUUNASADICc+AvQRIAMoAoQSIRYgAygClAEhCwsgAyAFNgLEESADQQA2AqABIAMgBSAXaiIBNgLMESADIAEgBGoiAUECaiIFNgLQESADIAEgDmoiBEEAIAgbIgE2AtQRIAMgASARQQAgC0EAShtBACAWQQBKG0ECdGo2AqwBIAMgBCAIakEfakFgcSIBNgLYESADIAFBwAZqIgE2AoASIAMgATYCsAEgC0ECRgRAIAMgASARQaAGbGo2ArABCyADQQA2ApgBIAMgEUEDdCILNgLsESADIBFBBHQiCDYC6BEgA0EAIAEgCWoiASAMaiAoUBs2ArwSIAMgASAIIBZB7ClqLQAAIgRsaiIBNgLcESADIAEgBEEBdiALbCIEIAYgCGxqaiIBNgLgESADIAEgBCALIA9sQQN0amo2AuQRIAVBAmtBACAOEA8aIAMoAtAR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BSAdKAKkBgs6AJwGIAEgGXJBAEchCgwBCyAfQQA6AAAgC0ECa0EAOgAAIAEtAIAGRQRAIAsgHEEBdGpBADoAASALQQFrQQA6AAALIB4gHEGgBmxqIgFCADcClAYgAUEAOgCcBgsgAygChBJBAEoEQCADKALUESADKAL4EUECdGoiBCADIB4gHEGgBmxqIgEtAJ4GQQN0aiABLQCABkECdGpBiBJqKAIANgAAIAQgBC0AAiAKcjoAAgsgFSgCGCEBIBtBIGokACABBEBBACEUIAMoAgANBiADQgc3AgAgA0G+CjYCCAwGCyADIAMoAvgRQQFqIgE2AvgRIAEgAygCoAJIDQALCyADKALQEUECa0EAOwAAIANBADYC+BEgA0EANgLIEQJ/QQAhBAJAIAMoAoQSQQBMDQAgAygC/BEiASADKAKsAkgNACABIAMoArQCTCEECyADQaABaiEBIAMoApQBRQRAIAMgBDYCqAEgAyADKAL8ETYCpAEgAyABECkgAyAQED0MAQsgA0H8AGoiBUHAzwAoAgARBgBBAXEEfyADQbQBaiAQQewAEBEaIAMgBDYCqAEgAyADKAKYATYCoAEgAyADKAL8ETYCpAECQCADKAKUAUECRgRAIAMoAoASIQEgAyADKAKwATYCgBIgAyABNgKwAQwBCyADIAEQKQsgBARAIAMoAtQRIQEgAyADKAKsATYC1BEgAyABNgKsAQsgBUHEzwAoAgARAAAgA0EAIAMoApgBQQFqIgEgASADKAKcAUYbNgKYAUEBBUEACwtFBEBBACEUIAMoAgANBCADQgY3AgAgA0GuCjYCCAwECyADIAMoAvwRQQFqIhQ2AvwRIBQgAygCtAJIDQALCwJAIAMoApQBQQBMDQAgA0H8AGpBwM8AKAIAEQYADQBBACEUDAILQQEhFAwBC0EAIRQgAygCAA0AIANCBzcCACADQeEKNgIIC0EBIQQgAygClAFBAEoEQCADQfwAakHAzwAoAgARBgAhBAsgECgCNCIBBEAgECABEQAAC0EBIAQgFHENARoLIANB/ABqQczPACgCABEAACADED8gAygC8BEQEiADQgA3AvARIANCADcCDCADQgA3AhQgA0IANwIcIANBADYCJEEACyEUICZBADYCAAsgFA0BCyADKAIAIQALIAMEQCADQfwAakHMzwAoAgARAAAgAxA/IAMoAvAREBIgA0IANwLwESADQgA3AgwgA0IANwIUIANCADcCHCADQQA2AiQgA0EANgIEIAMQEgsMAQtCAUGQAhAeIgAEfyAAQoCAgIAgNwMAEEwgAAVBAAsiCUUEQEEBIQAMAgsCQAJ/IA1BMGohBQJ/QQAgCUUNABogBUUEQCAJQQI2AgBBAAwCCyAJQQA2AgAgCSAFNgIIIAlBGGoiASAFKAJAIAUoAjwQLwJAAkACQCABQQgQEEEvRw0AIAFBDhAQIQQgAUEOEBAhACABQQEQEBogAUEDEBANACAJKAIwRQ0BCyAJQQM2AgAMAQsgCUECNgIEIAUgAEEBaiIBNgIEIAUgBEEBaiIANgIAQQEgACABQQEgCUEAECENARoLIAkQHEEACwsEQCANKAIwIA0oAjQgAigCFCACKAIAEEUiAA0BQQAhAAJ/AkACQCAJBH8gCSgCCCILKAIoIQYgCSgCBARAIAkgBigCADYCDCAGKAIUIAtBAxA4RQRAIAlBAjYCACAJEBxBAAwFCyAJIAk0AmggCTQCZH4iJyALKAIAIgGsQgSGIAFB//8DcSIBrXx8QQQQFCIENgIQIARFBEAgCUEANgIUDAQLIAkgBCABICenakECdGo2AhQCQAJAIAsoAlwEQCALKAJkIQMgCygCECEFIAsoAgwhASALKAJgIgSsIihCBYYiJyAoQgKGfELUAHxBARAUIghFBEAgCUEBNgIADAYLIAkgCDYCjAIgCSAINgKIAiAIIAEgBSAIQdQAaiIBICenaiAEIANBAEEEIAEQF0UNBSALKAJcDQELIAkoAgwoAgAiBUEHa0EDSw0BCxAjIAkoAgwoAgAhBQsCQCAFQQtJDQBBhM8AKAIAIgFBtM8AKAIARwRAQdTWAEGRATYCAEHQ1gBBkgE2AgBBxNYAQZMBNgIAQcjWAEGUATYCAEHM1gBBlQE2AgBBtM8AIAE2AgALIAkoAgwoAhxFDQAQIwsCQCAJKAI4RQ0AIAkoAnhBAEwNACAJQYgBaiIBKAIADQAgASAJKAKEARBKDQAMBAsgCUEANgIECyAJIAkoAhAgCSgCZCAJKAJoIAsoAlhBAhAyRQ0BIAYgCSgCdDYCEEEBBUEACwwCCyAJEBxBAAwBCyAJQQE2AgAgCRAcQQALDQELIAkoAgAhAAsgCRAiCyAABEAgAigCABAnDAELQQAhACACKAIUIgFFDQAgASgCMEUNACACKAIAIgUEfyAFKAIIIQQCQAJAIAUoAgBBCk0EQCAFIAUoAhAgBUEUaiIAKAIAIgIgBEEBa2xqNgIQDAELIAVBACAFKAIgIgBrNgIgIAVBACAFKAIkIgJrNgIkIAVBACAFKAIoIgFrNgIoIAUgBSgCECAAIASsQgF9IienIgRsajYCECAFIAUoAhQgAiAnQgGIpyIAbGo2AhQgBSAFKAIYIAAgAWxqNgIYIAUoAhwiAUUNASAFIAEgBCAFQSxqIgAoAgAiAmxqNgIcCyAAQQAgAms2AgALQQAFQQILIQALIA1BoAFqJAAgAAuFEwEIfyAAKAIEIQUgAS0AAyEGAkAgACgCCCICQQBODQAgACgCDCIEIAAoAhRJBEAgBCgAACEDIAAgBEEDajYCDCAAIAAoAgBBGHQgA0EIdkGA/gNxIANBCHRBgID8B3EgA0EYdHJyQQh2cjYCACACQRhqIQIMAQsgABAOIAAoAgghAgsgACACAn8gACgCACIDIAJ2IgcgBSAGbEEIdiIESwRAIAAgBEF/cyACdCADaiIDNgIAIAUgBGsMAQsgBEEBagsiBWdBGHMiBmsiAjYCCCAAIAUgBnRBAWsiBTYCBAJ/IAQgB08EQCABLQAEIQcCQCACQQBODQAgACgCDCIGIAAoAhRJBEAgBigAACEEIAAgBkEDajYCDCAAIANBGHQgBEEIdkGA/gNxIARBCHRBgID8B3EgBEEYdHJyQQh2ciIDNgIAIAJBGGohAgwBCyAAEA4gACgCACEDIAAoAgghAgsgACACAn8gBSAHbEEIdiIEIAMgAnZPIgZFBEAgACAEQX9zIAJ0IANqIgM2AgAgBSAEawwBCyAEQQFqCyIEZ0EYcyIFayICNgIIIAAgBCAFdEEBayIFNgIEQQIgBg0BGiABLQAFIQYCQCACQQBODQAgACgCDCIEIAAoAhRJBEAgBCgAACEBIAAgBEEDajYCDCAAIANBGHQgAUEIdkGA/gNxIAFBCHRBgID8B3EgAUEYdHJyQQh2ciIDNgIAIAJBGGohAgwBCyAAEA4gACgCACEDIAAoAgghAgsgACACAn8gBSAGbEEIdiIBIAMgAnZJBEAgACABQX9zIAJ0IANqNgIAQQQhBCAFIAFrDAELQQMhBCABQQFqCyIDZ0EYcyIBazYCCCAAIAMgAXRBAWs2AgQgBA8LIAEtAAYhBwJAIAJBAE4NACAAKAIMIgYgACgCFEkEQCAGKAAAIQQgACAGQQNqNgIMIAAgA0EYdCAEQQh2QYD+A3EgBEEIdEGAgPwHcSAEQRh0cnJBCHZyIgM2AgAgAkEYaiECDAELIAAQDiAAKAIAIQMgACgCCCECCyAAIAICfyADIAJ2IgYgBSAHbEEIdiIESwRAIAAgBEF/cyACdCADaiIDNgIAIAUgBGsMAQsgBEEBagsiBWdBGHMiB2siAjYCCCAAIAUgB3RBAWsiBTYCBCAEIAZPBEAgAS0AByEGAkAgAkEATg0AIAAoAgwiBCAAKAIUSQRAIAQoAAAhASAAIARBA2o2AgwgACADQRh0IAFBCHZBgP4DcSABQQh0QYCA/AdxIAFBGHRyckEIdnIiAzYCACACQRhqIQIMAQsgABAOIAAoAgAhAyAAKAIIIQILIAAgAgJ/IAMgAnYiByAFIAZsQQh2IgFLBEAgACABQX9zIAJ0IANqIgM2AgAgBSABawwBCyABQQFqCyIEZ0EYcyIFayICNgIIIAAgBCAFdEEBayIFNgIEIAEgB08EQAJAIAJBAE4NACAAKAIMIgQgACgCFEkEQCAEKAAAIQEgACAEQQNqNgIMIAAgA0EYdCABQQh2QYD+A3EgAUEIdEGAgPwHcSABQRh0cnJBCHZyIgM2AgAgAkEYaiECDAELIAAQDiAAKAIAIQMgACgCCCECCwJ/IAVBnwFsQQh2IgEgAyACdkkEQCAAIAFBf3MgAnQgA2o2AgAgBSABayEDQQYMAQsgAUEBaiEDQQULIQEgACACIANnQRhzIgJrNgIIIAAgAyACdEEBazYCBCABDwsCQCACQQBODQAgACgCDCIEIAAoAhRJBEAgBCgAACEBIAAgBEEDajYCDCAAIANBGHQgAUEIdkGA/gNxIAFBCHRBgID8B3EgAUEYdHJyQQh2ciIDNgIAIAJBGGohAgwBCyAAEA4gACgCACEDIAAoAgghAgsCfyAFQaUBbEEIdiIBIAMgAnZJBEAgACABQX9zIAJ0IANqIgM2AgAgBSABayEBQQkMAQsgAUEBaiEBQQcLIQUgACACIAFnQRhzIgRrIgI2AgggACABIAR0QQFrIgQ2AgQCQCACQQBODQAgACgCDCIGIAAoAhRJBEAgBigAACEBIAAgBkEDajYCDCAAIANBGHQgAUEIdkGA/gNxIAFBCHRBgID8B3EgAUEYdHJyQQh2ciIDNgIAIAJBGGohAgwBCyAAEA4gACgCACEDIAAoAgghAgsgACACAn8gAyACdiIGIARBkQFsQQh2IgFLBEAgACABQX9zIAJ0IANqNgIAIAQgAWsMAQsgAUEBagsiA2dBGHMiAms2AgggACADIAJ0QQFrNgIEIAUgASAGSWoPCyABLQAIIQcCQCACQQBODQAgACgCDCIGIAAoAhRJBEAgBigAACEEIAAgBkEDajYCDCAAIANBGHQgBEEIdkGA/gNxIARBCHRBgID8B3EgBEEYdHJyQQh2ciIDNgIAIAJBGGohAgwBCyAAEA4gACgCACEDIAAoAgghAgsgACACAn8gAyACdiIJIAUgB2xBCHYiBEsEQCAAIARBf3MgAnQgA2oiAzYCAEEKIQYgBSAEawwBC0EJIQYgBEEBagsiBWdBGHMiB2siAjYCCCAAIAUgB3RBAWsiBTYCBCABIAZqLQAAIQcCQCACQQBODQAgACgCDCIGIAAoAhRJBEAgBigAACEBIAAgBkEDajYCDCAAIANBGHQgAUEIdkGA/gNxIAFBCHRBgID8B3EgAUEYdHJyQQh2ciIDNgIAIAJBGGohAgwBCyAAEA4gACgCACEDIAAoAgghAgsgACACAn8gAyACdiIIIAUgB2xBCHYiAUsEQCAAIAFBf3MgAnQgA2oiAzYCACAFIAFrDAELIAFBAWoLIgVnQRhzIgZrIgI2AgggACAFIAZ0QQFrIgU2AgRBACEGIAQgCUlBAXQgASAISXIiCUECdEHwzgBqKAIAIgQtAAAiAQRAA0AgAUH/AXEhCAJAIAJBAE4NACAAKAIMIgcgACgCFEkEQCAHKAAAIQEgACAHQQNqNgIMIAAgA0EYdCABQQh2QYD+A3EgAUEIdEGAgPwHcSABQRh0cnJBCHZyIgM2AgAgAkEYaiECDAELIAAQDiAAKAIAIQMgACgCCCECCyAAIAICfyADIAJ2IgcgBSAIbEEIdiIBSwRAIAAgAUF/cyACdCADaiIDNgIAIAUgAWsMAQsgAUEBagsiBWdBGHMiCGsiAjYCCCAAIAUgCHRBAWsiBTYCBCAGQQF0IAEgB0lyIQYgBC0AASEBIARBAWohBCABDQALCyAGQQggCXRqQQNqCwufIQENfyAARQRAQQAPCyAAQQA2AgAgAEGrCTYCCAJAAkAgAUUEQCAAQQI2AgAgAEHxCzYCCAwBCyABKAI8IghBA00EQCAAQQc2AgAgAEHNCTYCCAwBCyABKAJAIgItAAEhAyACLQACIQYgACACLQAAIgRBBHZBAXEiCToAKiAAIARBAXZBB3EiDDoAKSAAIARBf3NBAXEiBToAKCAAIAQgA0EIdHIgBkEQdHJBBXYiAzYCLCAMQQRPBEAgAEEDNgIAIABBrgk2AghBACEDDAELIAlFBEAgAEEENgIAIABBlwo2AghBACEDDAELIAhBA2shBCACQQNqIQYgBQRAIARBBk0EQCAAQQc2AgAgAEHZCDYCCEEAIQMMAgsCQAJAIAYtAABBnQFHDQAgAi0ABEEBRw0AIAItAAVBKkYNAQsgAEEDNgIAIABBigk2AghBACEDDAILIAAgAi0ABiACLQAHQQh0QYD+AHFyIgQ7ATAgACACLQAHQQZ2OgA0IAAgAi0ACCACLQAJQQh0QYD+AHFyIgM7ATIgAi0ACSEGIAAgA0EPakEEdjYCpAIgACAEQQ9qQQR2NgKgAiAAIAZBBnY6ADUgAUEANgJUIAEgAzYCBCABIAQ2AgAgASADNgJkIAEgBDYCYCABQQA2AlwgASADNgJYIAEgBDYCUCABQgA3AkggASADNgIQIAEgBDYCDCAAQf//AzsBiAcgAEH/AToAigcgAEEANgJ4IABCATcCcCAAQgA3AmggAkEKaiEGIAAoAiwhAyAIQQprIQQLIAMgBEsEQEEAIQMgACgCAA0CIABBBzYCACAAQfUINgIIDAELIABBDGoiASAGIAMQMCAAKAIsIQMgAC0AKARAIAAgAUEBEA06ADYgACABQQEQDToANwsgACABQQEQDSICNgJoAkAgAAJ/AkAgAgRAIAAgAUEBEA02AmwgAUEBEA0EQCAAIAFBARANNgJwIAAgAUEBEA0EfyABQQcQEwVBAAs6AHQgACABQQEQDQR/IAFBBxATBUEACzoAdSAAIAFBARANBH8gAUEHEBMFQQALOgB2IAAgAUEBEA0EfyABQQcQEwVBAAs6AHcgACABQQEQDQR/IAFBBhATBUEACzoAeCAAIAFBARANBH8gAUEGEBMFQQALOgB5IAAgAUEBEA0EfyABQQYQEwVBAAs6AHogACABQQEQDQR/IAFBBhATBUEACzoAewsgACgCbEUNAyAAIAFBARANBH8gAUEIEA0FQf8BCzoAiAcgACABQQEQDQR/IAFBCBANBUH/AQs6AIkHIAFBARANDQFB/wEMAgsgAEEANgJsDAILIAFBCBANCzoAigcLIAAoAiQEQEEAIQMgACgCAA0CIABBAzYCACAAQaIINgIIDAELIAAgAUEBEA02AjggACABQQYQDTYCPCAAQUBrIAFBAxANNgIAIAAgAUEBEA0iAjYCRAJAIAJFDQAgAUEBEA1FDQAgAUEBEA0EQCAAIAFBBhATNgJICyABQQEQDQRAIAAgAUEGEBM2AkwLIAFBARANBEAgACABQQYQEzYCUAsgAUEBEA0EQCAAIAFBBhATNgJUCyABQQEQDQRAIAAgAUEGEBM2AlgLIAFBARANBEAgACABQQYQEzYCXAsgAUEBEA0EQCAAIAFBBhATNgJgCyABQQEQDUUNACAAIAFBBhATNgJkCyAAIAAoAjwEf0EBQQIgACgCOBsFQQALNgKEEiABKAIYBEBBACEDIAAoAgANAiAAQQM2AgAgAEG+CDYCCAwBCyADIAZqIQIgAEF/IABBDGpBAhANIgl0QX9zIgY2ArgCIAZBA2wiCCAEIANrIgRNBH8gAiAEaiEMIAQgCGshBCACIAhqIQMgCQRAIAZBASAGQQFLGyEFQQAhCANAIAAgCEEcbGpBvAJqIAMgBCACLwAAIAItAAJBEHRyIgkgBCAJSRsiCRAwIAQgCWshBCADIAlqIQMgAkEDaiECIAhBAWoiCCAFRw0ACwsgACAGQRxsakG8AmogAyAEEDBBAEEFIAMgDEkbBUEHCyICBEBBACEDIAAoAgANAiAAIAI2AgAgAEGKCDYCCAwBC0EAIQZBACEIQQAhCUEAIQwgAEEMaiICQQcQDSEEIAJBARANBEAgAkEEEBMhCAsgAkEBEA0EQCACQQQQEyEGCyACQQEQDQRAIAJBBBATIQwLIAJBARANBEAgAkEEEBMhCQsgAkEBEA0EfyACQQQQEwVBAAshBSAEIQIgACgCaCIKBEAgACwAdEEAIAQgACgCcBtqIQILIAAgAiAFaiIDNgKgBiAAIAIgCWoiC0H1ACALQfUASBsiC0EAIAtBAEobQeAmai0AADYCmAYgACACQf8AIAJB/wBIGyILQQAgC0EAShtBAXRB4CdqLwEANgKMBiAAIAIgCGoiC0H/ACALQf8ASBsiC0EAIAtBAEobQeAmai0AADYCiAYgACADQf8AIANB/wBIGyIDQQAgA0EAShtBAXRB4CdqLwEANgKcBiAAIAIgBmoiA0H/ACADQf8ASBsiA0EAIANBAEobQeAmai0AAEEBdDYCkAYgAEEIIAIgDGoiAkH/ACACQf8ASBsiAkEAIAJBAEobQQF0QeAnai8BAEHNmQZsIgJBEHYgAkGAgCBJGzYClAYCQCAKRQRAIAAgACkCiAY3AqgGIAAgACkCoAY3AsAGIAAgACkCmAY3ArgGIAAgACkCkAY3ArAGIAAgACkCiAY3AsgGIAAgACkCkAY3AtAGIAAgACkCmAY3AtgGIAAgACkCoAY3AuAGIAAgACkCiAY3AugGIAAgACkCkAY3AvAGIAAgACkCmAY3AvgGIAAgACkCoAY3AoAHDAELIABBACAEIAAoAnAbIgMgACwAdWoiAiAFaiIKNgLABiAAIAMgACwAdmoiAyAFaiILNgLgBiAAIAIgCWoiB0H1ACAHQfUASBsiB0EAIAdBAEobQeAmai0AADYCuAYgACACQf8AIAJB/wBIGyIHQQAgB0EAShtBAXRB4CdqLwEANgKsBiAAIAIgCGoiB0H/ACAHQf8ASBsiB0EAIAdBAEobQeAmai0AADYCqAYgACADIAlqIgdB9QAgB0H1AEgbIgdBACAHQQBKG0HgJmotAAA2AtgGIAAgA0H/ACADQf8ASBsiB0EAIAdBAEobQQF0QeAnai8BADYCzAYgACADIAhqIgdB/wAgB0H/AEgbIgdBACAHQQBKG0HgJmotAAA2AsgGIAAgCkH/ACAKQf8ASBsiCkEAIApBAEobQQF0QeAnai8BADYCvAYgACACIAZqIgpB/wAgCkH/AEgbIgpBACAKQQBKG0HgJmotAABBAXQ2ArAGIAAgC0H/ACALQf8ASBsiCkEAIApBAEobQQF0QeAnai8BADYC3AYgACADIAZqIgpB/wAgCkH/AEgbIgpBACAKQQBKG0HgJmotAABBAXQ2AtAGIABBCCACIAxqIgJB/wAgAkH/AEgbIgJBACACQQBKG0EBdEHgJ2ovAQBBzZkGbCICQRB2IAJBgIAgSRs2ArQGIABBCCADIAxqIgJB/wAgAkH/AEgbIgJBACACQQBKG0EBdEHgJ2ovAQBBzZkGbCICQRB2IAJBgIAgSRs2AtQGIAAgACwAd0EAIAQgACgCcBtqIgIgBWoiBDYCgAcgACACIAhqIgNB/wAgA0H/AEgbIgNBACADQQBKG0HgJmotAAA2AugGIAAgAkH/ACACQf8ASBsiA0EAIANBAEobQQF0QeAnai8BADYC7AYgACACIAlqIgNB9QAgA0H1AEgbIgNBACADQQBKG0HgJmotAAA2AvgGIAAgAiAGaiIDQf8AIANB/wBIGyIDQQAgA0EAShtB4CZqLQAAQQF0NgLwBiAAIARB/wAgBEH/AEgbIgRBACAEQQBKG0EBdEHgJ2ovAQA2AvwGIABBCCACIAxqIgJB/wAgAkH/AEgbIgJBACACQQBKG0EBdEHgJ2ovAQBBzZkGbCICQRB2IAJBgIAgSRs2AvQGCyAALQAoRQRAQQAhAyAAKAIADQIgAEEENgIAIABBhgo2AggMAQtBASEDIAFBARANGkEAIQkgAEGIB2ohCgNAQQAhDANAQQAhBANAIAxBIWwiCCAJQYgCbCIGQfAOamogBGotAAAhDSABKAIEIQsCQCABKAIIIgJBAE4NACABKAIMIgcgASgCFEkEQCAHKAAAIQUgASAHQQNqNgIMIAEgASgCAEEYdCAFQQh2QYD+A3EgBUEIdEGAgPwHcSAFQRh0cnJBCHZyNgIAIAJBGGohAgwBCyABEA4gASgCCCECCyABIAICfyALIA1sQQh2IgUgASgCACIHIAJ2TyINRQRAIAEgBUF/cyACdCAHajYCACALIAVrDAELIAVBAWoLIgJnQRhzIgVrNgIIIAEgAiAFdEEBazYCBCAAIAZqIAhqIgsgBGoCfyANRQRAIAFBCBANDAELIAZBkBdqIAhqIARqLQAACzoAiwcgBEEBaiIEQQtHDQALQQAhBANAIAYgCGogBGpB+w5qLQAAIQ4gASgCBCEHAkAgASgCCCICQQBODQAgASgCDCINIAEoAhRPBEAgARAOIAEoAgghAgwBCyANKAAAIQUgASANQQNqNgIMIAEgASgCAEEYdCAFQQh2QYD+A3EgBUEIdEGAgPwHcSAFQRh0cnJBCHZyNgIAIAJBGGohAgsgASACAn8gByAObEEIdiIFIAEoAgAiDSACdkkiDkUEQCAFQQFqDAELIAEgBUF/cyACdCANajYCACAHIAVrCyICZ0EYcyIFazYCCCABIAIgBXRBAWs2AgQgBCALagJ/IA5FBEAgBiAIaiAEakGbF2otAAAMAQsgAUEIEA0LOgCWByAEQQFqIgRBC0cNAAtBACEEA0AgBiAIaiAEakGGD2otAAAhDiABKAIEIQcCQCABKAIIIgJBAE4NACABKAIMIg0gASgCFE8EQCABEA4gASgCCCECDAELIA0oAAAhBSABIA1BA2o2AgwgASABKAIAQRh0IAVBCHZBgP4DcSAFQQh0QYCA/AdxIAVBGHRyckEIdnI2AgAgAkEYaiECCyABIAICfyAHIA5sQQh2IgUgASgCACINIAJ2SSIORQRAIAVBAWoMAQsgASAFQX9zIAJ0IA1qNgIAIAcgBWsLIgJnQRhzIgVrNgIIIAEgAiAFdEEBazYCBCAEIAtqAn8gDkUEQCAGIAhqIARqQaYXai0AAAwBCyABQQgQDQs6AKEHIARBAWoiBEELRw0ACyAMQQFqIgxBCEcNAAsgCiAJQcQAbGoiAkHkCGogBiAKaiIGQQNqIgg2AgAgAkHgCGogBkHqAWo2AgAgAkHcCGogBkHJAWoiBDYCACACQdgIaiAENgIAIAJB1AhqIAQ2AgAgAkHQCGogBDYCACACQcwIaiAENgIAIAJByAhqIAQ2AgAgAkHECGogBDYCACACQcAIaiAENgIAIAJBvAhqIAZBqAFqNgIAIAJBuAhqIAZBhwFqNgIAIAJBtAhqIAQ2AgAgAkGwCGogBkHmAGo2AgAgAkGsCGogBkHFAGo2AgAgAkGoCGogBkEkajYCACACQaQIaiAINgIAIAlBAWoiCUEERw0ACyAAIAFBARANIgI2ArwRIAIEQCAAIAFBCBANOgDAEQsLIAAgAzYCBAsgAwsRACAABEAgAEEAQewAEA8aCwudOQIwfwF+IwBBQGoiIyQAIAAoAqABIi0gACgC6BEiCmwhByAAKALcESEfIC0gACgC7BEiA2whBCAAKAKEEkHsKWotAAAiEkEBdiECIAAoAuQRIRwgACgC4BEhGSAAKAK0AiEGIAAoAqQBIScgACgClAFBAkYEQCAAIABBoAFqECkLIAdBBHQhHSAKIBJsISsgBEEDdCETIAIgA2whKAJAIAAoAqgBRQ0AIAAoAqgCIhAgACgCsAJODQAgACgCpAEhBANAAkAgACgCrAEgEEECdGoiDy0AACIJRQ0AIAAoAtwRIAAoAugRIgggACgCoAEiAmwgEGpBBHRqIQsgACgChBJBAUYEQCAQQQBKBEAgCyAIIAlBBGpB1NIAKAIAEQEACyAPLQACBEAgCyAIIAlB3NIAKAIAEQEACyAEQQBKBEAgCyAIIAlBBGpB0NIAKAIAEQEACyAPLQACRQ0BIAsgCCAJQdjSACgCABEBAAwBCyAPLQABIRogAiAAKALsESIKbEEDdCAQQQN0aiICIAAoAuQRaiEHIAAoAuARIAJqIQMgDy0AAyEFIBBBAEoEQCALIAggCUEEaiICIBogBUG00gAoAgARAwAgAyAHIAogAiAaIAVBvNIAKAIAEQkACyAPLQACBEAgCyAIIAkgGiAFQcTSACgCABEDACADIAcgCiAJIBogBUHM0gAoAgARCQALIARBAEoEQCALIAggCUEEaiICIBogBUGw0gAoAgARAwAgAyAHIAogAiAaIAVBuNIAKAIAEQkACyAPLQACRQ0AIAsgCCAJIBogBUHA0gAoAgARAwAgAyAHIAogCSAaIAVByNIAKAIAEQkACyAQQQFqIhAgACgCsAJIDQALCyAdICtrIQkgEyAoayEYAkAgACgCnARFDQAgACgCqAIiESAAKAKwAiIMTg0AIABBqARqIRQDQCAAKAKwASARQaAGbGoiCC0AnAYiC0EETwRAIBFBA3QhGiAAKALsESIbQQN0IQogACgC5BEhBSAAKALgESEPIAAoAqABIQcgACgCpAQhBCAAKAKgBCEQQQAhDANAIBQgEEECdGoiAiACKAIAIBQgBEECdGooAgBrIgNB/////wdxNgIAIABBACAAKAKgBEEBaiICIAJBN0YbIhA2AqAEIABBACAAKAKkBEEBaiICIAJBN0YbIgQ2AqQEIAwgI2ogA0EBdEEYdSALbEEIdkGAAXM6AAAgDEEBaiIMQcAARw0ACyAjIA8gByAKbCAaaiIKaiAbQeDSACgCABEBACAILQCcBiEHIAAoAqQEIQQgACgCoAQhEEEAIQwDQCAUIBBBAnRqIgIgAigCACAUIARBAnRqKAIAayIDQf////8HcTYCACAAQQAgACgCoARBAWoiAiACQTdGGyIQNgKgBCAAQQAgACgCpARBAWoiAiACQTdGGyIENgKkBCAMICNqIANBAXRBGHUgB2xBCHZBgAFzOgAAIAxBAWoiDEHAAEcNAAsgIyAFIApqIBtB4NIAKAIAEQEAIAAoArACIQwLIBFBAWoiESAMSA0ACwsgCSAfaiEuIBggHGohGiAYIBlqIS8gBkEBayEwAkACQAJ/QQEgASgCLEUNABogJ0EEdCIDQRBqIQICfyAnBEAgASAvNgIYIAEgLjYCFCAaIQQgAyASawwBCyABIAAoAtwRIB1qNgIUIAEgACgC4BEgE2o2AhggACgC5BEgE2ohBEEACyEQIAEgBDYCHEEAIQQgAUEANgJoIAEoAlgiAyACQQAgEiAnIDBOG2siAiACIANKGyEpAkAgACgCrBJFDQAgECApTg0AIAECfyApIBBrIQNBACETAkAgEEEASA0AIANBAEwNACABKAJYIgogAyAQakgNACABKAIAISQCQAJAIAAoArQSDQACQCAAKAKoEiIEDQAgAEIBQZABEB4iAjYCqBIgAkUNAyAAIAE0AlggATQCAH5BARAUIgQ2ArgSIARFDQIgAEEANgLAEiAAIAQ2ArwSIAAoAqwSIQ8gACgCsBIhByAAKAKoEiELQYTPACgCACICQZzPACgCAEcEQEGM0wBBzQA2AgBBiNMAQc4ANgIAQYTTAEHPADYCAEGA0wBBADYCAEH80gBB0AA2AgBB+NIAQdEANgIAQfTSAEHSADYCAEHw0gBBADYCAEGczwAgAjYCAAsgCyAENgKIASALIAEoAgA2AgAgCyABKAIENgIEIAdBAkkNAiALIA8tAABBA3EiBDYCCCALIA8tAABBAnZBA3E2AgwgCyAPLQAAQQR2QQNxIgI2AhAgBEEBSw0CIAJBAUsNAiAPLQAAQT9LDQIgB0EBayEHIAtBGGoQPCALQQA2AkAgC0EDNgJMIAtBBDYCSCALQQU2AkQgC0FAayALNgIAIAsgASgCADYCGCALIAEoAgQ2AhwgCyABKAJINgJgIAsgASgCTDYCZCALIAEoAlA2AmggCyABKAJUNgJsIAsgASgCWDYCcAJ/IAsoAghFBEAgByALKAIEIAsoAgBsTwwBCwJ/QQBCAUGQAhAeIgVFDQAaIAVCgICAgCA3AwAQTCAFIAsoAgAiAjYCZCALKAIEIQQgBSALQRhqNgIIIAUgBDYCaCALIAQ2AhwgCyACNgIYIAtBQGsgCzYCACAFQQA2AgAgBUEYaiAPQQFqIAcQLwJAAkACQCALKAIAIAsoAgRBASAFQQAQIUUNAAJAAkAgBSgCsAFBAUcNACAFKAK0AUEDRw0AIAUoAnhBAEoNACAFKAKkASIEQQBMDQEgBSgCqAEhAkEAIQcDQCACIAdBpARsaiIPKAIELQAADQEgDygCCC0AAA0BIA8oAgwtAAANASAEIAdBAWoiB0cNAAsMAQsgC0EANgKEASAFIAU0AmggBTQCZH4iMiALKAIAIgKsQgSGIAJB//8DcSICrXx8QQQQFCIENgIQIAQNAiAFQQA2AhQgBUEBNgIADAELIAtBATYChAEgBUEANgIUIAUgBTQCaCAFNAJkfkEBEBQiAjYCECACDQIgBUEBNgIACyAFEBwgBRASQQAMAgsgBSAEIAIgMqdqQQJ0ajYCFAsgCyAFNgIUQQELC0UNAiAAKAKoEiIEKAIQQQFHBEAgAEEANgLEEgwBCyAKIBBrIQMLIAQoAnAhCwJAIAQoAghFBEAgBCgCACIFIBBsIgcgACgCvBJqIQIgByAAKAKsEmpBAWohCCAAKALAEiEHAkACQAJAAkACQCAEKAIMIgoEQCADQQBMDQUgByAIIAIgBSAKQQJ0QYDTAGooAgARAgAgA0EBRgRAIAIhBwwGCyADQQFrIgdBAXEhCiADQQJHDQEgAiEHDAILIANBAEwNBCADQQNxIQQgA0EBa0EDTw0CDAMLIAdBfnEhBiACIQcDQCAHIAUgCGoiAiAFIAdqIgcgBSAEKAIMQQJ0QYDTAGooAgARAgAgByACIAVqIgggBSAHaiIHIAUgBCgCDEECdEGA0wBqKAIAEQIAIAZBAmsiBg0ACwsgCkUNAiAHIAUgCGogBSAHaiIHIAUgBCgCDEECdEGA0wBqKAIAEQIADAILIANBfHEhBgNAIAIgCCAFEBEhDyAFIAhqIgogBWoiByAFaiICIAVqIQggBSAPaiAKIAUQESAFaiAHIAUQESAFaiIHIAIgBRARIAVqIQIgBkEEayIGDQALCyAERQ0AA0AgAiIHIAggBRARIQIgBSAIaiEIIAIgBWohAiAEQQFrIgQNAAsLIAAgBzYCwBIgAyAQaiEHDAELIAMgEGoiByAEKAIUIg0oAmxKBH8CfwJAIAQoAoQBRQRAECMgBCgChAFFDQELIA0oAmghAyANKAJwIhEgESANKAJkIhJtIgQgEmxrIRQgESAHIBJsIhtOIgJFBEAgDSgCqAEgDSgCmAEiCgR/IA0oAqABIA0oApwBIAQgCnVsIBQgCnVqQQJ0aigCAAVBAAtBpARsaiETCyADIBJsIR8CQAJAIA0oAjANACACDQAgDUEYaiEYIA0oApQBIRwgDSgCECEZA0AgFCAccUUEQCANKAKoASANKAKYASICBH8gDSgCoAEgDSgCnAEgBCACdWwgFCACdWpBAnRqKAIABUEAC0GkBGxqIRMLIA0oAiwiBkEgTgRAIBgQHyANKAIsIQYLIA0gEygCACAYKQMAIjIgBkE/ca2Ip0H/AXFBAnRqIg4tAAAiAkEJTwR/IA4gDi8BAiAyIAZBCGoiBkE/ca2Ip0F/IAJBCGt0QX9zcWpBAnRqIg4tAAAFIAILQf8BcSAGaiIJNgIsAkAgDi8BAiIDQf8BTQRAIBEgGWogAzoAACARQQFqIREgFEEBaiIUIBJIDQEgBEEBaiECQQAhFCAEIAdOBEAgAiEEDAILIAJBD3EEQCACIQQMAgsgDSACEDEgAiEEDAELQQEhDCADQZcCSw0DAkAgA0GEAkkEQCADQYACayECDAELIBggA0GCAmtBAXYiAhAQIANBAXFBAnIgAnRqIQIgDSgCLCEJIA0pAxghMgsgDSATKAIQIDIgCUE/ca2Ip0H/AXFBAnRqIgYtAAAiA0EJTwR/IAYgBi8BAiAyIAlBCGoiCUE/ca2Ip0F/IANBCGt0QX9zcWpBAnRqIgYtAAAFIAMLQf8BcSAJaiIDNgIsIAYvAQIhBiADQSBOBEAgGBAfCwJ/IAZBBE8EQCAYIAZBAmtBAXYiAxAQIAZBAXFBAnIgA3RqIQYLIAZB9wBrIAZBAWpB+QBODQAaIAZB8A1qLQAAIgNBBHYgEmwgA0EPcWtBCGoiA0EBIANBAUobCyIDIBFKDQMgAkEBaiIFIB8gEWtKDQMgESAZaiIGIANrIQwCQAJ/AkACQAJAAkACQAJAIAVBCEgNAAJ/AkACQAJAIANBAWsOBAABBAIECyAMLQAAIglBgYKECGwMAgsgDC8AACIJQYGABGwMAQsgDCgAACIJCyEOIAZBA3FFBEAgBSEDDAYLIAYgCToAACAOQRh3IQ4gDEEBaiEMIAZBAWoiBkEDcUUEQCACIQMMBgsgBiAMLQAAOgAAIAJBAWshAyAOQRh3IQ4gDEEBaiEMIAZBAWoiBkEDcUUNBCAGIAwtAAA6AAAgAkECayEPIA5BGHchDiAMQQFqIQwgBkEBaiIGQQNxDQEgAyECIA8hAwwECyADIAVODQEgAkH+////B0sNBiAFQQNxIQlBACEOIAJBA08EQCAFQXxxIQIDQCAGIA5qIAwgDmotAAA6AAAgBiAOQQFyIgNqIAMgDGotAAA6AAAgBiAOQQJyIgNqIAMgDGotAAA6AAAgBiAOQQNyIgNqIAMgDGotAAA6AAAgDkEEaiEOIAJBBGsiAg0ACwsgCUUNBgNAIAYgDmogDCAOai0AADoAACAOQQFqIQ4gCUEBayIJDQALDAYLIAYgDC0AADoAACACQQNrIQogDkEYdyEOIAxBAWohDCAGQQFqIgZBA3ENASAPIQIgCiEDDAILIAYgDCAFEBEaDAQLIAYgDC0AADoAACACQQRrIQMgDkEYdyEOIAZBAWohBiAMQQFqIQwgCiECC0EAIAJBBUgNARoLIANBAnYiCkEHcSEIQQAhAiAKQQFrQQdPBEAgCkH4////A3EhHQNAIAYgAkECdCIKaiAONgIAIAYgCkEEcmogDjYCACAGIApBCHJqIA42AgAgBiAKQQxyaiAONgIAIAYgCkEQcmogDjYCACAGIApBFHJqIA42AgAgBiAKQRhyaiAONgIAIAYgCkEccmogDjYCACACQQhqIQIgHUEIayIdDQALCyAIBEADQCAGIAJBAnRqIA42AgAgAkEBaiECIAhBAWsiCA0ACwsgA0F8cQsiCSADTg0AIAMgCUF/c2ohAiADQQNxIg4EQANAIAYgCWogCSAMai0AADoAACAJQQFqIQkgDkEBayIODQALCyACQQNJDQADQCAGIAlqIAkgDGotAAA6AAAgBiAJQQFqIgJqIAIgDGotAAA6AAAgBiAJQQJqIgJqIAIgDGotAAA6AAAgBiAJQQNqIgJqIAIgDGotAAA6AAAgCUEEaiIJIANHDQALCyAFIBFqIREgEiAFIBRqIhRMBEADQCAUIBJrIRQgBCICQQFqIQQCQCACIAdODQAgBEEPcQ0AIA0gBBAxCyASIBRMDQALCyARIBtODQAgFCAccUUNACANKAKoASANKAKYASICBH8gDSgCoAEgDSgCnAEgBCACdWwgFCACdWpBAnRqKAIABUEAC0GkBGxqIRMLIA0oAjAEQCANQQE2AjAMAgtBACEGIA0oAiggDSgCJEYEQCANKAIsQcAASiEGCyANIAY2AjAgBg0BIBEgG0gNAAsLIA0gByAEIAQgB0obEDFBACEMCyANAn9BASANKAIwDQAaQQAgDSgCKCANKAIkRw0AGiANKAIsQcAASgsiAjYCMAJAIAxFBEAgAkUNASARIB9ODQELIA1BBUEDIAIbNgIAQQAMAgsgDSARNgJwQQEMAQsgDSANKAIQIA0oAmQgDSgCaCAHQQEQMgsFQQELRQ0CCwJAIAcgC04EQCAAQQE2ArQSDAELIAAoArQSRQ0BCyAAKAKoEiICBEAgAigCFBAiIAJBADYCFCACEBILIABBADYCqBIgACgCxBIiCkEATA0AIAAoArwSIAEoAkwiBCABKAJUIgIgJGxqaiEHIAEoAlAgBGshFiABKAJYIAJrISFBACEEQQAhAkEAIR0jAEGAAmsiMSQAIApBGW0hAwJAIApB5ABLDQAgB0UNACAWQQBMDQAgIUEATA0AQQEhBCAhQQFrIhRBAXYgFkEBayIfQQF2IAMgA0EBdEEBciAWShsiAyADQQF0QQFyICFKGyIXQQBMDQBBACEEQgEgFkEBdCIYIBggF0EBdCIKQQJqbCIDakH+H2oQFCILRQ0AQQAgF2shIiALIApBAXIiBCAWbEEBdGoiFSAYayIGQQAgGBAPGiAxQQBBgAIQDyEbIBZBfnEhCiAWQQFxIRwgFkEBayENIAMgC2ohHiAEIARsIRlB/wEhJkH/ASEJIAchBANAQQAhCCAKIQMgDQRAA0AgGyAEIAhqLQAAIhJqQQE6AAAgGyAEIAhBAXJqLQAAIhNqQQE6AAAgEyASIAIgAiASSSIFGyICIAIgE0kiDxshAiATIBIgJSAFGyAPGyElIBMgEiAJIAkgEkoiBRsiDyAPIBNKIg8bIQkgEyASICYgBRsgDxshJiAIQQJqIQggA0ECayIDDQALCyAcBEAgGyAEIAhqLQAAIg9qQQE6AAAgDyAmIAkgD0oiAxshJiAPIAkgAxshCSAPICUgAiAPSSIDGyElIA8gAiADGyECCyAEICRqIQQgHUEBaiIdICFHDQALIAIgCWshCEF/IQRBACECQQAhAwNAIAMgG2otAAAEfyACQQFqIQIgBEEATgRAIAMgBGsiBCAIIAQgCEgbIQgLIAMFIAQLIQoCQCAbIANBAXIiBGotAABFBEAgCiEEDAELIAJBAWohAiAKQQBIDQAgBCAKayIKIAggCCAKShshCAsgA0ECaiIDQYACRw0ACyAIQQJ0IgkgCEEMbEECdSIFayEPIBggHmpB/g9qISpBASEDA0AgKiADQQF0IgpqAn8gAyADIAVMDQAaQQAgAyAJTg0AGiAJIANrIAVsIA9tC0ECdiIEOwEAICogCmtBACAEazsBACADQQFqIgNBgAhHDQALICpBADsBAEGAgBAgGW4hIAJAIAJBA0gNACAhICJMDQAgGEECayESIBYgF2shCiAXQQFqIgIhDiAXQQFrIQwgFSAfQQF0aiETIBZBfnEhBSAWQQFxIR0gAkF+cSEPIAJBAXEhGCAXQX9zIiwgFmohGyALIQIgByEJA0ACQCAWQQBMIh8NAEEAIQhBACEDIAUhBCANBEADQCAVIANBAXQiEWogAyAJai0AACAIQf//A3FqIhwgBiARai8BAGoiGSACIBFqIggvAQBrOwEAIAggGTsBACAVIANBAXIiCEEBdCIZaiAIIAlqLQAAIBxB//8DcWoiCCAGIBlqLwEAaiIcIAIgGWoiGS8BAGs7AQAgGSAcOwEAIANBAmohAyAEQQJrIgQNAAsLIB1FDQAgFSADQQF0IgRqIAQgBmovAQAgCCADIAlqLQAAamoiAyACIARqIgQvAQBrOwEAIAQgAzsBAAsgAiAWQQF0aiIcIBVGIRkgFyAiTARAQQAhAyAPIQgCQCAKAn9BACAXQQBIDQAaA0AgHiADQQF0aiAgIBUgFyADa0EBdGovAQAgFSADIAxqQQF0ai8BAGpB//8DcWxBEHY7AQAgHiADQQFyIgRBAXRqICAgFSAXIARrQQF0ai8BACAVIAMgF2pBAXRqLwEAakH//wNxbEEQdjsBACADQQJqIQMgCEECayIIDQALIA4gGEUNABogHiADQQF0aiAgIBUgFyADa0EBdGovAQAgFSADIAxqQQF0ai8BAGpB//8DcWxBEHY7AQAgDgsiBEwNACAWIBcgBCIDaiIIa0EBcQRAIB4gBEEBdGogICAVIAhBAXRqLwEAIBUgBCAsakEBdGovAQBrQf//A3FsQRB2OwEAIARBAWohAwsgBCAbRiEIIAohBCAIDQADQCAeIANBAXRqICAgFSADIBdqQQF0ai8BACAVIAMgLGpBAXRqLwEAa0H//wNxbEEQdjsBACAeIANBAWoiBEEBdGogICAVIAQgF2pBAXRqLwEAIBUgAyAXa0EBdGovAQBrQf//A3FsQRB2OwEAIANBAmoiAyAKRw0ACyAKIQQLIAQgFkgEQANAIB4gBEEBdGogICATLwEAQQF0IBUgEiAEIBdqa0EBdGovAQAgFSAEICxqQQF0ai8BAGprQf//A3FsQRB2OwEAIARBAWoiBCAWRw0ACwtBACEDIB9FBEADQAJAICUgAyAHaiIELQAAIghMDQAgCCAmTA0AIAQgKiAeIANBAXRqLwEAIAhBAnRrQQF0ai4BACAIaiIEQQAgBEEAShsiBEH/ASAEQf8BSBs6AAALIANBAWoiAyAWRw0ACwsgByAkaiEHCyAkQQAgFCAiShtBACAiQQBOGyAJaiEJIAIhBiALIBwgGRshAiAiQQFqIiIgIUcNAAsLIAsQEkEBIQQLIDFBgAJqJAAgBEUNAQsgACgCvBIgECAkbGoMAgsgACgCuBIQEiAAQgA3ArgSIAAoAqgSIgIEQCACKAIUECIgAkEANgIUIAIQEgsgAEEANgKoEgtBAAsiBDYCaCAERQ0CCyAQIAEoAlQiAkgEQCABIAEoAhQgAiAQayIHIAAoAugRbGo2AhQgASAAKALsESAHQQF1bCIDIAEoAhhqNgIYIAEgASgCHCADajYCHAJAIARFBEBBACEEDAELIAEgBCABKAIAIAdsaiIENgJoCyACIRALQQEgECApTg0AGiABIAEoAkwiByABKAIUajYCFCABIAdBAXUiAyABKAIYajYCGCABIAEoAhwgA2o2AhwgBARAIAEgBCAHajYCaAsgASAQIAJrNgIIIAEgKSAQazYCECABIAEoAlAgB2s2AgwgASABKAIsEQYACyEMIAAoApwBIC1BAWpHDQEgJyAwTg0BIAAoAtwRICtrIC4gACgC6BFBBHRqICsQERpBACAoayIBIAAoAuARaiAvIAAoAuwRQQN0aiAoEBEaIAAoAuQRIAFqIBogACgC7BFBA3RqICgQERoMAQsgACgCAEUEQCAAQagLNgIIIABBAzYCACAAQQA2AgQLQQAhDAsgI0FAayQAIAwL+gICCH8EfkECIQYCQCAAKAIAIgdBDEsNACAAKAIIIQMgACgCBCEBAkACQCAHQQtPBEAgACgCKCICIAJBH3UiAmogAnMiCCABQQFqQQJtIgJOIAAoAiQiBCAEQR91IgRqIARzIgQgAk4gACgCICIFIAVBH3UiBWogBXMiBSABTiAANQIwIAGsIgkgA0EBa6wiCiAFrX58WiAANQI0IAKsIgsgA0EBakECbUEBa6wiDCAErX58WnEgADUCOCAIrSAMfiALfFpxcXFxIAAoAhBBAEdxIAAoAhRBAEdxIAAoAhhBAEdxIQMgB0EMRw0BIAAoAhxFDQMgASAAKAIsIgEgAUEfdSIBaiABcyIBTCADcUUNAyAANQI8IAGtIAp+IAl8Wg0CDAMLIAAoAhQhAiAAKAIQRQ0CIAIgAkEfdSIIaiAIcyICIAEgB0GbDWotAABsIgFIDQIgADUCGCABrCADQQFrrCACrX58Wg0BDAILIANFDQELQQAhBgsgBgs5AQF/IAAoArgSEBIgAEIANwK4EiAAKAKoEiIBBEAgASgCFBAiIAFBADYCFCABEBILIABBADYCqBILmQIAIABFBEBBAA8LAn8CQCAABH8gAUH/AE0NAQJAQfTXACgCACgCAEUEQCABQYB/cUGAvwNGDQMMAQsgAUH/D00EQCAAIAFBP3FBgAFyOgABIAAgAUEGdkHAAXI6AABBAgwECyABQYBAcUGAwANHIAFBgLADT3FFBEAgACABQT9xQYABcjoAAiAAIAFBDHZB4AFyOgAAIAAgAUEGdkE/cUGAAXI6AAFBAwwECyABQYCABGtB//8/TQRAIAAgAUE/cUGAAXI6AAMgACABQRJ2QfABcjoAACAAIAFBBnZBP3FBgAFyOgACIAAgAUEMdkE/cUGAAXI6AAFBBAwECwtB4NYAQRk2AgBBfwVBAQsMAQsgACABOgAAQQELC7wCAAJAAkACQAJAAkACQAJAAkACQAJAAkAgAUEJaw4SAAgJCggJAQIDBAoJCgoICQUGBwsgAiACKAIAIgFBBGo2AgAgACABKAIANgIADwsgAiACKAIAIgFBBGo2AgAgACABMgEANwMADwsgAiACKAIAIgFBBGo2AgAgACABMwEANwMADwsgAiACKAIAIgFBBGo2AgAgACABMAAANwMADwsgAiACKAIAIgFBBGo2AgAgACABMQAANwMADwsgAiACKAIAQQdqQXhxIgFBCGo2AgAgACABKwMAOQMADwsgACACQQARBQALDwsgAiACKAIAIgFBBGo2AgAgACABNAIANwMADwsgAiACKAIAIgFBBGo2AgAgACABNQIANwMADwsgAiACKAIAQQdqQXhxIgFBCGo2AgAgACABKQMANwMAC3IBA38gACgCACwAAEEwa0EKTwRAQQAPCwNAIAAoAgAhA0F/IQEgAkHMmbPmAE0EQEF/IAMsAABBMGsiASACQQpsIgJqIAFB/////wcgAmtKGyEBCyAAIANBAWo2AgAgASECIAMsAAFBMGtBCkkNAAsgAgucFQIRfwJ+IwBB0ABrIgUkACAFIAE2AkwgBUE3aiEUIAVBOGohEEEAIQECQAJAAkACQANAIAFB/////wcgDGtKDQEgASAMaiEMIAUoAkwiCSEBAkACQAJAIAktAAAiCARAA0ACQAJAIAhB/wFxIgZFBEAgASEIDAELIAZBJUcNASABIQgDQCABLQABQSVHDQEgBSABQQJqIgY2AkwgCEEBaiEIIAEtAAIhCiAGIQEgCkElRg0ACwsgCCAJayIBQf////8HIAxrIhVKDQcgAARAIAAgCSABEB0LIAENBkF/IQ9BASEGAkAgBSgCTCIBLAABQTBrQQpPDQAgAS0AAkEkRw0AIAEsAAFBMGshD0EBIRFBAyEGCyAFIAEgBmoiATYCTEEAIQ0CQCABLAAAIgtBIGsiCEEfSwRAIAEhBgwBCyABIQZBASAIdCIHQYnRBHFFDQADQCAFIAFBAWoiBjYCTCAHIA1yIQ0gASwAASILQSBrIghBIE8NASAGIQFBASAIdCIHQYnRBHENAAsLAkAgC0EqRgRAIAUCfwJAIAYsAAFBMGtBCk8NACAFKAJMIgEtAAJBJEcNACABLAABQQJ0IARqQcABa0EKNgIAIAEsAAFBA3QgA2pBgANrKAIAIQ5BASERIAFBA2oMAQsgEQ0GQQAhEUEAIQ4gAARAIAIgAigCACIBQQRqNgIAIAEoAgAhDgsgBSgCTEEBagsiATYCTCAOQQBODQFBACAOayEOIA1BgMAAciENDAELIAVBzABqEEIiDkEASA0IIAUoAkwhAQtBACEGQX8hBwJ/QQAgAS0AAEEuRw0AGiABLQABQSpGBEAgBQJ/AkAgASwAAkEwa0EKTw0AIAUoAkwiAS0AA0EkRw0AIAEsAAJBAnQgBGpBwAFrQQo2AgAgASwAAkEDdCADakGAA2soAgAhByABQQRqDAELIBENBiAABH8gAiACKAIAIgFBBGo2AgAgASgCAAVBAAshByAFKAJMQQJqCyIBNgJMIAdBf3NBH3YMAQsgBSABQQFqNgJMIAVBzABqEEIhByAFKAJMIQFBAQshEgNAIAYhE0EcIQggASwAAEHBAGtBOUsNCSAFIAFBAWoiCzYCTCABLAAAIQYgCyEBIAYgE0E6bGpBv8oAai0AACIGQQFrQQhJDQALAkACQCAGQRtHBEAgBkUNCyAPQQBOBEAgBCAPQQJ0aiAGNgIAIAUgAyAPQQN0aikDADcDQAwCCyAARQ0IIAVBQGsgBiACEEEgBSgCTCELDAILIA9BAE4NCgtBACEBIABFDQcLIA1B//97cSIKIA0gDUGAwABxGyEGQQAhDUGACCEPIBAhCAJAAkACQAJ/AkACQAJAAkACfwJAAkACQAJAAkACQAJAIAtBAWssAAAiAUFfcSABIAFBD3FBA0YbIAEgExsiAUHYAGsOIQQUFBQUFBQUFA4UDwYODg4UBhQUFBQCBQMUFAkUARQUBAALAkAgAUHBAGsOBw4UCxQODg4ACyABQdMARg0JDBMLIAUpA0AhFkGACAwFC0EAIQECQAJAAkACQAJAAkACQCATQf8BcQ4IAAECAwQaBQYaCyAFKAJAIAw2AgAMGQsgBSgCQCAMNgIADBgLIAUoAkAgDKw3AwAMFwsgBSgCQCAMOwEADBYLIAUoAkAgDDoAAAwVCyAFKAJAIAw2AgAMFAsgBSgCQCAMrDcDAAwTCyAHQQggB0EISxshByAGQQhyIQZB+AAhAQsgECEKIAFBIHEhCSAFKQNAIhZQRQRAA0AgCkEBayIKIBanQQ9xQdDOAGotAAAgCXI6AAAgFkIPViELIBZCBIghFiALDQALCyAKIQkgBSkDQFANAyAGQQhxRQ0DIAFBBHZBgAhqIQ9BAiENDAMLIBAhASAFKQNAIhZQRQRAA0AgAUEBayIBIBanQQdxQTByOgAAIBZCB1YhCSAWQgOIIRYgCQ0ACwsgASEJIAZBCHFFDQIgByAQIAlrIgFBAWogASAHSBshBwwCCyAFKQNAIhZCAFMEQCAFQgAgFn0iFjcDQEEBIQ1BgAgMAQsgBkGAEHEEQEEBIQ1BgQgMAQtBgghBgAggBkEBcSINGwshDyAQIQkCQCAWQoCAgIAQVARAIBYhFwwBCwNAIAlBAWsiCSAWIBZCCoAiF0IKfn2nQTByOgAAIBZC/////58BViEBIBchFiABDQALCyAXpyIKBEADQCAJQQFrIgkgCiAKQQpuIgFBCmxrQTByOgAAIApBCUshCyABIQogCw0ACwsLIBJBACAHQQBIGw0OIAZB//97cSAGIBIbIQYCQCAFKQNAIhZCAFINACAHDQAgECIJIQhBACEHDAwLIAcgFlAgECAJa2oiASABIAdIGyEHDAsLAn9B/////wcgByAHQQBIGyILIgZBAEchCAJAAkACQCAFKAJAIgFB6gsgARsiCSIBQQNxRQ0AIAZFDQADQCABLQAARQ0CIAZBAWsiBkEARyEIIAFBAWoiAUEDcUUNASAGDQALCyAIRQ0BCwJAIAEtAABFDQAgBkEESQ0AA0AgASgCACIIQX9zIAhBgYKECGtxQYCBgoR4cQ0BIAFBBGohASAGQQRrIgZBA0sNAAsLIAZFDQADQCABIAEtAABFDQIaIAFBAWohASAGQQFrIgYNAAsLQQALIgEgCWsgCyABGyIBIAlqIQggB0EATgRAIAohBiABIQcMCwsgCiEGIAEhByAILQAADQ0MCgsgBwRAIAUoAkAMAgtBACEBIABBICAOQQAgBhAbDAILIAVBADYCDCAFIAUpA0A+AgggBSAFQQhqIgE2AkBBfyEHIAELIQhBACEBAkADQCAIKAIAIglFDQECQCAFQQRqIAkQQCIJQQBIIgoNACAJIAcgAWtLDQAgCEEEaiEIIAcgASAJaiIBSw0BDAILCyAKDQ0LQT0hCCABQQBIDQsgAEEgIA4gASAGEBsgAUUEQEEAIQEMAQtBACEHIAUoAkAhCANAIAgoAgAiCUUNASAFQQRqIAkQQCIJIAdqIgcgAUsNASAAIAVBBGogCRAdIAhBBGohCCABIAdLDQALCyAAQSAgDiABIAZBgMAAcxAbIA4gASABIA5IGyEBDAgLIBJBACAHQQBIGw0IQT0hCCAAIAUrA0AgDiAHIAYgAUEAERIAIgFBAE4NBwwJCyAFIAUpA0A8ADdBASEHIBQhCSAKIQYMBAsgBSABQQFqIgY2AkwgAS0AASEIIAYhAQwACwALIAANByARRQ0CQQEhAQNAIAQgAUECdGooAgAiAARAIAMgAUEDdGogACACEEFBASEMIAFBAWoiAUEKRw0BDAkLC0EBIQwgAUEKTw0HA0AgBCABQQJ0aigCAA0BIAFBAWoiAUEKRw0ACwwHC0EcIQgMBAsgCCAJayILIAcgByALSBsiB0H/////ByANa0oNAkE9IQggByANaiIKIA4gCiAOShsiASAVSg0DIABBICABIAogBhAbIAAgDyANEB0gAEEwIAEgCiAGQYCABHMQGyAAQTAgByALQQAQGyAAIAkgCxAdIABBICABIAogBkGAwABzEBsMAQsLQQAhDAwDC0E9IQgLQeDWACAINgIAC0F/IQwLIAVB0ABqJAAgDAtZAQF/IAAgACgCSCIBQQFrIAFyNgJIIAAoAgAiAUEIcQRAIAAgAUEgcjYCAEF/DwsgAEIANwIEIAAgACgCLCIBNgIcIAAgATYCFCAAIAEgACgCMGo2AhBBAAurBgIGfwR+IwBBEGsiByQAQQIhBQJAIANFDQAgAEEATA0AIAFBAEwNAAJAIAJFDQAgAigCCARAIAAhBCABIQYgAigCFCIAQQBKIAIoAgxBfnEiCCACKAIQQX5xIglyQQBOcSACKAIYIgFBAEpxIAQgCEpxIAAgBExxIAQgCGsgAE5xIAYgCUpxIAEgBkxxIAYgCWsgAU5xRQ0CCyACKAIcRQ0AIAcgAigCIDYCDCAHIAIoAiQ2AgggACABIAdBDGogB0EIahBHRQ0BIAcoAgghASAHKAIMIQALIAMgATYCCCADIAA2AgQgAEEATA0AIAFBAEwNACADKAIAIgRBDEsNAAJAIAMoAgxBAEoNACADKAJQDQAgAK0iCiAEQZsNai0AACIGrX5C/////wdWDQEgAa0iCyAAIAZsIgisfiEMAn8gBEELSQRAQgAhCkIAIQtBACEGQQAMAQsgCiALfkIAIARBDEYiBRshCiAAQQFqQQF2IgatIAFBAWpBAXatfiELIABBACAFGwshCUEBIQUgC0IBhiINIAogDHx8QQEQFCIARQ0BIAMgADYCECADIAA2AlAgBEELTwRAIAMgDKciBTYCMCADIAg2AiAgAyALpyIBNgI0IAMgBjYCJCADIAE2AjggAyAGNgIoIAMgACAFaiIANgIUIAMgACABajYCGCAEQQxGBEAgAyAAIA2najYCHAsgAyAJNgIsIAMgCj4CPAwBCyADIAw+AhggAyAINgIUCyADED4iBQ0AIAJFDQAgAigCMEUEQEEAIQUMAQsgAygCCCECAkAgAygCAEEKTQRAIAMgAygCECADQRRqIgAoAgAiASACQQFrbGo2AhAMAQtBACEFIANBACADKAIgIgBrNgIgIANBACADKAIkIgFrNgIkIANBACADKAIoIgRrNgIoIAMgAygCECAAIAKsQgF9IgynIgJsajYCECADIAMoAhQgASAMQgGIpyIAbGo2AhQgAyADKAIYIAAgBGxqNgIYIAMoAhwiBEUNASADIAQgA0EsaiIAKAIAIgEgAmxqNgIcC0EAIQUgAEEAIAFrNgIACyAHQRBqJAAgBQstAQF/IAAoAggiAQRAIAAoAgwgACgCECABEQQAIQEgACAAKAIUIAFFcjYCFAsLmQECAn8BfiADKAIAIQQCQCACKAIAIgUNACABQQBMDQAgAa0iBiAErCAArH58QgF9IAaApyEFCwJAIAQNACAAQQBMDQAgAK0iBiAFrCABrH58QgF9IAaApyEEC0EAIQACQCAFQf////8DSg0AIAVBAEwNACAEQQBMDQAgBEH/////A0oNACACIAU2AgAgAyAENgIAQQEhAAsgAAtvAQJ/IwBBgAhrIgQkAAJAIABFBEBBACABIAIgA0EAEC0hAwwBCyADQYAETARAIAAgASACIAMgBBAtIQMMAQsgA61BAhAUIgVFBEBBACEDDAELIAAgASACIAMgBRAtIQMgBRASCyAEQYAIaiQAIAMLFwAgASgCACAAKAIAQQQgASgCCHQQERoLMQEBfyAAQQEgAXSsQQQQHiICNgIAIAJFBEBBAA8LIAAgATYCCCAAQSAgAWs2AgRBAQuPAQEBf0GEzwAoAgAiAEGszwAoAgBHBEBBsNUAQfwANgIAQazVAEH9ADYCAEGc1QBB/AA2AgBBlNUAQf0ANgIAQbjVAEH+ADYCAEG01QBB/wA2AgBBqNUAQYABNgIAQaTVAEH+ADYCAEGg1QBB/wA2AgBBmNUAQYEBNgIAQZDVAEGCATYCAEGszwAgADYCAAsL2wQBAX9BhM8AKAIAIgBBoM8AKAIARwRAQazUAEHTADYCAEGo1ABB0wA2AgBBpNQAQdQANgIAQaDUAEHVADYCAEGc1ABB1gA2AgBBmNQAQdcANgIAQZTUAEHYADYCAEGQ1ABB2QA2AgBBjNQAQdoANgIAQYjUAEHbADYCAEGE1ABB3AA2AgBBgNQAQd0ANgIAQfzTAEHeADYCAEH40wBB3wA2AgBB9NMAQeAANgIAQfDTAEHTADYCAEHs0wBB4QA2AgBB6NMAQeEANgIAQeTTAEHiADYCAEHg0wBB4wA2AgBB3NMAQeQANgIAQdjTAEHlADYCAEHU0wBB5gA2AgBB0NMAQecANgIAQczTAEHoADYCAEHI0wBB6QA2AgBBxNMAQeoANgIAQcDTAEHrADYCAEG80wBB7AA2AgBBuNMAQe0ANgIAQbTTAEHuADYCAEGw0wBB4QA2AgBB7NQAQeEANgIAQejUAEHhADYCAEHk1ABB4gA2AgBB4NQAQeMANgIAQdzUAEHkADYCAEHY1ABB5QA2AgBB1NQAQeYANgIAQdDUAEHnADYCAEHM1ABB6AA2AgBByNQAQekANgIAQcTUAEHqADYCAEHA1ABB6wA2AgBBvNQAQewANgIAQbjUAEHtADYCAEG01ABB7gA2AgBBsNQAQeEANgIAQZTTAEHvADYCAEHw1ABB8AA2AgBBnNMAQfEANgIAQZjTAEHyADYCAEGg0wBB8wA2AgBBpNMAQfQANgIAQajTAEH1ADYCAEH01ABB9gA2AgBBkNMAQfcANgIAQaDPACAANgIACwvBAwECfwJAAkACQAJAAkACQAJAAkACQAJAAkACQCACDgsAAQMEBggKAgUHCQsLIAAgASADQZjTACgCABEBAA8LIAAgASADQZzTACgCABEBAA8LIAAgASADQZzTACgCABEBACADQQAgAUEBQQBBgNEAKAIAEQMADwsgACABIANBoNMAKAIAEQEADwsgAyAAIAFBAnQQERoPCyADIAAgAUECdBARQQAgAUEBQQBBgNEAKAIAEQMADwsgAUEATA0EIAAgAUECdGohAgNAIAMgACgCACIBQRh0IAFBCHRBgID8B3FyIAFBCHZBgP4DcSABQRh2cnI2AAAgA0EEaiEDIABBBGoiACACSQ0ACwwECyABQQBKBEAgACABQQJ0aiEFIAMhAgNAIAIgACgCACIEQRh0IARBCHRBgID8B3FyIARBCHZBgP4DcSAEQRh2cnI2AAAgAkEEaiECIABBBGoiACAFSQ0ACwsgA0EBIAFBAUEAQYDRACgCABEDAA8LIAAgASADQaTTACgCABEBAA8LIAAgASADQaTTACgCABEBACADIAFBAUEAQYTRACgCABECAA8LIAAgASADQajTACgCABEBAAsLpQYBA38CQCACQQFHBEADQCABIAEtAAAgAC0AAEH4AGtBBHVqIgNBACADQQBKGyIDQf8BIANB/wFIGzoAACABIAEtAAEgAC0AAUH4AGtBBHVqIgNBACADQQBKGyIDQf8BIANB/wFIGzoAASABIAEtAAIgAC0AAkH4AGtBBHVqIgNBACADQQBKGyIDQf8BIANB/wFIGzoAAiABIAEtAAMgAC0AA0H4AGtBBHVqIgNBACADQQBKGyIDQf8BIANB/wFIGzoAAyABIAEtAAQgAC0ABEH4AGtBBHVqIgNBACADQQBKGyIDQf8BIANB/wFIGzoABCABIAEtAAUgAC0ABUH4AGtBBHVqIgNBACADQQBKGyIDQf8BIANB/wFIGzoABSABIAEtAAYgAC0ABkH4AGtBBHVqIgNBACADQQBKGyIDQf8BIANB/wFIGzoABiABIAEtAAcgAC0AB0H4AGtBBHVqIgNBACADQQBKGyIDQf8BIANB/wFIGzoAByAAQQhqIQAgASACaiEBIAVBAWoiBUEIRw0ACwwBCyABLQAGIQUDQCABIAEtAAAgAC0AAEH4AGtBBHVqIgRBACAEQQBKGyIEQf8BIARB/wFIGzoAACABIAEtAAEgAC0AAUH4AGtBBHVqIgRBACAEQQBKGyIEQf8BIARB/wFIGzoAASABIAEtAAIgAC0AAkH4AGtBBHVqIgRBACAEQQBKGyIEQf8BIARB/wFIGzoAAiABIAEtAAMgAC0AA0H4AGtBBHVqIgRBACAEQQBKGyIEQf8BIARB/wFIGzoAAyABIAEtAAQgAC0ABEH4AGtBBHVqIgRBACAEQQBKGyIEQf8BIARB/wFIGzoABCABIAEtAAUgAC0ABUH4AGtBBHVqIgRBACAEQQBKGyIEQf8BIARB/wFIGzoABSABIAVB/wFxIAAtAAZB+ABrQQR1aiIFQQAgBUEAShsiBUH/ASAFQf8BSBs6AAYgASABLQAHIAAtAAdB+ABrQQR1aiIFQQAgBUEAShsiBUH/ASAFQf8BSBsiBToAByAAQQhqIQAgASACaiEBIANBAWoiA0EIRw0ACwsL0wEBAX4gACAALQDfASAAQRlrLQAAIAAtAL8BIABBGmstAAAgAC0AnwEgAEEbay0AACAALQB/IABBHGstAAAgAC0AXyAAQR1rLQAAIAAtAD8gAEEeay0AACAALQAfIABBH2stAAAgAEEgay0AACAAQQFrLQAAampqampqampqampqampqQQhqQQR2rUL/AYNCgYKEiJCgwIABfiIBNwDgASAAIAE3AMABIAAgATcAoAEgACABNwCAASAAIAE3AGAgACABNwBAIAAgATcAICAAIAE3AAALyQoBE38gAEGUzwAoAgAiASAAQQFrLQAAIABBIWstAAAiA2siAiAAQSBrIgwtAAAiBGpqLQAAOgAAIAAgASACIABBH2siDS0AACIFamotAAA6AAEgACABIAIgAEEeayIOLQAAIgZqai0AADoAAiAAIAEgAiAAQR1rIg8tAAAiB2pqLQAAOgADIAAgASACIABBHGsiEC0AACIIamotAAA6AAQgACABIAIgAEEbayIRLQAAIglqai0AADoABSAAIAEgAiAAQRprIhItAAAiCmpqLQAAOgAGIAAgASACIABBGWsiEy0AACILamotAAA6AAcgACABIAQgAC0AHyADayICamotAAA6ACAgACABIAIgBWpqLQAAOgAhIAAgASACIAZqai0AADoAIiAAIAEgAiAHamotAAA6ACMgACABIAIgCGpqLQAAOgAkIAAgASACIAlqai0AADoAJSAAIAEgAiAKamotAAA6ACYgACABIAIgC2pqLQAAOgAnIAAgASAALQA/IANrIgIgDC0AACIEamotAAA6AEAgACABIAIgDS0AACIFamotAAA6AEEgACABIAIgDi0AACIGamotAAA6AEIgACABIAIgDy0AACIHamotAAA6AEMgACABIAIgEC0AACIIamotAAA6AEQgACABIAIgES0AACIJamotAAA6AEUgACABIAIgEi0AACIKamotAAA6AEYgACABIAIgEy0AACILamotAAA6AEcgACABIAQgAC0AXyADayICamotAAA6AGAgACABIAIgBWpqLQAAOgBhIAAgASACIAZqai0AADoAYiAAIAEgAiAHamotAAA6AGMgACABIAIgCGpqLQAAOgBkIAAgASACIAlqai0AADoAZSAAIAEgAiAKamotAAA6AGYgACABIAIgC2pqLQAAOgBnIAAgASAALQB/IANrIgIgDC0AACIEamotAAA6AIABIAAgASACIA0tAAAiBWpqLQAAOgCBASAAIAEgAiAOLQAAIgZqai0AADoAggEgACABIAIgDy0AACIHamotAAA6AIMBIAAgASACIBAtAAAiCGpqLQAAOgCEASAAIAEgAiARLQAAIglqai0AADoAhQEgACABIAIgEi0AACIKamotAAA6AIYBIAAgASACIBMtAAAiC2pqLQAAOgCHASAAIAEgBCAALQCfASADayICamotAAA6AKABIAAgASACIAVqai0AADoAoQEgACABIAIgBmpqLQAAOgCiASAAIAEgAiAHamotAAA6AKMBIAAgASACIAhqai0AADoApAEgACABIAIgCWpqLQAAOgClASAAIAEgAiAKamotAAA6AKYBIAAgASACIAtqai0AADoApwEgACABIAAtAL8BIANrIgIgDC0AAGpqLQAAOgDAASAAIAEgAiANLQAAamotAAA6AMEBIAAgASACIA4tAABqai0AADoAwgEgACABIAIgDy0AAGpqLQAAOgDDASAAIAEgAiAQLQAAamotAAA6AMQBIAAgASACIBEtAABqai0AADoAxQEgACABIAIgEi0AAGpqLQAAOgDGASAAIAEgAiATLQAAamotAAA6AMcBIAAgASAALQDfASADayIDIAwtAABqai0AADoA4AEgACABIAMgDS0AAGpqLQAAOgDhASAAIAEgAyAOLQAAamotAAA6AOIBIAAgASADIA8tAABqai0AADoA4wEgACABIAMgEC0AAGpqLQAAOgDkASAAIAEgAyARLQAAamotAAA6AOUBIAAgASADIBItAABqai0AADoA5gEgACABIAMgEy0AAGpqLQAAOgDnAQtIAQF+IAAgAEEgaykAACIBNwDgASAAIAE3AMABIAAgATcAoAEgACABNwCAASAAIAE3AGAgACABNwBAIAAgATcAICAAIAE3AAALtAEAIAAgADEAH0KBgoSIkKDAgAF+NwAgIAAgADEAP0KBgoSIkKDAgAF+NwBAIAAgADEAX0KBgoSIkKDAgAF+NwBgIAAgADEAf0KBgoSIkKDAgAF+NwCAASAAIAAxAJ8BQoGChIiQoMCAAX43AKABIAAgADEAvwFCgYKEiJCgwIABfjcAwAEgACAAMQDfAUKBgoSIkKDAgAF+NwDgASAAIABBAWsxAABCgYKEiJCgwIABfjcAAAuLAQEBfiAAIAAtAN8BIAAtAL8BIAAtAJ8BIAAtAH8gAC0AXyAALQA/IABBAWstAAAgAC0AH2pqampqampBBGpBA3atQv8Bg0KBgoSIkKDAgAF+IgE3AOABIAAgATcAwAEgACABNwCgASAAIAE3AIABIAAgATcAYCAAIAE3AEAgACABNwAgIAAgATcAAAudAQEBfiAAIABBGWstAAAgAEEaay0AACAAQRtrLQAAIABBHGstAAAgAEEday0AACAAQR5rLQAAIABBIGstAAAgAEEfay0AAGpqampqampBBGpBA3atQv8Bg0KBgoSIkKDAgAF+IgE3AOABIAAgATcAwAEgACABNwCgASAAIAE3AIABIAAgATcAYCAAIAE3AEAgACABNwAgIAAgATcAAAuGAQAgAEKAgYKEiJCgwIB/NwDgASAAQoCBgoSIkKDAgH83AMABIABCgIGChIiQoMCAfzcAoAEgAEKAgYKEiJCgwIB/NwCAASAAQoCBgoSIkKDAgH83AGAgAEKAgYKEiJCgwIB/NwBAIABCgIGChIiQoMCAfzcAICAAQoCBgoSIkKDAgH83AAALjwQBAX4gACAAQRFrLQAAIAAtAN8DIABBEmstAAAgAC0AvwMgAEETay0AACAALQCfAyAAQRRrLQAAIAAtAP8CIABBFWstAAAgAC0A3wIgAEEWay0AACAALQC/AiAAQRdrLQAAIAAtAJ8CIABBGGstAAAgAC0A/wEgAEEZay0AACAALQDfASAAQRprLQAAIAAtAL8BIABBG2stAAAgAC0AnwEgAEEcay0AACAALQB/IABBHWstAAAgAC0AXyAAQR5rLQAAIAAtAD8gAEEfay0AACAALQAfIABBAWstAAAgAEEgay0AAGpqampqampqampqampqampqampqampqampqampqampBEGpBBXatQv8Bg0KBgoSIkKDAgAF+IgE3AAggACABNwAAIAAgATcAICAAIAE3ACggACABNwBAIAAgATcASCAAIAE3AGAgACABNwBoIAAgATcAgAEgACABNwCIASAAIAE3AKABIAAgATcAqAEgACABNwDAASAAIAE3AMgBIAAgATcA6AEgACABNwDgASAAIAE3AIgCIAAgATcAgAIgACABNwCoAiAAIAE3AKACIAAgATcAyAIgACABNwDAAiAAIAE3AOgCIAAgATcA4AIgACABNwCIAyAAIAE3AIADIAAgATcAqAMgACABNwCgAyAAIAE3AMgDIAAgATcAwAMgACABNwDoAyAAIAE3AOADC9gDARR/IABBEWshBCAAQRJrIQUgAEETayEGIABBFGshByAAQRVrIQggAEEWayEJIABBF2shCiAAQRhrIQsgAEEZayEMIABBGmshDSAAQRtrIQ4gAEEcayEPIABBHWshECAAQR5rIREgAEEfayESIABBIGshEyAAQSFrLQAAIRRBlM8AKAIAIQEDQCAAIAEgAEEBay0AACAUayICIBMtAABqai0AADoAACAAIAEgAiASLQAAamotAAA6AAEgACABIAIgES0AAGpqLQAAOgACIAAgASACIBAtAABqai0AADoAAyAAIAEgAiAPLQAAamotAAA6AAQgACABIAIgDi0AAGpqLQAAOgAFIAAgASACIA0tAABqai0AADoABiAAIAEgAiAMLQAAamotAAA6AAcgACABIAIgCy0AAGpqLQAAOgAIIAAgASACIAotAABqai0AADoACSAAIAEgAiAJLQAAamotAAA6AAogACABIAIgCC0AAGpqLQAAOgALIAAgASACIActAABqai0AADoADCAAIAEgAiAGLQAAamotAAA6AA0gACABIAIgBS0AAGpqLQAAOgAOIAAgASACIAQtAABqai0AADoADyAAQSBqIQAgA0EBaiIDQRBHDQALC5cCAgJ+AX8gACAAQSBrIgMpAAAiATcAACAAIAE3ACAgACABNwBAIAAgATcAYCAAIAE3AIABIAAgATcAoAEgACABNwDAASAAIAE3AOABIAAgAykACCIBNwAIIAAgATcAKCAAIAE3AEggACABNwBoIAAgATcAiAEgACABNwCoASAAIAE3AMgBIAAgATcA6AEgACADKQAIIgE3AIgCIAAgAykAACICNwCAAiAAIAE3AKgCIAAgAjcAoAIgACABNwDIAiAAIAI3AMACIAAgATcA6AIgACACNwDgAiAAIAI3AIADIAAgATcAiAMgACABNwCoAyAAIAI3AKADIAAgAjcAwAMgACABNwDIAyAAIAE3AOgDIAAgAjcA4AMLigQBAX4gACAAMQAfQoGChIiQoMCAAX4iATcAICAAIAE3ACggACAAMQA/QoGChIiQoMCAAX4iATcAQCAAIAE3AEggACAAMQBfQoGChIiQoMCAAX4iATcAYCAAIAE3AGggACAAMQB/QoGChIiQoMCAAX4iATcAgAEgACABNwCIASAAIAAxAJ8BQoGChIiQoMCAAX4iATcAqAEgACABNwCgASAAIABBAWsxAABCgYKEiJCgwIABfiIBNwAAIAAgATcACCAAIAAxAL8BQoGChIiQoMCAAX4iATcAyAEgACABNwDAASAAIAAxAN8BQoGChIiQoMCAAX4iATcA6AEgACABNwDgASAAIAAxAP8BQoGChIiQoMCAAX4iATcAiAIgACABNwCAAiAAIAAxAJ8CQoGChIiQoMCAAX4iATcAqAIgACABNwCgAiAAIAAxAL8CQoGChIiQoMCAAX4iATcAyAIgACABNwDAAiAAIAAxAN8CQoGChIiQoMCAAX4iATcA6AIgACABNwDgAiAAIAAxAP8CQoGChIiQoMCAAX4iATcAiAMgACABNwCAAyAAIAAxAJ8DQoGChIiQoMCAAX4iATcAqAMgACABNwCgAyAAIAAxAL8DQoGChIiQoMCAAX4iATcAyAMgACABNwDAAyAAIAAxAN8DQoGChIiQoMCAAX4iATcA6AMgACABNwDgAwv/AgEBfiAAIAAtAN8DIAAtAL8DIAAtAJ8DIAAtAP8CIAAtAN8CIAAtAL8CIAAtAJ8CIAAtAP8BIAAtAN8BIAAtAL8BIAAtAJ8BIAAtAH8gAC0AXyAALQA/IABBAWstAAAgAC0AH2pqampqampqampqampqakEIakEEdq1C/wGDQoGChIiQoMCAAX4iATcAACAAIAE3AAggACABNwAoIAAgATcAICAAIAE3AEggACABNwBAIAAgATcAaCAAIAE3AGAgACABNwCIASAAIAE3AIABIAAgATcAqAEgACABNwCgASAAIAE3AMgBIAAgATcAwAEgACABNwDoASAAIAE3AOABIAAgATcAiAIgACABNwCAAiAAIAE3AKgCIAAgATcAoAIgACABNwDIAiAAIAE3AMACIAAgATcA6AIgACABNwDgAiAAIAE3AIgDIAAgATcAgAMgACABNwCoAyAAIAE3AKADIAAgATcAyAMgACABNwDAAyAAIAE3AOgDIAAgATcA4AMLoQMBAX4gACAAQRFrLQAAIABBEmstAAAgAEETay0AACAAQRRrLQAAIABBFWstAAAgAEEWay0AACAAQRdrLQAAIABBGGstAAAgAEEZay0AACAAQRprLQAAIABBG2stAAAgAEEcay0AACAAQR1rLQAAIABBHmstAAAgAEEgay0AACAAQR9rLQAAampqampqampqampqampqQQhqQQR2rUL/AYNCgYKEiJCgwIABfiIBNwAA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QyAAIAg6AAEgACAEIAVqIANBAXRqQQJ2IgM6AGMgACACOgAhIAAgASAHaiAEQQF0akECdjoAYSAAIAM6AEELygEBBn8gACAALQBfIgE6AEMgACABOgBCIAAgAUGBgoQIbDYAYCAAIAAtAB8iBEEBaiICIAAtAD8iA2pBAXYiBToAICAAIAIgAEEBay0AACIGakEBdjoAACAAIAEgA2pBAWpBAXYiAjoAQCAAIAU6AAIgACACOgAiIAAgASAEaiADQQF0akECakECdiICOgAhIAAgBiADQQJqIgNqIARBAXRqQQJ2OgABIAAgASADaiABQQF0akECdiIBOgBBIAAgAjoAAyAAIAE6ACMLbgEBfyAAIAAtAF8gAEEday0AACAALQA/IABBHmstAAAgAC0AHyAAQR9rLQAAIABBIGstAAAgAEEBay0AAGpqampqampBBGpBA3ZB/wFxQYGChAhsIgE2AGAgACABNgBAIAAgATYAICAAIAE2AAAL1gIBB38gAEGUzwAoAgAiASAAQQFrLQAAIABBIWstAAAiA2siAiAAQSBrLQAAIgRqai0AADoAACAAIAEgAiAAQR9rLQAAIgVqai0AADoAASAAIAEgAiAAQR5rLQAAIgZqai0AADoAAiAAIAEgAiAAQR1rLQAAIgdqai0AADoAAyAAIAEgBCAALQAfIANrIgJqai0AADoAICAAIAEgAiAFamotAAA6ACEgACABIAIgBmpqLQAAOgAiIAAgASACIAdqai0AADoAIyAAIAEgBCAALQA/IANrIgJqai0AADoAQCAAIAEgAiAFamotAAA6AEEgACABIAIgBmpqLQAAOgBCIAAgASACIAdqai0AADoAQyAAIAEgBCAALQBfIANrIgNqai0AADoAYCAAIAEgAyAFamotAAA6AGEgACABIAMgBmpqLQAAOgBiIAAgASADIAdqai0AADoAYwviAQEGfyAAIABBHGstAAAgAEEeay0AACICQQJqIgMgAEEday0AACIBQQF0ampBAnYiBDoAYyAAIAEgAEEfay0AACIFQQJqIgYgAkEBdGpqQQJ2IgI6AGIgACADIABBIGstAAAiAWogBUEBdGpBAnYiAzoAYSAAIAYgAEEhay0AAGogAUEBdGpBAnYiAToAYCAAIAQ6AEMgACACOgBCIAAgAzoAQSAAIAE6AEAgACAEOgAj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IAsgCCANIAdBBGpBA3VqLAAAIghBAWpBAXUiB2pqLQAAOgAAIAkgCyADIA9qai0AADoAACAAIAsgDiAIa2otAAA6AAAgCiAHawshAyAMIAMgC2otAAA6AAALIAFBAWshAyAAQQFqIQAgAUEBSw0ACwsiACAAIAJBAUEIIAMgBCAFECAgASACQQFBCCADIAQgBRAgCxIAIABBASABQRAgAiADIAQQIAuwBAEZfyABQQNsIRIgAUF9bCETQQAgAWshFEEAIAFBAnQiFWshFkEAIAFBAXQiF2shGCACQQF0QQFyIRlBjM8AKAIAIRpBlM8AKAIAIQlBkM8AKAIAIQpBmM8AKAIAIQdBAyENA0BBECEFIAAgFWoiACECA0AgBSEQAkAgByACIBhqIhstAAAiCCABIAJqIgstAAAiDmsiD2otAAAgByACIBRqIhEtAAAiBSACLQAAIgxrai0AAEECdGogGUoNACAHIAIgFmotAAAgAiATai0AACIGa2otAAAgA0oNACAHIAYgCGtqLQAAIANKDQAgByAIIAVrai0AACIcIANKDQAgByACIBJqLQAAIAIgF2otAAAiBmtqLQAAIANKDQAgByAGIA5rai0AACADSg0AIAcgDiAMa2otAAAiHSADSg0AIAwgBWtBA2whBgJ/IAQgHE4gBCAdTnFFBEAgCiAGIA8gGmosAABqIgtBBGpBA3VqLAAAIQggESAJIAogC0EDakEDdWosAAAgBWpqLQAAOgAAIAIhCyAMIAhrDAELIAogBkEDakEDdWosAAAhDyAbIAkgCCAKIAZBBGpBA3VqLAAAIghBAWpBAXUiBmpqLQAAOgAAIBEgCSAFIA9qai0AADoAACACIAkgDCAIa2otAAA6AAAgDiAGawshBSALIAUgCWotAAA6AAALIBBBAWshBSACQQFqIQIgEEEBSw0ACyANQQFLIQIgDUEBayENIAINAAsLEgAgACABQQFBECACIAMgBBAgC28AIAAvAQAEQCAAIAFBqNIAKAIAEQUACyAALwEgBEAgAEEgaiABQQRqQajSACgCABEFAAsgAC8BQARAIABBQGsgAUGAAWpBqNIAKAIAEQUACyAALwFgBEAgAEHgAGogAUGEAWpBqNIAKAIAEQUACwspACAAIAFBAUGc0gAoAgARAQAgAEFAayABQYABakEBQZzSACgCABEBAAvoBQEGfyABIAEtACAgAC4BAiIEQfucAWxBEHUgBGoiBSAALgEIIgNBjJUCbEEQdSIHIAAuAQBBBGoiBmoiAmpBA3VqIgBBACAAQQBKGyIAQf8BIABB/wFIGzoAICABIAEtACEgAiAEQYyVAmxBEHUiAGpBA3VqIgRBACAEQQBKGyIEQf8BIARB/wFIGzoAISABIAEtACIgAiAAa0EDdWoiBEEAIARBAEobIgRB/wEgBEH/AUgbOgAiIAEgAS0AIyACIAVrQQN1aiICQQAgAkEAShsiAkH/ASACQf8BSBs6ACMgASABLQAAIAMgA0H7nAFsQRB1aiIEIAZqIgIgBWpBA3VqIgNBACADQQBKGyIDQf8BIANB/wFIGzoAACABIAEtAAEgACACakEDdWoiA0EAIANBAEobIgNB/wEgA0H/AUgbOgABIAEgAS0AAiACIABrQQN1aiIDQQAgA0EAShsiA0H/ASADQf8BSBs6AAIgASABLQADIAIgBWtBA3VqIgJBACACQQBKGyICQf8BIAJB/wFIGzoAAyABIAEtAEAgBSAGIAdrIgJqQQN1aiIDQQAgA0EAShsiA0H/ASADQf8BSBs6AEAgASABLQBBIAAgAmpBA3VqIgNBACADQQBKGyIDQf8BIANB/wFIGzoAQSABIAEtAEIgAiAAa0EDdWoiA0EAIANBAEobIgNB/wEgA0H/AUgbOgBCIAEgAS0AQyACIAVrQQN1aiICQQAgAkEAShsiAkH/ASACQf8BSBs6AEMgASABLQBgIAYgBGsiBiAFakEDdWoiAkEAIAJBAEobIgJB/wEgAkH/AUgbOgBgIAEgAS0AYSAAIAZqQQN1aiICQQAgAkEAShsiAkH/ASACQf8BSBs6AGEgASABLQBiIAYgAGtBA3VqIgBBACAAQQBKGyIAQf8BIABB/wFIGzoAYiABIAEtAGMgBiAFa0EDdWoiAEEAIABBAEobIgBB/wEgAEH/AUgbOgBjC78EAQF/IAEgAC4BAEEEakEDdSIAIAEtAABqIgJBACACQQBKGyICQf8BIAJB/wFIGzoAACABIAAgAS0AAWoiAkEAIAJBAEobIgJB/wEgAkH/AUgbOgABIAEgACABLQACaiICQQAgAkEAShsiAkH/ASACQf8BSBs6AAIgASAAIAEtAANqIgJBACACQQBKGyICQf8BIAJB/wFIGzoAAyABIAAgAS0AIGoiAkEAIAJBAEobIgJB/wEgAkH/AUgbOgAgIAEgACABLQAhaiICQQAgAkEAShsiAkH/ASACQf8BSBs6ACEgASAAIAEtACJqIgJBACACQQBKGyICQf8BIAJB/wFIGzoAIiABIAAgAS0AI2oiAkEAIAJBAEobIgJB/wEgAkH/AUgbOgAjIAEgACABLQBAaiICQQAgAkEAShsiAkH/ASACQf8BSBs6AEAgASAAIAEtAEFqIgJBACACQQBKGyICQf8BIAJB/wFIGzoAQSABIAAgAS0AQmoiAkEAIAJBAEobIgJB/wEgAkH/AUgbOgBCIAEgACABLQBDaiICQQAgAkEAShsiAkH/ASACQf8BSBs6AEMgASAAIAEtAGBqIgJBACACQQBKGyICQf8BIAJB/wFIGzoAYCABIAAgAS0AYWoiAkEAIAJBAEobIgJB/wEgAkH/AUgbOgBhIAEgACABLQBiaiICQQAgAkEAShsiAkH/ASACQf8BSBs6AGIgASAAIAEtAGNqIgBBACAAQQBKGyIAQf8BIABB/wFIGzoAYwusBAEdfyABIAAuAQAiAyAALgEYIgZrIgQgAC4BCCICIAAuARAiB2siC2tBA2oiCCAALgEGIgUgAC4BHiIJayIMIAAuAQ4iDSAALgEWIg5rIhJrIgprIg8gAC4BAiIQIAAuARoiEWsiEyAALgEKIhQgAC4BEiIVayIWayIXIAAuAQQiGCAALgEcIhlrIhogAC4BDCIbIAAuARQiAGsiHGsiHWsiHmtBA3Y7AeADIAEgCCAKaiIIIBcgHWoiCmtBA3Y7AcADIAEgDyAeakEDdjsBoAMgASAIIApqQQN2OwGAAyABIAMgBmoiAyACIAdqIgZrQQNqIgIgBSAJaiIHIA0gDmoiCGsiBWsiCSAQIBFqIg0gFCAVaiIOayIKIBggGWoiDyAAIBtqIgBrIhBrIhFrQQN2OwHgAiABIAIgBWoiAiAKIBBqIgVrQQN2OwHAAiABIAkgEWpBA3Y7AaACIAEgAiAFakEDdjsBgAIgASAEIAtqQQNqIgQgDCASaiICayILIBMgFmoiBSAaIBxqIglrIgxrQQN2OwHgASABIAIgBGoiBCAFIAlqIgJrQQN2OwHAASABIAsgDGpBA3Y7AaABIAEgAiAEakEDdjsBgAEgASADIAZqQQNqIgMgByAIaiIGayIEIA0gDmoiAiAAIA9qIgBrIgdrQQN2OwFgIAEgAyAGaiIDIAAgAmoiAGtBA3Y7AUAgASAEIAdqQQN2OwEgIAEgACADakEDdjsBAAsZACAAIAEQNCACBEAgAEEgaiABQQRqEDQLCwQAQQAL5QEBBH8CQCABQQBMDQAgAUEDcSEFIAFBAWtBA08EQCABQXxxIQYDQCAAIANBAnQiAWoiBCgCAEH///8HTQRAIAQgAjYCAAsgACABQQRyaiIEKAIAQYCAgAhJBEAgBCACNgIACyAAIAFBCHJqIgQoAgBB////B00EQCAEIAI2AgALIAAgAUEMcmoiASgCAEH///8HTQRAIAEgAjYCAAsgA0EEaiEDIAZBBGsiBg0ACwsgBUUNAANAIAAgA0ECdGoiASgCAEH///8HTQRAIAEgAjYCAAsgA0EBaiEDIAVBAWsiBQ0ACwsLQgEDfwJAIAFBAEwNAANAIAAgAmotAABB/wFGBEAgAkEEaiECIAFBAkghBCABQQFrIQEgBEUNAQwCCwtBASEDCyADCzEBAX8DQCABQQBMBEBBAA8LIAFBAWshASAALQAAIQIgAEEBaiEAIAJB/wFGDQALQQELzwEBA38CQCACQQBMDQAgAkEDcSEFIAJBAWtBA08EQCACQXxxIQIDQCABIANqIAAgA0ECdGooAgBBCHY6AAAgASADQQFyIgRqIAAgBEECdGooAgBBCHY6AAAgASADQQJyIgRqIAAgBEECdGooAgBBCHY6AAAgASADQQNyIgRqIAAgBEECdGooAgBBCHY6AAAgA0EEaiEDIAJBBGsiAg0ACwsgBUUNAANAIAEgA2ogACADQQJ0aigCAEEIdjoAACADQQFqIQMgBUEBayIFDQALCwurAgEKf0EBIQYCQCADQQBMDQAgAkEATA0AIAJBfHEhDSACQQNxIQ5B/wEhBiACQQFrQQNJIQ8DQEEAIQIgDSEHIA9FBEADQCACIARqIAAgAkECdGotAAAiCDoAACAEIAJBAXIiCWogACAJQQJ0ai0AACIJOgAAIAQgAkECciIKaiAAIApBAnRqLQAAIgo6AAAgBCACQQNyIgtqIAAgC0ECdGotAAAiCzoAACALIAogCSAGIAhxcXFxIQYgAkEEaiECIAdBBGsiBw0ACwsgDiIHBEADQCACIARqIAAgAkECdGotAAAiCDoAACACQQFqIQIgBiAIcSEGIAdBAWsiBw0ACwsgBCAFaiEEIAAgAWohACAMQQFqIgwgA0cNAAsgBkH/AXFB/wFGIQYLIAYLiQIBBn8CQCADQQBMDQAgAkEATA0AIAJBfHEhCCACQQNxIQkgAkEBa0EDSSEKIAVBAnQhCwNAQQAhAiAIIQUgCkUEQANAIAQgAkECdGogACACai0AAEEIdDYCACAEIAJBAXIiBkECdGogACAGai0AAEEIdDYCACAEIAJBAnIiBkECdGogACAGai0AAEEIdDYCACAEIAJBA3IiBkECdGogACAGai0AAEEIdDYCACACQQRqIQIgBUEEayIFDQALCyAJIgUEQANAIAQgAkECdGogACACai0AAEEIdDYCACACQQFqIQIgBUEBayIFDQALCyAAIAFqIQAgBCALaiEEIAdBAWoiByADRw0ACwsLowIBCn8CQCADQQBMDQAgAkEATA0AIAJBfHEhDSACQQNxIQ5B/wEhBiACQQFrQQNJIQ8DQEEAIQIgDSEHIA9FBEADQCAEIAJBAnRqIAAgAmotAAAiCDoAACAEIAJBAXIiCUECdGogACAJai0AACIJOgAAIAQgAkECciIKQQJ0aiAAIApqLQAAIgo6AAAgBCACQQNyIgtBAnRqIAAgC2otAAAiCzoAACALIAogCSAGIAhxcXFxIQYgAkEEaiECIAdBBGsiBw0ACwsgDiIHBEADQCAEIAJBAnRqIAAgAmotAAAiCDoAACACQQFqIQIgBiAIcSEGIAdBAWsiBw0ACwsgBCAFaiEEIAAgAWohACAMQQFqIgwgA0cNAAsgBkH/AUchBgsgBgvEAQEHfwJAIANBAEwNACACQQBMDQBBAEEDIAEbIQkgAUEARyEKA0AgACAKaiEHIANBAWshC0EAIQEDQCAAIAFBAnQiBSAJcmotAAAiBkH/AUcEQCAFIAdqIgggBkGBgQJsIgYgCC0AAGxBF3Y6AAAgByAFQQFyaiIIIAYgCC0AAGxBF3Y6AAAgByAFQQJyaiIFIAYgBS0AAGxBF3Y6AAALIAFBAWoiASACRw0ACyAAIARqIQAgA0EBSiEBIAshAyABDQALCwtTAQJ/IANBAEoEQANAIAUgB0ECdGogAiAGai0AACAAIAZqLQAAQRB0IAEgBmotAABBCHRyckGAgIB4cjYCACAEIAZqIQYgB0EBaiIHIANHDQALCwuzAQEFfwJAIAJBAEwNACABQQBMDQADQEEAIQUDQCAAIAVBAXRqIgRBAWogBC0AASIGQQ9xIghBkSJsIgcgBkHwAXEgBkEEdnJsQRB2QfABcSAIcjoAACAEIAcgBC0AACIEQfABcSAEQQR2cmxBEHZB8AFxIAcgBEEPcSAEQQR0ckH/AXFsQRR2cjoAACAFQQFqIgUgAUcNAAsgACADaiEAIAJBAUohBSACQQFrIQIgBQ0ACwsLwAEBAn8CQCACQQBMDQAgA0UEQANAAkAgASAEai0AACIDQf8BRg0AIANFBEAgACAEakEAOgAADAELIAAgBGoiBSADIAUtAABsQYGCBGxBgICABGpBGHY6AAALIARBAWoiBCACRw0ADAILAAsDQAJAIAEgBGotAAAiA0H/AUYNACADRQRAIAAgBGpBADoAAAwBCyAAIARqIgUgBS0AAEGAgIB4IANubEGAgIAEakEYdjoAAAsgBEEBaiIEIAJHDQALCwvMAgEDfwJAIAFBAEwNACACRQRAA0AgACAEQQJ0aiIFKAIAIgJB////d00EQEEAIQMgBSACQYCAgAhPBH8gAkGAgIB4cSACQRh2QYGCBGwiAyACQf8BcWxBgICABGpBGHZyIAMgAkEIdkH/AXFsQYCAgARqQRB2QYD+A3FyIAMgAkEQdkH/AXFsQYCAgARqQQh2QYCA/AdxcgVBAAs2AgALIARBAWoiBCABRw0ADAILAAsDQCAAIARBAnRqIgUoAgAiAkH///93TQRAQQAhAyAFIAJBgICACE8EfyACQYCAgHhxQYCAgHggAkEYdm4iAyACQf8BcWxBgICABGpBGHZyIAMgAkEIdkH/AXFsQYCAgARqQRB2QYD+A3FyIAMgAkEQdkH/AXFsQYCAgARqQQh2QYCA/AdxcgVBAAs2AgALIARBAWoiBCABRw0ACwsL7wcBCX8CQCAEQQ9MBEAgASAEQQJ0aigCACACQQtsaiEMIAAoAgghAiAAKAIEIQoDQCAMLQAAIQcCQCACQQBODQAgACgCDCIGIAAoAhRJBEAgBigAACEJIAAgBkEDajYCDCAAIAAoAgBBGHQgCUEIdkGA/gNxIAlBCHRBgID8B3EgCUEYdHJyQQh2cjYCACACQRhqIQIMAQsgABAOIAAoAgghAgsgACACAn8gByAKbEEIdiIJIAAoAgAiCCACdk8iB0UEQCAAIAlBf3MgAnQgCGoiCDYCACAKIAlrDAELIAlBAWoLIgZnQRhzIglrIgI2AgggACAGIAl0QQFrIgo2AgQgBCIJIQYgBw0CA0AgDC0AASEHAkAgAkEATg0AIAAoAgwiBiAAKAIUSQRAIAYoAAAhBCAAIAZBA2o2AgwgACAIQRh0IARBCHZBgP4DcSAEQQh0QYCA/AdxIARBGHRyckEIdnIiCDYCACACQRhqIQIMAQsgABAOIAAoAgAhCCAAKAIIIQILIAAgAgJ/IAggAnYiCyAHIApsQQh2IgZLBEAgACAGQX9zIAJ0IAhqIgg2AgAgCiAGawwBCyAGQQFqCyIEZ0EYcyIHayICNgIIIAAgBCAHdEEBayIKNgIEIAEgCUEBaiIEQQJ0aigCACEHIAYgC08EQEEQIQYgByEMIAQiCUEQRw0BDAQLCyAMLQACIQ0CQCACQQBODQAgACgCDCILIAAoAhRJBEAgCygAACEGIAAgC0EDajYCDCAAIAhBGHQgBkEIdkGA/gNxIAZBCHRBgID8B3EgBkEYdHJyQQh2ciIINgIAIAJBGGohAgwBCyAAEA4gACgCACEIIAAoAgghAgsgACACAn8gCCACdiIOIAogDWxBCHYiC0sEQCAAIAtBf3MgAnQgCGo2AgAgCiALawwBCyALQQFqCyIIZ0EYcyICayIGNgIIIAAgCCACdEEBazYCBAJ/IAsgDk8EQEEBIQggB0ELagwBCyAAIAwQOiEIIAAoAgghBiAHQRZqCyEMAkAgBkEATg0AIAAoAgwiByAAKAIUSQRAIAcoAAAhAiAAIAdBA2o2AgwgACAAKAIAQRh0IAJBCHZBgP4DcSACQQh0QYCA/AdxIAJBGHRyckEIdnI2AgAgBkEYaiEGDAELIAAQDiAAKAIIIQYLIAAgBkEBayICNgIIIAAgACgCBCIKQQF2IgsgACgCACINIAZ2a0EfdSIHIApqQQFyIgo2AgQgACANIAcgC0EBanEgBnRrNgIAIAUgCUGQKmotAABBAXRqIAMgCUEASkECdGooAgAgByAIcyAHa2w7AQAgCUEPSA0ACwtBECEGCyAGC6gIAQh/AkAgBEEPTARAIAEgBEECdGooAgAgAkELbGohDCAAKAIIIQYgACgCBCEJA0AgDC0AACEHAkAgBkEATg0AIAAoAgwiCyAAKAIUSQRAIAsoAAAhAiAAIAtBA2o2AgwgACAGQRhqIgY2AgggACAAKAIAQRh0IAJBCHZBgP4DcSACQQh0QYCA/AdxIAJBGHRyckEIdnI2AgAMAQsgABAOIAAoAgghBgsgByAJbEEIdiICIAAoAgAiCCAGdk8iCkUEQCAAIAggAkEBaiICIAZ0ayIINgIAIAkgAmshAgsgAkH+AE0EQCAAIAYgAkGwxgBqLQAAayIGNgIIIAJBsMcAai0AACECCyAAIAI2AgQgBCILIQcgCg0CA0AgDC0AASEJAkAgBkEATg0AIAAoAgwiByAAKAIUSQRAIAcoAAAhBCAAIAZBGGoiBjYCCCAAIAdBA2o2AgwgACAIQRh0IARBCHZBgP4DcSAEQQh0QYCA/AdxIARBGHRyckEIdnIiCDYCAAwBCyAAEA4gACgCACEIIAAoAgghBgsCfyAIIAZ2IgogAiAJbEEIdiIHTQRAIAcMAQsgACAIIAdBAWoiBCAGdGsiCDYCACACIARrCyICQf4ATQRAIAAgBiACQbDGAGotAABrIgY2AgggAkGwxwBqLQAAIQILIAAgAjYCBCABIAtBAWoiBEECdGooAgAhCSAHIApPBEBBECEHIAkhDCAEIgtBEEcNAQwECwsgDC0AAiENAkAgACgCCCIHQQBODQAgACgCDCIKIAAoAhRJBEAgCigAACEGIAAgB0EYaiIHNgIIIAAgCkEDajYCDCAAIAhBGHQgBkEIdkGA/gNxIAZBCHRBgID8B3EgBkEYdHJyQQh2ciIINgIADAELIAAQDiAAKAIAIQggACgCCCEHCyACIA1sQQh2IgohBiAKIAggB3YiDUkEQCAAIAggCkEBaiIGIAd0azYCACACIAZrIQYLIAAgBkH+AE0EfyAAIAcgBkGwxgBqLQAAayIHNgIIIAZBsMcAai0AAAUgBgs2AgQCfyAKIA1PBEBBASEIIAlBC2oMAQsgACAMEDohCCAAKAIIIQcgCUEWagshDAJAIAdBAE4NACAAKAIMIgkgACgCFEkEQCAJKAAAIQIgACAJQQNqNgIMIAAgACgCAEEYdCACQQh2QYD+A3EgAkEIdEGAgPwHcSACQRh0cnJBCHZyNgIAIAdBGGohBwwBCyAAEA4gACgCCCEHCyAAIAdBAWsiBjYCCCAAIAAoAgQiCUEBdiIKIAAoAgAiDSAHdmtBH3UiAiAJakEBciIJNgIEIAAgDSACIApBAWpxIAd0azYCACAFIAtBkCpqLQAAQQF0aiADIAtBAEpBAnRqKAIAIAIgCHMgAmtsOwEAIAtBD0gNAAsLQRAhBwsgBwuMAgEJfwJAIAAoAiQiBEFAaygCACAEKAI4Tg0AIAAoAgAiBSgCACIDQQRGIANBCUZyIQggA0EHayELIAUoAhAgBSgCFCIGIAFsaiEJIAQoAjQhCkEAIQMCf0EAIAQoAhhBAEoNABpBACACQQBMDQAaIAlBAEEDIAgbaiEBA0ACQCAEEBggACgCJCgCREEAIApBASABQQBBiNEAKAIAEQcAIAdyIQcgA0EBaiEDIAUoAhQhBiAAKAIkIgRBQGsoAgAgBCgCOE4NACAEKAIYQQBKDQAgASAGaiEBIAIgA0oNAQsLIAdBAEcLIQEgC0EDSw0AIAFFDQAgCSAIIAogAyAGQYDRACgCABEDAAsgAwu3AwENfwJAIAAoAiQiA0FAaygCACADKAI4Tg0AIAMoAjQiB0EATARAA0AgAygCGEEASg0CIAIgBEwNAiADEBggBEEBaiEEIAAoAiQiA0FAaygCACADKAI4SA0ACwwBCyAAKAIAIggoAgBBB2shCiAHQX5xIQsgB0EBcSEMIAgoAhAgCCgCFCABbGoiDUEBaiEBQQ8hBQNAAkAgAygCGEEASg0AIAIgBEwNACADEBhBACEDIAshCSAHQQFHBEADQCABIANBAXRqIgYgACgCJCgCRCADai0AAEEEdiIOIAYtAABB8AFxcjoAACABIANBAXIiBkEBdGoiDyAAKAIkKAJEIAZqLQAAQQR2IgYgDy0AAEHwAXFyOgAAIAUgDnEgBnEhBSADQQJqIQMgCUECayIJDQALCyAMBEAgASADQQF0aiIJIAAoAiQoAkQgA2otAABBBHYiAyAJLQAAQfABcXI6AAAgAyAFcSEFCyAEQQFqIQQgASAIKAIUaiEBIAAoAiQiA0FAaygCACADKAI4SA0BCwsgCkEDSw0AIAVBD0YNACANIAcgBCAIKAIUQYTRACgCABECAAsgBAt/AQZ/AkAgACgCaCIDRQ0AIAJBAEwNACABKAIQIAJqIQUgASgCJCEEA0AgBCAAKAIQIAAoAggiBiAEKAI8IgdraiADIAAoAgAiCCAHIAZrbGogCBAWGiACIAEgBSACayACIAEoAjQRCABrIgJBAEwNASAAKAJoIQMMAAsAC0EAC50DAQt/IAAoAhAiCEEATARAQQAPCyAIQQFqQQF1IQsgASgCGCECA0AgAiAIIAdrIAAoAhQgACgCICICIAdsaiACEBYhBSALIAZrIgIgASgCHCIDKAIgIgQgAygCGGpBAWsgBG0iAyACIANIGwRAIAEoAhwgAiAAKAIYIAAoAiQiAyAGbGogAxAWIQMgASgCICACIAAoAhwgACgCJCICIAZsaiACEBYaIAMgBmohBgsgBSAHaiEHIAEoAgAiBSgCACEEQQAhAwJAIAEoAhgiAigCOCACQUBrKAIATA0AIARBAnRB0NUAaigCACEMIAUoAhAgBSgCFCABKAIQIAlqbGohBANAIAIoAhhBAEoNASABKAIcIgpBQGsoAgAgCigCOE4NASAKKAIYQQBKDQEgAhAYIAEoAhwQGCABKAIgEBggASgCGCICKAJEIAEoAhwoAkQgASgCICgCRCAEIAIoAjQgDBEDACADQQFqIQMgBCAFKAIUaiEEIAEoAhgiAkFAaygCACACKAI4SA0ACwsgAyAJaiEJIAcgCEgNAAsgCQvgAgEJfyABKAIAIgQoAhwiBiAEKAIsIgMgASgCECIIbGohBQJAIAAoAmgiBwRAIAAoAhAiAkEATA0BIAQoAiAhCSABKAIkIQMgACgCACEGIAQoAhAhCkEAIQADQCAHIAMgAiAHIAYQFiILIAZsaiEHIAMQJCAAaiEAIAIgC2siAkEASg0ACyAAQQBMDQEgCiAIIAlsaiAEKAIgIAUgBCgCLCABKAIkKAI0IABBARA1QQAPCyAGRQ0AIAJBAEwNACAAKAJgIQEgAkEHcSEAIAJBAWtBB08EQCACQXhxIQIDQCAFQf8BIAEQDyADakH/ASABEA8gA2pB/wEgARAPIANqQf8BIAEQDyADakH/ASABEA8gA2pB/wEgARAPIANqQf8BIAEQDyADakH/ASABEA8gA2ohBSACQQhrIgINAAsLIABFDQADQCAFQf8BIAEQDyADaiEFIABBAWsiAA0ACwtBAAu/AgEIfyAAKAIQIQQgASgCGCEFAkAgASgCACgCACICQQxNQQBBASACdEG6IHEbRSACQQdrQQNLcQ0AIAAoAmgiAkUNACAAKAIUIAAoAiAgAiAAKAIAIAAoAgwgBEEAEDULIARBAEwEQEEADwsgBEEBakEBdSEHIAAoAiAhBiAAKAIUIQMgBCECA0AgAyAFIAIgAyAGEBYiCSAGbGohAyAFECQgCGohCCACIAlrIgJBAEoNAAsgBEEASgRAIAEoAhwhBCAAKAIkIQUgACgCGCEDIAchAgNAIAQgAiADIAUQFiEGIAQQJBogAyAFIAZsaiEDIAIgBmsiAkEASg0ACyAAKAIcIQMgASgCICEBIAAoAiQhAANAIAEgByADIAAQFiECIAEQJBogAyAAIAJsaiEDIAcgAmsiB0EASg0ACwsgCAsQACMAIABrQXBxIgAkACAACwYAIAAkAAsEACMAC8UCAQV/IAEoAgAiBigCHCIHIAYoAiwiAiAAKAIIbGohBSAAKAIQIQQgACgCDCEBAkAgACgCaCIDBEAgBEEATA0BIARBAUcEQCAEQX5xIQIDQCAFIAMgARARIAYoAixqIAMgACgCAGoiAyABEBEgBigCLGohBSADIAAoAgBqIQMgAkECayICDQALCyAEQQFxRQ0BIAUgAyABEBEaQQAPCyAHRQ0AIARBAEwNACAEQQdxIQMgBEEBa0EHTwRAIARBeHEhAANAIAVB/wEgARAPIAJqQf8BIAEQDyACakH/ASABEA8gAmpB/wEgARAPIAJqQf8BIAEQDyACakH/ASABEA8gAmpB/wEgARAPIAJqQf8BIAEQDyACaiEFIABBCGsiAA0ACwsgA0UNAANAIAVB/wEgARAPIAJqIQUgA0EBayIDDQALC0EAC1YBAX8gACgCPCEDIwBBEGsiACQAIAMgAacgAUIgiKcgAkH/AXEgAEEIahAJIgIEf0Hg1gAgAjYCAEF/BUEACyECIAApAwghASAAQRBqJABCfyABIAIbC+8CAQd/IwBBIGsiBCQAIAQgACgCHCIFNgIQIAAoAhQhAyAEIAI2AhwgBCABNgIYIAQgAyAFayIBNgIUIAEgAmohBUECIQcCfwJAAkAgACgCPCAEQRBqIgFBAiAEQQxqEAEiAwR/QeDWACADNgIAQX8FQQALRQRAA0AgBSAEKAIMIgNGDQIgA0EASA0DIAEgAyABKAIEIghLIgZBA3RqIgkgAyAIQQAgBhtrIgggCSgCAGo2AgAgAUEMQQQgBhtqIgkgCSgCACAIazYCACAFIANrIQUgACgCPCABQQhqIAEgBhsiASAHIAZrIgcgBEEMahABIgMEf0Hg1gAgAzYCAEF/BUEAC0UNAAsLIAVBf0cNAQsgACAAKAIsIgE2AhwgACABNgIUIAAgASAAKAIwajYCECACDAELIABBADYCHCAAQgA3AxAgACAAKAIAQSByNgIAQQAgB0ECRg0AGiACIAEoAgRrCyEAIARBIGokACAAC/MBAQh/AkAgACgCaCIFRQ0AIAEoAgAiBigCACIHQQRGIAdBCUZyIQggACgCECEBIAAoAgghAyAAKAIMIQkCQCAAKAI4RQRAIAMhBAwBCwJ/IANFBEAgAUEBawwBCyADQQFrIQQgBSAAKAIAayEFIAELIQIgACgCVCIKIAEgA2pqIgEgACgCWEcEQCACIQEMAQsgASAEIApqayEBCyAFIAAoAgAgCSABIAYoAhAgBigCFCICIARsaiIAQQBBAyAIG2ogAkGI0QAoAgARBwBFDQAgB0EHa0EDSw0AIAAgCCAJIAEgBigCFEGA0QAoAgARAwALQQALCQAgACgCPBACCwkAIABBADYCBAu4AwEOfwJAIAAoAmgiBkUNACAAKAIQIQUgACgCCCEHAkAgACgCOEUEQCAHIQMMAQsCfyAHRQRAIAVBAWsMAQsgB0EBayEDIAYgACgCAGshBiAFCyECIAAoAlQiBCAFIAdqaiIFIAAoAlhHBEAgAiEFDAELIAUgAyAEamshBQsgBUEATA0AIAAoAgwiCUEATA0AIAEoAgAiCigCACEMIAlBfnEhByAJQQFxIQ0gCigCECAKKAIUIANsaiIOQQFqIQFBDyEDA0BBACEEIAchAiAJQQFHBEADQCABIARBAXRqIgggBCAGai0AAEEEdiIPIAgtAABB8AFxcjoAACABIARBAXIiCEEBdGoiECAGIAhqLQAAQQR2IgggEC0AAEHwAXFyOgAAIAMgD3EgCHEhAyAEQQJqIQQgAkECayICDQALCyANBEAgASAEQQF0aiICIAQgBmotAABBBHYiBCACLQAAQfABcXI6AAAgAyAEcSEDCyABIAooAhQiAmohASAGIAAoAgBqIQYgC0EBaiILIAVHDQALIANBD0YNACAMQQdrQQNLDQAgDiAJIAUgAkGE0QAoAgARAgALQQALCAAgACgCFEULGwAgAEEANgIUIAAoAgRFBEAgAEEBNgIEC0EBCxcAIABCADcCACAAQgA3AhAgAEIANwIIC6oBAQd/IAEoAgAiASgCGCEGIAEoAighByABKAIUIQIgASgCJCEDIAAoAhQgACgCICABKAIQIAEoAiAiBCAAKAIIIgVsaiAEIAAoAgwiBCAAKAIQIggQGSAAKAIYIAAoAiQgAiADIAVBAXUiBWxqIAEoAiQgBEEBakECbSICIAhBAWpBAm0iAxAZIAAoAhwgACgCJCAGIAUgB2xqIAEoAiggAiADEBkgACgCEAuDAwEMfyAAKAIQIQIgACgCDCIIQQFqQQJtIQ0gASgCACIJKAIQIAkoAhQiCiAAKAIIIgNsaiEGIAkoAgBBAnRBkNUAaigCACELIAAoAhwhBCAAKAIYIQUgACgCFCEHAn8gA0UEQCAHQQAgBSAEIAUgBCAGQQAgCCALEQoAIAIMAQsgASgCBCAHIAEoAgggASgCDCAFIAQgBiAKayAGIAggCxEKACACQQFqCyEKIAIgA2ohDCACQQNOBEAgA0ECaiECA0AgByAAKAIgIgNBAXRqIgcgA2sgByAFIAQgBSAAKAIkIgNqIgUgAyAEaiIEIAYgCSgCFCIDQQF0aiIGIANrIAYgCCALEQoAIAJBAmoiAiAMSA0ACwsgByAAKAIgaiECIAAoAlggACgCVCAMakoEQCABKAIEIAIgCBARGiABKAIIIAUgDRARGiABKAIMIAQgDRARGiAKQQFrDwsgDEEBcUUEQCACQQAgBSAEIAUgBCAGIAkoAhRqQQAgCCALEQoACyAKC9YBAQJ/AkAgAkEATA0AIAJBAXEhBCACQQFHBEAgAkF+cSECA0AgASADaiAALQACQceDAWwgAC0AAUGjggJsaiAALQAAQZQybGpBgIDCAGpBEHY6AAAgASADQQFyaiAALQAFQceDAWwgAC0ABEGjggJsaiAALQADQZQybGpBgIDCAGpBEHY6AAAgAEEGaiEAIANBAmohAyACQQJrIgINAAsLIARFDQAgASADaiAALQACQceDAWwgAC0AAUGjggJsaiAALQAAQZQybGpBgIDCAGpBEHY6AAALC9YBAQJ/AkAgAkEATA0AIAJBAXEhBCACQQFHBEAgAkF+cSECA0AgASADaiAALQAAQceDAWwgAC0AAUGjggJsaiAALQACQZQybGpBgIDCAGpBEHY6AAAgASADQQFyaiAALQADQceDAWwgAC0ABEGjggJsaiAALQAFQZQybGpBgIDCAGpBEHY6AAAgAEEGaiEAIANBAmohAyACQQJrIgINAAsLIARFDQAgASADaiAALQAAQceDAWwgAC0AAUGjggJsaiAALQACQZQybGpBgIDCAGpBEHY6AAALC18BAn8gAkEASgRAA0AgASADaiAAIANBAnRqKAIAIgRB/wFxQZQybCAEQRB2Qf8BcUHHgwFsaiAEQQh2Qf8BcUGjggJsakGAgMIAakEQdjoAACADQQFqIgMgAkcNAAsLC7gBAQZ/IANBAEoEQANAIAEgBGogAC8BAiIFQffqfmwgAC8BACIGQYm0f2xqIAAvAQQiB0GA4QFsaiIIQYCAiBBqQRJ1IglBgID4b0H/ASAIQYCA+G9IGyAJQYACSRs6AAAgAiAEaiAFQczDfmwgBkGA4QFsaiAHQbRbbGoiBUGAgIgQakESdSIGQYCA+G9B/wEgBUGAgPhvSBsgBkGAAkkbOgAAIABBCGohACAEQQFqIgQgA0cNAAsLC9UEAQZ/AkAgA0ECSA0AIANBAXUiBUEBIAVBAUobIQhBACEFIARFBEADQCABIAVqIgYgBi0AACAAIAVBA3RqIgcoAgQiBkEPdkH+A3EgBygCACIHQQ92Qf4DcWoiCUGJtH9sIAZBB3ZB/gNxIAdBB3ZB/gNxaiIKQffqfmxqIAZBAXRB/gNxIAdBAXRB/gNxaiIGQYDhAWxqQYCAiBBqQRJ2akEBakEBdjoAACACIAVqIgcgBy0AACAJQYDhAWwgCkHMw35saiAGQbRbbGpBgICIEGpBEnZqQQFqQQF2OgAAIAVBAWoiBSAIRw0ADAILAAsDQCABIAVqIAAgBUEDdGoiBygCBCIGQQ92Qf4DcSAHKAIAIgdBD3ZB/gNxaiIJQYm0f2wgBkEHdkH+A3EgB0EHdkH+A3FqIgpB9+p+bGogBkEBdEH+A3EgB0EBdEH+A3FqIgZBgOEBbGpBgICIEGpBEnY6AAAgAiAFaiAJQYDhAWwgCkHMw35saiAGQbRbbGpBgICIEGpBEnY6AAAgBUEBaiIFIAhHDQALCyADQQFxBEAgACAIQQN0aigCACIAQQ52QfwHcSIDQYDhAWwgAEEGdkH8B3EiBUHMw35saiAAQQJ0QfwHcSIGQbRbbGpBgICIEGpBEnYhACADQYm0f2wgBUH36n5saiAGQYDhAWxqQYCAiBBqQRJ2IQMgBARAIAEgCGogAzoAACACIAhqIAA6AAAPCyABIAhqIgEgAyABLQAAakEBakEBdjoAACACIAhqIgEgACABLQAAakEBakEBdjoAAAsL/AQBBn8gBEF+cSIHBEAgAyAHQQNsaiEHA0AgAi0AACEFIAMgAC0AAEGFlQFsQQh2IgYgAS0AACIKQZqCAmxBCHZqIghBlYoBayIJQQZ2QQBB/wEgCEGVigFJGyAJQYCAAUkbOgACIAMgBUGlzAFsQQh2IAZqIghBmu8AayIJQQZ2QQBB/wEgCEGa7wBJGyAJQYCAAUkbOgAAIAMgBiAKQZMybEEIdiAFQYjoAGxBCHZqayIFQYTEAGoiBkEGdkEAQf8BIAVB/Lt/SBsgBkGAgAFJGzoAASACLQAAIQUgAyAALQABQYWVAWxBCHYiBiABLQAAIgpBmoICbEEIdmoiCEGVigFrIglBBnZBAEH/ASAIQZWKAUkbIAlBgIABSRs6AAUgAyAFQaXMAWxBCHYgBmoiCEGa7wBrIglBBnZBAEH/ASAIQZrvAEkbIAlBgIABSRs6AAMgAyAGIApBkzJsQQh2IAVBiOgAbEEIdmprIgVBhMQAaiIGQQZ2QQBB/wEgBUH8u39IGyAGQYCAAUkbOgAEIAJBAWohAiABQQFqIQEgAEECaiEAIANBBmoiAyAHRw0ACyAHIQMLIARBAXEEQCACLQAAIQIgAyAALQAAQYWVAWxBCHYiACABLQAAIgFBmoICbEEIdmoiBEGVigFrIgdBBnZBAEH/ASAEQZWKAUkbIAdBgIABSRs6AAIgAyACQaXMAWxBCHYgAGoiBEGa7wBrIgdBBnZBAEH/ASAEQZrvAEkbIAdBgIABSRs6AAAgAyAAIAFBkzJsQQh2IAJBiOgAbEEIdmprIgBBhMQAaiIBQQZ2QQBB/wEgAEH8u39IGyABQYCAAUkbOgABCwv8BAEGfyAEQX5xIgcEQCADIAdBA2xqIQcDQCABLQAAIQUgAyAALQAAQYWVAWxBCHYiBiACLQAAIgpBpcwBbEEIdmoiCEGa7wBrIglBBnZBAEH/ASAIQZrvAEkbIAlBgIABSRs6AAIgAyAFQZqCAmxBCHYgBmoiCEGVigFrIglBBnZBAEH/ASAIQZWKAUkbIAlBgIABSRs6AAAgAyAGIAVBkzJsQQh2IApBiOgAbEEIdmprIgVBhMQAaiIGQQZ2QQBB/wEgBUH8u39IGyAGQYCAAUkbOgABIAEtAAAhBSADIAAtAAFBhZUBbEEIdiIGIAItAAAiCkGlzAFsQQh2aiIIQZrvAGsiCUEGdkEAQf8BIAhBmu8ASRsgCUGAgAFJGzoABSADIAVBmoICbEEIdiAGaiIIQZWKAWsiCUEGdkEAQf8BIAhBlYoBSRsgCUGAgAFJGzoAAyADIAYgBUGTMmxBCHYgCkGI6ABsQQh2amsiBUGExABqIgZBBnZBAEH/ASAFQfy7f0gbIAZBgIABSRs6AAQgAkEBaiECIAFBAWohASAAQQJqIQAgA0EGaiIDIAdHDQALIAchAwsgBEEBcQRAIAEtAAAhASADIAAtAABBhZUBbEEIdiIAIAItAAAiAkGlzAFsQQh2aiIEQZrvAGsiB0EGdkEAQf8BIARBmu8ASRsgB0GAgAFJGzoAAiADIAFBmoICbEEIdiAAaiIEQZWKAWsiB0EGdkEAQf8BIARBlYoBSRsgB0GAgAFJGzoAACADIAAgAUGTMmxBCHYgAkGI6ABsQQh2amsiAEGExABqIgFBBnZBAEH/ASAAQfy7f0gbIAFBgIABSRs6AAELC6AFAQV/IARBAXRBfHEiCQRAIAMgCWohCQNAIAMgAC0AAEGFlQFsQQh2IgYgAi0AACIFQaXMAWxBCHZqIgdBmu8AayIIQQZ2QQBB+AEgB0Ga7wBJGyAIQYCAAUkbQfgBcSAGIAEtAAAiB0GTMmxBCHYgBUGI6ABsQQh2amsiBUGExABqIghBBnVBAEH/ASAFQfy7f0gbIAhBgIABSRsiBUEFdnI6AAAgAyAFQQN0QeABcSAHQZqCAmxBCHYgBmoiBkGVigFrIgVBCXZBAEEfIAZBlYoBSRsgBUGAgAFJG3I6AAEgAyAALQABQYWVAWxBCHYiBiACLQAAIgVBpcwBbEEIdmoiB0Ga7wBrIghBBnZBAEH4ASAHQZrvAEkbIAhBgIABSRtB+AFxIAYgAS0AACIHQZMybEEIdiAFQYjoAGxBCHZqayIFQYTEAGoiCEEGdUEAQf8BIAVB/Lt/SBsgCEGAgAFJGyIFQQV2cjoAAiADIAVBA3RB4AFxIAdBmoICbEEIdiAGaiIGQZWKAWsiBUEJdkEAQR8gBkGVigFJGyAFQYCAAUkbcjoAAyACQQFqIQIgAUEBaiEBIABBAmohACADQQRqIgMgCUcNAAsgCSEDCyAEQQFxBEAgAyAALQAAQYWVAWxBCHYiACACLQAAIgJBpcwBbEEIdmoiBEGa7wBrIglBBnZBAEH4ASAEQZrvAEkbIAlBgIABSRtB+AFxIAAgAS0AACIBQZMybEEIdiACQYjoAGxBCHZqayICQYTEAGoiBEEGdUEAQf8BIAJB/Lt/SBsgBEGAgAFJGyICQQV2cjoAACADIAJBA3RB4AFxIAFBmoICbEEIdiAAaiIAQZWKAWsiAUEJdkEAQR8gAEGVigFJGyABQYCAAUkbcjoAAQsLpgUBBn8gBEECdEF4cSIIBEAgAyAIaiEIA0AgAi0AACEFIAEtAAAhBiAALQAAIQcgA0H/AToAAyADIAdBhZUBbEEIdiIHIAZBmoICbEEIdmoiCUGVigFrIgpBBnZBAEH/ASAJQZWKAUkbIApBgIABSRs6AAIgAyAFQaXMAWxBCHYgB2oiCUGa7wBrIgpBBnZBAEH/ASAJQZrvAEkbIApBgIABSRs6AAAgAyAHIAZBkzJsQQh2IAVBiOgAbEEIdmprIgVBhMQAaiIGQQZ2QQBB/wEgBUH8u39IGyAGQYCAAUkbOgABIAItAAAhBSABLQAAIQYgAC0AASEHIANB/wE6AAcgAyAHQYWVAWxBCHYiByAGQZqCAmxBCHZqIglBlYoBayIKQQZ2QQBB/wEgCUGVigFJGyAKQYCAAUkbOgAGIAMgBUGlzAFsQQh2IAdqIglBmu8AayIKQQZ2QQBB/wEgCUGa7wBJGyAKQYCAAUkbOgAEIAMgByAGQZMybEEIdiAFQYjoAGxBCHZqayIFQYTEAGoiBkEGdkEAQf8BIAVB/Lt/SBsgBkGAgAFJGzoABSACQQFqIQIgAUEBaiEBIABBAmohACADQQhqIgMgCEcNAAsgCCEDCyAEQQFxBEAgAi0AACECIAEtAAAhASAALQAAIQAgA0H/AToAAyADIABBhZUBbEEIdiIAIAFBmoICbEEIdmoiBEGVigFrIghBBnZBAEH/ASAEQZWKAUkbIAhBgIABSRs6AAIgAyACQaXMAWxBCHYgAGoiBEGa7wBrIghBBnZBAEH/ASAEQZrvAEkbIAhBgIABSRs6AAAgAyAAIAFBkzJsQQh2IAJBiOgAbEEIdmprIgBBhMQAaiIBQQZ2QQBB/wEgAEH8u39IGyABQYCAAUkbOgABCwvkAQEKfyAAKAIUIQIgACgCICEJIAAoAhghBSAAKAIcIQYgACgCJCEKIAEoAgAiAygCFCIBIAAoAghsIAMoAhBqIQQgACgCDCEHIAMoAgBBAnRBkNYAaigCACEDAkAgACgCECIIQQBMDQAgCEEBRwRAIAhBfnEhCwNAIAIgBSAGIAQgByADEQMAIAIgCWoiAiAFIAYgASAEaiIEIAcgAxEDACAFIApqIQUgBiAKaiEGIAEgBGohBCACIAlqIQIgC0ECayILDQALCyAIQQFxRQ0AIAIgBSAGIAQgByADEQMACyAAKAIQC6YFAQZ/IARBAnRBeHEiCARAIAMgCGohCANAIAEtAAAhBSACLQAAIQYgAC0AACEHIANB/wE6AAMgAyAHQYWVAWxBCHYiByAGQaXMAWxBCHZqIglBmu8AayIKQQZ2QQBB/wEgCUGa7wBJGyAKQYCAAUkbOgACIAMgBUGaggJsQQh2IAdqIglBlYoBayIKQQZ2QQBB/wEgCUGVigFJGyAKQYCAAUkbOgAAIAMgByAFQZMybEEIdiAGQYjoAGxBCHZqayIFQYTEAGoiBkEGdkEAQf8BIAVB/Lt/SBsgBkGAgAFJGzoAASABLQAAIQUgAi0AACEGIAAtAAEhByADQf8BOgAHIAMgB0GFlQFsQQh2IgcgBkGlzAFsQQh2aiIJQZrvAGsiCkEGdkEAQf8BIAlBmu8ASRsgCkGAgAFJGzoABiADIAVBmoICbEEIdiAHaiIJQZWKAWsiCkEGdkEAQf8BIAlBlYoBSRsgCkGAgAFJGzoABCADIAcgBUGTMmxBCHYgBkGI6ABsQQh2amsiBUGExABqIgZBBnZBAEH/ASAFQfy7f0gbIAZBgIABSRs6AAUgAkEBaiECIAFBAWohASAAQQJqIQAgA0EIaiIDIAhHDQALIAghAwsgBEEBcQRAIAEtAAAhASACLQAAIQIgAC0AACEAIANB/wE6AAMgAyAAQYWVAWxBCHYiACACQaXMAWxBCHZqIgRBmu8AayIIQQZ2QQBB/wEgBEGa7wBJGyAIQYCAAUkbOgACIAMgAUGaggJsQQh2IABqIgRBlYoBayIIQQZ2QQBB/wEgBEGVigFJGyAIQYCAAUkbOgAAIAMgACABQZMybEEIdiACQYjoAGxBCHZqayIAQYTEAGoiAUEGdkEAQf8BIABB/Lt/SBsgAUGAgAFJGzoAAQsLpgUBBn8gBEECdEF4cSIIBEAgAyAIaiEIA0AgAi0AACEFIAEtAAAhBiAALQAAIQcgA0H/AToAACADIAdBhZUBbEEIdiIHIAZBmoICbEEIdmoiCUGVigFrIgpBBnZBAEH/ASAJQZWKAUkbIApBgIABSRs6AAMgAyAFQaXMAWxBCHYgB2oiCUGa7wBrIgpBBnZBAEH/ASAJQZrvAEkbIApBgIABSRs6AAEgAyAHIAZBkzJsQQh2IAVBiOgAbEEIdmprIgVBhMQAaiIGQQZ2QQBB/wEgBUH8u39IGyAGQYCAAUkbOgACIAItAAAhBSABLQAAIQYgAC0AASEHIANB/wE6AAQgAyAHQYWVAWxBCHYiByAGQZqCAmxBCHZqIglBlYoBayIKQQZ2QQBB/wEgCUGVigFJGyAKQYCAAUkbOgAHIAMgBUGlzAFsQQh2IAdqIglBmu8AayIKQQZ2QQBB/wEgCUGa7wBJGyAKQYCAAUkbOgAFIAMgByAGQZMybEEIdiAFQYjoAGxBCHZqayIFQYTEAGoiBkEGdkEAQf8BIAVB/Lt/SBsgBkGAgAFJGzoABiACQQFqIQIgAUEBaiEBIABBAmohACADQQhqIgMgCEcNAAsgCCEDCyAEQQFxBEAgAi0AACECIAEtAAAhASAALQAAIQAgA0H/AToAACADIABBhZUBbEEIdiIAIAFBmoICbEEIdmoiBEGVigFrIghBBnZBAEH/ASAEQZWKAUkbIAhBgIABSRs6AAMgAyACQaXMAWxBCHYgAGoiBEGa7wBrIghBBnZBAEH/ASAEQZrvAEkbIAhBgIABSRs6AAEgAyAAIAFBkzJsQQh2IAJBiOgAbEEIdmprIgBBhMQAaiIBQQZ2QQBB/wEgAEH8u39IGyABQYCAAUkbOgACCwuCBQEGfyAEQQF0QXxxIgkEQCADIAlqIQkDQCACLQAAIQUgAyAALQAAQYWVAWxBCHYiBiABLQAAIgpBmoICbEEIdmoiB0GVigFrIghBBnZBAEHwASAHQZWKAUkbIAhBgIABSRtBD3I6AAEgAyAFQaXMAWxBCHYgBmoiB0Ga7wBrIghBBnZBAEHwASAHQZrvAEkbIAhBgIABSRtB8AFxIAYgCkGTMmxBCHYgBUGI6ABsQQh2amsiBUGExABqIgZBCnZBAEEPIAVB/Lt/SBsgBkGAgAFJG3I6AAAgAi0AACEFIAMgAC0AAUGFlQFsQQh2IgYgAS0AACIKQZqCAmxBCHZqIgdBlYoBayIIQQZ2QQBB8AEgB0GVigFJGyAIQYCAAUkbQQ9yOgADIAMgBUGlzAFsQQh2IAZqIgdBmu8AayIIQQZ2QQBB8AEgB0Ga7wBJGyAIQYCAAUkbQfABcSAGIApBkzJsQQh2IAVBiOgAbEEIdmprIgVBhMQAaiIGQQp2QQBBDyAFQfy7f0gbIAZBgIABSRtyOgACIAJBAWohAiABQQFqIQEgAEECaiEAIANBBGoiAyAJRw0ACyAJIQMLIARBAXEEQCACLQAAIQIgAyAALQAAQYWVAWxBCHYiACABLQAAIgFBmoICbEEIdmoiBEGVigFrIglBBnZBAEHwASAEQZWKAUkbIAlBgIABSRtBD3I6AAEgAyACQaXMAWxBCHYgAGoiA0Ga7wBrIgRBBnZBAEHwASADQZrvAEkbIARBgIABSRtB8AFxIAAgAUGTMmxBCHYgAkGI6ABsQQh2amsiAEGExABqIgFBCnZBAEEPIABB/Lt/SBsgAUGAgAFJG3I6AAALC/QBAQZ/IARBAEoEQANAIAMgBUEBdGoiCCAAIAVqLQAAQYWVAWxBCHYiByACIAVqLQAAIgZBpcwBbEEIdmoiCUGa7wBrIgpBBnZBAEH4ASAJQZrvAEkbIApBgIABSRtB+AFxIAcgASAFai0AACIJQZMybEEIdiAGQYjoAGxBCHZqayIGQYTEAGoiCkEGdUEAQf8BIAZB/Lt/SBsgCkGAgAFJGyIGQQV2cjoAACAIIAZBA3RB4AFxIAlBmoICbEEIdiAHaiIHQZWKAWsiCEEJdkEAQR8gB0GVigFJGyAIQYCAAUkbcjoAASAFQQFqIgUgBEcNAAsLC+oBAQd/IARBAEoEQANAIAIgBWotAAAhBiADIAVBAXRqIgggACAFai0AAEGFlQFsQQh2IgcgASAFai0AACIKQZqCAmxBCHZqIglBlYoBayILQQZ2QQBB8AEgCUGVigFJGyALQYCAAUkbQQ9yOgABIAggBkGlzAFsQQh2IAdqIghBmu8AayIJQQZ2QQBB8AEgCEGa7wBJGyAJQYCAAUkbQfABcSAHIApBkzJsQQh2IAZBiOgAbEEIdmprIgZBhMQAaiIHQQp2QQBBDyAGQfy7f0gbIAdBgIABSRtyOgAAIAVBAWoiBSAERw0ACwsL9gEBB38gBEEASgRAA0AgAiAFai0AACEHIAEgBWotAAAhCyAAIAVqLQAAIQggAyAFQQJ0aiIGQf8BOgAAIAYgCEGFlQFsQQh2IgggC0GaggJsQQh2aiIJQZWKAWsiCkEGdkEAQf8BIAlBlYoBSRsgCkGAgAFJGzoAAyAGIAdBpcwBbEEIdiAIaiIJQZrvAGsiCkEGdkEAQf8BIAlBmu8ASRsgCkGAgAFJGzoAASAGIAggC0GTMmxBCHYgB0GI6ABsQQh2amsiBkGExABqIgdBBnZBAEH/ASAGQfy7f0gbIAdBgIABSRs6AAIgBUEBaiIFIARHDQALCwvoAQEHfyAEQQBKBEADQCABIAVqLQAAIQYgAyAFQQNsaiIHIAAgBWotAABBhZUBbEEIdiIKIAIgBWotAAAiC0GlzAFsQQh2aiIIQZrvAGsiCUEGdkEAQf8BIAhBmu8ASRsgCUGAgAFJGzoAAiAHIAZBmoICbEEIdiAKaiIIQZWKAWsiCUEGdkEAQf8BIAhBlYoBSRsgCUGAgAFJGzoAACAHIAogBkGTMmxBCHYgC0GI6ABsQQh2amsiBkGExABqIgdBBnZBAEH/ASAGQfy7f0gbIAdBgIABSRs6AAEgBUEBaiIFIARHDQALCwvoAQEHfyAEQQBKBEADQCACIAVqLQAAIQYgAyAFQQNsaiIHIAAgBWotAABBhZUBbEEIdiIKIAEgBWotAAAiC0GaggJsQQh2aiIIQZWKAWsiCUEGdkEAQf8BIAhBlYoBSRsgCUGAgAFJGzoAAiAHIAZBpcwBbEEIdiAKaiIIQZrvAGsiCUEGdkEAQf8BIAhBmu8ASRsgCUGAgAFJGzoAACAHIAogC0GTMmxBCHYgBkGI6ABsQQh2amsiBkGExABqIgdBBnZBAEH/ASAGQfy7f0gbIAdBgIABSRs6AAEgBUEBaiIFIARHDQALCwv2AQEHfyAEQQBKBEADQCABIAVqLQAAIQcgAiAFai0AACELIAAgBWotAAAhCCADIAVBAnRqIgZB/wE6AAMgBiAIQYWVAWxBCHYiCCALQaXMAWxBCHZqIglBmu8AayIKQQZ2QQBB/wEgCUGa7wBJGyAKQYCAAUkbOgACIAYgB0GaggJsQQh2IAhqIglBlYoBayIKQQZ2QQBB/wEgCUGVigFJGyAKQYCAAUkbOgAAIAYgCCAHQZMybEEIdiALQYjoAGxBCHZqayIGQYTEAGoiB0EGdkEAQf8BIAZB/Lt/SBsgB0GAgAFJGzoAASAFQQFqIgUgBEcNAAsLC/YBAQd/IARBAEoEQANAIAIgBWotAAAhByABIAVqLQAAIQsgACAFai0AACEIIAMgBUECdGoiBkH/AToAAyAGIAhBhZUBbEEIdiIIIAtBmoICbEEIdmoiCUGVigFrIgpBBnZBAEH/ASAJQZWKAUkbIApBgIABSRs6AAIgBiAHQaXMAWxBCHYgCGoiCUGa7wBrIgpBBnZBAEH/ASAJQZrvAEkbIApBgIABSRs6AAAgBiAIIAtBkzJsQQh2IAdBiOgAbEEIdmprIgZBhMQAaiIHQQZ2QQBB/wEgBkH8u39IGyAHQYCAAUkbOgABIAVBAWoiBSAERw0ACwsLVwEDfwJAIAAoAgxBAEwNACAAKAIQQQBMDQAgACAAKAIoIgEgASgCLBEEACECIAEoAjAiAwRAIAAgASACIAMRCAAaCyABIAEoAhAgAmo2AhBBASEBCyABC9sOARJ/IAYgAC0AAEGFlQFsQQh2IgogBC0AACAFLQAAQRB0ciIMIAItAAAgAy0AAEEQdHIiCUEDbGpBgoAIaiILQRJ2Ig9BpcwBbEEIdmoiEUGa7wBrIg1BBnZBAEH/ASARQZrvAEkbIA1BgIABSRs6AAAgBiALQQJ2Qf8BcSILQZqCAmxBCHYgCmoiEUGVigFrIg1BBnZBAEH/ASARQZWKAUkbIA1BgIABSRs6AAIgBiAKIA9BiOgAbEEIdiALQZMybEEIdmprIgpBhMQAaiILQQZ2QQBB/wEgCkH8u39IGyALQYCAAUkbOgABIAEEQCAHIAEtAABBhZUBbEEIdiIKIAkgDEEDbGpBgoAIaiILQRJ2Ig9BpcwBbEEIdmoiEUGa7wBrIg1BBnZBAEH/ASARQZrvAEkbIA1BgIABSRs6AAAgByAKIAtBAnZB/wFxIgtBmoICbEEIdmoiEUGVigFrIg1BBnZBAEH/ASARQZWKAUkbIA1BgIABSRs6AAIgByAKIAtBkzJsQQh2IA9BiOgAbEEIdmprIgpBhMQAaiILQQZ2QQBB/wEgCkH8u39IGyALQYCAAUkbOgABCyAIQQFrIRECQCAIQQNIBEAgDCEKIAkhCwwBCyARQQF1IgpBASAKQQFKGyEaQQEhDwNAIAYgD0EBdCINQQFrIhJBA2wiFGoiDiAAIBJqLQAAQYWVAWxBCHYiECAEIA9qLQAAIAUgD2otAABBEHRyIgogAiAPai0AACADIA9qLQAAQRB0ciILIAxqIhggCWpqQYiAIGoiGSAYQQF0akEDdiIYIAlqIhVBEXYiFkGlzAFsQQh2aiITQZrvAGsiF0EGdkEAQf8BIBNBmu8ASRsgF0GAgAFJGzoAACAOIBVBAXZB/wFxIhVBmoICbEEIdiAQaiITQZWKAWsiF0EGdkEAQf8BIBNBlYoBSRsgF0GAgAFJGzoAAiAOIBAgFkGI6ABsQQh2IBVBkzJsQQh2amsiDkGExABqIhBBBnZBAEH/ASAOQfy7f0gbIBBBgIABSRs6AAEgBiAPQQZsIhVqIg4gACANai0AAEGFlQFsQQh2IhAgGSAJIApqQQF0akEDdiIZIAtqIglBAXZB/wFxIhZBmoICbEEIdmoiE0GVigFrIhdBBnZBAEH/ASATQZWKAUkbIBdBgIABSRs6AAIgDiAQIAlBEXYiCUGI6ABsQQh2IBZBkzJsQQh2amsiFkGExABqIhNBBnZBAEH/ASAWQfy7f0gbIBNBgIABSRs6AAEgDiAJQaXMAWxBCHYgEGoiCUGa7wBrIg5BBnZBAEH/ASAJQZrvAEkbIA5BgIABSRs6AAAgAQRAIAcgFGoiCSABIBJqLQAAQYWVAWxBCHYiEiAMIBlqIgxBEXYiDkGlzAFsQQh2aiIQQZrvAGsiFEEGdkEAQf8BIBBBmu8ASRsgFEGAgAFJGzoAACAJIBIgDEEBdkH/AXEiDEGaggJsQQh2aiIQQZWKAWsiFEEGdkEAQf8BIBBBlYoBSRsgFEGAgAFJGzoAAiAJIBIgDEGTMmxBCHYgDkGI6ABsQQh2amsiCUGExABqIgxBBnZBAEH/ASAJQfy7f0gbIAxBgIABSRs6AAEgByAVaiIJIAEgDWotAABBhZUBbEEIdiIMIAogGGoiDUEBdkH/AXEiEkGaggJsQQh2aiIOQZWKAWsiEEEGdkEAQf8BIA5BlYoBSRsgEEGAgAFJGzoAAiAJIAwgEkGTMmxBCHYgDUERdiINQYjoAGxBCHZqayISQYTEAGoiDkEGdkEAQf8BIBJB/Lt/SBsgDkGAgAFJGzoAASAJIAwgDUGlzAFsQQh2aiIJQZrvAGsiDEEGdkEAQf8BIAlBmu8ASRsgDEGAgAFJGzoAAAsgDyAaRyENIA9BAWohDyALIQkgCiEMIA0NAAsLAkAgCEEBcQ0AIAYgEUEDbCIDaiICIAAgEWotAABBhZUBbEEIdiIAIAogC0EDbGpBgoAIaiIEQRJ2IgVBpcwBbEEIdmoiBkGa7wBrIghBBnZBAEH/ASAGQZrvAEkbIAhBgIABSRs6AAAgAiAAIARBAnZB/wFxIgRBmoICbEEIdmoiBkGVigFrIghBBnZBAEH/ASAGQZWKAUkbIAhBgIABSRs6AAIgAiAAIARBkzJsQQh2IAVBiOgAbEEIdmprIgBBhMQAaiICQQZ2QQBB/wEgAEH8u39IGyACQYCAAUkbOgABIAFFDQAgAyAHaiIAIAEgEWotAABBhZUBbEEIdiIBIAsgCkEDbGpBgoAIaiICQRJ2IgNBpcwBbEEIdmoiBEGa7wBrIgVBBnZBAEH/ASAEQZrvAEkbIAVBgIABSRs6AAAgACABIAJBAnZB/wFxIgJBmoICbEEIdmoiBEGVigFrIgVBBnZBAEH/ASAEQZWKAUkbIAVBgIABSRs6AAIgACABIAJBkzJsQQh2IANBiOgAbEEIdmprIgBBhMQAaiIBQQZ2QQBB/wEgAEH8u39IGyABQYCAAUkbOgABCwvbDgESfyAGIAAtAABBhZUBbEEIdiIKIAQtAAAgBS0AAEEQdHIiDCACLQAAIAMtAABBEHRyIglBA2xqQYKACGoiC0ESdiIPQaXMAWxBCHZqIhFBmu8AayINQQZ2QQBB/wEgEUGa7wBJGyANQYCAAUkbOgACIAYgC0ECdkH/AXEiC0GaggJsQQh2IApqIhFBlYoBayINQQZ2QQBB/wEgEUGVigFJGyANQYCAAUkbOgAAIAYgCiAPQYjoAGxBCHYgC0GTMmxBCHZqayIKQYTEAGoiC0EGdkEAQf8BIApB/Lt/SBsgC0GAgAFJGzoAASABBEAgByABLQAAQYWVAWxBCHYiCiAJIAxBA2xqQYKACGoiC0ESdiIPQaXMAWxBCHZqIhFBmu8AayINQQZ2QQBB/wEgEUGa7wBJGyANQYCAAUkbOgACIAcgCiALQQJ2Qf8BcSILQZqCAmxBCHZqIhFBlYoBayINQQZ2QQBB/wEgEUGVigFJGyANQYCAAUkbOgAAIAcgCiALQZMybEEIdiAPQYjoAGxBCHZqayIKQYTEAGoiC0EGdkEAQf8BIApB/Lt/SBsgC0GAgAFJGzoAAQsgCEEBayERAkAgCEEDSARAIAwhCiAJIQsMAQsgEUEBdSIKQQEgCkEBShshGkEBIQ8DQCAGIA9BAXQiDUEBayISQQNsIhRqIg4gACASai0AAEGFlQFsQQh2IhAgBCAPai0AACAFIA9qLQAAQRB0ciIKIAIgD2otAAAgAyAPai0AAEEQdHIiCyAMaiIYIAlqakGIgCBqIhkgGEEBdGpBA3YiGCAJaiIVQRF2IhZBpcwBbEEIdmoiE0Ga7wBrIhdBBnZBAEH/ASATQZrvAEkbIBdBgIABSRs6AAIgDiAVQQF2Qf8BcSIVQZqCAmxBCHYgEGoiE0GVigFrIhdBBnZBAEH/ASATQZWKAUkbIBdBgIABSRs6AAAgDiAQIBZBiOgAbEEIdiAVQZMybEEIdmprIg5BhMQAaiIQQQZ2QQBB/wEgDkH8u39IGyAQQYCAAUkbOgABIAYgD0EGbCIVaiIOIAAgDWotAABBhZUBbEEIdiIQIBkgCSAKakEBdGpBA3YiGSALaiIJQRF2IhZBpcwBbEEIdmoiE0Ga7wBrIhdBBnZBAEH/ASATQZrvAEkbIBdBgIABSRs6AAIgDiAQIBZBiOgAbEEIdiAJQQF2Qf8BcSIJQZMybEEIdmprIhZBhMQAaiITQQZ2QQBB/wEgFkH8u39IGyATQYCAAUkbOgABIA4gCUGaggJsQQh2IBBqIglBlYoBayIOQQZ2QQBB/wEgCUGVigFJGyAOQYCAAUkbOgAAIAEEQCAHIBRqIgkgASASai0AAEGFlQFsQQh2IhIgDCAZaiIMQRF2Ig5BpcwBbEEIdmoiEEGa7wBrIhRBBnZBAEH/ASAQQZrvAEkbIBRBgIABSRs6AAIgCSASIAxBAXZB/wFxIgxBmoICbEEIdmoiEEGVigFrIhRBBnZBAEH/ASAQQZWKAUkbIBRBgIABSRs6AAAgCSASIAxBkzJsQQh2IA5BiOgAbEEIdmprIglBhMQAaiIMQQZ2QQBB/wEgCUH8u39IGyAMQYCAAUkbOgABIAcgFWoiCSABIA1qLQAAQYWVAWxBCHYiDCAKIBhqIg1BEXYiEkGlzAFsQQh2aiIOQZrvAGsiEEEGdkEAQf8BIA5Bmu8ASRsgEEGAgAFJGzoAAiAJIAwgDUEBdkH/AXEiDUGTMmxBCHYgEkGI6ABsQQh2amsiEkGExABqIg5BBnZBAEH/ASASQfy7f0gbIA5BgIABSRs6AAEgCSAMIA1BmoICbEEIdmoiCUGVigFrIgxBBnZBAEH/ASAJQZWKAUkbIAxBgIABSRs6AAALIA8gGkchDSAPQQFqIQ8gCyEJIAohDCANDQALCwJAIAhBAXENACAGIBFBA2wiA2oiAiAAIBFqLQAAQYWVAWxBCHYiACAKIAtBA2xqQYKACGoiBEESdiIFQaXMAWxBCHZqIgZBmu8AayIIQQZ2QQBB/wEgBkGa7wBJGyAIQYCAAUkbOgACIAIgACAEQQJ2Qf8BcSIEQZqCAmxBCHZqIgZBlYoBayIIQQZ2QQBB/wEgBkGVigFJGyAIQYCAAUkbOgAAIAIgACAEQZMybEEIdiAFQYjoAGxBCHZqayIAQYTEAGoiAkEGdkEAQf8BIABB/Lt/SBsgAkGAgAFJGzoAASABRQ0AIAMgB2oiACABIBFqLQAAQYWVAWxBCHYiASALIApBA2xqQYKACGoiAkESdiIDQaXMAWxBCHZqIgRBmu8AayIFQQZ2QQBB/wEgBEGa7wBJGyAFQYCAAUkbOgACIAAgASACQQJ2Qf8BcSICQZqCAmxBCHZqIgRBlYoBayIFQQZ2QQBB/wEgBEGVigFJGyAFQYCAAUkbOgAAIAAgASACQZMybEEIdiADQYjoAGxBCHZqayIAQYTEAGoiAUEGdkEAQf8BIABB/Lt/SBsgAUGAgAFJGzoAAQsLyw8BEn8gBiAALQAAQYWVAWxBCHYiCyAELQAAIAUtAABBEHRyIg0gAi0AACADLQAAQRB0ciIJQQNsakGCgAhqIgxBEnYiCkGI6ABsQQh2IAxBAnZB/wFxIgxBkzJsQQh2amsiEUGExABqIg9BBnVBAEH/ASARQfy7f0gbIA9BgIABSRsiEUEFdiAKQaXMAWxBCHYgC2oiCkGa7wBrIg9BBnZBAEH4ASAKQZrvAEkbIA9BgIABSRtB+AFxcjoAACAGIBFBA3RB4AFxIAxBmoICbEEIdiALaiILQZWKAWsiDEEJdkEAQR8gC0GVigFJGyAMQYCAAUkbcjoAASABBEAgByABLQAAQYWVAWxBCHYiCyAJIA1BA2xqQYKACGoiDEESdiIKQaXMAWxBCHZqIhFBmu8AayIPQQZ2QQBB+AEgEUGa7wBJGyAPQYCAAUkbQfgBcSALIAxBAnZB/wFxIgxBkzJsQQh2IApBiOgAbEEIdmprIgpBhMQAaiIRQQZ1QQBB/wEgCkH8u39IGyARQYCAAUkbIgpBBXZyOgAAIAcgCkEDdEHgAXEgCyAMQZqCAmxBCHZqIgtBlYoBayIMQQl2QQBBHyALQZWKAUkbIAxBgIABSRtyOgABCyAIQQFrIRECQCAIQQNIBEAgDSELIAkhDAwBCyARQQF1IgtBASALQQFKGyEaQQEhCgNAIAYgCkEBdCIPQQFrIhBBAXQiEmoiFiAAIBBqLQAAQYWVAWxBCHYiDiAEIApqLQAAIAUgCmotAABBEHRyIgsgAiAKai0AACADIApqLQAAQRB0ciIMIA1qIhkgCWpqQYiAIGoiFyAZQQF0akEDdiIZIAlqIhhBEXYiE0GI6ABsQQh2IBhBAXZB/wFxIhhBkzJsQQh2amsiFEGExABqIhVBBnVBAEH/ASAUQfy7f0gbIBVBgIABSRsiFEEFdiATQaXMAWxBCHYgDmoiE0Ga7wBrIhVBBnZBAEH4ASATQZrvAEkbIBVBgIABSRtB+AFxcjoAACAWIBRBA3RB4AFxIBhBmoICbEEIdiAOaiIOQZWKAWsiFkEJdkEAQR8gDkGVigFJGyAWQYCAAUkbcjoAASAGIApBAnQiFmoiGCAAIA9qLQAAQYWVAWxBCHYiDiAXIAkgC2pBAXRqQQN2IhcgDGoiCUERdiITQYjoAGxBCHYgCUEBdkH/AXEiCUGTMmxBCHZqayIUQYTEAGoiFUEGdUEAQf8BIBRB/Lt/SBsgFUGAgAFJGyIUQQV2IBNBpcwBbEEIdiAOaiITQZrvAGsiFUEGdkEAQfgBIBNBmu8ASRsgFUGAgAFJG0H4AXFyOgAAIBggFEEDdEHgAXEgCUGaggJsQQh2IA5qIglBlYoBayIOQQl2QQBBHyAJQZWKAUkbIA5BgIABSRtyOgABIAEEQCAHIBJqIg4gASAQai0AAEGFlQFsQQh2IgkgDSAXaiINQRF2IhBBpcwBbEEIdmoiEkGa7wBrIhdBBnZBAEH4ASASQZrvAEkbIBdBgIABSRtB+AFxIAkgDUEBdkH/AXEiDUGTMmxBCHYgEEGI6ABsQQh2amsiEEGExABqIhJBBnVBAEH/ASAQQfy7f0gbIBJBgIABSRsiEEEFdnI6AAAgDiAQQQN0QeABcSAJIA1BmoICbEEIdmoiCUGVigFrIg1BCXZBAEEfIAlBlYoBSRsgDUGAgAFJG3I6AAEgByAWaiINIAEgD2otAABBhZUBbEEIdiIJIAsgGWoiD0ERdiIQQaXMAWxBCHZqIg5Bmu8AayISQQZ2QQBB+AEgDkGa7wBJGyASQYCAAUkbQfgBcSAJIA9BAXZB/wFxIg9BkzJsQQh2IBBBiOgAbEEIdmprIhBBhMQAaiIOQQZ1QQBB/wEgEEH8u39IGyAOQYCAAUkbIhBBBXZyOgAAIA0gEEEDdEHgAXEgCSAPQZqCAmxBCHZqIglBlYoBayINQQl2QQBBHyAJQZWKAUkbIA1BgIABSRtyOgABCyAKIBpHIQ8gCkEBaiEKIAwhCSALIQ0gDw0ACwsCQCAIQQFxDQAgBiARQQF0IgJqIgMgACARai0AAEGFlQFsQQh2IgAgCyAMQQNsakGCgAhqIgRBEnYiBUGlzAFsQQh2aiIGQZrvAGsiCEEGdkEAQfgBIAZBmu8ASRsgCEGAgAFJG0H4AXEgACAEQQJ2Qf8BcSIEQZMybEEIdiAFQYjoAGxBCHZqayIFQYTEAGoiBkEGdUEAQf8BIAVB/Lt/SBsgBkGAgAFJGyIFQQV2cjoAACADIAVBA3RB4AFxIAAgBEGaggJsQQh2aiIAQZWKAWsiA0EJdkEAQR8gAEGVigFJGyADQYCAAUkbcjoAASABRQ0AIAIgB2oiAiABIBFqLQAAQYWVAWxBCHYiACAMIAtBA2xqQYKACGoiAUESdiIDQaXMAWxBCHZqIgRBmu8AayIFQQZ2QQBB+AEgBEGa7wBJGyAFQYCAAUkbQfgBcSAAIAFBAnZB/wFxIgFBkzJsQQh2IANBiOgAbEEIdmprIgNBhMQAaiIEQQZ1QQBB/wEgA0H8u39IGyAEQYCAAUkbIgNBBXZyOgAAIAIgA0EDdEHgAXEgACABQZqCAmxBCHZqIgBBlYoBayIBQQl2QQBBHyAAQZWKAUkbIAFBgIABSRtyOgABCwv7DwESfyAALQAAIQogAi0AACEMIAMtAAAhDiAELQAAIQ0gBS0AACEQIAZB/wE6AAAgBiAKQYWVAWxBCHYiCyANIBBBEHRyIg0gDCAOQRB0ciIKQQNsakGCgAhqIgxBAnZB/wFxIg5BmoICbEEIdmoiEEGVigFrIglBBnZBAEH/ASAQQZWKAUkbIAlBgIABSRs6AAMgBiAMQRJ2Qf8BcSIMQaXMAWxBCHYgC2oiEEGa7wBrIglBBnZBAEH/ASAQQZrvAEkbIAlBgIABSRs6AAEgBiALIAxBiOgAbEEIdiAOQZMybEEIdmprIgtBhMQAaiIMQQZ2QQBB/wEgC0H8u39IGyAMQYCAAUkbOgACIAEEQCABLQAAIQsgB0H/AToAACAHIAtBhZUBbEEIdiILIAogDUEDbGpBgoAIaiIMQQJ2Qf8BcSIOQZqCAmxBCHZqIhBBlYoBayIJQQZ2QQBB/wEgEEGVigFJGyAJQYCAAUkbOgADIAcgCyAMQRJ2Qf8BcSIMQaXMAWxBCHZqIhBBmu8AayIJQQZ2QQBB/wEgEEGa7wBJGyAJQYCAAUkbOgABIAcgCyAOQZMybEEIdiAMQYjoAGxBCHZqayILQYTEAGoiDEEGdkEAQf8BIAtB/Lt/SBsgDEGAgAFJGzoAAgsgCEEBayEQAkAgCEEDSARAIA0hCyAKIQwMAQsgEEEBdSILQQEgC0EBShshGUEBIQ4DQCAAIA5BAXQiFUEBayISai0AACELIAIgDmotAAAhDCADIA5qLQAAIRYgBCAOai0AACERIAUgDmotAAAhEyAGIBJBAnQiGmoiCUH/AToAACAJIAtBhZUBbEEIdiIPIBEgE0EQdHIiCyAMIBZBEHRyIgwgDWoiFiAKampBiIAgaiIRIBZBAXRqQQN2IhYgCmoiE0EBdkH/AXEiF0GaggJsQQh2aiIUQZWKAWsiGEEGdkEAQf8BIBRBlYoBSRsgGEGAgAFJGzoAAyAJIBNBEXZB/wFxIhNBpcwBbEEIdiAPaiIUQZrvAGsiGEEGdkEAQf8BIBRBmu8ASRsgGEGAgAFJGzoAASAJIA8gE0GI6ABsQQh2IBdBkzJsQQh2amsiCUGExABqIg9BBnZBAEH/ASAJQfy7f0gbIA9BgIABSRs6AAIgACAVai0AACEPIAYgDkEDdCITaiIJQf8BOgAAIAkgD0GFlQFsQQh2Ig8gESAKIAtqQQF0akEDdiIRIAxqIgpBAXZB/wFxIhdBmoICbEEIdmoiFEGVigFrIhhBBnZBAEH/ASAUQZWKAUkbIBhBgIABSRs6AAMgCSAPIApBEXZB/wFxIgpBiOgAbEEIdiAXQZMybEEIdmprIhdBhMQAaiIUQQZ2QQBB/wEgF0H8u39IGyAUQYCAAUkbOgACIAkgCkGlzAFsQQh2IA9qIgpBmu8AayIJQQZ2QQBB/wEgCkGa7wBJGyAJQYCAAUkbOgABIAEEQCABIBJqLQAAIQkgByAaaiIKQf8BOgAAIAogCUGFlQFsQQh2IgkgDSARaiINQQF2Qf8BcSISQZqCAmxBCHZqIg9BlYoBayIRQQZ2QQBB/wEgD0GVigFJGyARQYCAAUkbOgADIAogCSANQRF2Qf8BcSINQaXMAWxBCHZqIg9Bmu8AayIRQQZ2QQBB/wEgD0Ga7wBJGyARQYCAAUkbOgABIAogCSASQZMybEEIdiANQYjoAGxBCHZqayIKQYTEAGoiDUEGdkEAQf8BIApB/Lt/SBsgDUGAgAFJGzoAAiABIBVqLQAAIQ0gByATaiIKQf8BOgAAIAogDUGFlQFsQQh2Ig0gCyAWaiIJQQF2Qf8BcSIVQZqCAmxBCHZqIhJBlYoBayIPQQZ2QQBB/wEgEkGVigFJGyAPQYCAAUkbOgADIAogDSAVQZMybEEIdiAJQRF2Qf8BcSIJQYjoAGxBCHZqayIVQYTEAGoiEkEGdkEAQf8BIBVB/Lt/SBsgEkGAgAFJGzoAAiAKIA0gCUGlzAFsQQh2aiIKQZrvAGsiDUEGdkEAQf8BIApBmu8ASRsgDUGAgAFJGzoAAQsgDiAZRyEJIA5BAWohDiAMIQogCyENIAkNAAsLAkAgCEEBcQ0AIAAgEGotAAAhAiAGIBBBAnQiA2oiAEH/AToAACAAIAJBhZUBbEEIdiICIAsgDEEDbGpBgoAIaiIEQQJ2Qf8BcSIFQZqCAmxBCHZqIgZBlYoBayIIQQZ2QQBB/wEgBkGVigFJGyAIQYCAAUkbOgADIAAgAiAEQRJ2Qf8BcSIEQaXMAWxBCHZqIgZBmu8AayIIQQZ2QQBB/wEgBkGa7wBJGyAIQYCAAUkbOgABIAAgAiAFQZMybEEIdiAEQYjoAGxBCHZqayIAQYTEAGoiAkEGdkEAQf8BIABB/Lt/SBsgAkGAgAFJGzoAAiABRQ0AIAEgEGotAAAhASADIAdqIgBB/wE6AAAgACABQYWVAWxBCHYiASAMIAtBA2xqQYKACGoiAkECdkH/AXEiA0GaggJsQQh2aiIEQZWKAWsiBUEGdkEAQf8BIARBlYoBSRsgBUGAgAFJGzoAAyAAIAEgAkESdkH/AXEiAkGlzAFsQQh2aiIEQZrvAGsiBUEGdkEAQf8BIARBmu8ASRsgBUGAgAFJGzoAASAAIAEgA0GTMmxBCHYgAkGI6ABsQQh2amsiAEGExABqIgFBBnZBAEH/ASAAQfy7f0gbIAFBgIABSRs6AAILC+sOARJ/IAYgAC0AAEGFlQFsQQh2IgogBC0AACAFLQAAQRB0ciILIAItAAAgAy0AAEEQdHIiCUEDbGpBgoAIaiIMQQJ2Qf8BcSIPQZqCAmxBCHZqIhBBlYoBayIOQQZ2QQBB8AEgEEGVigFJGyAOQYCAAUkbQQ9yOgABIAYgDEESdiIMQaXMAWxBCHYgCmoiEEGa7wBrIg5BBnZBAEHwASAQQZrvAEkbIA5BgIABSRtB8AFxIAogDEGI6ABsQQh2IA9BkzJsQQh2amsiCkGExABqIgxBCnZBAEEPIApB/Lt/SBsgDEGAgAFJG3I6AAAgAQRAIAcgAS0AAEGFlQFsQQh2IgogCSALQQNsakGCgAhqIgxBAnZB/wFxIg9BmoICbEEIdmoiEEGVigFrIg5BBnZBAEHwASAQQZWKAUkbIA5BgIABSRtBD3I6AAEgByAKIAxBEnYiDEGlzAFsQQh2aiIQQZrvAGsiDkEGdkEAQfABIBBBmu8ASRsgDkGAgAFJG0HwAXEgCiAPQZMybEEIdiAMQYjoAGxBCHZqayIKQYTEAGoiDEEKdkEAQQ8gCkH8u39IGyAMQYCAAUkbcjoAAAsgCEEBayEQAkAgCEEDSARAIAshCiAJIQwMAQsgEEEBdSIKQQEgCkEBShshGkEBIQ8DQCAGIA9BAXQiDkEBayIVQQF0IhFqIhIgACAVai0AAEGFlQFsQQh2Ig0gBCAPai0AACAFIA9qLQAAQRB0ciIKIAIgD2otAAAgAyAPai0AAEEQdHIiDCALaiIXIAlqakGIgCBqIhYgF0EBdGpBA3YiFyAJaiITQQF2Qf8BcSIYQZqCAmxBCHZqIhRBlYoBayIZQQZ2QQBB8AEgFEGVigFJGyAZQYCAAUkbQQ9yOgABIBIgE0ERdiISQaXMAWxBCHYgDWoiE0Ga7wBrIhRBBnZBAEHwASATQZrvAEkbIBRBgIABSRtB8AFxIA0gEkGI6ABsQQh2IBhBkzJsQQh2amsiDUGExABqIhJBCnZBAEEPIA1B/Lt/SBsgEkGAgAFJG3I6AAAgBiAPQQJ0IhJqIhMgACAOai0AAEGFlQFsQQh2Ig0gFiAJIApqQQF0akEDdiIWIAxqIglBAXZB/wFxIhhBmoICbEEIdmoiFEGVigFrIhlBBnZBAEHwASAUQZWKAUkbIBlBgIABSRtBD3I6AAEgEyAJQRF2IglBpcwBbEEIdiANaiITQZrvAGsiFEEGdkEAQfABIBNBmu8ASRsgFEGAgAFJG0HwAXEgDSAJQYjoAGxBCHYgGEGTMmxBCHZqayIJQYTEAGoiDUEKdkEAQQ8gCUH8u39IGyANQYCAAUkbcjoAACABBEAgByARaiINIAEgFWotAABBhZUBbEEIdiIJIAsgFmoiC0EBdkH/AXEiFUGaggJsQQh2aiIRQZWKAWsiFkEGdkEAQfABIBFBlYoBSRsgFkGAgAFJG0EPcjoAASANIAkgC0ERdiILQaXMAWxBCHZqIg1Bmu8AayIRQQZ2QQBB8AEgDUGa7wBJGyARQYCAAUkbQfABcSAJIBVBkzJsQQh2IAtBiOgAbEEIdmprIglBhMQAaiILQQp2QQBBDyAJQfy7f0gbIAtBgIABSRtyOgAAIAcgEmoiCyABIA5qLQAAQYWVAWxBCHYiCSAKIBdqIg5BAXZB/wFxIhVBmoICbEEIdmoiDUGVigFrIhFBBnZBAEHwASANQZWKAUkbIBFBgIABSRtBD3I6AAEgCyAJIA5BEXYiC0GlzAFsQQh2aiIOQZrvAGsiDUEGdkEAQfABIA5Bmu8ASRsgDUGAgAFJG0HwAXEgCSAVQZMybEEIdiALQYjoAGxBCHZqayIJQYTEAGoiC0EKdkEAQQ8gCUH8u39IGyALQYCAAUkbcjoAAAsgDyAaRyEOIA9BAWohDyAMIQkgCiELIA4NAAsLAkAgCEEBcQ0AIAYgEEEBdCICaiIDIAAgEGotAABBhZUBbEEIdiIAIAogDEEDbGpBgoAIaiIEQQJ2Qf8BcSIFQZqCAmxBCHZqIgZBlYoBayIIQQZ2QQBB8AEgBkGVigFJGyAIQYCAAUkbQQ9yOgABIAMgACAEQRJ2IgNBpcwBbEEIdmoiBEGa7wBrIgZBBnZBAEHwASAEQZrvAEkbIAZBgIABSRtB8AFxIAAgBUGTMmxBCHYgA0GI6ABsQQh2amsiAEGExABqIgNBCnZBAEEPIABB/Lt/SBsgA0GAgAFJG3I6AAAgAUUNACACIAdqIgIgASAQai0AAEGFlQFsQQh2IgAgDCAKQQNsakGCgAhqIgFBAnZB/wFxIgNBmoICbEEIdmoiBEGVigFrIgVBBnZBAEHwASAEQZWKAUkbIAVBgIABSRtBD3I6AAEgAiAAIAFBEnYiAUGlzAFsQQh2aiICQZrvAGsiBEEGdkEAQfABIAJBmu8ASRsgBEGAgAFJG0HwAXEgACADQZMybEEIdiABQYjoAGxBCHZqayIAQYTEAGoiAUEKdkEAQQ8gAEH8u39IGyABQYCAAUkbcjoAAAsL+w8BEn8gAC0AACEKIAItAAAhDCADLQAAIQ4gBC0AACENIAUtAAAhECAGQf8BOgADIAYgCkGFlQFsQQh2IgsgDSAQQRB0ciINIAwgDkEQdHIiCkEDbGpBgoAIaiIMQQJ2Qf8BcSIOQZqCAmxBCHZqIhBBlYoBayIJQQZ2QQBB/wEgEEGVigFJGyAJQYCAAUkbOgACIAYgDEESdkH/AXEiDEGlzAFsQQh2IAtqIhBBmu8AayIJQQZ2QQBB/wEgEEGa7wBJGyAJQYCAAUkbOgAAIAYgCyAMQYjoAGxBCHYgDkGTMmxBCHZqayILQYTEAGoiDEEGdkEAQf8BIAtB/Lt/SBsgDEGAgAFJGzoAASABBEAgAS0AACELIAdB/wE6AAMgByALQYWVAWxBCHYiCyAKIA1BA2xqQYKACGoiDEECdkH/AXEiDkGaggJsQQh2aiIQQZWKAWsiCUEGdkEAQf8BIBBBlYoBSRsgCUGAgAFJGzoAAiAHIAsgDEESdkH/AXEiDEGlzAFsQQh2aiIQQZrvAGsiCUEGdkEAQf8BIBBBmu8ASRsgCUGAgAFJGzoAACAHIAsgDkGTMmxBCHYgDEGI6ABsQQh2amsiC0GExABqIgxBBnZBAEH/ASALQfy7f0gbIAxBgIABSRs6AAELIAhBAWshEAJAIAhBA0gEQCANIQsgCiEMDAELIBBBAXUiC0EBIAtBAUobIRlBASEOA0AgACAOQQF0IhVBAWsiEmotAAAhCyACIA5qLQAAIQwgAyAOai0AACEWIAQgDmotAAAhESAFIA5qLQAAIRMgBiASQQJ0IhpqIglB/wE6AAMgCSALQYWVAWxBCHYiDyARIBNBEHRyIgsgDCAWQRB0ciIMIA1qIhYgCmpqQYiAIGoiESAWQQF0akEDdiIWIApqIhNBAXZB/wFxIhdBmoICbEEIdmoiFEGVigFrIhhBBnZBAEH/ASAUQZWKAUkbIBhBgIABSRs6AAIgCSATQRF2Qf8BcSITQaXMAWxBCHYgD2oiFEGa7wBrIhhBBnZBAEH/ASAUQZrvAEkbIBhBgIABSRs6AAAgCSAPIBNBiOgAbEEIdiAXQZMybEEIdmprIglBhMQAaiIPQQZ2QQBB/wEgCUH8u39IGyAPQYCAAUkbOgABIAAgFWotAAAhDyAGIA5BA3QiE2oiCUH/AToAAyAJIA9BhZUBbEEIdiIPIBEgCiALakEBdGpBA3YiESAMaiIKQQF2Qf8BcSIXQZqCAmxBCHZqIhRBlYoBayIYQQZ2QQBB/wEgFEGVigFJGyAYQYCAAUkbOgACIAkgDyAKQRF2Qf8BcSIKQYjoAGxBCHYgF0GTMmxBCHZqayIXQYTEAGoiFEEGdkEAQf8BIBdB/Lt/SBsgFEGAgAFJGzoAASAJIApBpcwBbEEIdiAPaiIKQZrvAGsiCUEGdkEAQf8BIApBmu8ASRsgCUGAgAFJGzoAACABBEAgASASai0AACEJIAcgGmoiCkH/AToAAyAKIAlBhZUBbEEIdiIJIA0gEWoiDUEBdkH/AXEiEkGaggJsQQh2aiIPQZWKAWsiEUEGdkEAQf8BIA9BlYoBSRsgEUGAgAFJGzoAAiAKIAkgDUERdkH/AXEiDUGlzAFsQQh2aiIPQZrvAGsiEUEGdkEAQf8BIA9Bmu8ASRsgEUGAgAFJGzoAACAKIAkgEkGTMmxBCHYgDUGI6ABsQQh2amsiCkGExABqIg1BBnZBAEH/ASAKQfy7f0gbIA1BgIABSRs6AAEgASAVai0AACENIAcgE2oiCkH/AToAAyAKIA1BhZUBbEEIdiINIAsgFmoiCUEBdkH/AXEiFUGaggJsQQh2aiISQZWKAWsiD0EGdkEAQf8BIBJBlYoBSRsgD0GAgAFJGzoAAiAKIA0gFUGTMmxBCHYgCUERdkH/AXEiCUGI6ABsQQh2amsiFUGExABqIhJBBnZBAEH/ASAVQfy7f0gbIBJBgIABSRs6AAEgCiANIAlBpcwBbEEIdmoiCkGa7wBrIg1BBnZBAEH/ASAKQZrvAEkbIA1BgIABSRs6AAALIA4gGUchCSAOQQFqIQ4gDCEKIAshDSAJDQALCwJAIAhBAXENACAAIBBqLQAAIQIgBiAQQQJ0IgNqIgBB/wE6AAMgACACQYWVAWxBCHYiAiALIAxBA2xqQYKACGoiBEECdkH/AXEiBUGaggJsQQh2aiIGQZWKAWsiCEEGdkEAQf8BIAZBlYoBSRsgCEGAgAFJGzoAAiAAIAIgBEESdkH/AXEiBEGlzAFsQQh2aiIGQZrvAGsiCEEGdkEAQf8BIAZBmu8ASRsgCEGAgAFJGzoAACAAIAIgBUGTMmxBCHYgBEGI6ABsQQh2amsiAEGExABqIgJBBnZBAEH/ASAAQfy7f0gbIAJBgIABSRs6AAEgAUUNACABIBBqLQAAIQEgAyAHaiIAQf8BOgADIAAgAUGFlQFsQQh2IgEgDCALQQNsakGCgAhqIgJBAnZB/wFxIgNBmoICbEEIdmoiBEGVigFrIgVBBnZBAEH/ASAEQZWKAUkbIAVBgIABSRs6AAIgACABIAJBEnZB/wFxIgJBpcwBbEEIdmoiBEGa7wBrIgVBBnZBAEH/ASAEQZrvAEkbIAVBgIABSRs6AAAgACABIANBkzJsQQh2IAJBiOgAbEEIdmprIgBBhMQAaiIBQQZ2QQBB/wEgAEH8u39IGyABQYCAAUkbOgABCwv7DwESfyAALQAAIQogAi0AACEMIAMtAAAhDiAELQAAIQ0gBS0AACEQIAZB/wE6AAMgBiAKQYWVAWxBCHYiCyANIBBBEHRyIg0gDCAOQRB0ciIKQQNsakGCgAhqIgxBEnZB/wFxIg5BpcwBbEEIdmoiEEGa7wBrIglBBnZBAEH/ASAQQZrvAEkbIAlBgIABSRs6AAIgBiAMQQJ2Qf8BcSIMQZqCAmxBCHYgC2oiEEGVigFrIglBBnZBAEH/ASAQQZWKAUkbIAlBgIABSRs6AAAgBiALIA5BiOgAbEEIdiAMQZMybEEIdmprIgtBhMQAaiIMQQZ2QQBB/wEgC0H8u39IGyAMQYCAAUkbOgABIAEEQCABLQAAIQsgB0H/AToAAyAHIAtBhZUBbEEIdiILIAogDUEDbGpBgoAIaiIMQRJ2Qf8BcSIOQaXMAWxBCHZqIhBBmu8AayIJQQZ2QQBB/wEgEEGa7wBJGyAJQYCAAUkbOgACIAcgCyAMQQJ2Qf8BcSIMQZqCAmxBCHZqIhBBlYoBayIJQQZ2QQBB/wEgEEGVigFJGyAJQYCAAUkbOgAAIAcgCyAMQZMybEEIdiAOQYjoAGxBCHZqayILQYTEAGoiDEEGdkEAQf8BIAtB/Lt/SBsgDEGAgAFJGzoAAQsgCEEBayEQAkAgCEEDSARAIA0hCyAKIQwMAQsgEEEBdSILQQEgC0EBShshGUEBIQ4DQCAAIA5BAXQiFUEBayISai0AACELIAIgDmotAAAhDCADIA5qLQAAIRYgBCAOai0AACERIAUgDmotAAAhEyAGIBJBAnQiGmoiCUH/AToAAyAJIAtBhZUBbEEIdiIPIBEgE0EQdHIiCyAMIBZBEHRyIgwgDWoiFiAKampBiIAgaiIRIBZBAXRqQQN2IhYgCmoiE0ERdkH/AXEiF0GlzAFsQQh2aiIUQZrvAGsiGEEGdkEAQf8BIBRBmu8ASRsgGEGAgAFJGzoAAiAJIBNBAXZB/wFxIhNBmoICbEEIdiAPaiIUQZWKAWsiGEEGdkEAQf8BIBRBlYoBSRsgGEGAgAFJGzoAACAJIA8gF0GI6ABsQQh2IBNBkzJsQQh2amsiCUGExABqIg9BBnZBAEH/ASAJQfy7f0gbIA9BgIABSRs6AAEgACAVai0AACEPIAYgDkEDdCITaiIJQf8BOgADIAkgD0GFlQFsQQh2Ig8gESAKIAtqQQF0akEDdiIRIAxqIgpBEXZB/wFxIhdBpcwBbEEIdmoiFEGa7wBrIhhBBnZBAEH/ASAUQZrvAEkbIBhBgIABSRs6AAIgCSAPIBdBiOgAbEEIdiAKQQF2Qf8BcSIKQZMybEEIdmprIhdBhMQAaiIUQQZ2QQBB/wEgF0H8u39IGyAUQYCAAUkbOgABIAkgCkGaggJsQQh2IA9qIgpBlYoBayIJQQZ2QQBB/wEgCkGVigFJGyAJQYCAAUkbOgAAIAEEQCABIBJqLQAAIQkgByAaaiIKQf8BOgADIAogCUGFlQFsQQh2IgkgDSARaiINQRF2Qf8BcSISQaXMAWxBCHZqIg9Bmu8AayIRQQZ2QQBB/wEgD0Ga7wBJGyARQYCAAUkbOgACIAogCSANQQF2Qf8BcSINQZqCAmxBCHZqIg9BlYoBayIRQQZ2QQBB/wEgD0GVigFJGyARQYCAAUkbOgAAIAogCSANQZMybEEIdiASQYjoAGxBCHZqayIKQYTEAGoiDUEGdkEAQf8BIApB/Lt/SBsgDUGAgAFJGzoAASABIBVqLQAAIQ0gByATaiIKQf8BOgADIAogDUGFlQFsQQh2Ig0gCyAWaiIJQRF2Qf8BcSIVQaXMAWxBCHZqIhJBmu8AayIPQQZ2QQBB/wEgEkGa7wBJGyAPQYCAAUkbOgACIAogDSAJQQF2Qf8BcSIJQZMybEEIdiAVQYjoAGxBCHZqayIVQYTEAGoiEkEGdkEAQf8BIBVB/Lt/SBsgEkGAgAFJGzoAASAKIA0gCUGaggJsQQh2aiIKQZWKAWsiDUEGdkEAQf8BIApBlYoBSRsgDUGAgAFJGzoAAAsgDiAZRyEJIA5BAWohDiAMIQogCyENIAkNAAsLAkAgCEEBcQ0AIAAgEGotAAAhAiAGIBBBAnQiA2oiAEH/AToAAyAAIAJBhZUBbEEIdiICIAsgDEEDbGpBgoAIaiIEQRJ2Qf8BcSIFQaXMAWxBCHZqIgZBmu8AayIIQQZ2QQBB/wEgBkGa7wBJGyAIQYCAAUkbOgACIAAgAiAEQQJ2Qf8BcSIEQZqCAmxBCHZqIgZBlYoBayIIQQZ2QQBB/wEgBkGVigFJGyAIQYCAAUkbOgAAIAAgAiAEQZMybEEIdiAFQYjoAGxBCHZqayIAQYTEAGoiAkEGdkEAQf8BIABB/Lt/SBsgAkGAgAFJGzoAASABRQ0AIAEgEGotAAAhASADIAdqIgBB/wE6AAMgACABQYWVAWxBCHYiASAMIAtBA2xqQYKACGoiAkESdkH/AXEiA0GlzAFsQQh2aiIEQZrvAGsiBUEGdkEAQf8BIARBmu8ASRsgBUGAgAFJGzoAAiAAIAEgAkECdkH/AXEiAkGaggJsQQh2aiIEQZWKAWsiBUEGdkEAQf8BIARBlYoBSRsgBUGAgAFJGzoAACAAIAEgAkGTMmxBCHYgA0GI6ABsQQh2amsiAEGExABqIgFBBnZBAEH/ASAAQfy7f0gbIAFBgIABSRs6AAELC4YDAgh/AX4gACgCCCAAKAI0bCEEIAAoAkwhBiAAKAJEIQcCQCAAKAIYIAAoAhBsIgIEQCAEQQBMDQEgACgCUCEDQQAgAmutIQkDQCABIAdqQX8gADUCFCAGIAFBAnQiAmoiBSgCACACIANqNQIAIAl+QiCIpyICa61+QoCAgIAIfEIgiKciCCAIQf8BShs6AAAgBSACNgIAIAFBAWoiASAERw0ACwwBCyAEQQBMDQAgBEEBRwRAIARBfnEhAgNAIAEgB2pBfyAANQIUIAYgAUECdGoiAzUCAH5CgICAgAh8QiCIpyIFIAVB/wFKGzoAACADQQA2AgAgByABQQFyIgNqQX8gADUCFCAGIANBAnRqIgM1AgB+QoCAgIAIfEIgiKciBSAFQf8BShs6AAAgA0EANgIAIAFBAmohASACQQJrIgINAAsLIARBAXFFDQAgASAHakF/IAA1AhQgBiABQQJ0aiIANQIAfkKAgICACHxCIIinIgEgAUH/AUobOgAAIABBADYCAAsLzQsCDn8CfgJ/IAAoAigiASgCACgCACIEQQFrIgNBDEkEQEEBQZ0QIAN2QQFxDQEaCyAEQQdrQQRJCyEDIAFCADcCKCABQgA3AjACQCABKAIUIABBC0EMIAMbEDhFDQACQCADRQ0AIARBB2tBA0sNABBLCwJAAkACQAJAAkAgACgCXARAIAEoAgAiAygCACIHQQFrIQIgBEEKTQRAIAJBDE8NBEEAIQRBnRAgAnZBAXFFDQQMBQsgAkEMTw0BQQAhBEGdECACdkEBcUUNAQwCCwJAIARBCk0EQEGEzwAoAgAiAkGwzwAoAgBHBEBBuNYAQYoBNgIAQbTWAEGLATYCAEGw1gBBjAE2AgBBrNYAQY0BNgIAQajWAEGOATYCAEGk1gBBigE2AgBBoNYAQYsBNgIAQZzWAEGMATYCAEGY1gBBjwE2AgBBlNYAQY0BNgIAQZDWAEGQATYCAEGwzwAgAjYCAAsgAUEGNgIsIAAoAjhFDQEgAUIBIAAoAgwiAkEBaiIHQX5xIAJqEBQiAjYCKCACRQ0HIAEgAjYCBCAAKAIMIQAgAUEHNgIsIAEgACACaiIANgIIIAEgACAHQQF1ajYCDBBLDAELIAFBCDYCLAtBASEFIANFDQVBCSEAAkACQCAEQQVrDgYBAAAAAAEAC0EJQQogBEELSRtBAWohAAsgASAANgIwIARBCksNBQwECyAHQQdrQQNLIQQLQgAgACgCYCIHQQF0IgqtIg8gBBsgD3wgB0EBaiIIQX5xIglBAXQiC618QgKGQpsCQu8CIAQbfCIPQv////8PVg0DIAAoAhAhDCAAKAIMIQ0gACgCZCEGIAFCASAPpyIOEBQiAjYCKCACRQ0DIAEgAiAOQZsCQe8CIAQba2pBH2pBYHEiBTYCGCABIAVBqAFqNgIgIAEgBUHUAGo2AhwgAUEAIAVB/AFqIAQbNgIkIAUgACgCDCAAKAIQIAMoAhAgByAGIAMoAiBBASACEBdFBEBBAA8LIAEoAhwgDUEBakEBdSINIAxBAWpBAXUiDCADKAIUIAhBAXUiCCAGQQFqQQF1Ig4gAygCJEEBIAIgCkECdGoiAhAXRQRAQQAPC0EBIQUgASgCICANIAwgAygCGCAIIA4gAygCKEEBIAIgCUECdGoQF0UEQEEADwsgAUEMNgIsIAQNA0EAIQUgASgCJCAAKAIMIAAoAhAgAygCHCAHIAYgAygCLEEBIAIgC0ECdGoQF0UNAyABQQ02AjAMAgsgB0EHa0EDSyEEC0H8AUHQAiAEGyIGQR9qrUIDQgQgBBsiDyAAKAJgIgOsfnwgA0EBdCIKrSAPfiIPQgKGfCIQQv////8PVg0BIAAoAhAhCCAAKAIMIQkgACgCZCEHIAFCASAQpyILEBQiAjYCKCACRQ0BIAEgCyAGayACakFgcSIGNgIYIAEgBkGoAWo2AiAgASAGQdQAajYCHCABQQAgBkH8AWogBBs2AiQgBiAAKAIMIAAoAhAgAiAPp0ECdGoiBiADIAdBAEEBIAIQF0UNASABKAIcIAlBAWpBAXUiCSAIQQFqQQF1IgggAyAGaiADIAdBAEEBIAIgCkECdGoQF0UNASABKAIgIAkgCCAGIApqIAMgB0EAQQEgAiADQQR0ahAXRQ0BIAFBDjYCLEGEzwAoAgAiBUGozwAoAgBHBEBB3NUAQYMBNgIAQdTVAEGEATYCAEH41QBBhQE2AgBB9NUAQYYBNgIAQfDVAEGDATYCAEHs1QBBhAE2AgBB6NUAQYcBNgIAQeTVAEGFATYCAEHg1QBBhgE2AgBB2NUAQYgBNgIAQdDVAEGJATYCAEGozwAgBTYCAAtBASEFIAQNAUEAIQUgASgCJCAAKAIMIAAoAhAgBiADQQNsaiADIAdBAEEBIAIgA0EYbGoQF0UNASABQQ82AjAgAUEQQRBBESABKAIAKAIAIgBBCkYbIABBBUYbNgI0CxAjQQEhBQsgBQuEAwIGfwJ+IAAoAgggACgCNGwhAyAAKAJQIQUgACgCRCEGAkAgACgCGCIERQRAIANBAEwNASADQQFHBEAgA0F+cSEEA0AgASAGakF/IAA1AhAgBSABQQJ0ajUCAH5CgICAgAh8QiCIpyICIAJB/wFKGzoAACAGIAFBAXIiAmpBfyAANQIQIAUgAkECdGo1AgB+QoCAgIAIfEIgiKciAiACQf8BShs6AAAgAUECaiEBIARBAmsiBA0ACwsgA0EBcUUNASABIAZqQX8gADUCECAFIAFBAnRqNQIAfkKAgICACHxCIIinIgAgAEH/AUobOgAADwtBACAEa61CIIYgADQCIIAhByADQQBMDQAgACgCTCEEIAdC/////w+DIQhCACAHfUL/////D4MhBwNAIAEgBmpBfyAANQIQIAcgBSABQQJ0IgJqNQIAfiAIIAIgBGo1AgB+fEKAgICACHxCIIh+QoCAgIAIfEIgiKciAiACQf8BShs6AAAgAUEBaiIBIANHDQALCwvHAQEKfyAAKAIIIgNBAEoEQCAAKAI0IANsIQkDQCAEIAlIBEAgACgCUCELQQAhAkEAIQUgBCIHIQgDQCAAKAIoIQpBACEGIAAoAiQgAmoiAkEASgRAA0AgBSABIAhqLQAAIgZqIQUgAyAIaiEIIAIgCmsiAkEASg0ACwsgCyAHQQJ0aiACIAZsIgYgBSAKbGo2AgAgADUCDEEAIAZrrX5CgICAgAh8QiCIpyEFIAMgB2oiByAJSA0ACwsgBEEBaiIEIANHDQALCwvfAQEKfyAAKAIIIgVBAEoEQCAAKAI0IAVsIQggACgCUCEJA0AgBSAGaiECIAAoAiQhAyABIAZqLQAAIgchBCAAKAIsQQJOBEAgASACai0AACEECyAJIAZBAnRqIAMgB2w2AgAgAiEKIAIgCEgEQANAAkAgAyAAKAIoayIDQQBOBEAgACgCJCELDAELIAAoAiQiCyADaiEDIAQhByABIAUgCmoiCmotAAAhBAsgCSACQQJ0aiAEIAtsIAcgBGsgA2xqNgIAIAIgBWoiAiAISA0ACwsgBkEBaiIGIAVHDQALCwvvAQEDfwJAIAMgBE4NACAFQQBMDQAgBUF8cSEGIAVBA3EhByAFQQFrQQNJIQgDQCAGIQUgCEUEQANAIAIgASAALQAAQQJ0aigCAEEIdjoAACACIAEgAC0AAUECdGooAgBBCHY6AAEgAiABIAAtAAJBAnRqKAIAQQh2OgACIAIgASAALQADQQJ0aigCAEEIdjoAAyACQQRqIQIgAEEEaiEAIAVBBGsiBQ0ACwsgByIFBEADQCACIAEgAC0AAEECdGooAgBBCHY6AAAgAkEBaiECIABBAWohACAFQQFrIgUNAAsLIANBAWoiAyAERw0ACwsL9AEBA38CQCADIARODQAgBUEATA0AIAVBfHEhBiAFQQNxIQcgBUEBa0EDSSEIA0AgBiEFIAhFBEADQCACIAEgACgCAEEGdkH8B3FqKAIANgIAIAIgASAAKAIEQQZ2QfwHcWooAgA2AgQgAiABIAAoAghBBnZB/AdxaigCADYCCCACIAEgACgCDEEGdkH8B3FqKAIANgIMIAJBEGohAiAAQRBqIQAgBUEEayIFDQALCyAHIgUEQANAIAIgASAAKAIAQQZ2QfwHcWooAgA2AgAgAkEEaiECIABBBGohACAFQQFrIgUNAAsLIANBAWoiAyAERw0ACwsLiAIBBX8CQCACQQBMDQAgA0EEaygCACEBIAJBAUcEQCACQX5xIQYDQCADIAVBAnQiBGogACAEaigCACIHQYD+g3hxIAFBgP6DeHFqQYD+g3hxIgggB0H/gfwHcSABQf+B/AdxakH/gfwHcSIBcjYCACADIARBBHIiBGogACAEaigCACIEQYD+g3hxIAhqQYD+g3hxIARB/4H8B3EgAWpB/4H8B3FyIgE2AgAgBUECaiEFIAZBAmsiBg0ACwsgAkEBcUUNACADIAVBAnQiAmogACACaigCACIAQYD+g3hxIAFBgP6DeHFqQYD+g3hxIABB/4H8B3EgAUH/gfwHcWpB/4H8B3FyNgIACwtnAQN/IAJBAEoEQANAIAMgBUECdCIEaiAAIARqKAIAIgZBgP6DeHEgASAEaigCACIEQYD+g3hxakGA/oN4cSAGQf+B/AdxIARB/4H8B3FqQf+B/AdxcjYCACAFQQFqIgUgAkcNAAsLC2oBA38gAkEASgRAA0AgAyAEQQJ0IgVqIAAgBWooAgAiBUGA/oN4cSABIARBAWoiBEECdGooAgAiBkGA/oN4cWpBgP6DeHEgBUH/gfwHcSAGQf+B/AdxakH/gfwHcXI2AgAgAiAERw0ACwsLagEDfyACQQBKBEADQCADIAVBAnQiBGogACAEaigCACIGQYD+g3hxIAEgBGpBBGsoAgAiBEGA/oN4cWpBgP6DeHEgBkH/gfwHcSAEQf+B/AdxakH/gfwHcXI2AgAgBUEBaiIFIAJHDQALCwukAQEFfyACQQBKBEAgA0EEaygCACEEA0AgAyAGQQJ0IgVqIAEgBWoiBygCBCIIIARzQQF2Qf/+/fsHcSAEIAhxaiIEIAcoAgAiB3NBAXZB//79+wdxIAQgB3FqIgRBgP6DeHEgACAFaigCACIFQYD+g3hxakGA/oN4cSAEQf+B/AdxIAVB/4H8B3FqQf+B/AdxciIENgIAIAZBAWoiBiACRw0ACwsLFQAgACgCKCIAKAIoEBIgAEEANgIoC4sBAQR/IAJBAEoEQCADQQRrKAIAIQQDQCADIAZBAnQiBWogASAFakEEaygCACIHIARzQQF2Qf/+/fsHcSAEIAdxaiIEQYD+g3hxIAAgBWooAgAiBUGA/oN4cWpBgP6DeHEgBEH/gfwHcSAFQf+B/AdxakH/gfwHcXIiBDYCACAGQQFqIgYgAkcNAAsLC4gBAQR/IAJBAEoEQCADQQRrKAIAIQQDQCADIAZBAnQiBWogASAFaigCACIHIARzQQF2Qf/+/fsHcSAEIAdxaiIEQYD+g3hxIAAgBWooAgAiBUGA/oN4cWpBgP6DeHEgBEH/gfwHcSAFQf+B/AdxakH/gfwHcXIiBDYCACAGQQFqIgYgAkcNAAsLC4YBAQR/IAJBAEoEQANAIAMgBkECdCIFaiABIAVqIgQoAgAiByAEQQRrKAIAIgRzQQF2Qf/+/fsHcSAEIAdxaiIEQYD+g3hxIAAgBWooAgAiBUGA/oN4cWpBgP6DeHEgBEH/gfwHcSAFQf+B/AdxakH/gfwHcXI2AgAgBkEBaiIGIAJHDQALCwuDAQEEfyACQQBKBEADQCADIAZBAnQiBWogASAFaiIEKAIEIgcgBCgCACIEc0EBdkH//v37B3EgBCAHcWoiBEGA/oN4cSAAIAVqKAIAIgVBgP6DeHFqQYD+g3hxIARB/4H8B3EgBUH/gfwHcWpB/4H8B3FyNgIAIAZBAWoiBiACRw0ACwsLwQEBBn8gAkEASgRAIANBBGsoAgAhBANAIAMgB0ECdCIFaiABIAVqIgYoAgQiCCAGKAIAIglzQQF2Qf/+/fsHcSAIIAlxaiIIIAZBBGsoAgAiBiAEc0EBdkH//v37B3EgBCAGcWoiBHNBAXZB//79+wdxIAQgCHFqIgRBgP6DeHEgACAFaigCACIFQYD+g3hxakGA/oN4cSAEQf+B/AdxIAVB/4H8B3FqQf+B/AdxciIENgIAIAdBAWoiByACRw0ACwsL4wIBCX8gAkEASgRAIANBBGsoAgAhBQNAIAMgCkECdCIMaiABIAxqIgYoAgAiByAFIAVB/wFxIAZBBGsoAgAiBkH/AXEiBGsiCCAIQR91IghqIAhzIAVBGHYgBkEYdiIIayIJIAlBH3UiCWogCXNqIAVBCHZB/wFxIAZBCHZB/wFxIglrIgsgC0EfdSILaiALc2ogB0H/AXEgBGsiBCAEQR91IgRqIARzIAdBGHYgCGsiBCAEQR91IgRqIARzaiAHQQh2Qf8BcSAJayIEIARBH3UiBGogBHNqIAdBEHZB/wFxIAZBEHZB/wFxIgdrIgYgBkEfdSIGaiAGc2prIAVBEHZB/wFxIAdrIgUgBUEfdSIFaiAFc2pBAEwbIgVBgP6DeHEgACAMaigCACIHQYD+g3hxakGA/oN4cSAFQf+B/AdxIAdB/4H8B3FqQf+B/AdxciIFNgIAIApBAWoiCiACRw0ACwsLrAIBBn8gAkEASgRAIANBBGsoAgAhBANAIAMgCEECdCIJaiABIAlqIgYoAgAiB0EYdiAEQRh2aiAGQQRrKAIAIgZBGHZrIgUgBUF/c0EYdiAFQYACSRtBGHQgB0H/AXEgBEH/AXFqIAZB/wFxayIFIAVBf3NBGHYgBUGAAkkbciAHQRB2Qf8BcSAEQRB2Qf8BcWogBkEQdkH/AXFrIgUgBUF/c0EYdiAFQYACSRtBEHRyIAdBCHZB/wFxIARBCHZB/wFxaiAGQQh2Qf8BcWsiBCAEQX9zQRh2IARBgAJJG0EIdHIiBEGA/oN4cSAAIAlqKAIAIgdBgP6DeHFqQYD+g3hxIARB/4H8B3EgB0H/gfwHcWpB/4H8B3FyIgQ2AgAgCEEBaiIIIAJHDQALCwvYAgEFfyACQQBKBEAgA0EEaygCACEFA0AgAyAHQQJ0IghqIAEgCGoiBigCACIEIAVzQQF2Qf/+/fsHcSAEIAVxaiIFQRh2IgQgBCAGQQRrKAIAIgZBGHZrQQJtQRB0QRB1aiIEIARBf3NBGHYgBEGAAkkbQRh0IAVB/wFxIgQgBCAGQf8BcWtBAm1BEHRBEHVqIgQgBEF/c0EYdiAEQYACSRtyIAVBEHZB/wFxIgQgBCAGQRB2Qf8BcWtBAm1BEHRBEHVqIgQgBEF/c0EYdiAEQYACSRtBEHRyIAVBCHZB/wFxIgUgBSAGQQh2Qf8BcWtBAm1BEHRBEHVqIgUgBUF/c0EYdiAFQYACSRtBCHRyIgVBgP6DeHEgACAIaigCACIGQYD+g3hxakGA/oN4cSAFQf+B/AdxIAZB/4H8B3FqQf+B/AdxciIFNgIAIAdBAWoiByACRw0ACwsLjQEBAn8CQCACQQBMDQBBACEBIAJBAUcEQCACQX5xIQUDQCADIAFBAnQiBGogACAEaigCAEGAgIAIazYCACADIARBBHIiBGogACAEaigCAEGAgIAIazYCACABQQJqIQEgBUECayIFDQALCyACQQFxRQ0AIAMgAUECdCIBaiAAIAFqKAIAQYCAgAhrNgIACwvZCQEPfwJAAkAgASAAKAJsIghrIgdBAEwNACAAKAIIIgQoAgAhBiAAKAIQIAAoAmQiAiAIbEECdGohBSAAKAIUIQkCQCAAKAKwASIDQQBKBEAgACADQQFrIgJBFGxqQbQBaiAIIAEgBSAJECYgA0EBRg0BA0AgACACQQFrIgdBFGxqQbQBaiAIIAEgCSAJECYgAkEBSiEDIAchAiADDQALDAELIAUgCUYNACAJIAUgAiAHbEECdBARGgsgBCgCWCICIAEgASACShsiAiAEKAJUIgsgACgCbCIIIAggC0giAxsiBUwNACAEIAIgBWsiBzYCECAEIAUgC2s2AgggBCAEKAJQIAQoAkwiAmsiBTYCDCAJIAJBAnQgBkECdCIMIAsgCGtsQQAgAxtqaiEKIAAoAgwiAigCACIJQQpLDQEgAigCECACKAIUIg0gACgCdGxqIQ4CQCAEKAJcBEBBACEGIAdBAEwEQEEAIQMMAgtBACEDA0AgCiAGIAxsaiILIAwgACgCjAIiBSgCLCAHIAZrIgggBSgCICICIAUoAhhqQQFrIAJtIgIgAiAIShsQNiAAKAKMAiAIIAsgDBAWIAZqIQZBACEPAkAgACgCjAIiBEFAayIFKAIAIAQoAjhODQAgBCgCNCELIAQoAkQhCCAOIAMgDWxqIQIDQCAEKAIYQQBKDQEgBBAYIAggC0EBQfjQACgCABEBACAIIAsgCSACEE0gD0EBaiEPIAIgDWohAiAFKAIAIAQoAjhIDQALCyADIA9qIQMgBiAHSA0ACwwBCyAHQQBKBEAgByECA0AgCiAFIAkgDhBNIA0gDmohDiAKIAxqIQogAkEBSiEDIAJBAWshAiADDQALCyAHIQMLIAAgACgCdCADajYCdAsgACABNgJsDwsgACgCdCEGAkAgBCgCXARAIAdBAEwNAQNAIAogDCAAKAKMAiIDKAIsIAcgDmsiBSADKAIgIgIgAygCGGpBAWsgAm0iAiACIAVKGyICEDYgAiAMbCELIAAoAowCIAUgCiAMEBYgDmohDkEAIQ8CQCAAKAKMAiIEQUBrIggoAgAgBCgCOE4NACAEKAJEIglBA2ohBSAEKAI0IQ0gBiECA0AgBCgCGEEASg0BIAQQGCAJIA1BAUH40AAoAgARAQAgCSAAKAIMIhAoAhAgECgCICACbGogDUHQ1gAoAgARAQAgCSAQKAIUIAJBAXUiAyAQKAIkbGogECgCGCAQKAIoIANsaiANIAJBf3NBAXFB1NYAKAIAEQMAIBAoAhwiAwRAIAVBACANQQEgAyAQKAIsIAJsakEAQZDRACgCABEHABoLIA9BAWohDyACQQFqIQIgCCgCACAEKAI4SA0ACwsgCiALaiEKIAYgD2ohBiAHIA5KDQALDAELIAdBAEwNAANAIAogAigCECACKAIgIAZsaiAFQdDWACgCABEBACAKIAIoAhQgBkEBdSIDIAIoAiRsaiACKAIYIAIoAiggA2xqIAUgBkF/c0EBcUHU1gAoAgARAwAgAigCHCIDBEAgCkEDakEAIAVBASADIAIoAiwgBmxqQQBBkNEAKAIAEQcAGgsgBkEBaiEGIAdBAkgNASAHQQFrIQcgCiAMaiEKIAAoAgwhAgwACwALIAAgBjYCdCAAIAE2AmwLTAEBfyABQQBKBEAgACABQQJ0aiEDA0AgAiAAKAIAIgE6AAAgAiABQRB2OgACIAIgAUEIdjoAASACQQNqIQIgAEEEaiIAIANJDQALCwtfAQF/IAFBAEoEQCAAIAFBAnRqIQMDQCACIAAoAgAiAUEFdkHgAXEgAUEDdkEfcXI6AAEgAiABQRB2QfgBcSABQQ12QQdxcjoAACACQQJqIQIgAEEEaiIAIANJDQALCwtZAQF/IAFBAEoEQCAAIAFBAnRqIQMDQCACIAAoAgAiAUHwAXEgAUEcdnI6AAEgAiABQRB2QfABcSABQQx2QQ9xcjoAACACQQJqIQIgAEEEaiIAIANJDQALCwtWAQF/IAFBAEoEQCAAIAFBAnRqIQMDQCACIAAoAgAiAToAAiACIAFBGHY6AAMgAiABQQh2OgABIAIgAUEQdjoAACACQQRqIQIgAEEEaiIAIANJDQALCwtMAQF/IAFBAEoEQCAAIAFBAnRqIQMDQCACIAAoAgAiAToAAiACIAFBCHY6AAEgAiABQRB2OgAAIAJBA2ohAiAAQQRqIgAgA0kNAAsLC5IBAQZ/IAJBAEoEQCAALAACIQUgACwAASEGIAAsAAAhB0EAIQADQCADIABBAnQiBGogASAEaigCACIEQRB0QRh1IgggB2xBBXUgBEEQdmoiCUEQdEGAgPwHcSAEQYD+g3hxciAGIAhsQQV2IARqIAlBGHRBGHUgBWxBBXZqQf8BcXI2AgAgAEEBaiIAIAJHDQALCwvyAQEFfwJAIAFBAEwNACABQQFHBEAgAUF+cSEGA0AgAiAEQQJ0IgNqIAAgA2ooAgAiBUEIdkH/AXEiByAFQf+B/AdxaiAHQRB0akH/gfwHcSAFQYD+g3hxcjYCACACIANBBHIiA2ogACADaigCACIDQQh2Qf8BcSIFIANB/4H8B3FqIAVBEHRqQf+B/AdxIANBgP6DeHFyNgIAIARBAmohBCAGQQJrIgYNAAsLIAFBAXFFDQAgAiAEQQJ0IgFqIAAgAWooAgAiAEEIdkH/AXEiASAAQf+B/AdxaiABQRB0akH/gfwHcSAAQYD+g3hxcjYCAAsL8QEBAX8gASgCACICIAAoAgAiAHNBAXZB//79+wdxIAAgAnFqIgBBGHYiAiACIAFBBGsoAgAiAUEYdmtBAm1BEHRBEHVqIgIgAkF/c0EYdiACQYACSRtBGHQgAEH/AXEiAiACIAFB/wFxa0ECbUEQdEEQdWoiAiACQX9zQRh2IAJBgAJJG3IgAEEQdkH/AXEiAiACIAFBEHZB/wFxa0ECbUEQdEEQdWoiAiACQX9zQRh2IAJBgAJJG0EQdHIgAEEIdkH/AXEiACAAIAFBCHZB/wFxa0ECbUEQdEEQdWoiACAAQX9zQRh2IABBgAJJG0EIdHIL/wMBDX8gASAAKAJsIgRrIgpBAEoEQCAAKAIQIAAoAmQiAiAEbEECdGohCwNAIApBECAKQRBIGyIGIARqIQwgACgCCCIDKAIAIgUgBmwhDSADKAIoIgcoAogBIAQgBWxqIQMgACgCFCEIAkAgACgCsAEiCUEASgRAIAAgCUEBayICQRRsakG0AWogBCAMIAsgCBAmIAlBAUYNAQNAIAAgAkEBayIJQRRsakG0AWogBCAMIAggCBAmIAJBAUohDiAJIQIgDg0ACwwBCyAIIAtGDQAgCCALIAIgBmxBAnQQERoLIAggAyANQZTRACgCABEBACAHKAIMIgkEQCAHKAKMASECAkAgCkEATA0AIAIgAyADIAUgCUECdEGA0wBqKAIAEQIAIAZBAUYEQCADIQIMAQsgBkEBcQR/IARBAWoFIAMgAyAFaiICIAIgBSAHKAIMQQJ0QYDTAGooAgARAgAgAiEDIARBAmoLIQQgBkECRg0AA0AgAyADIAVqIgIgAiAFIAcoAgxBAnRBgNMAaigCABECACACIAIgBWoiAyADIAUgBygCDEECdEGA0wBqKAIAEQIAIAMhAiAEQQJqIgQgDEcNAAsLIAcgAjYCjAELIAsgACgCZCICIAZsQQJ0aiELIAwhBCAKIAZrIgpBAEoNAAsLIAAgATYCbCAAIAE2AnQLxQEBAn8gASgCACIDQRh2IAAoAgAiAEEYdmogAUEEaygCACIBQRh2ayICIAJBf3NBGHYgAkGAAkkbQRh0IANB/wFxIABB/wFxaiABQf8BcWsiAiACQX9zQRh2IAJBgAJJG3IgA0EQdkH/AXEgAEEQdkH/AXFqIAFBEHZB/wFxayICIAJBf3NBGHYgAkGAAkkbQRB0ciADQQh2Qf8BcSAAQQh2Qf8BcWogAUEIdkH/AXFrIgAgAEF/c0EYdiAAQYACSRtBCHRyC/wBAQV/IAEoAgAiBCAAKAIAIgAgAEH/AXEgAUEEaygCACIBQf8BcSICayIDIANBH3UiA2ogA3MgAEEYdiABQRh2IgNrIgUgBUEfdSIFaiAFc2ogAEEIdkH/AXEgAUEIdkH/AXEiBWsiBiAGQR91IgZqIAZzaiAEQRh2IANrIgMgA0EfdSIDaiADcyAEQf8BcSACayICIAJBH3UiAmogAnNqIARBCHZB/wFxIAVrIgIgAkEfdSICaiACc2ogBEEQdkH/AXEgAUEQdkH/AXEiAWsiBCAEQR91IgRqIARzamsgAEEQdkH/AXEgAWsiACAAQR91IgBqIABzakEATBsLWgECfyABKAIEIgIgASgCACIDc0EBdkH//v37B3EgAiADcWoiAiABQQRrKAIAIgEgACgCACIAc0EBdkH//v37B3EgACABcWoiAHNBAXZB//79+wdxIAAgAnFqCyEAIAEoAgQiACABKAIAIgFzQQF2Qf/+/fsHcSAAIAFxagskACABKAIAIgAgAUEEaygCACIBc0EBdkH//v37B3EgACABcWoLIQAgASgCACIBIAAoAgAiAHNBAXZB//79+wdxIAAgAXFqCyQAIAFBBGsoAgAiASAAKAIAIgBzQQF2Qf/+/fsHcSAAIAFxags9AQF/IAEoAgQiAiAAKAIAIgBzQQF2Qf/+/fsHcSAAIAJxaiIAIAEoAgAiAXNBAXZB//79+wdxIAAgAXFqCwoAIAFBBGsoAgALBwAgASgCBAsHACABKAIACwcAIAAoAgALBwBBgICAeAu1BAEGfyAEIAAtAAA6AAACQCABQQJOBEAgAUEBayIGQQFxIQgCQCABQQJrIgpFBEBBACEBDAELIAZBfnEhBUEAIQEDQCAEIAFBAXIiB2ogACAHaiIHLQAAIAAgAWotAABrOgAAIAQgAUECaiIBaiAAIAFqLQAAIActAABrOgAAIAVBAmsiBQ0ACwsgCARAIAQgAUEBaiIFaiAAIAVqLQAAIAAgAWotAABrOgAACyACQQJIDQEgBkF+cSEIIAZBAXEhB0EBIQYDQCADIARqIgQgACADaiIBLQAAIAAtAABrOgAAQQAhACAIIQUgCgRAA0AgBCAAQQFyIglqIAEgCWoiCS0AACAAIAFqLQAAazoAACAEIABBAmoiAGogACABai0AACAJLQAAazoAACAFQQJrIgUNAAsLIAcEQCAEIABBAWoiBWogASAFai0AACAAIAFqLQAAazoAAAsgASEAIAZBAWoiBiACRw0ACwwBCyACQQJIDQAgAkEBayIBQQNxIQUgAkECa0EDTwRAIAFBfHEhAQNAIAMgBGoiBCAAIANqIgItAAAgAC0AAGs6AAAgAyAEaiIEIAIgA2oiAC0AACACLQAAazoAACADIARqIgQgACADaiICLQAAIAAtAABrOgAAIAMgBGoiBCACIANqIgAtAAAgAi0AAGs6AAAgAUEEayIBDQALCyAFRQ0AA0AgAyAEaiIEIAAgA2oiAS0AACAALQAAazoAACABIQAgBUEBayIFDQALCwvZAgEHfyAEIAAtAAA6AAACQCABQQJIDQAgAUEBayIGQQFxIQggAUECRwRAIAZBfnEhBgNAIAQgBUEBciIHaiAAIAdqIgctAAAgACAFai0AAGs6AAAgBCAFQQJqIgVqIAAgBWotAAAgBy0AAGs6AAAgBkECayIGDQALCyAIRQ0AIAQgBUEBaiIGaiAAIAZqLQAAIAAgBWotAABrOgAACwJAIAJBAkgNACABQQBMDQAgAUF+cSEHIAFBAXEhC0EBIQkDQCADIARqIQQgACADaiEGQQAhBSAHIQggAUEBRwRAA0AgBCAFaiAFIAZqLQAAIAAgBWotAABrOgAAIAQgBUEBciIKaiAGIApqLQAAIAAgCmotAABrOgAAIAVBAmohBSAIQQJrIggNAAsLIAsEQCAEIAVqIAUgBmotAAAgACAFai0AAGs6AAALIAYhACAJQQFqIgkgAkcNAAsLC4AEAQV/IAQgAC0AADoAAAJAIAFBAk4EQCABQQFrIgZBAXEhCSABQQJHBEAgBkF+cSEGA0AgBCAFQQFyIgdqIAAgB2oiBy0AACAAIAVqLQAAazoAACAEIAVBAmoiBWogACAFai0AACAHLQAAazoAACAGQQJrIgYNAAsLIAkEQCAEIAVBAWoiBmogACAGai0AACAAIAVqLQAAazoAAAtBASEJIAJBAUwNASADQX9zIQcDQCADIARqIgQgACADaiIGLQAAIAAtAABrOgAAQQEhBQNAIAQgBWogBSAGaiIILQAAIAAgBWotAAAgCEEBay0AAGogBiAFIAdqai0AAGsiCEEAIAhBAEobIghB/wEgCEH/AUgbazoAACAFQQFqIgUgAUcNAAsgBiEAIAlBAWoiCSACRw0ACwwBCyACQQJIDQAgAkEBayIBQQNxIQYgAkECa0EDTwRAIAFBfHEhAQNAIAMgBGoiBCAAIANqIgItAAAgAC0AAGs6AAAgAyAEaiIEIAIgA2oiAC0AACACLQAAazoAACADIARqIgQgACADaiICLQAAIAAtAABrOgAAIAMgBGoiBCACIANqIgAtAAAgAi0AAGs6AAAgAUEEayIBDQALCyAGRQ0AA0AgAyAEaiIEIAAgA2oiAS0AACAALQAAazoAACABIQAgBkEBayIGDQALCwvdAQEDfyAABH8gAC0AAAVBAAshBAJAIANBAEwNACADQQNxIQZBACEAIANBAWtBA08EQCADQXxxIQMDQCAAIAJqIAAgAWotAAAgBGoiBDoAACACIABBAXIiBWogASAFai0AACAEaiIEOgAAIAIgAEECciIFaiABIAVqLQAAIARqIgQ6AAAgAiAAQQNyIgVqIAEgBWotAAAgBGoiBDoAACAAQQRqIQAgA0EEayIDDQALCyAGRQ0AA0AgACACaiAAIAFqLQAAIARqIgQ6AAAgAEEBaiEAIAZBAWsiBg0ACwsL1QIBA38CQCAABEAgA0EATA0BIANBAXEhBiADQQFHBEAgA0F+cSEDA0AgAiAEaiABIARqLQAAIAAgBGotAABqOgAAIAIgBEEBciIFaiABIAVqLQAAIAAgBWotAABqOgAAIARBAmohBCADQQJrIgMNAAsLIAZFDQEgAiAEaiABIARqLQAAIAAgBGotAABqOgAADwsgA0EATA0AIANBA3EhACADQQFrQQNPBEAgA0F8cSEDA0AgAiAEaiABIARqLQAAIAVqIgU6AAAgAiAEQQFyIgZqIAEgBmotAAAgBWoiBToAACACIARBAnIiBmogASAGai0AACAFaiIFOgAAIAIgBEEDciIGaiABIAZqLQAAIAVqIgU6AAAgBEEEaiEEIANBBGsiAw0ACwsgAEUNAANAIAIgBGogASAEai0AACAFaiIFOgAAIARBAWohBCAAQQFrIgANAAsLC8ECAQR/AkAgAEUEQCADQQBMDQEgA0EDcSEFIANBAWtBA08EQCADQXxxIQcDQCACIARqIAEgBGotAAAgBmoiADoAACACIARBAXIiA2ogASADai0AACAAaiIAOgAAIAIgBEECciIDaiABIANqLQAAIABqIgA6AAAgAiAEQQNyIgNqIAEgA2otAAAgAGoiBjoAACAEQQRqIQQgB0EEayIHDQALCyAFRQ0BA0AgAiAEaiABIARqLQAAIAZqIgY6AAAgBEEBaiEEIAVBAWsiBQ0ACwwBCyADQQBMDQAgAC0AACIFIQYgBSEHA0AgAiAEaiABIARqLQAAIAZB/wFxIAdB/wFxayAFIgdB/wFxaiIFQQAgBUEAShsiBUH/ASAFQf8BSBtqIgY6AAAgBEEBaiIEIANGDQEgACAEai0AACEFDAALAAsLiwkBCX8jAEHwAWsiBCQAAkAgBEEoaiIGBH8gBkEAQcgBEA9BKGoQN0EBBUEAC0UEQEH8ygAoAgAiACgCTEEASARAQbEMQRogABArGgwCC0GxDEEaIAAQKxoMAQtB8NAALQAARQRAQSAQDBpB8NAAQQE6AAALIARB0ABqIQlBAiEGAkAgBEEoaiICRQ0AIABFDQAgAkIANwIAIAJCADcCICACQgA3AhggAkEQaiIFQgA3AgAgAkEIaiIGQgA3AgAgACABIAIgAkEEaiAGIAJBDGogBUEAECghBgsCQCAGDQAgBCgCKCAEKAIsQSBBABALIghFBEAgBCAEKQMoNwMAQfzKACgCAEHyDCAEECxBACEIDAELQQAgBCgCKCAEKAIsQSBB/wFBgP4DQYCA/AdBgICAeBAIIgdFBEAgBCAEKQMoNwMQQfzKACgCAEHMDCAEQRBqECxBACEHDAELIAcQBxogBEEBNgJQIAQgBygCCDYCVCAEIAcoAgw2AlggBCAHKAIUNgJgIAQgBygCEDYCZCAHKAIMIQYgBygCECEDIARBATYCXCAEIAMgBmw2AmggACEGIwBBkAFrIgIkAAJAIARBKGoiBUUEQEECIQAMAQsCQCAGRQRAQQIhAwwBCyAFQgA3AgAgBUIANwIgIAVCADcCGCAFQRBqIgpCADcCACAFQQhqIgNCADcCAEEDIQACQCAGIAEgBSAFQQRqIAMgBUEMaiAKQQAQKCIDDggAAQEBAQEBAgELIAJCADcCbCACQQA2AowBIAJCADcChAEgAkIANwJ8IAJCADcCdCACQgA3AmQgAiAFQfwAajYCbCACQgA3AlwgAiAFQShqIgM2AlggBSEAQQAhBQJAIAMoAgxBAkgNACADKAIAQQdrQQNLDQAgAEUNACAAKAIIQQBHIQULIAUEQCACEDcgAiAAKAIoNgIAIAIgACgCADYCBCACIAAoAgQ2AgggAiACNgJYIAYgASACQdgAahA5IgBFBEAgAyACKAIENgIEIAMgAigCCDYCCAJ/QQIgAxA+DQAaIAIoAhAhAQJAIAIoAgAiAEEKTQRAIAEgAigCFCADKAIQIAMoAhQgAigCBCAAQZsNai0AAGwgAigCCBAZDAELIAEgAigCICADKAIQIAMoAiAgAigCBCACKAIIEBkgAigCFCACKAIkIAMoAhQgAygCJCACKAIEQQFqQQJtIAIoAghBAWpBAm0QGSACKAIYIAIoAiggAygCGCADKAIoIAIoAgRBAWpBAm0gAigCCEEBakECbRAZIAIoAgAiAEEMTUEAQQEgAHRBuiBxG0UEQEEAIABBB2tBA0sNAhoLIAIoAhwgAigCLCADKAIcIAMoAiwgAigCBCACKAIIEBkLQQALIQALIAIQJwwCCyAGIAEgAkHYAGoQOSEADAELIAMhAAsgAkGQAWokACAABEAgBCAANgIgQfzKACgCAEGWDCAEQSBqECxBACEDDAELIAcQBkEAIQMgB0EAIAhBABAFDQAgCBAERSEDCyAHEAAgCBAAIAkQJwsgBEHwAWokACADCwvjRBgAQYAIC7QeLSsgICAwWDB4AGNhbm5vdCBwYXJzZSBwYXJ0aXRpb25zAGNhbm5vdCBwYXJzZSBzZWdtZW50IGhlYWRlcgBjYW5ub3QgcGFyc2UgZmlsdGVyIGhlYWRlcgBjYW5ub3QgcGFyc2UgcGljdHVyZSBoZWFkZXIAYmFkIHBhcnRpdGlvbiBsZW5ndGgAQmFkIGNvZGUgd29yZABGcmFtZSBzZXR1cCBmYWlsZWQAT0sASW5jb3JyZWN0IGtleWZyYW1lIHBhcmFtZXRlcnMuAFRydW5jYXRlZCBoZWFkZXIuAG5vIG1lbW9yeSBkdXJpbmcgZnJhbWUgaW5pdGlhbGl6YXRpb24uAE5vdCBhIGtleSBmcmFtZS4ARnJhbWUgbm90IGRpc3BsYXlhYmxlLgBPdXRwdXQgYWJvcnRlZC4AUHJlbWF0dXJlIGVuZC1vZi1maWxlIGVuY291bnRlcmVkLgBQcmVtYXR1cmUgZW5kLW9mLXBhcnRpdGlvbjAgZW5jb3VudGVyZWQuAHRocmVhZCBpbml0aWFsaXphdGlvbiBmYWlsZWQuAENvdWxkIG5vdCBkZWNvZGUgYWxwaGEgZGF0YS4ATlVMTCBWUDhJbyBwYXJhbWV0ZXIgaW4gVlA4RGVjb2RlKCkuAChudWxsKQBudWxsIFZQOElvIHBhc3NlZCB0byBWUDhHZXRIZWFkZXJzKCkARXJyb3IgZGVjb2RpbmcgaW1hZ2UgKCVkKQoATGlicmFyeSB2ZXJzaW9uIG1pc21hdGNoIQoAVW5hYmxlIHRvIGNyZWF0ZSAlZHglZCBSR0JBIHN1cmZhY2UhCgBVbmFibGUgdG8gc2V0IHZpZGVvIG1vZGUgKDMyYnBwICVkeCVkKSEKAAMEAwQEAgIEBAQCAQEAAAAAAAAAAIoLjAuOC5ILmguqC8oLCgyMDIwNjA+MEwAAAAAAAAAAERIAAQIDBAUQBgcICQoLDA0ODwIDBwMDCwAAAAAAAAAYBxcZKAYnKRYaJio4BTc5FRs2OiUrSARHSRQcNTtGSiQsWEVLNDwDV1kTHVZaIy1ETFVbMz1oAmdpEh5maiIuVFxDTWVrMj54AXd5U10RH2RsQk52eiEvdXsxP2NtUl4AdHxBTxAgYm4wc31RX0ByfmFvUHF/YHAAAAAAAAAAAP///////////////////////////////////////////7D2////////////3/H8///////////5/f3////////////0/P//////////6v7+///////////9///////////////2/v//////////7/3+///////////+//7////////////4/v//////////+//+///////////////////////////9/v//////////+/7+///////////+//7////////////+/f/+////////+v/+//7////////+/////////////////////////////////////////////////////////9n/////////////4fzx/f///v/////q+vH6/f/9/v/////+////////////3/7+///////////u/f7+///////////4/v//////////+f7////////////////////////////9////////////9/7////////////////////////////9/v///////////P/////////////////////////////+/v///////////f/////////////////////////////+/f//////////+v/////////////+/////////////////////////////////////////////////////////7r7+v//////////6vv0/v/////////7+/P9/v/+///////9/v//////////7P3+///////////7/f3+/v/////////+/v///////////v7+///////////////////////////+/////////////v7////////////+/////////////////////////////v////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////j/////////////+v78/v/////////4/vn9///////////9/f//////////9v39///////////8/vv+/v/////////+/P//////////+P79///////////9//7+///////////7/v//////////9fv+///////////9/f7////////////7/f///////////P3+/////////////v/////////////8////////////+f/+//////////////7//////////////f//////////+v///////////////////////////////////////////v///////////////////////////4CAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgP2I/v/k24CAgICAvYHy/+PV/9uAgIBqfuP81tH//4CAgAFi+P/s4v//gICAtYXu/t3q/5qAgIBOhsr3xrT/24CAgAG5+f/z/4CAgICAuJb3/+zggICAgIBNbtj/7OaAgICAgAFl+//x/4CAgICAqovx/OzR//+AgIAldMTz5P///4CAgAHM/v/1/4CAgICAz6D6/+6AgICAgIBmZ+f/06uAgICAgAGY/P/w/4CAgICAsYfz/+rhgICAgIBQgdP/wuCAgICAgAEB/4CAgICAgICA9gH/gICAgICAgID/gICAgICAgICAgMYj7d/Bu6KgkZs+gy3G3ayw3J383QFEL5LQlafdov/fgAGV8f/d4P//gICAuI3q/d7c/8eAgIBRY7XysL75yv//gAGB6P3WxfLE//+AY3nS+snG/8qAgIAXW6Pyqrv30v//gAHI9v/q/4CAgICAbbLx/+f1//+AgIAsgsn9zcD//4CAgAGE7/vb0f+lgICAXojh+9q+//+AgIAWZK71uqH/x4CAgAG2+f/o64CAgICAfI/x/+PqgICAgIAjTbX7wdP/zYCAgAGd9//s5///gICAeY3r/+Hj//+AgIAtY7z7w9n/4ICAgAEB+//V/4CAgICAywH4//+AgICAgICJAbH/4P+AgICAgP0J+PvP0P/AgICArw3g88G5+cb//4BJEavdobPsp//qgAFf9/3Ut///gICA71r0+tPR//+AgICbTcP4vMP//4CAgAEY7/va2//NgICAyTPb/8S6gICAgIBFLr7vydr/5ICAgAG/+///gICAgICA36X5/9X/gICAgICNfPj//4CAgICAgAEQ+P//gICAgICAviTm/+z/gICAgICVAf+AgICAgICAgAHi/4CAgICAgICA98D/gICAgICAgIDwgP+AgICAgICAgAGG/P//gICAgICA1T76//+AgICAgIA3Xf+AgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgMoY1eu6v9yg8K//fia26Km45K7/u4A9Lorbl7Lwqv/YgAFw5vrHv/ef//+Apm3k/NPX/66AgIAnTaLorLT1sv//gAE03PbGx/nc//+AfEq/87fB+t3//4AYR4Lbmqrztv//gAG24fnb8P/ggICAlZbi/NjN/6uAgIAcbKryt8L+3///gAFR5vzMy//AgICAe2bR97zE/+mAgIAUX5nzpK3/y4CAgAHe+P/Y1YCAgICAqK/2/OvN//+AgIAvdNf/09T//4CAgAF57P3U1v//gICAjVTV/MnK/9uAgIAqUKDworn/zYCAgAEB/4CAgICAgICA9AH/gICAgICAgIDuAf+AgICAgICAgOd4MFlzcXiYcJizQH6qdi5GX69Fj1BVUkibZzg6CqvavRENmHIaEaMswxUKrXkYUMMaPixAVZBHCiar1ZAiGqouNxOIoCHORz8UCHJy0AwJ4lEoC2C2VB0QJIa3WYliZWqllEi7ZIKdbyBLUEJmp2NKPijqgCk1CbLxjRoIa0orGpJJpjEXnUEmaaAzNB9zgGhPDBvZ/1cRB1dERyxyMw+6Fy8pDm62txURwkItGWbFvRcSFlhYk5YqLi3EzStht3VVJiOzPSc1yFcaFSvoqzgiM2hyZh1dTSccVas6pVpiQCIWdM4XIiumSWs2IBozAVErH0QZahZAqyThciITFWaEvBBMfD4STl9VOTIwM8FlI5/Xb1kubzyUH6zb5BUSb3BxTVWz/yZ4cigqAcT10QoZbVgrHYym1SUrmj0/HptDLUQB0WRQCCuaATMaR45OThD/gCLFqykoBWbTtwQB3TMyEajRwBcZUoofJKsbpiYs5UNXOqlScxo7sz87WrQ7pl1JmigoFXSP0SInry8PELci3zEtty4RIbcGYg8gtzkuFhiAATYRJUEgSXMcgBeAzSgDCXMzwBIG31clCXM7TUAVL2g3LNoJNjWC4kBaRs0oKRcaOTY5cLgFKSam1R4iGoWYdAoghicTNd0aciBJ/x8JQeoCDwF2SUsgDDPA/6ArM1gfI0NmVTe6VTgVF287zS0lwDcmRnxJZgEiYn1iKlhoVXWvUl9UNVmAZHFlLUtPey8zgFGrATkRBUdmOTUpMSYhDXk5SRoBVSkKQ4pNblovcnMVAgpm/6YXBmUdEApVgGXEGjkSCmZm1SIUK3UUDySjgEQBGmY9RyUiNR/zwEU8RyZJdxzeJUQtgCIBLwv1qz4RE0aSVTc+RiUrJZpko1WgAT8JXIgcQCDJVUsPCQlA/7h3EFYGHAVA/xn4ATgIEYSJ/zd0gDoPFFKHORp5KKQyH4mahRkj2jNnLIODex8GnlYoQIeU4C23gBYaEYPwmg4B0S0QFVtA3gcBxTgVJ5s8ihdm1VMMDTbA/0QvHFUaVVWAgCCSqxILBz+QqwQE9iMbCpKuqwwagL5QI2O0UH42LVV+L1ewMykUIGVLgIt2knSAVTgpD7DsVSUJPkceEXd2/xESimUmPIo3RisajpIkEx6r/2EbFIotPT7bAVG8QCApFHWXjhQVo3ATDD3DgDAEGABBwSYLEQH/Av4DBAb9Bfz7+gf5CPj3AEHgJgvAFQQFBgcICQoKCwwNDg8QERESExQUFRUWFhcXGBkZGhscHR4fICEiIyQlJSYnKCkqKywtLi4vMDEyMzQ1Njc4OTo7PD0+P0BBQkNERUZHSElKS0xMTU5PUFFSU1RVVldYWVtdX2BiZGVmaGpsbnBydHZ6fH6AgoSGiIqMj5GUl5qdBAAFAAYABwAIAAkACgALAAwADQAOAA8AEAARABIAEwAUABUAFgAXABgAGQAaABsAHAAdAB4AHwAgACEAIgAjACQAJQAmACcAKAApACoAKwAsAC0ALgAvADAAMQAyADMANAA1ADYANwA4ADkAOgA8AD4AQABCAEQARgBIAEoATABOAFAAUgBUAFYAWABaAFwAXgBgAGIAZABmAGgAagBsAG4AcAByAHQAdwB6AH0AgACDAIYAiQCMAI8AkgCVAJgAmwCeAKEApACnAKoArQCxALUAuQC9AMEAxQDJAM0A0QDVANkA3QDhAOUA6gDvAPUA+QD+AAMBCAENARIBFwEcAQgHBgQEAgICAQEBAQACCAAAAAQACAAMAIAAhACIAIwAAAEEAQgBDAGAAYQBiAGMAQABBAgFAgMGCQwNCgcLDg+tlIwAsJuMhwC0nY2GggD+/vPmxLGZjIWCgQAAAAAAAICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYKDhIWGh4iJiouMjY6PkJGSk5SVlpeYmZqbnJ2en6ChoqOkpaanqKmqq6ytrq+wsbKztLW2t7i5uru8vb6/wMHCw8TFxsfIycrLzM3Oz9DR0tPU1dbX2Nna29zd3t/g4eLj5OXm5+jp6uvs7e7v8PHy8/T19vf4+fr7/P3+/wABAgMEBQYHCAkKCwwNDg8QERITFBUWFxgZGhscHR4fICEiIyQlJicoKSorLC0uLzAxMjM0NTY3ODk6Ozw9Pj9AQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVpbXF1eX2BhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ent8fX5/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/fwAAAAAAAAAA8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PHy8/T19vf4+fr7/P3+/wABAgMEBQYHCAkKCwwNDg8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8AQbA+C+MKAQIDBAUGBwgJCgsMDQ4PEBESExQVFhcYGRobHB0eHyAhIiMkJSYnKCkqKywtLi8wMTIzNDU2Nzg5Ojs8PT4/QEFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaW1xdXl9gYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXp7fH1+f4CBgoOEhYaHiImKi4yNjo+QkZKTlJWWl5iZmpucnZ6foKGio6SlpqeoqaqrrK2ur7CxsrO0tba3uLm6u7y9vr/AwcLDxMXGx8jJysvMzc7P0NHS09TV1tfY2drb3N3e3+Dh4uPk5ebn6Onq6+zt7u/w8fLz9PX29/j5+vv8/f7/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAD//v38+/r5+Pf29fTz8vHw7+7t7Ovq6ejn5uXk4+Lh4N/e3dzb2tnY19bV1NPS0dDPzs3My8rJyMfGxcTDwsHAv769vLu6ubi3trW0s7KxsK+urayrqqmop6alpKOioaCfnp2cm5qZmJeWlZSTkpGQj46NjIuKiYiHhoWEg4KBgH9+fXx7enl4d3Z1dHNycXBvbm1sa2ppaGdmZWRjYmFgX15dXFtaWVhXVlVUU1JRUE9OTUxLSklIR0ZFRENCQUA/Pj08Ozo5ODc2NTQzMjEwLy4tLCsqKSgnJiUkIyIhIB8eHRwbGhkYFxYVFBMSERAPDg0MCwoJCAcGBQQDAgEAAQIDBAUGBwgJCgsMDQ4PEBESExQVFhcYGRobHB0eHyAhIiMkJSYnKCkqKywtLi8wMTIzNDU2Nzg5Ojs8PT4/QEFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaW1xdXl9gYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXp7fH1+f4CBgoOEhYaHiImKi4yNjo+QkZKTlJWWl5iZmpucnZ6foKGio6SlpqeoqaqrrK2ur7CxsrO0tba3uLm6u7y9vr/AwcLDxMXGx8jJysvMzc7P0NHS09TV1tfY2drb3N3e3+Dh4uPk5ebn6Onq6+zt7u/w8fLz9PX29/j5+vv8/f7/AAcGBgUFBQUEBAQEBAQEBAMDAwMDAwMDAwMDAwMDAwMCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAf3+/f5+/33+Pn6+/z9/vf4ePl5+nr7e/x8/X3+fv93+Dh4uPk5ebn6Onq6+zt7u/w8fLz9PX29/j5+vv8/f7f4GDhYeJi42PkZOVl5mbnZ+ho6Wnqautr7Gztbe5u72/wcPFx8nLzc/R09XX2dvd3+Hj5efp6+3v8fP19/n7/X8AAAAAAQAAAAMAAAAHAAAADwAAAB8AAAA/AAAAfwAAAP8AAAD/AQAA/wMAAP8HAAD/DwAA/x8AAP8/AAD/fwAA//8AAP//AQD//wMA//8HAP//DwD//x8A//8/AP//fwD///8AQaDJAAuhAjBS4Q2GGLMDy6xfd2piiBxVXDhoKLizFPj+hUpLuN1Jl/P8ZIkCVVwAAClK2sF+Dau3QFl9V5JUcsoZTmmM0zhl7gEMX3WhMlL2N1QyLLtasVeqD+cz9XPa7l9o4sxjdYMOmW7tpzBHxtnATzwVa0n6AxRPDPsaVDILmXMcy9cmBjfMb9h3uywqL3Z13cwlZGFUsyQVh30KqBQEIme/HhSDFbRW4wLlc2+xykRCTSYo+666c+3rUAr7tmodC9Q6DWg72zWDHggrlWvOd/DlgVG8O4V4lJSfADzt5SfQJwAAGQAKABkZGQAAAAAFAAAAAAAACQAAAAALAAAAAAAAAAAZABEKGRkZAwoHAAEACQsYAAAJBgsAAAsABhkAAAAZGRkAQdHLAAshDgAAAAAAAAAAGQAKDRkZGQANAAACAAkOAAAACQAOAAAOAEGLzAALAQwAQZfMAAsVEwAAAAATAAAAAAkMAAAAAAAMAAAMAEHFzAALARAAQdHMAAsVDwAAAAQPAAAAAAkQAAAAAAAQAAAQAEH/zAALARIAQYvNAAseEQAAAAARAAAAAAkSAAAAAAASAAASAAAaAAAAGhoaAEHCzQALDhoAAAAaGhoAAAAAAAAJAEHzzQALARQAQf/NAAsVFwAAAAAXAAAAAAkUAAAAAAAUAAAUAEGtzgALARYAQbnOAAsnFQAAAAAVAAAAAAkWAAAAAAAWAAAWAAAwMTIzNDU2Nzg5QUJDREVGAEHgzgALAmAnAEHwzgALYSAVAAAkFQAAKRUAAC8VAACAJwAAIQAAAIgnAAA8GQAAsB0AAC8fAAAvIgAAnCcAAKAnAACkJwAAqCcAAKwnAACwJwAAtCcAAJYAAACXAAAAmAAAAJkAAACaAAAAmwAAAAUAQdzPAAsBnABB9M8ACwqdAAAAngAAAGArAEGM0AALAQIAQZzQAAsI//////////8AQeHQAAsCLlA=")
                                ) || ((z = X), (X = A.locateFile ? A.locateFile(z, a) : a + z));
                                var gA = [];
                                function BA(A) {
                                    var I = gA[A];
                                    return (
                                        I ||
                                            (A >= gA.length && (gA.length = A + 1),
                                            (gA[A] = I = L.get(A))),
                                        I
                                    );
                                }
                                function QA(A) {
                                    if (A instanceof LA || "unwind" == A) return y;
                                    e(1, A);
                                }
                                var CA,
                                    EA = {
                                        splitPath: function (A) {
                                            return /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/
                                                .exec(A)
                                                .slice(1);
                                        },
                                        normalizeArray: function (A, I) {
                                            for (var g = 0, B = A.length - 1; B >= 0; B--) {
                                                var Q = A[B];
                                                "." === Q
                                                    ? A.splice(B, 1)
                                                    : ".." === Q
                                                      ? (A.splice(B, 1), g++)
                                                      : g && (A.splice(B, 1), g--);
                                            }
                                            if (I) for (; g; g--) A.unshift("..");
                                            return A;
                                        },
                                        normalize: function (A) {
                                            var I = "/" === A.charAt(0),
                                                g = "/" === A.substr(-1);
                                            return (
                                                (A = EA.normalizeArray(
                                                    A.split("/").filter(function (A) {
                                                        return !!A;
                                                    }),
                                                    !I
                                                ).join("/")) ||
                                                    I ||
                                                    (A = "."),
                                                A && g && (A += "/"),
                                                (I ? "/" : "") + A
                                            );
                                        },
                                        dirname: function (A) {
                                            var I = EA.splitPath(A),
                                                g = I[0],
                                                B = I[1];
                                            return g || B
                                                ? (B && (B = B.substr(0, B.length - 1)), g + B)
                                                : ".";
                                        },
                                        basename: function (A) {
                                            if ("/" === A) return "/";
                                            var I = (A = (A = EA.normalize(A)).replace(
                                                /\/$/,
                                                ""
                                            )).lastIndexOf("/");
                                            return -1 === I ? A : A.substr(I + 1);
                                        },
                                        extname: function (A) {
                                            return EA.splitPath(A)[3];
                                        },
                                        join: function () {
                                            var A = Array.prototype.slice.call(arguments, 0);
                                            return EA.normalize(A.join("/"));
                                        },
                                        join2: function (A, I) {
                                            return EA.normalize(A + "/" + I);
                                        },
                                    },
                                    iA = {
                                        resolve: function () {
                                            for (
                                                var A = "", I = !1, g = arguments.length - 1;
                                                g >= -1 && !I;
                                                g--
                                            ) {
                                                var B = g >= 0 ? arguments[g] : tA.cwd();
                                                if ("string" != typeof B)
                                                    throw new TypeError(
                                                        "Arguments to path.resolve must be strings"
                                                    );
                                                if (!B) return "";
                                                (A = B + "/" + A), (I = "/" === B.charAt(0));
                                            }
                                            return (
                                                (I ? "/" : "") +
                                                    (A = EA.normalizeArray(
                                                        A.split("/").filter(function (A) {
                                                            return !!A;
                                                        }),
                                                        !I
                                                    ).join("/")) || "."
                                            );
                                        },
                                        relative: function (A, I) {
                                            function g(A) {
                                                for (var I = 0; I < A.length && "" === A[I]; I++);
                                                for (
                                                    var g = A.length - 1;
                                                    g >= 0 && "" === A[g];
                                                    g--
                                                );
                                                return I > g ? [] : A.slice(I, g - I + 1);
                                            }
                                            (A = iA.resolve(A).substr(1)),
                                                (I = iA.resolve(I).substr(1));
                                            for (
                                                var B = g(A.split("/")),
                                                    Q = g(I.split("/")),
                                                    C = Math.min(B.length, Q.length),
                                                    E = C,
                                                    i = 0;
                                                i < C;
                                                i++
                                            )
                                                if (B[i] !== Q[i]) {
                                                    E = i;
                                                    break;
                                                }
                                            var o = [];
                                            for (i = E; i < B.length; i++) o.push("..");
                                            return (o = o.concat(Q.slice(E))).join("/");
                                        },
                                    },
                                    oA = {
                                        ttys: [],
                                        init: function () {},
                                        shutdown: function () {},
                                        register: function (A, I) {
                                            (oA.ttys[A] = { input: [], output: [], ops: I }),
                                                tA.registerDevice(A, oA.stream_ops);
                                        },
                                        stream_ops: {
                                            open: function (A) {
                                                var I = oA.ttys[A.node.rdev];
                                                if (!I) throw new tA.ErrnoError(43);
                                                (A.tty = I), (A.seekable = !1);
                                            },
                                            close: function (A) {
                                                A.tty.ops.flush(A.tty);
                                            },
                                            flush: function (A) {
                                                A.tty.ops.flush(A.tty);
                                            },
                                            read: function (A, I, g, B, Q) {
                                                if (!A.tty || !A.tty.ops.get_char)
                                                    throw new tA.ErrnoError(60);
                                                for (var C = 0, E = 0; E < B; E++) {
                                                    var i;
                                                    try {
                                                        i = A.tty.ops.get_char(A.tty);
                                                    } catch (A) {
                                                        throw new tA.ErrnoError(29);
                                                    }
                                                    if (void 0 === i && 0 === C)
                                                        throw new tA.ErrnoError(6);
                                                    if (null == i) break;
                                                    C++, (I[g + E] = i);
                                                }
                                                return C && (A.node.timestamp = Date.now()), C;
                                            },
                                            write: function (A, I, g, B, Q) {
                                                if (!A.tty || !A.tty.ops.put_char)
                                                    throw new tA.ErrnoError(60);
                                                try {
                                                    for (var C = 0; C < B; C++)
                                                        A.tty.ops.put_char(A.tty, I[g + C]);
                                                } catch (A) {
                                                    throw new tA.ErrnoError(29);
                                                }
                                                return B && (A.node.timestamp = Date.now()), C;
                                            },
                                        },
                                        default_tty_ops: {
                                            get_char: function (A) {
                                                if (!A.input.length) {
                                                    var I = null;
                                                    if (
                                                        ("undefined" != typeof window &&
                                                        "function" == typeof window.prompt
                                                            ? null !==
                                                                  (I = window.prompt("Input: ")) &&
                                                              (I += "\n")
                                                            : "function" == typeof readline &&
                                                              null !== (I = readline()) &&
                                                              (I += "\n"),
                                                        !I)
                                                    )
                                                        return null;
                                                    A.input = fA(I, !0);
                                                }
                                                return A.input.shift();
                                            },
                                            put_char: function (A, I) {
                                                null === I || 10 === I
                                                    ? (r(H(A.output, 0)), (A.output = []))
                                                    : 0 != I && A.output.push(I);
                                            },
                                            flush: function (A) {
                                                A.output &&
                                                    A.output.length > 0 &&
                                                    (r(H(A.output, 0)), (A.output = []));
                                            },
                                        },
                                        default_tty1_ops: {
                                            put_char: function (A, I) {
                                                null === I || 10 === I
                                                    ? (s(H(A.output, 0)), (A.output = []))
                                                    : 0 != I && A.output.push(I);
                                            },
                                            flush: function (A) {
                                                A.output &&
                                                    A.output.length > 0 &&
                                                    (s(H(A.output, 0)), (A.output = []));
                                            },
                                        },
                                    },
                                    eA = {
                                        ops_table: null,
                                        mount: function (A) {
                                            return eA.createNode(null, "/", 16895, 0);
                                        },
                                        createNode: function (A, I, g, B) {
                                            if (tA.isBlkdev(g) || tA.isFIFO(g))
                                                throw new tA.ErrnoError(63);
                                            eA.ops_table ||
                                                (eA.ops_table = {
                                                    dir: {
                                                        node: {
                                                            getattr: eA.node_ops.getattr,
                                                            setattr: eA.node_ops.setattr,
                                                            lookup: eA.node_ops.lookup,
                                                            mknod: eA.node_ops.mknod,
                                                            rename: eA.node_ops.rename,
                                                            unlink: eA.node_ops.unlink,
                                                            rmdir: eA.node_ops.rmdir,
                                                            readdir: eA.node_ops.readdir,
                                                            symlink: eA.node_ops.symlink,
                                                        },
                                                        stream: { llseek: eA.stream_ops.llseek },
                                                    },
                                                    file: {
                                                        node: {
                                                            getattr: eA.node_ops.getattr,
                                                            setattr: eA.node_ops.setattr,
                                                        },
                                                        stream: {
                                                            llseek: eA.stream_ops.llseek,
                                                            read: eA.stream_ops.read,
                                                            write: eA.stream_ops.write,
                                                            allocate: eA.stream_ops.allocate,
                                                            mmap: eA.stream_ops.mmap,
                                                            msync: eA.stream_ops.msync,
                                                        },
                                                    },
                                                    link: {
                                                        node: {
                                                            getattr: eA.node_ops.getattr,
                                                            setattr: eA.node_ops.setattr,
                                                            readlink: eA.node_ops.readlink,
                                                        },
                                                        stream: {},
                                                    },
                                                    chrdev: {
                                                        node: {
                                                            getattr: eA.node_ops.getattr,
                                                            setattr: eA.node_ops.setattr,
                                                        },
                                                        stream: tA.chrdev_stream_ops,
                                                    },
                                                });
                                            var Q = tA.createNode(A, I, g, B);
                                            return (
                                                tA.isDir(Q.mode)
                                                    ? ((Q.node_ops = eA.ops_table.dir.node),
                                                      (Q.stream_ops = eA.ops_table.dir.stream),
                                                      (Q.contents = {}))
                                                    : tA.isFile(Q.mode)
                                                      ? ((Q.node_ops = eA.ops_table.file.node),
                                                        (Q.stream_ops = eA.ops_table.file.stream),
                                                        (Q.usedBytes = 0),
                                                        (Q.contents = null))
                                                      : tA.isLink(Q.mode)
                                                        ? ((Q.node_ops = eA.ops_table.link.node),
                                                          (Q.stream_ops = eA.ops_table.link.stream))
                                                        : tA.isChrdev(Q.mode) &&
                                                          ((Q.node_ops = eA.ops_table.chrdev.node),
                                                          (Q.stream_ops =
                                                              eA.ops_table.chrdev.stream)),
                                                (Q.timestamp = Date.now()),
                                                A &&
                                                    ((A.contents[I] = Q),
                                                    (A.timestamp = Q.timestamp)),
                                                Q
                                            );
                                        },
                                        getFileDataAsTypedArray: function (A) {
                                            return A.contents
                                                ? A.contents.subarray
                                                    ? A.contents.subarray(0, A.usedBytes)
                                                    : new Uint8Array(A.contents)
                                                : new Uint8Array(0);
                                        },
                                        expandFileStorage: function (A, I) {
                                            var g = A.contents ? A.contents.length : 0;
                                            if (!(g >= I)) {
                                                (I = Math.max(
                                                    I,
                                                    (g * (g < 1048576 ? 2 : 1.125)) >>> 0
                                                )),
                                                    0 != g && (I = Math.max(I, 256));
                                                var B = A.contents;
                                                (A.contents = new Uint8Array(I)),
                                                    A.usedBytes > 0 &&
                                                        A.contents.set(
                                                            B.subarray(0, A.usedBytes),
                                                            0
                                                        );
                                            }
                                        },
                                        resizeFileStorage: function (A, I) {
                                            if (A.usedBytes != I)
                                                if (0 == I) (A.contents = null), (A.usedBytes = 0);
                                                else {
                                                    var g = A.contents;
                                                    (A.contents = new Uint8Array(I)),
                                                        g &&
                                                            A.contents.set(
                                                                g.subarray(
                                                                    0,
                                                                    Math.min(I, A.usedBytes)
                                                                )
                                                            ),
                                                        (A.usedBytes = I);
                                                }
                                        },
                                        node_ops: {
                                            getattr: function (A) {
                                                var I = {};
                                                return (
                                                    (I.dev = tA.isChrdev(A.mode) ? A.id : 1),
                                                    (I.ino = A.id),
                                                    (I.mode = A.mode),
                                                    (I.nlink = 1),
                                                    (I.uid = 0),
                                                    (I.gid = 0),
                                                    (I.rdev = A.rdev),
                                                    tA.isDir(A.mode)
                                                        ? (I.size = 4096)
                                                        : tA.isFile(A.mode)
                                                          ? (I.size = A.usedBytes)
                                                          : tA.isLink(A.mode)
                                                            ? (I.size = A.link.length)
                                                            : (I.size = 0),
                                                    (I.atime = new Date(A.timestamp)),
                                                    (I.mtime = new Date(A.timestamp)),
                                                    (I.ctime = new Date(A.timestamp)),
                                                    (I.blksize = 4096),
                                                    (I.blocks = Math.ceil(I.size / I.blksize)),
                                                    I
                                                );
                                            },
                                            setattr: function (A, I) {
                                                void 0 !== I.mode && (A.mode = I.mode),
                                                    void 0 !== I.timestamp &&
                                                        (A.timestamp = I.timestamp),
                                                    void 0 !== I.size &&
                                                        eA.resizeFileStorage(A, I.size);
                                            },
                                            lookup: function (A, I) {
                                                throw tA.genericErrors[44];
                                            },
                                            mknod: function (A, I, g, B) {
                                                return eA.createNode(A, I, g, B);
                                            },
                                            rename: function (A, I, g) {
                                                if (tA.isDir(A.mode)) {
                                                    var B;
                                                    try {
                                                        B = tA.lookupNode(I, g);
                                                    } catch (A) {}
                                                    if (B)
                                                        for (var Q in B.contents)
                                                            throw new tA.ErrnoError(55);
                                                }
                                                delete A.parent.contents[A.name],
                                                    (A.parent.timestamp = Date.now()),
                                                    (A.name = g),
                                                    (I.contents[g] = A),
                                                    (I.timestamp = A.parent.timestamp),
                                                    (A.parent = I);
                                            },
                                            unlink: function (A, I) {
                                                delete A.contents[I], (A.timestamp = Date.now());
                                            },
                                            rmdir: function (A, I) {
                                                var g = tA.lookupNode(A, I);
                                                for (var B in g.contents)
                                                    throw new tA.ErrnoError(55);
                                                delete A.contents[I], (A.timestamp = Date.now());
                                            },
                                            readdir: function (A) {
                                                var I = [".", ".."];
                                                for (var g in A.contents)
                                                    A.contents.hasOwnProperty(g) && I.push(g);
                                                return I;
                                            },
                                            symlink: function (A, I, g) {
                                                var B = eA.createNode(A, I, 41471, 0);
                                                return (B.link = g), B;
                                            },
                                            readlink: function (A) {
                                                if (!tA.isLink(A.mode)) throw new tA.ErrnoError(28);
                                                return A.link;
                                            },
                                        },
                                        stream_ops: {
                                            read: function (A, I, g, B, Q) {
                                                var C = A.node.contents;
                                                if (Q >= A.node.usedBytes) return 0;
                                                var E = Math.min(A.node.usedBytes - Q, B);
                                                if (E > 8 && C.subarray)
                                                    I.set(C.subarray(Q, Q + E), g);
                                                else
                                                    for (var i = 0; i < E; i++) I[g + i] = C[Q + i];
                                                return E;
                                            },
                                            write: function (A, I, g, B, Q, C) {
                                                if ((I.buffer === S.buffer && (C = !1), !B))
                                                    return 0;
                                                var E = A.node;
                                                if (
                                                    ((E.timestamp = Date.now()),
                                                    I.subarray &&
                                                        (!E.contents || E.contents.subarray))
                                                ) {
                                                    if (C)
                                                        return (
                                                            (E.contents = I.subarray(g, g + B)),
                                                            (E.usedBytes = B),
                                                            B
                                                        );
                                                    if (0 === E.usedBytes && 0 === Q)
                                                        return (
                                                            (E.contents = I.slice(g, g + B)),
                                                            (E.usedBytes = B),
                                                            B
                                                        );
                                                    if (Q + B <= E.usedBytes)
                                                        return (
                                                            E.contents.set(I.subarray(g, g + B), Q),
                                                            B
                                                        );
                                                }
                                                if (
                                                    (eA.expandFileStorage(E, Q + B),
                                                    E.contents.subarray && I.subarray)
                                                )
                                                    E.contents.set(I.subarray(g, g + B), Q);
                                                else
                                                    for (var i = 0; i < B; i++)
                                                        E.contents[Q + i] = I[g + i];
                                                return (
                                                    (E.usedBytes = Math.max(E.usedBytes, Q + B)), B
                                                );
                                            },
                                            llseek: function (A, I, g) {
                                                var B = I;
                                                if (
                                                    (1 === g
                                                        ? (B += A.position)
                                                        : 2 === g &&
                                                          tA.isFile(A.node.mode) &&
                                                          (B += A.node.usedBytes),
                                                    B < 0)
                                                )
                                                    throw new tA.ErrnoError(28);
                                                return B;
                                            },
                                            allocate: function (A, I, g) {
                                                eA.expandFileStorage(A.node, I + g),
                                                    (A.node.usedBytes = Math.max(
                                                        A.node.usedBytes,
                                                        I + g
                                                    ));
                                            },
                                            mmap: function (A, I, g, B, Q, C) {
                                                if (0 !== I) throw new tA.ErrnoError(28);
                                                if (!tA.isFile(A.node.mode))
                                                    throw new tA.ErrnoError(43);
                                                var E,
                                                    i,
                                                    o = A.node.contents;
                                                if (2 & C || o.buffer !== F) {
                                                    if (
                                                        ((B > 0 || B + g < o.length) &&
                                                            (o = o.subarray
                                                                ? o.subarray(B, B + g)
                                                                : Array.prototype.slice.call(
                                                                      o,
                                                                      B,
                                                                      B + g
                                                                  )),
                                                        (i = !0),
                                                        !(E = void V()))
                                                    )
                                                        throw new tA.ErrnoError(48);
                                                    S.set(o, E);
                                                } else (i = !1), (E = o.byteOffset);
                                                return { ptr: E, allocated: i };
                                            },
                                            msync: function (A, I, g, B, Q) {
                                                if (!tA.isFile(A.node.mode))
                                                    throw new tA.ErrnoError(43);
                                                return (
                                                    2 & Q || eA.stream_ops.write(A, I, 0, B, g, !1),
                                                    0
                                                );
                                            },
                                        },
                                    },
                                    tA = {
                                        root: null,
                                        mounts: [],
                                        devices: {},
                                        streams: [],
                                        nextInode: 1,
                                        nameTable: null,
                                        currentPath: "/",
                                        initialized: !1,
                                        ignorePermissions: !0,
                                        ErrnoError: null,
                                        genericErrors: {},
                                        filesystems: null,
                                        syncFSRequests: 0,
                                        lookupPath: (A, I = {}) => {
                                            if (!(A = iA.resolve(tA.cwd(), A)))
                                                return { path: "", node: null };
                                            var g = { follow_mount: !0, recurse_count: 0 };
                                            for (var B in g) void 0 === I[B] && (I[B] = g[B]);
                                            if (I.recurse_count > 8) throw new tA.ErrnoError(32);
                                            for (
                                                var Q = EA.normalizeArray(
                                                        A.split("/").filter(A => !!A),
                                                        !1
                                                    ),
                                                    C = tA.root,
                                                    E = "/",
                                                    i = 0;
                                                i < Q.length;
                                                i++
                                            ) {
                                                var o = i === Q.length - 1;
                                                if (o && I.parent) break;
                                                if (
                                                    ((C = tA.lookupNode(C, Q[i])),
                                                    (E = EA.join2(E, Q[i])),
                                                    tA.isMountpoint(C) &&
                                                        (!o || (o && I.follow_mount)) &&
                                                        (C = C.mounted.root),
                                                    !o || I.follow)
                                                )
                                                    for (var e = 0; tA.isLink(C.mode); ) {
                                                        var t = tA.readlink(E);
                                                        if (
                                                            ((E = iA.resolve(EA.dirname(E), t)),
                                                            (C = tA.lookupPath(E, {
                                                                recurse_count: I.recurse_count,
                                                            }).node),
                                                            e++ > 40)
                                                        )
                                                            throw new tA.ErrnoError(32);
                                                    }
                                            }
                                            return { path: E, node: C };
                                        },
                                        getPath: A => {
                                            for (var I; ; ) {
                                                if (tA.isRoot(A)) {
                                                    var g = A.mount.mountpoint;
                                                    return I
                                                        ? "/" !== g[g.length - 1]
                                                            ? g + "/" + I
                                                            : g + I
                                                        : g;
                                                }
                                                (I = I ? A.name + "/" + I : A.name), (A = A.parent);
                                            }
                                        },
                                        hashName: (A, I) => {
                                            for (var g = 0, B = 0; B < I.length; B++)
                                                g = ((g << 5) - g + I.charCodeAt(B)) | 0;
                                            return ((A + g) >>> 0) % tA.nameTable.length;
                                        },
                                        hashAddNode: A => {
                                            var I = tA.hashName(A.parent.id, A.name);
                                            (A.name_next = tA.nameTable[I]), (tA.nameTable[I] = A);
                                        },
                                        hashRemoveNode: A => {
                                            var I = tA.hashName(A.parent.id, A.name);
                                            if (tA.nameTable[I] === A)
                                                tA.nameTable[I] = A.name_next;
                                            else
                                                for (var g = tA.nameTable[I]; g; ) {
                                                    if (g.name_next === A) {
                                                        g.name_next = A.name_next;
                                                        break;
                                                    }
                                                    g = g.name_next;
                                                }
                                        },
                                        lookupNode: (A, I) => {
                                            var g = tA.mayLookup(A);
                                            if (g) throw new tA.ErrnoError(g, A);
                                            for (
                                                var B = tA.hashName(A.id, I), Q = tA.nameTable[B];
                                                Q;
                                                Q = Q.name_next
                                            ) {
                                                var C = Q.name;
                                                if (Q.parent.id === A.id && C === I) return Q;
                                            }
                                            return tA.lookup(A, I);
                                        },
                                        createNode: (A, I, g, B) => {
                                            var Q = new tA.FSNode(A, I, g, B);
                                            return tA.hashAddNode(Q), Q;
                                        },
                                        destroyNode: A => {
                                            tA.hashRemoveNode(A);
                                        },
                                        isRoot: A => A === A.parent,
                                        isMountpoint: A => !!A.mounted,
                                        isFile: A => 32768 == (61440 & A),
                                        isDir: A => 16384 == (61440 & A),
                                        isLink: A => 40960 == (61440 & A),
                                        isChrdev: A => 8192 == (61440 & A),
                                        isBlkdev: A => 24576 == (61440 & A),
                                        isFIFO: A => 4096 == (61440 & A),
                                        isSocket: A => 49152 == (49152 & A),
                                        flagModes: {
                                            r: 0,
                                            "r+": 2,
                                            w: 577,
                                            "w+": 578,
                                            a: 1089,
                                            "a+": 1090,
                                        },
                                        modeStringToFlags: A => {
                                            var I = tA.flagModes[A];
                                            if (void 0 === I)
                                                throw new Error("Unknown file open mode: " + A);
                                            return I;
                                        },
                                        flagsToPermissionString: A => {
                                            var I = ["r", "w", "rw"][3 & A];
                                            return 512 & A && (I += "w"), I;
                                        },
                                        nodePermissions: (A, I) =>
                                            tA.ignorePermissions ||
                                            ((!I.includes("r") || 292 & A.mode) &&
                                                (!I.includes("w") || 146 & A.mode) &&
                                                (!I.includes("x") || 73 & A.mode))
                                                ? 0
                                                : 2,
                                        mayLookup: A =>
                                            tA.nodePermissions(A, "x") ||
                                            (A.node_ops.lookup ? 0 : 2),
                                        mayCreate: (A, I) => {
                                            try {
                                                return tA.lookupNode(A, I), 20;
                                            } catch (A) {}
                                            return tA.nodePermissions(A, "wx");
                                        },
                                        mayDelete: (A, I, g) => {
                                            var B;
                                            try {
                                                B = tA.lookupNode(A, I);
                                            } catch (A) {
                                                return A.errno;
                                            }
                                            var Q = tA.nodePermissions(A, "wx");
                                            if (Q) return Q;
                                            if (g) {
                                                if (!tA.isDir(B.mode)) return 54;
                                                if (tA.isRoot(B) || tA.getPath(B) === tA.cwd())
                                                    return 10;
                                            } else if (tA.isDir(B.mode)) return 31;
                                            return 0;
                                        },
                                        mayOpen: (A, I) =>
                                            A
                                                ? tA.isLink(A.mode)
                                                    ? 32
                                                    : tA.isDir(A.mode) &&
                                                        ("r" !== tA.flagsToPermissionString(I) ||
                                                            512 & I)
                                                      ? 31
                                                      : tA.nodePermissions(
                                                            A,
                                                            tA.flagsToPermissionString(I)
                                                        )
                                                : 44,
                                        MAX_OPEN_FDS: 4096,
                                        nextfd: (A = 0, I = tA.MAX_OPEN_FDS) => {
                                            for (var g = A; g <= I; g++)
                                                if (!tA.streams[g]) return g;
                                            throw new tA.ErrnoError(33);
                                        },
                                        getStream: A => tA.streams[A],
                                        createStream: (A, I, g) => {
                                            tA.FSStream ||
                                                ((tA.FSStream = function () {}),
                                                (tA.FSStream.prototype = {
                                                    object: {
                                                        get: function () {
                                                            return this.node;
                                                        },
                                                        set: function (A) {
                                                            this.node = A;
                                                        },
                                                    },
                                                    isRead: {
                                                        get: function () {
                                                            return 1 != (2097155 & this.flags);
                                                        },
                                                    },
                                                    isWrite: {
                                                        get: function () {
                                                            return 0 != (2097155 & this.flags);
                                                        },
                                                    },
                                                    isAppend: {
                                                        get: function () {
                                                            return 1024 & this.flags;
                                                        },
                                                    },
                                                })),
                                                (A = Object.assign(new tA.FSStream(), A));
                                            var B = tA.nextfd(I, g);
                                            return (A.fd = B), (tA.streams[B] = A), A;
                                        },
                                        closeStream: A => {
                                            tA.streams[A] = null;
                                        },
                                        chrdev_stream_ops: {
                                            open: A => {
                                                var I = tA.getDevice(A.node.rdev);
                                                (A.stream_ops = I.stream_ops),
                                                    A.stream_ops.open && A.stream_ops.open(A);
                                            },
                                            llseek: () => {
                                                throw new tA.ErrnoError(70);
                                            },
                                        },
                                        major: A => A >> 8,
                                        minor: A => 255 & A,
                                        makedev: (A, I) => (A << 8) | I,
                                        registerDevice: (A, I) => {
                                            tA.devices[A] = { stream_ops: I };
                                        },
                                        getDevice: A => tA.devices[A],
                                        getMounts: A => {
                                            for (var I = [], g = [A]; g.length; ) {
                                                var B = g.pop();
                                                I.push(B), g.push.apply(g, B.mounts);
                                            }
                                            return I;
                                        },
                                        syncfs: (A, I) => {
                                            "function" == typeof A && ((I = A), (A = !1)),
                                                tA.syncFSRequests++,
                                                tA.syncFSRequests > 1 &&
                                                    s(
                                                        "warning: " +
                                                            tA.syncFSRequests +
                                                            " FS.syncfs operations in flight at once, probably just doing extra work"
                                                    );
                                            var g = tA.getMounts(tA.root.mount),
                                                B = 0;
                                            function Q(A) {
                                                return tA.syncFSRequests--, I(A);
                                            }
                                            function C(A) {
                                                if (A)
                                                    return C.errored
                                                        ? void 0
                                                        : ((C.errored = !0), Q(A));
                                                ++B >= g.length && Q(null);
                                            }
                                            g.forEach(I => {
                                                if (!I.type.syncfs) return C(null);
                                                I.type.syncfs(I, A, C);
                                            });
                                        },
                                        mount: (A, I, g) => {
                                            var B,
                                                Q = "/" === g,
                                                C = !g;
                                            if (Q && tA.root) throw new tA.ErrnoError(10);
                                            if (!Q && !C) {
                                                var E = tA.lookupPath(g, { follow_mount: !1 });
                                                if (
                                                    ((g = E.path), (B = E.node), tA.isMountpoint(B))
                                                )
                                                    throw new tA.ErrnoError(10);
                                                if (!tA.isDir(B.mode)) throw new tA.ErrnoError(54);
                                            }
                                            var i = { type: A, opts: I, mountpoint: g, mounts: [] },
                                                o = A.mount(i);
                                            return (
                                                (o.mount = i),
                                                (i.root = o),
                                                Q
                                                    ? (tA.root = o)
                                                    : B &&
                                                      ((B.mounted = i),
                                                      B.mount && B.mount.mounts.push(i)),
                                                o
                                            );
                                        },
                                        unmount: A => {
                                            var I = tA.lookupPath(A, { follow_mount: !1 });
                                            if (!tA.isMountpoint(I.node))
                                                throw new tA.ErrnoError(28);
                                            var g = I.node,
                                                B = g.mounted,
                                                Q = tA.getMounts(B);
                                            Object.keys(tA.nameTable).forEach(A => {
                                                for (var I = tA.nameTable[A]; I; ) {
                                                    var g = I.name_next;
                                                    Q.includes(I.mount) && tA.destroyNode(I),
                                                        (I = g);
                                                }
                                            }),
                                                (g.mounted = null);
                                            var C = g.mount.mounts.indexOf(B);
                                            g.mount.mounts.splice(C, 1);
                                        },
                                        lookup: (A, I) => A.node_ops.lookup(A, I),
                                        mknod: (A, I, g) => {
                                            var B = tA.lookupPath(A, { parent: !0 }).node,
                                                Q = EA.basename(A);
                                            if (!Q || "." === Q || ".." === Q)
                                                throw new tA.ErrnoError(28);
                                            var C = tA.mayCreate(B, Q);
                                            if (C) throw new tA.ErrnoError(C);
                                            if (!B.node_ops.mknod) throw new tA.ErrnoError(63);
                                            return B.node_ops.mknod(B, Q, I, g);
                                        },
                                        create: (A, I) => (
                                            (I = void 0 !== I ? I : 438),
                                            (I &= 4095),
                                            (I |= 32768),
                                            tA.mknod(A, I, 0)
                                        ),
                                        mkdir: (A, I) => (
                                            (I = void 0 !== I ? I : 511),
                                            (I &= 1023),
                                            (I |= 16384),
                                            tA.mknod(A, I, 0)
                                        ),
                                        mkdirTree: (A, I) => {
                                            for (
                                                var g = A.split("/"), B = "", Q = 0;
                                                Q < g.length;
                                                ++Q
                                            )
                                                if (g[Q]) {
                                                    B += "/" + g[Q];
                                                    try {
                                                        tA.mkdir(B, I);
                                                    } catch (A) {
                                                        if (20 != A.errno) throw A;
                                                    }
                                                }
                                        },
                                        mkdev: (A, I, g) => (
                                            void 0 === g && ((g = I), (I = 438)),
                                            (I |= 8192),
                                            tA.mknod(A, I, g)
                                        ),
                                        symlink: (A, I) => {
                                            if (!iA.resolve(A)) throw new tA.ErrnoError(44);
                                            var g = tA.lookupPath(I, { parent: !0 }).node;
                                            if (!g) throw new tA.ErrnoError(44);
                                            var B = EA.basename(I),
                                                Q = tA.mayCreate(g, B);
                                            if (Q) throw new tA.ErrnoError(Q);
                                            if (!g.node_ops.symlink) throw new tA.ErrnoError(63);
                                            return g.node_ops.symlink(g, B, A);
                                        },
                                        rename: (A, I) => {
                                            var g,
                                                B,
                                                Q = EA.dirname(A),
                                                C = EA.dirname(I),
                                                E = EA.basename(A),
                                                i = EA.basename(I);
                                            if (
                                                ((g = tA.lookupPath(A, { parent: !0 }).node),
                                                (B = tA.lookupPath(I, { parent: !0 }).node),
                                                !g || !B)
                                            )
                                                throw new tA.ErrnoError(44);
                                            if (g.mount !== B.mount) throw new tA.ErrnoError(75);
                                            var o,
                                                e = tA.lookupNode(g, E),
                                                t = iA.relative(A, C);
                                            if ("." !== t.charAt(0)) throw new tA.ErrnoError(28);
                                            if ("." !== (t = iA.relative(I, Q)).charAt(0))
                                                throw new tA.ErrnoError(55);
                                            try {
                                                o = tA.lookupNode(B, i);
                                            } catch (A) {}
                                            if (e !== o) {
                                                var a = tA.isDir(e.mode),
                                                    n = tA.mayDelete(g, E, a);
                                                if (n) throw new tA.ErrnoError(n);
                                                if (
                                                    (n = o
                                                        ? tA.mayDelete(B, i, a)
                                                        : tA.mayCreate(B, i))
                                                )
                                                    throw new tA.ErrnoError(n);
                                                if (!g.node_ops.rename) throw new tA.ErrnoError(63);
                                                if (tA.isMountpoint(e) || (o && tA.isMountpoint(o)))
                                                    throw new tA.ErrnoError(10);
                                                if (B !== g && (n = tA.nodePermissions(g, "w")))
                                                    throw new tA.ErrnoError(n);
                                                tA.hashRemoveNode(e);
                                                try {
                                                    g.node_ops.rename(e, B, i);
                                                } catch (A) {
                                                    throw A;
                                                } finally {
                                                    tA.hashAddNode(e);
                                                }
                                            }
                                        },
                                        rmdir: A => {
                                            var I = tA.lookupPath(A, { parent: !0 }).node,
                                                g = EA.basename(A),
                                                B = tA.lookupNode(I, g),
                                                Q = tA.mayDelete(I, g, !0);
                                            if (Q) throw new tA.ErrnoError(Q);
                                            if (!I.node_ops.rmdir) throw new tA.ErrnoError(63);
                                            if (tA.isMountpoint(B)) throw new tA.ErrnoError(10);
                                            I.node_ops.rmdir(I, g), tA.destroyNode(B);
                                        },
                                        readdir: A => {
                                            var I = tA.lookupPath(A, { follow: !0 }).node;
                                            if (!I.node_ops.readdir) throw new tA.ErrnoError(54);
                                            return I.node_ops.readdir(I);
                                        },
                                        unlink: A => {
                                            var I = tA.lookupPath(A, { parent: !0 }).node;
                                            if (!I) throw new tA.ErrnoError(44);
                                            var g = EA.basename(A),
                                                B = tA.lookupNode(I, g),
                                                Q = tA.mayDelete(I, g, !1);
                                            if (Q) throw new tA.ErrnoError(Q);
                                            if (!I.node_ops.unlink) throw new tA.ErrnoError(63);
                                            if (tA.isMountpoint(B)) throw new tA.ErrnoError(10);
                                            I.node_ops.unlink(I, g), tA.destroyNode(B);
                                        },
                                        readlink: A => {
                                            var I = tA.lookupPath(A).node;
                                            if (!I) throw new tA.ErrnoError(44);
                                            if (!I.node_ops.readlink) throw new tA.ErrnoError(28);
                                            return iA.resolve(
                                                tA.getPath(I.parent),
                                                I.node_ops.readlink(I)
                                            );
                                        },
                                        stat: (A, I) => {
                                            var g = tA.lookupPath(A, { follow: !I }).node;
                                            if (!g) throw new tA.ErrnoError(44);
                                            if (!g.node_ops.getattr) throw new tA.ErrnoError(63);
                                            return g.node_ops.getattr(g);
                                        },
                                        lstat: A => tA.stat(A, !0),
                                        chmod: (A, I, g) => {
                                            var B;
                                            if (
                                                !(B =
                                                    "string" == typeof A
                                                        ? tA.lookupPath(A, { follow: !g }).node
                                                        : A).node_ops.setattr
                                            )
                                                throw new tA.ErrnoError(63);
                                            B.node_ops.setattr(B, {
                                                mode: (4095 & I) | (-4096 & B.mode),
                                                timestamp: Date.now(),
                                            });
                                        },
                                        lchmod: (A, I) => {
                                            tA.chmod(A, I, !0);
                                        },
                                        fchmod: (A, I) => {
                                            var g = tA.getStream(A);
                                            if (!g) throw new tA.ErrnoError(8);
                                            tA.chmod(g.node, I);
                                        },
                                        chown: (A, I, g, B) => {
                                            var Q;
                                            if (
                                                !(Q =
                                                    "string" == typeof A
                                                        ? tA.lookupPath(A, { follow: !B }).node
                                                        : A).node_ops.setattr
                                            )
                                                throw new tA.ErrnoError(63);
                                            Q.node_ops.setattr(Q, { timestamp: Date.now() });
                                        },
                                        lchown: (A, I, g) => {
                                            tA.chown(A, I, g, !0);
                                        },
                                        fchown: (A, I, g) => {
                                            var B = tA.getStream(A);
                                            if (!B) throw new tA.ErrnoError(8);
                                            tA.chown(B.node, I, g);
                                        },
                                        truncate: (A, I) => {
                                            if (I < 0) throw new tA.ErrnoError(28);
                                            var g;
                                            if (
                                                !(g =
                                                    "string" == typeof A
                                                        ? tA.lookupPath(A, { follow: !0 }).node
                                                        : A).node_ops.setattr
                                            )
                                                throw new tA.ErrnoError(63);
                                            if (tA.isDir(g.mode)) throw new tA.ErrnoError(31);
                                            if (!tA.isFile(g.mode)) throw new tA.ErrnoError(28);
                                            var B = tA.nodePermissions(g, "w");
                                            if (B) throw new tA.ErrnoError(B);
                                            g.node_ops.setattr(g, {
                                                size: I,
                                                timestamp: Date.now(),
                                            });
                                        },
                                        ftruncate: (A, I) => {
                                            var g = tA.getStream(A);
                                            if (!g) throw new tA.ErrnoError(8);
                                            if (0 == (2097155 & g.flags))
                                                throw new tA.ErrnoError(28);
                                            tA.truncate(g.node, I);
                                        },
                                        utime: (A, I, g) => {
                                            var B = tA.lookupPath(A, { follow: !0 }).node;
                                            B.node_ops.setattr(B, { timestamp: Math.max(I, g) });
                                        },
                                        open: (I, g, B, Q, C) => {
                                            if ("" === I) throw new tA.ErrnoError(44);
                                            var E;
                                            if (
                                                ((B = void 0 === B ? 438 : B),
                                                (B =
                                                    64 &
                                                    (g =
                                                        "string" == typeof g
                                                            ? tA.modeStringToFlags(g)
                                                            : g)
                                                        ? (4095 & B) | 32768
                                                        : 0),
                                                "object" == typeof I)
                                            )
                                                E = I;
                                            else {
                                                I = EA.normalize(I);
                                                try {
                                                    E = tA.lookupPath(I, {
                                                        follow: !(131072 & g),
                                                    }).node;
                                                } catch (A) {}
                                            }
                                            var i = !1;
                                            if (64 & g)
                                                if (E) {
                                                    if (128 & g) throw new tA.ErrnoError(20);
                                                } else (E = tA.mknod(I, B, 0)), (i = !0);
                                            if (!E) throw new tA.ErrnoError(44);
                                            if (
                                                (tA.isChrdev(E.mode) && (g &= -513),
                                                65536 & g && !tA.isDir(E.mode))
                                            )
                                                throw new tA.ErrnoError(54);
                                            if (!i) {
                                                var o = tA.mayOpen(E, g);
                                                if (o) throw new tA.ErrnoError(o);
                                            }
                                            512 & g && tA.truncate(E, 0), (g &= -131713);
                                            var e = tA.createStream(
                                                {
                                                    node: E,
                                                    path: tA.getPath(E),
                                                    flags: g,
                                                    seekable: !0,
                                                    position: 0,
                                                    stream_ops: E.stream_ops,
                                                    ungotten: [],
                                                    error: !1,
                                                },
                                                Q,
                                                C
                                            );
                                            return (
                                                e.stream_ops.open && e.stream_ops.open(e),
                                                !A.logReadFiles ||
                                                    1 & g ||
                                                    (tA.readFiles || (tA.readFiles = {}),
                                                    I in tA.readFiles || (tA.readFiles[I] = 1)),
                                                e
                                            );
                                        },
                                        close: A => {
                                            if (tA.isClosed(A)) throw new tA.ErrnoError(8);
                                            A.getdents && (A.getdents = null);
                                            try {
                                                A.stream_ops.close && A.stream_ops.close(A);
                                            } catch (A) {
                                                throw A;
                                            } finally {
                                                tA.closeStream(A.fd);
                                            }
                                            A.fd = null;
                                        },
                                        isClosed: A => null === A.fd,
                                        llseek: (A, I, g) => {
                                            if (tA.isClosed(A)) throw new tA.ErrnoError(8);
                                            if (!A.seekable || !A.stream_ops.llseek)
                                                throw new tA.ErrnoError(70);
                                            if (0 != g && 1 != g && 2 != g)
                                                throw new tA.ErrnoError(28);
                                            return (
                                                (A.position = A.stream_ops.llseek(A, I, g)),
                                                (A.ungotten = []),
                                                A.position
                                            );
                                        },
                                        read: (A, I, g, B, Q) => {
                                            if (B < 0 || Q < 0) throw new tA.ErrnoError(28);
                                            if (tA.isClosed(A)) throw new tA.ErrnoError(8);
                                            if (1 == (2097155 & A.flags))
                                                throw new tA.ErrnoError(8);
                                            if (tA.isDir(A.node.mode)) throw new tA.ErrnoError(31);
                                            if (!A.stream_ops.read) throw new tA.ErrnoError(28);
                                            var C = void 0 !== Q;
                                            if (C) {
                                                if (!A.seekable) throw new tA.ErrnoError(70);
                                            } else Q = A.position;
                                            var E = A.stream_ops.read(A, I, g, B, Q);
                                            return C || (A.position += E), E;
                                        },
                                        write: (A, I, g, B, Q, C) => {
                                            if (B < 0 || Q < 0) throw new tA.ErrnoError(28);
                                            if (tA.isClosed(A)) throw new tA.ErrnoError(8);
                                            if (0 == (2097155 & A.flags))
                                                throw new tA.ErrnoError(8);
                                            if (tA.isDir(A.node.mode)) throw new tA.ErrnoError(31);
                                            if (!A.stream_ops.write) throw new tA.ErrnoError(28);
                                            A.seekable && 1024 & A.flags && tA.llseek(A, 0, 2);
                                            var E = void 0 !== Q;
                                            if (E) {
                                                if (!A.seekable) throw new tA.ErrnoError(70);
                                            } else Q = A.position;
                                            var i = A.stream_ops.write(A, I, g, B, Q, C);
                                            return E || (A.position += i), i;
                                        },
                                        allocate: (A, I, g) => {
                                            if (tA.isClosed(A)) throw new tA.ErrnoError(8);
                                            if (I < 0 || g <= 0) throw new tA.ErrnoError(28);
                                            if (0 == (2097155 & A.flags))
                                                throw new tA.ErrnoError(8);
                                            if (!tA.isFile(A.node.mode) && !tA.isDir(A.node.mode))
                                                throw new tA.ErrnoError(43);
                                            if (!A.stream_ops.allocate)
                                                throw new tA.ErrnoError(138);
                                            A.stream_ops.allocate(A, I, g);
                                        },
                                        mmap: (A, I, g, B, Q, C) => {
                                            if (
                                                0 != (2 & Q) &&
                                                0 == (2 & C) &&
                                                2 != (2097155 & A.flags)
                                            )
                                                throw new tA.ErrnoError(2);
                                            if (1 == (2097155 & A.flags))
                                                throw new tA.ErrnoError(2);
                                            if (!A.stream_ops.mmap) throw new tA.ErrnoError(43);
                                            return A.stream_ops.mmap(A, I, g, B, Q, C);
                                        },
                                        msync: (A, I, g, B, Q) =>
                                            A && A.stream_ops.msync
                                                ? A.stream_ops.msync(A, I, g, B, Q)
                                                : 0,
                                        munmap: A => 0,
                                        ioctl: (A, I, g) => {
                                            if (!A.stream_ops.ioctl) throw new tA.ErrnoError(59);
                                            return A.stream_ops.ioctl(A, I, g);
                                        },
                                        readFile: (A, I = {}) => {
                                            if (
                                                ((I.flags = I.flags || 0),
                                                (I.encoding = I.encoding || "binary"),
                                                "utf8" !== I.encoding && "binary" !== I.encoding)
                                            )
                                                throw new Error(
                                                    'Invalid encoding type "' + I.encoding + '"'
                                                );
                                            var g,
                                                B = tA.open(A, I.flags),
                                                Q = tA.stat(A).size,
                                                C = new Uint8Array(Q);
                                            return (
                                                tA.read(B, C, 0, Q, 0),
                                                "utf8" === I.encoding
                                                    ? (g = H(C, 0))
                                                    : "binary" === I.encoding && (g = C),
                                                tA.close(B),
                                                g
                                            );
                                        },
                                        writeFile: (A, I, g = {}) => {
                                            g.flags = g.flags || 577;
                                            var B = tA.open(A, g.flags, g.mode);
                                            if ("string" == typeof I) {
                                                var Q = new Uint8Array(l(I) + 1),
                                                    C = m(I, Q, 0, Q.length);
                                                tA.write(B, Q, 0, C, void 0, g.canOwn);
                                            } else {
                                                if (!ArrayBuffer.isView(I))
                                                    throw new Error("Unsupported data type");
                                                tA.write(B, I, 0, I.byteLength, void 0, g.canOwn);
                                            }
                                            tA.close(B);
                                        },
                                        cwd: () => tA.currentPath,
                                        chdir: A => {
                                            var I = tA.lookupPath(A, { follow: !0 });
                                            if (null === I.node) throw new tA.ErrnoError(44);
                                            if (!tA.isDir(I.node.mode)) throw new tA.ErrnoError(54);
                                            var g = tA.nodePermissions(I.node, "x");
                                            if (g) throw new tA.ErrnoError(g);
                                            tA.currentPath = I.path;
                                        },
                                        createDefaultDirectories: () => {
                                            tA.mkdir("/tmp"),
                                                tA.mkdir("/home"),
                                                tA.mkdir("/home/web_user");
                                        },
                                        createDefaultDevices: () => {
                                            tA.mkdir("/dev"),
                                                tA.registerDevice(tA.makedev(1, 3), {
                                                    read: () => 0,
                                                    write: (A, I, g, B, Q) => B,
                                                }),
                                                tA.mkdev("/dev/null", tA.makedev(1, 3)),
                                                oA.register(tA.makedev(5, 0), oA.default_tty_ops),
                                                oA.register(tA.makedev(6, 0), oA.default_tty1_ops),
                                                tA.mkdev("/dev/tty", tA.makedev(5, 0)),
                                                tA.mkdev("/dev/tty1", tA.makedev(6, 0));
                                            var A = (function () {
                                                if (
                                                    "object" == typeof crypto &&
                                                    "function" == typeof crypto.getRandomValues
                                                ) {
                                                    var A = new Uint8Array(1);
                                                    return function () {
                                                        return crypto.getRandomValues(A), A[0];
                                                    };
                                                }
                                                return function () {
                                                    V("randomDevice");
                                                };
                                            })();
                                            tA.createDevice("/dev", "random", A),
                                                tA.createDevice("/dev", "urandom", A),
                                                tA.mkdir("/dev/shm"),
                                                tA.mkdir("/dev/shm/tmp");
                                        },
                                        createSpecialDirectories: () => {
                                            tA.mkdir("/proc");
                                            var A = tA.mkdir("/proc/self");
                                            tA.mkdir("/proc/self/fd"),
                                                tA.mount(
                                                    {
                                                        mount: () => {
                                                            var I = tA.createNode(
                                                                A,
                                                                "fd",
                                                                16895,
                                                                73
                                                            );
                                                            return (
                                                                (I.node_ops = {
                                                                    lookup: (A, I) => {
                                                                        var g = +I,
                                                                            B = tA.getStream(g);
                                                                        if (!B)
                                                                            throw new tA.ErrnoError(
                                                                                8
                                                                            );
                                                                        var Q = {
                                                                            parent: null,
                                                                            mount: {
                                                                                mountpoint: "fake",
                                                                            },
                                                                            node_ops: {
                                                                                readlink: () =>
                                                                                    B.path,
                                                                            },
                                                                        };
                                                                        return (Q.parent = Q), Q;
                                                                    },
                                                                }),
                                                                I
                                                            );
                                                        },
                                                    },
                                                    {},
                                                    "/proc/self/fd"
                                                );
                                        },
                                        createStandardStreams: () => {
                                            A.stdin
                                                ? tA.createDevice("/dev", "stdin", A.stdin)
                                                : tA.symlink("/dev/tty", "/dev/stdin"),
                                                A.stdout
                                                    ? tA.createDevice(
                                                          "/dev",
                                                          "stdout",
                                                          null,
                                                          A.stdout
                                                      )
                                                    : tA.symlink("/dev/tty", "/dev/stdout"),
                                                A.stderr
                                                    ? tA.createDevice(
                                                          "/dev",
                                                          "stderr",
                                                          null,
                                                          A.stderr
                                                      )
                                                    : tA.symlink("/dev/tty1", "/dev/stderr"),
                                                tA.open("/dev/stdin", 0),
                                                tA.open("/dev/stdout", 1),
                                                tA.open("/dev/stderr", 1);
                                        },
                                        ensureErrnoError: () => {
                                            tA.ErrnoError ||
                                                ((tA.ErrnoError = function (A, I) {
                                                    (this.node = I),
                                                        (this.setErrno = function (A) {
                                                            this.errno = A;
                                                        }),
                                                        this.setErrno(A),
                                                        (this.message = "FS error");
                                                }),
                                                (tA.ErrnoError.prototype = new Error()),
                                                (tA.ErrnoError.prototype.constructor =
                                                    tA.ErrnoError),
                                                [44].forEach(A => {
                                                    (tA.genericErrors[A] = new tA.ErrnoError(A)),
                                                        (tA.genericErrors[A].stack =
                                                            "<generic error, no stack>");
                                                }));
                                        },
                                        staticInit: () => {
                                            tA.ensureErrnoError(),
                                                (tA.nameTable = new Array(4096)),
                                                tA.mount(eA, {}, "/"),
                                                tA.createDefaultDirectories(),
                                                tA.createDefaultDevices(),
                                                tA.createSpecialDirectories(),
                                                (tA.filesystems = { MEMFS: eA });
                                        },
                                        init: (I, g, B) => {
                                            (tA.init.initialized = !0),
                                                tA.ensureErrnoError(),
                                                (A.stdin = I || A.stdin),
                                                (A.stdout = g || A.stdout),
                                                (A.stderr = B || A.stderr),
                                                tA.createStandardStreams();
                                        },
                                        quit: () => {
                                            tA.init.initialized = !1;
                                            for (var A = 0; A < tA.streams.length; A++) {
                                                var I = tA.streams[A];
                                                I && tA.close(I);
                                            }
                                        },
                                        getMode: (A, I) => {
                                            var g = 0;
                                            return A && (g |= 365), I && (g |= 146), g;
                                        },
                                        findObject: (A, I) => {
                                            var g = tA.analyzePath(A, I);
                                            return g.exists ? g.object : null;
                                        },
                                        analyzePath: (A, I) => {
                                            try {
                                                A = (B = tA.lookupPath(A, { follow: !I })).path;
                                            } catch (A) {}
                                            var g = {
                                                isRoot: !1,
                                                exists: !1,
                                                error: 0,
                                                name: null,
                                                path: null,
                                                object: null,
                                                parentExists: !1,
                                                parentPath: null,
                                                parentObject: null,
                                            };
                                            try {
                                                var B = tA.lookupPath(A, { parent: !0 });
                                                (g.parentExists = !0),
                                                    (g.parentPath = B.path),
                                                    (g.parentObject = B.node),
                                                    (g.name = EA.basename(A)),
                                                    (B = tA.lookupPath(A, { follow: !I })),
                                                    (g.exists = !0),
                                                    (g.path = B.path),
                                                    (g.object = B.node),
                                                    (g.name = B.node.name),
                                                    (g.isRoot = "/" === B.path);
                                            } catch (A) {
                                                g.error = A.errno;
                                            }
                                            return g;
                                        },
                                        createPath: (A, I, g, B) => {
                                            A = "string" == typeof A ? A : tA.getPath(A);
                                            for (var Q = I.split("/").reverse(); Q.length; ) {
                                                var C = Q.pop();
                                                if (C) {
                                                    var E = EA.join2(A, C);
                                                    try {
                                                        tA.mkdir(E);
                                                    } catch (A) {}
                                                    A = E;
                                                }
                                            }
                                            return E;
                                        },
                                        createFile: (A, I, g, B, Q) => {
                                            var C = EA.join2(
                                                    "string" == typeof A ? A : tA.getPath(A),
                                                    I
                                                ),
                                                E = tA.getMode(B, Q);
                                            return tA.create(C, E);
                                        },
                                        createDataFile: (A, I, g, B, Q, C) => {
                                            var E = I;
                                            A &&
                                                ((A = "string" == typeof A ? A : tA.getPath(A)),
                                                (E = I ? EA.join2(A, I) : A));
                                            var i = tA.getMode(B, Q),
                                                o = tA.create(E, i);
                                            if (g) {
                                                if ("string" == typeof g) {
                                                    for (
                                                        var e = new Array(g.length),
                                                            t = 0,
                                                            a = g.length;
                                                        t < a;
                                                        ++t
                                                    )
                                                        e[t] = g.charCodeAt(t);
                                                    g = e;
                                                }
                                                tA.chmod(o, 146 | i);
                                                var n = tA.open(o, 577);
                                                tA.write(n, g, 0, g.length, 0, C),
                                                    tA.close(n),
                                                    tA.chmod(o, i);
                                            }
                                            return o;
                                        },
                                        createDevice: (A, I, g, B) => {
                                            var Q = EA.join2(
                                                    "string" == typeof A ? A : tA.getPath(A),
                                                    I
                                                ),
                                                C = tA.getMode(!!g, !!B);
                                            tA.createDevice.major || (tA.createDevice.major = 64);
                                            var E = tA.makedev(tA.createDevice.major++, 0);
                                            return (
                                                tA.registerDevice(E, {
                                                    open: A => {
                                                        A.seekable = !1;
                                                    },
                                                    close: A => {
                                                        B && B.buffer && B.buffer.length && B(10);
                                                    },
                                                    read: (A, I, B, Q, C) => {
                                                        for (var E = 0, i = 0; i < Q; i++) {
                                                            var o;
                                                            try {
                                                                o = g();
                                                            } catch (A) {
                                                                throw new tA.ErrnoError(29);
                                                            }
                                                            if (void 0 === o && 0 === E)
                                                                throw new tA.ErrnoError(6);
                                                            if (null == o) break;
                                                            E++, (I[B + i] = o);
                                                        }
                                                        return (
                                                            E && (A.node.timestamp = Date.now()), E
                                                        );
                                                    },
                                                    write: (A, I, g, Q, C) => {
                                                        for (var E = 0; E < Q; E++)
                                                            try {
                                                                B(I[g + E]);
                                                            } catch (A) {
                                                                throw new tA.ErrnoError(29);
                                                            }
                                                        return (
                                                            Q && (A.node.timestamp = Date.now()), E
                                                        );
                                                    },
                                                }),
                                                tA.mkdev(Q, C, E)
                                            );
                                        },
                                        forceLoadFile: A => {
                                            if (A.isDevice || A.isFolder || A.link || A.contents)
                                                return !0;
                                            if ("undefined" != typeof XMLHttpRequest)
                                                throw new Error(
                                                    "Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread."
                                                );
                                            if (!Q)
                                                throw new Error(
                                                    "Cannot load without read() or XMLHttpRequest."
                                                );
                                            try {
                                                (A.contents = fA(Q(A.url), !0)),
                                                    (A.usedBytes = A.contents.length);
                                            } catch (A) {
                                                throw new tA.ErrnoError(29);
                                            }
                                        },
                                        createLazyFile: (A, I, g, B, Q) => {
                                            function C() {
                                                (this.lengthKnown = !1), (this.chunks = []);
                                            }
                                            if (
                                                ((C.prototype.get = function (A) {
                                                    if (!(A > this.length - 1 || A < 0)) {
                                                        var I = A % this.chunkSize,
                                                            g = (A / this.chunkSize) | 0;
                                                        return this.getter(g)[I];
                                                    }
                                                }),
                                                (C.prototype.setDataGetter = function (A) {
                                                    this.getter = A;
                                                }),
                                                (C.prototype.cacheLength = function () {
                                                    var A = new XMLHttpRequest();
                                                    if (
                                                        (A.open("HEAD", g, !1),
                                                        A.send(null),
                                                        !(
                                                            (A.status >= 200 && A.status < 300) ||
                                                            304 === A.status
                                                        ))
                                                    )
                                                        throw new Error(
                                                            "Couldn't load " +
                                                                g +
                                                                ". Status: " +
                                                                A.status
                                                        );
                                                    var I,
                                                        B = Number(
                                                            A.getResponseHeader("Content-length")
                                                        ),
                                                        Q =
                                                            (I =
                                                                A.getResponseHeader(
                                                                    "Accept-Ranges"
                                                                )) && "bytes" === I,
                                                        C =
                                                            (I =
                                                                A.getResponseHeader(
                                                                    "Content-Encoding"
                                                                )) && "gzip" === I,
                                                        E = 1048576;
                                                    Q || (E = B);
                                                    var i = this;
                                                    i.setDataGetter(A => {
                                                        var I = A * E,
                                                            Q = (A + 1) * E - 1;
                                                        if (
                                                            ((Q = Math.min(Q, B - 1)),
                                                            void 0 === i.chunks[A] &&
                                                                (i.chunks[A] = ((A, I) => {
                                                                    if (A > I)
                                                                        throw new Error(
                                                                            "invalid range (" +
                                                                                A +
                                                                                ", " +
                                                                                I +
                                                                                ") or no bytes requested!"
                                                                        );
                                                                    if (I > B - 1)
                                                                        throw new Error(
                                                                            "only " +
                                                                                B +
                                                                                " bytes available! programmer error!"
                                                                        );
                                                                    var Q = new XMLHttpRequest();
                                                                    if (
                                                                        (Q.open("GET", g, !1),
                                                                        B !== E &&
                                                                            Q.setRequestHeader(
                                                                                "Range",
                                                                                "bytes=" +
                                                                                    A +
                                                                                    "-" +
                                                                                    I
                                                                            ),
                                                                        (Q.responseType =
                                                                            "arraybuffer"),
                                                                        Q.overrideMimeType &&
                                                                            Q.overrideMimeType(
                                                                                "text/plain; charset=x-user-defined"
                                                                            ),
                                                                        Q.send(null),
                                                                        !(
                                                                            (Q.status >= 200 &&
                                                                                Q.status < 300) ||
                                                                            304 === Q.status
                                                                        ))
                                                                    )
                                                                        throw new Error(
                                                                            "Couldn't load " +
                                                                                g +
                                                                                ". Status: " +
                                                                                Q.status
                                                                        );
                                                                    return void 0 !== Q.response
                                                                        ? new Uint8Array(
                                                                              Q.response || []
                                                                          )
                                                                        : fA(
                                                                              Q.responseText || "",
                                                                              !0
                                                                          );
                                                                })(I, Q)),
                                                            void 0 === i.chunks[A])
                                                        )
                                                            throw new Error("doXHR failed!");
                                                        return i.chunks[A];
                                                    }),
                                                        (!C && B) ||
                                                            ((E = B = 1),
                                                            (B = this.getter(0).length),
                                                            (E = B),
                                                            r(
                                                                "LazyFiles on gzip forces download of the whole file when length is accessed"
                                                            )),
                                                        (this._length = B),
                                                        (this._chunkSize = E),
                                                        (this.lengthKnown = !0);
                                                }),
                                                "undefined" != typeof XMLHttpRequest)
                                            ) {
                                                if (!t)
                                                    throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
                                                var E = new C();
                                                Object.defineProperties(E, {
                                                    length: {
                                                        get: function () {
                                                            return (
                                                                this.lengthKnown ||
                                                                    this.cacheLength(),
                                                                this._length
                                                            );
                                                        },
                                                    },
                                                    chunkSize: {
                                                        get: function () {
                                                            return (
                                                                this.lengthKnown ||
                                                                    this.cacheLength(),
                                                                this._chunkSize
                                                            );
                                                        },
                                                    },
                                                });
                                                var i = { isDevice: !1, contents: E };
                                            } else i = { isDevice: !1, url: g };
                                            var o = tA.createFile(A, I, i, B, Q);
                                            i.contents
                                                ? (o.contents = i.contents)
                                                : i.url && ((o.contents = null), (o.url = i.url)),
                                                Object.defineProperties(o, {
                                                    usedBytes: {
                                                        get: function () {
                                                            return this.contents.length;
                                                        },
                                                    },
                                                });
                                            var e = {};
                                            return (
                                                Object.keys(o.stream_ops).forEach(A => {
                                                    var I = o.stream_ops[A];
                                                    e[A] = function () {
                                                        return (
                                                            tA.forceLoadFile(o),
                                                            I.apply(null, arguments)
                                                        );
                                                    };
                                                }),
                                                (e.read = (A, I, g, B, Q) => {
                                                    tA.forceLoadFile(o);
                                                    var C = A.node.contents;
                                                    if (Q >= C.length) return 0;
                                                    var E = Math.min(C.length - Q, B);
                                                    if (C.slice)
                                                        for (var i = 0; i < E; i++)
                                                            I[g + i] = C[Q + i];
                                                    else
                                                        for (i = 0; i < E; i++)
                                                            I[g + i] = C.get(Q + i);
                                                    return E;
                                                }),
                                                (o.stream_ops = e),
                                                o
                                            );
                                        },
                                        createPreloadedFile: (A, I, g, B, Q, E, i, o, e, t) => {
                                            var a = I ? iA.resolve(EA.join2(A, I)) : A;
                                            function n(g) {
                                                function C(g) {
                                                    t && t(),
                                                        o || tA.createDataFile(A, I, g, B, Q, e),
                                                        E && E(),
                                                        O();
                                                }
                                                DA.handledByPreloadPlugin(g, a, C, () => {
                                                    i && i(), O();
                                                }) || C(g);
                                            }
                                            T(),
                                                "string" == typeof g
                                                    ? (function (A, I, g, B) {
                                                          var Q = "al " + A;
                                                          C(
                                                              A,
                                                              function (I) {
                                                                  w(
                                                                      I,
                                                                      'Loading data file "' +
                                                                          A +
                                                                          '" failed (no arrayBuffer).'
                                                                  ),
                                                                      n(new Uint8Array(I)),
                                                                      Q && O();
                                                              },
                                                              function (I) {
                                                                  if (!g)
                                                                      throw (
                                                                          'Loading data file "' +
                                                                          A +
                                                                          '" failed.'
                                                                      );
                                                                  g();
                                                              }
                                                          ),
                                                              Q && T();
                                                      })(g, 0, i)
                                                    : n(g);
                                        },
                                        indexedDB: () =>
                                            window.indexedDB ||
                                            window.mozIndexedDB ||
                                            window.webkitIndexedDB ||
                                            window.msIndexedDB,
                                        DB_NAME: () => "EM_FS_" + window.location.pathname,
                                        DB_VERSION: 20,
                                        DB_STORE_NAME: "FILE_DATA",
                                        saveFilesToDB: (A, I, g) => {
                                            (I = I || (() => {})), (g = g || (() => {}));
                                            var B = tA.indexedDB();
                                            try {
                                                var Q = B.open(tA.DB_NAME(), tA.DB_VERSION);
                                            } catch (A) {
                                                return g(A);
                                            }
                                            (Q.onupgradeneeded = () => {
                                                r("creating db"),
                                                    Q.result.createObjectStore(tA.DB_STORE_NAME);
                                            }),
                                                (Q.onsuccess = () => {
                                                    var B = Q.result.transaction(
                                                            [tA.DB_STORE_NAME],
                                                            "readwrite"
                                                        ),
                                                        C = B.objectStore(tA.DB_STORE_NAME),
                                                        E = 0,
                                                        i = 0,
                                                        o = A.length;
                                                    function e() {
                                                        0 == i ? I() : g();
                                                    }
                                                    A.forEach(A => {
                                                        var I = C.put(
                                                            tA.analyzePath(A).object.contents,
                                                            A
                                                        );
                                                        (I.onsuccess = () => {
                                                            ++E + i == o && e();
                                                        }),
                                                            (I.onerror = () => {
                                                                i++, E + i == o && e();
                                                            });
                                                    }),
                                                        (B.onerror = g);
                                                }),
                                                (Q.onerror = g);
                                        },
                                        loadFilesFromDB: (A, I, g) => {
                                            (I = I || (() => {})), (g = g || (() => {}));
                                            var B = tA.indexedDB();
                                            try {
                                                var Q = B.open(tA.DB_NAME(), tA.DB_VERSION);
                                            } catch (A) {
                                                return g(A);
                                            }
                                            (Q.onupgradeneeded = g),
                                                (Q.onsuccess = () => {
                                                    var B = Q.result;
                                                    try {
                                                        var C = B.transaction(
                                                            [tA.DB_STORE_NAME],
                                                            "readonly"
                                                        );
                                                    } catch (A) {
                                                        return void g(A);
                                                    }
                                                    var E = C.objectStore(tA.DB_STORE_NAME),
                                                        i = 0,
                                                        o = 0,
                                                        e = A.length;
                                                    function t() {
                                                        0 == o ? I() : g();
                                                    }
                                                    A.forEach(A => {
                                                        var I = E.get(A);
                                                        (I.onsuccess = () => {
                                                            tA.analyzePath(A).exists &&
                                                                tA.unlink(A),
                                                                tA.createDataFile(
                                                                    EA.dirname(A),
                                                                    EA.basename(A),
                                                                    I.result,
                                                                    !0,
                                                                    !0,
                                                                    !0
                                                                ),
                                                                ++i + o == e && t();
                                                        }),
                                                            (I.onerror = () => {
                                                                o++, i + o == e && t();
                                                            });
                                                    }),
                                                        (C.onerror = g);
                                                }),
                                                (Q.onerror = g);
                                        },
                                    };
                                function aA(I, g) {
                                    if (
                                        ((DA.mainLoop.timingMode = I),
                                        (DA.mainLoop.timingValue = g),
                                        !DA.mainLoop.func)
                                    )
                                        return 1;
                                    if ((DA.mainLoop.running || (DA.mainLoop.running = !0), 0 == I))
                                        (DA.mainLoop.scheduler = function () {
                                            var A =
                                                0 |
                                                Math.max(0, DA.mainLoop.tickStartTime + g - CA());
                                            setTimeout(DA.mainLoop.runner, A);
                                        }),
                                            (DA.mainLoop.method = "timeout");
                                    else if (1 == I)
                                        (DA.mainLoop.scheduler = function () {
                                            DA.requestAnimationFrame(DA.mainLoop.runner);
                                        }),
                                            (DA.mainLoop.method = "rAF");
                                    else if (2 == I) {
                                        if ("undefined" == typeof setImmediate) {
                                            var B = [],
                                                Q = "setimmediate";
                                            addEventListener(
                                                "message",
                                                function (A) {
                                                    (A.data !== Q && A.data.target !== Q) ||
                                                        (A.stopPropagation(), B.shift()());
                                                },
                                                !0
                                            ),
                                                (setImmediate = function (I) {
                                                    B.push(I),
                                                        t
                                                            ? (void 0 === A.setImmediates &&
                                                                  (A.setImmediates = []),
                                                              A.setImmediates.push(I),
                                                              postMessage({ target: Q }))
                                                            : postMessage(Q, "*");
                                                });
                                        }
                                        (DA.mainLoop.scheduler = function () {
                                            setImmediate(DA.mainLoop.runner);
                                        }),
                                            (DA.mainLoop.method = "immediate");
                                    }
                                    return 0;
                                }
                                function nA(I, g, B, Q, C) {
                                    w(
                                        !DA.mainLoop.func,
                                        "emscripten_set_main_loop: there can only be one main loop function at once: call emscripten_cancel_main_loop to cancel the previous one before setting a new one with different parameters."
                                    ),
                                        (DA.mainLoop.func = I),
                                        (DA.mainLoop.arg = Q);
                                    var E = DA.mainLoop.currentlyRunningMainloop;
                                    function i() {
                                        return !(
                                            E < DA.mainLoop.currentlyRunningMainloop &&
                                            ((function () {
                                                if (!x())
                                                    try {
                                                        (function (I, g) {
                                                            var B;
                                                            (y = I),
                                                                x() || (q = !0),
                                                                (y = B = I),
                                                                x() ||
                                                                    (A.onExit && A.onExit(B),
                                                                    (c = !0)),
                                                                e(B, new LA(B));
                                                        })(y);
                                                    } catch (A) {
                                                        QA(A);
                                                    }
                                            })(),
                                            1)
                                        );
                                    }
                                    if (
                                        ((DA.mainLoop.running = !1),
                                        (DA.mainLoop.runner = function () {
                                            if (!c)
                                                if (DA.mainLoop.queue.length > 0) {
                                                    var A = Date.now(),
                                                        g = DA.mainLoop.queue.shift();
                                                    if (
                                                        (g.func(g.arg),
                                                        DA.mainLoop.remainingBlockers)
                                                    ) {
                                                        var B = DA.mainLoop.remainingBlockers,
                                                            Q = B % 1 == 0 ? B - 1 : Math.floor(B);
                                                        g.counted
                                                            ? (DA.mainLoop.remainingBlockers = Q)
                                                            : ((Q += 0.5),
                                                              (DA.mainLoop.remainingBlockers =
                                                                  (8 * B + Q) / 9));
                                                    }
                                                    if (
                                                        (r(
                                                            'main loop blocker "' +
                                                                g.name +
                                                                '" took ' +
                                                                (Date.now() - A) +
                                                                " ms"
                                                        ),
                                                        DA.mainLoop.updateStatus(),
                                                        !i())
                                                    )
                                                        return;
                                                    setTimeout(DA.mainLoop.runner, 0);
                                                } else
                                                    i() &&
                                                        ((DA.mainLoop.currentFrameNumber =
                                                            (DA.mainLoop.currentFrameNumber + 1) |
                                                            0),
                                                        1 == DA.mainLoop.timingMode &&
                                                        DA.mainLoop.timingValue > 1 &&
                                                        DA.mainLoop.currentFrameNumber %
                                                            DA.mainLoop.timingValue !=
                                                            0
                                                            ? DA.mainLoop.scheduler()
                                                            : (0 == DA.mainLoop.timingMode &&
                                                                  (DA.mainLoop.tickStartTime =
                                                                      CA()),
                                                              DA.mainLoop.runIter(I),
                                                              i() &&
                                                                  ("object" == typeof hA &&
                                                                      hA.audio &&
                                                                      hA.audio.queueNewAudioData &&
                                                                      hA.audio.queueNewAudioData(),
                                                                  DA.mainLoop.scheduler())));
                                        }),
                                        C ||
                                            (g && g > 0 ? aA(0, 1e3 / g) : aA(1, 1),
                                            DA.mainLoop.scheduler()),
                                        B)
                                    )
                                        throw "unwind";
                                }
                                function rA(A, I) {
                                    if (!q && !c)
                                        if (I) A();
                                        else
                                            try {
                                                A();
                                            } catch (A) {
                                                QA(A);
                                            }
                                }
                                function sA(A, I) {
                                    return setTimeout(function () {
                                        rA(A);
                                    }, I);
                                }
                                CA = () => performance.now();
                                var DA = {
                                    mainLoop: {
                                        running: !1,
                                        scheduler: null,
                                        method: "",
                                        currentlyRunningMainloop: 0,
                                        func: null,
                                        arg: 0,
                                        timingMode: 0,
                                        timingValue: 0,
                                        currentFrameNumber: 0,
                                        queue: [],
                                        pause: function () {
                                            (DA.mainLoop.scheduler = null),
                                                DA.mainLoop.currentlyRunningMainloop++;
                                        },
                                        resume: function () {
                                            DA.mainLoop.currentlyRunningMainloop++;
                                            var A = DA.mainLoop.timingMode,
                                                I = DA.mainLoop.timingValue,
                                                g = DA.mainLoop.func;
                                            (DA.mainLoop.func = null),
                                                nA(g, 0, !1, DA.mainLoop.arg, !0),
                                                aA(A, I),
                                                DA.mainLoop.scheduler();
                                        },
                                        updateStatus: function () {
                                            if (A.setStatus) {
                                                var I = A.statusMessage || "Please wait...",
                                                    g = DA.mainLoop.remainingBlockers,
                                                    B = DA.mainLoop.expectedBlockers;
                                                g
                                                    ? g < B
                                                        ? A.setStatus(
                                                              I + " (" + (B - g) + "/" + B + ")"
                                                          )
                                                        : A.setStatus(I)
                                                    : A.setStatus("");
                                            }
                                        },
                                        runIter: function (I) {
                                            if (!c) {
                                                if (A.preMainLoop && !1 === A.preMainLoop()) return;
                                                rA(I), A.postMainLoop && A.postMainLoop();
                                            }
                                        },
                                    },
                                    isFullscreen: !1,
                                    pointerLock: !1,
                                    moduleContextCreatedCallbacks: [],
                                    workers: [],
                                    init: function () {
                                        if (
                                            (A.preloadPlugins || (A.preloadPlugins = []),
                                            !DA.initted)
                                        ) {
                                            DA.initted = !0;
                                            try {
                                                new Blob(), (DA.hasBlobConstructor = !0);
                                            } catch (A) {
                                                (DA.hasBlobConstructor = !1),
                                                    r(
                                                        "warning: no blob constructor, cannot create blobs with mimetypes"
                                                    );
                                            }
                                            (DA.BlobBuilder =
                                                "undefined" != typeof MozBlobBuilder
                                                    ? MozBlobBuilder
                                                    : "undefined" != typeof WebKitBlobBuilder
                                                      ? WebKitBlobBuilder
                                                      : DA.hasBlobConstructor
                                                        ? null
                                                        : r("warning: no BlobBuilder")),
                                                (DA.URLObject =
                                                    "undefined" != typeof window
                                                        ? window.URL
                                                            ? window.URL
                                                            : window.webkitURL
                                                        : void 0),
                                                A.noImageDecoding ||
                                                    void 0 !== DA.URLObject ||
                                                    (r(
                                                        "warning: Browser does not support creating object URLs. Built-in browser image decoding will not be available."
                                                    ),
                                                    (A.noImageDecoding = !0));
                                            var I = {
                                                canHandle: function (I) {
                                                    return (
                                                        !A.noImageDecoding &&
                                                        /\.(jpg|jpeg|png|bmp)$/i.test(I)
                                                    );
                                                },
                                                handle: function (I, g, B, Q) {
                                                    var C = null;
                                                    if (DA.hasBlobConstructor)
                                                        try {
                                                            (C = new Blob([I], {
                                                                type: DA.getMimetype(g),
                                                            })).size !== I.length &&
                                                                (C = new Blob(
                                                                    [new Uint8Array(I).buffer],
                                                                    { type: DA.getMimetype(g) }
                                                                ));
                                                        } catch (A) {
                                                            D(
                                                                "Blob constructor present but fails: " +
                                                                    A +
                                                                    "; falling back to blob builder"
                                                            );
                                                        }
                                                    if (!C) {
                                                        var E = new DA.BlobBuilder();
                                                        E.append(new Uint8Array(I).buffer),
                                                            (C = E.getBlob());
                                                    }
                                                    var i = DA.URLObject.createObjectURL(C),
                                                        o = new Image();
                                                    (o.onload = () => {
                                                        w(
                                                            o.complete,
                                                            "Image " + g + " could not be decoded"
                                                        );
                                                        var Q = document.createElement("canvas");
                                                        (Q.width = o.width),
                                                            (Q.height = o.height),
                                                            Q.getContext("2d").drawImage(o, 0, 0),
                                                            (A.preloadedImages[g] = Q),
                                                            DA.URLObject.revokeObjectURL(i),
                                                            B && B(I);
                                                    }),
                                                        (o.onerror = A => {
                                                            r(
                                                                "Image " +
                                                                    i +
                                                                    " could not be decoded"
                                                            ),
                                                                Q && Q();
                                                        }),
                                                        (o.src = i);
                                                },
                                            };
                                            A.preloadPlugins.push(I);
                                            var g = {
                                                canHandle: function (I) {
                                                    return (
                                                        !A.noAudioDecoding &&
                                                        I.substr(-4) in
                                                            { ".ogg": 1, ".wav": 1, ".mp3": 1 }
                                                    );
                                                },
                                                handle: function (I, g, B, Q) {
                                                    var C = !1;
                                                    function E(Q) {
                                                        C ||
                                                            ((C = !0),
                                                            (A.preloadedAudios[g] = Q),
                                                            B && B(I));
                                                    }
                                                    function i() {
                                                        C ||
                                                            ((C = !0),
                                                            (A.preloadedAudios[g] = new Audio()),
                                                            Q && Q());
                                                    }
                                                    if (!DA.hasBlobConstructor) return i();
                                                    try {
                                                        var o = new Blob([I], {
                                                            type: DA.getMimetype(g),
                                                        });
                                                    } catch (A) {
                                                        return i();
                                                    }
                                                    var e = DA.URLObject.createObjectURL(o),
                                                        t = new Audio();
                                                    t.addEventListener(
                                                        "canplaythrough",
                                                        function () {
                                                            E(t);
                                                        },
                                                        !1
                                                    ),
                                                        (t.onerror = function (A) {
                                                            C ||
                                                                (r(
                                                                    "warning: browser could not fully decode audio " +
                                                                        g +
                                                                        ", trying slower base64 approach"
                                                                ),
                                                                (t.src =
                                                                    "data:audio/x-" +
                                                                    g.substr(-3) +
                                                                    ";base64," +
                                                                    (function (A) {
                                                                        for (
                                                                            var I =
                                                                                    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
                                                                                g = "",
                                                                                B = 0,
                                                                                Q = 0,
                                                                                C = 0;
                                                                            C < A.length;
                                                                            C++
                                                                        )
                                                                            for (
                                                                                B = (B << 8) | A[C],
                                                                                    Q += 8;
                                                                                Q >= 6;

                                                                            ) {
                                                                                var E =
                                                                                    (B >> (Q - 6)) &
                                                                                    63;
                                                                                (Q -= 6),
                                                                                    (g += I[E]);
                                                                            }
                                                                        return (
                                                                            2 == Q
                                                                                ? ((g +=
                                                                                      I[
                                                                                          (3 & B) <<
                                                                                              4
                                                                                      ]),
                                                                                  (g += "=="))
                                                                                : 4 == Q &&
                                                                                  ((g +=
                                                                                      I[
                                                                                          (15 &
                                                                                              B) <<
                                                                                              2
                                                                                      ]),
                                                                                  (g += "=")),
                                                                            g
                                                                        );
                                                                    })(I)),
                                                                E(t));
                                                        }),
                                                        (t.src = e),
                                                        sA(function () {
                                                            E(t);
                                                        }, 1e4);
                                                },
                                            };
                                            A.preloadPlugins.push(g);
                                            var B = A.canvas;
                                            B &&
                                                ((B.requestPointerLock =
                                                    B.requestPointerLock ||
                                                    B.mozRequestPointerLock ||
                                                    B.webkitRequestPointerLock ||
                                                    B.msRequestPointerLock ||
                                                    function () {}),
                                                (B.exitPointerLock =
                                                    document.exitPointerLock ||
                                                    document.mozExitPointerLock ||
                                                    document.webkitExitPointerLock ||
                                                    document.msExitPointerLock ||
                                                    function () {}),
                                                (B.exitPointerLock =
                                                    B.exitPointerLock.bind(document)),
                                                document.addEventListener(
                                                    "pointerlockchange",
                                                    Q,
                                                    !1
                                                ),
                                                document.addEventListener(
                                                    "mozpointerlockchange",
                                                    Q,
                                                    !1
                                                ),
                                                document.addEventListener(
                                                    "webkitpointerlockchange",
                                                    Q,
                                                    !1
                                                ),
                                                document.addEventListener(
                                                    "mspointerlockchange",
                                                    Q,
                                                    !1
                                                ),
                                                A.elementPointerLock &&
                                                    B.addEventListener(
                                                        "click",
                                                        function (I) {
                                                            !DA.pointerLock &&
                                                                A.canvas.requestPointerLock &&
                                                                (A.canvas.requestPointerLock(),
                                                                I.preventDefault());
                                                        },
                                                        !1
                                                    ));
                                        }
                                        function Q() {
                                            DA.pointerLock =
                                                document.pointerLockElement === A.canvas ||
                                                document.mozPointerLockElement === A.canvas ||
                                                document.webkitPointerLockElement === A.canvas ||
                                                document.msPointerLockElement === A.canvas;
                                        }
                                    },
                                    handledByPreloadPlugin: function (I, g, B, Q) {
                                        DA.init();
                                        var C = !1;
                                        return (
                                            A.preloadPlugins.forEach(function (A) {
                                                C ||
                                                    (A.canHandle(g) &&
                                                        (A.handle(I, g, B, Q), (C = !0)));
                                            }),
                                            C
                                        );
                                    },
                                    createContext: function (I, g, B, Q) {
                                        if (g && A.ctx && I == A.canvas) return A.ctx;
                                        var C, E;
                                        if (g) {
                                            var i = { antialias: !1, alpha: !1, majorVersion: 1 };
                                            if (Q) for (var o in Q) i[o] = Q[o];
                                            void 0 !== yA &&
                                                (E = yA.createContext(I, i)) &&
                                                (C = yA.getContext(E).GLctx);
                                        } else C = I.getContext("2d");
                                        return C
                                            ? (B &&
                                                  (g ||
                                                      w(
                                                          void 0 === wA,
                                                          "cannot set in module if GLctx is used, but we are a non-GL context that would replace it"
                                                      ),
                                                  (A.ctx = C),
                                                  g && yA.makeContextCurrent(E),
                                                  (A.useWebGL = g),
                                                  DA.moduleContextCreatedCallbacks.forEach(
                                                      function (A) {
                                                          A();
                                                      }
                                                  ),
                                                  DA.init()),
                                              C)
                                            : null;
                                    },
                                    destroyContext: function (A, I, g) {},
                                    fullscreenHandlersInstalled: !1,
                                    lockPointer: void 0,
                                    resizeCanvas: void 0,
                                    requestFullscreen: function (I, g) {
                                        (DA.lockPointer = I),
                                            (DA.resizeCanvas = g),
                                            void 0 === DA.lockPointer && (DA.lockPointer = !0),
                                            void 0 === DA.resizeCanvas && (DA.resizeCanvas = !1);
                                        var B = A.canvas;
                                        function Q() {
                                            DA.isFullscreen = !1;
                                            var I = B.parentNode;
                                            (document.fullscreenElement ||
                                                document.mozFullScreenElement ||
                                                document.msFullscreenElement ||
                                                document.webkitFullscreenElement ||
                                                document.webkitCurrentFullScreenElement) === I
                                                ? ((B.exitFullscreen = DA.exitFullscreen),
                                                  DA.lockPointer && B.requestPointerLock(),
                                                  (DA.isFullscreen = !0),
                                                  DA.resizeCanvas
                                                      ? DA.setFullscreenCanvasSize()
                                                      : DA.updateCanvasDimensions(B))
                                                : (I.parentNode.insertBefore(B, I),
                                                  I.parentNode.removeChild(I),
                                                  DA.resizeCanvas
                                                      ? DA.setWindowedCanvasSize()
                                                      : DA.updateCanvasDimensions(B)),
                                                A.onFullScreen && A.onFullScreen(DA.isFullscreen),
                                                A.onFullscreen && A.onFullscreen(DA.isFullscreen);
                                        }
                                        DA.fullscreenHandlersInstalled ||
                                            ((DA.fullscreenHandlersInstalled = !0),
                                            document.addEventListener("fullscreenchange", Q, !1),
                                            document.addEventListener("mozfullscreenchange", Q, !1),
                                            document.addEventListener(
                                                "webkitfullscreenchange",
                                                Q,
                                                !1
                                            ),
                                            document.addEventListener("MSFullscreenChange", Q, !1));
                                        var C = document.createElement("div");
                                        B.parentNode.insertBefore(C, B),
                                            C.appendChild(B),
                                            (C.requestFullscreen =
                                                C.requestFullscreen ||
                                                C.mozRequestFullScreen ||
                                                C.msRequestFullscreen ||
                                                (C.webkitRequestFullscreen
                                                    ? function () {
                                                          C.webkitRequestFullscreen(
                                                              Element.ALLOW_KEYBOARD_INPUT
                                                          );
                                                      }
                                                    : null) ||
                                                (C.webkitRequestFullScreen
                                                    ? function () {
                                                          C.webkitRequestFullScreen(
                                                              Element.ALLOW_KEYBOARD_INPUT
                                                          );
                                                      }
                                                    : null)),
                                            C.requestFullscreen();
                                    },
                                    exitFullscreen: function () {
                                        return (
                                            !!DA.isFullscreen &&
                                            ((
                                                document.exitFullscreen ||
                                                document.cancelFullScreen ||
                                                document.mozCancelFullScreen ||
                                                document.msExitFullscreen ||
                                                document.webkitCancelFullScreen ||
                                                function () {}
                                            ).apply(document, []),
                                            !0)
                                        );
                                    },
                                    nextRAF: 0,
                                    fakeRequestAnimationFrame: function (A) {
                                        var I = Date.now();
                                        if (0 === DA.nextRAF) DA.nextRAF = I + 1e3 / 60;
                                        else for (; I + 2 >= DA.nextRAF; ) DA.nextRAF += 1e3 / 60;
                                        var g = Math.max(DA.nextRAF - I, 0);
                                        setTimeout(A, g);
                                    },
                                    requestAnimationFrame: function (A) {
                                        "function" != typeof requestAnimationFrame
                                            ? (0, DA.fakeRequestAnimationFrame)(A)
                                            : requestAnimationFrame(A);
                                    },
                                    safeSetTimeout: function (A) {
                                        return sA(A);
                                    },
                                    safeRequestAnimationFrame: function (A) {
                                        return DA.requestAnimationFrame(function () {
                                            rA(A);
                                        });
                                    },
                                    getMimetype: function (A) {
                                        return {
                                            jpg: "image/jpeg",
                                            jpeg: "image/jpeg",
                                            png: "image/png",
                                            bmp: "image/bmp",
                                            ogg: "audio/ogg",
                                            wav: "audio/wav",
                                            mp3: "audio/mpeg",
                                        }[A.substr(A.lastIndexOf(".") + 1)];
                                    },
                                    getUserMedia: function (A) {
                                        window.getUserMedia ||
                                            (window.getUserMedia =
                                                navigator.getUserMedia ||
                                                navigator.mozGetUserMedia),
                                            window.getUserMedia(A);
                                    },
                                    getMovementX: function (A) {
                                        return (
                                            A.movementX || A.mozMovementX || A.webkitMovementX || 0
                                        );
                                    },
                                    getMovementY: function (A) {
                                        return (
                                            A.movementY || A.mozMovementY || A.webkitMovementY || 0
                                        );
                                    },
                                    getMouseWheelDelta: function (A) {
                                        var I = 0;
                                        switch (A.type) {
                                            case "DOMMouseScroll":
                                                I = A.detail / 3;
                                                break;
                                            case "mousewheel":
                                                I = A.wheelDelta / 120;
                                                break;
                                            case "wheel":
                                                switch (((I = A.deltaY), A.deltaMode)) {
                                                    case 0:
                                                        I /= 100;
                                                        break;
                                                    case 1:
                                                        I /= 3;
                                                        break;
                                                    case 2:
                                                        I *= 80;
                                                        break;
                                                    default:
                                                        throw (
                                                            "unrecognized mouse wheel delta mode: " +
                                                            A.deltaMode
                                                        );
                                                }
                                                break;
                                            default:
                                                throw "unrecognized mouse wheel event: " + A.type;
                                        }
                                        return I;
                                    },
                                    mouseX: 0,
                                    mouseY: 0,
                                    mouseMovementX: 0,
                                    mouseMovementY: 0,
                                    touches: {},
                                    lastTouches: {},
                                    calculateMouseEvent: function (I) {
                                        if (DA.pointerLock)
                                            "mousemove" != I.type && "mozMovementX" in I
                                                ? (DA.mouseMovementX = DA.mouseMovementY = 0)
                                                : ((DA.mouseMovementX = DA.getMovementX(I)),
                                                  (DA.mouseMovementY = DA.getMovementY(I))),
                                                void 0 !== hA
                                                    ? ((DA.mouseX = hA.mouseX + DA.mouseMovementX),
                                                      (DA.mouseY = hA.mouseY + DA.mouseMovementY))
                                                    : ((DA.mouseX += DA.mouseMovementX),
                                                      (DA.mouseY += DA.mouseMovementY));
                                        else {
                                            var g = A.canvas.getBoundingClientRect(),
                                                B = A.canvas.width,
                                                Q = A.canvas.height,
                                                C =
                                                    void 0 !== window.scrollX
                                                        ? window.scrollX
                                                        : window.pageXOffset,
                                                E =
                                                    void 0 !== window.scrollY
                                                        ? window.scrollY
                                                        : window.pageYOffset;
                                            if (
                                                "touchstart" === I.type ||
                                                "touchend" === I.type ||
                                                "touchmove" === I.type
                                            ) {
                                                var i = I.touch;
                                                if (void 0 === i) return;
                                                var o = i.pageX - (C + g.left),
                                                    e = i.pageY - (E + g.top),
                                                    t = {
                                                        x: (o *= B / g.width),
                                                        y: (e *= Q / g.height),
                                                    };
                                                if ("touchstart" === I.type)
                                                    (DA.lastTouches[i.identifier] = t),
                                                        (DA.touches[i.identifier] = t);
                                                else if (
                                                    "touchend" === I.type ||
                                                    "touchmove" === I.type
                                                ) {
                                                    var a = DA.touches[i.identifier];
                                                    a || (a = t),
                                                        (DA.lastTouches[i.identifier] = a),
                                                        (DA.touches[i.identifier] = t);
                                                }
                                                return;
                                            }
                                            var n = I.pageX - (C + g.left),
                                                r = I.pageY - (E + g.top);
                                            (n *= B / g.width),
                                                (r *= Q / g.height),
                                                (DA.mouseMovementX = n - DA.mouseX),
                                                (DA.mouseMovementY = r - DA.mouseY),
                                                (DA.mouseX = n),
                                                (DA.mouseY = r);
                                        }
                                    },
                                    resizeListeners: [],
                                    updateResizeListeners: function () {
                                        var I = A.canvas;
                                        DA.resizeListeners.forEach(function (A) {
                                            A(I.width, I.height);
                                        });
                                    },
                                    setCanvasSize: function (I, g, B) {
                                        var Q = A.canvas;
                                        DA.updateCanvasDimensions(Q, I, g),
                                            B || DA.updateResizeListeners();
                                    },
                                    windowedWidth: 0,
                                    windowedHeight: 0,
                                    setFullscreenCanvasSize: function () {
                                        if (void 0 !== hA) {
                                            var I = R[hA.screen >> 2];
                                            (I |= 8388608), (N[hA.screen >> 2] = I);
                                        }
                                        DA.updateCanvasDimensions(A.canvas),
                                            DA.updateResizeListeners();
                                    },
                                    setWindowedCanvasSize: function () {
                                        if (void 0 !== hA) {
                                            var I = R[hA.screen >> 2];
                                            (I &= -8388609), (N[hA.screen >> 2] = I);
                                        }
                                        DA.updateCanvasDimensions(A.canvas),
                                            DA.updateResizeListeners();
                                    },
                                    updateCanvasDimensions: function (I, g, B) {
                                        g && B
                                            ? ((I.widthNative = g), (I.heightNative = B))
                                            : ((g = I.widthNative), (B = I.heightNative));
                                        var Q = g,
                                            C = B;
                                        if (
                                            (A.forcedAspectRatio &&
                                                A.forcedAspectRatio > 0 &&
                                                (Q / C < A.forcedAspectRatio
                                                    ? (Q = Math.round(C * A.forcedAspectRatio))
                                                    : (C = Math.round(Q / A.forcedAspectRatio))),
                                            (document.fullscreenElement ||
                                                document.mozFullScreenElement ||
                                                document.msFullscreenElement ||
                                                document.webkitFullscreenElement ||
                                                document.webkitCurrentFullScreenElement) ===
                                                I.parentNode && "undefined" != typeof screen)
                                        ) {
                                            var E = Math.min(screen.width / Q, screen.height / C);
                                            (Q = Math.round(Q * E)), (C = Math.round(C * E));
                                        }
                                        DA.resizeCanvas
                                            ? (I.width != Q && (I.width = Q),
                                              I.height != C && (I.height = C),
                                              void 0 !== I.style &&
                                                  (I.style.removeProperty("width"),
                                                  I.style.removeProperty("height")))
                                            : (I.width != g && (I.width = g),
                                              I.height != B && (I.height = B),
                                              void 0 !== I.style &&
                                                  (Q != g || C != B
                                                      ? (I.style.setProperty(
                                                            "width",
                                                            Q + "px",
                                                            "important"
                                                        ),
                                                        I.style.setProperty(
                                                            "height",
                                                            C + "px",
                                                            "important"
                                                        ))
                                                      : (I.style.removeProperty("width"),
                                                        I.style.removeProperty("height"))));
                                    },
                                };
                                function GA(I) {
                                    var g = hA.surfaces[I];
                                    if ((g.locked++, g.locked > 1)) return 0;
                                    if (
                                        (g.buffer ||
                                            ((g.buffer = HA(g.width * g.height * 4)),
                                            (N[(I + 20) >> 2] = g.buffer)),
                                        (N[(I + 20) >> 2] = g.buffer),
                                        I == hA.screen && A.screenIsReadOnly && g.image)
                                    )
                                        return 0;
                                    if (hA.defaults.discardOnLock) {
                                        if (
                                            (g.image ||
                                                (g.image = g.ctx.createImageData(
                                                    g.width,
                                                    g.height
                                                )),
                                            !hA.defaults.opaqueFrontBuffer)
                                        )
                                            return;
                                    } else g.image = g.ctx.getImageData(0, 0, g.width, g.height);
                                    if (I == hA.screen && hA.defaults.opaqueFrontBuffer)
                                        for (
                                            var B = g.image.data, Q = B.length, C = 0;
                                            C < Q / 4;
                                            C++
                                        )
                                            B[4 * C + 3] = 255;
                                    if (hA.defaults.copyOnLock && !hA.defaults.discardOnLock) {
                                        if (g.isFlagSet(2097152))
                                            throw (
                                                "CopyOnLock is not supported for SDL_LockSurface with SDL_HWPALETTE flag set" +
                                                new Error().stack
                                            );
                                        f.set(g.image.data, g.buffer);
                                    }
                                    return 0;
                                }
                                var hA = {
                                        defaults: {
                                            width: 320,
                                            height: 200,
                                            copyOnLock: !0,
                                            discardOnLock: !1,
                                            opaqueFrontBuffer: !0,
                                        },
                                        version: null,
                                        surfaces: {},
                                        canvasPool: [],
                                        events: [],
                                        fonts: [null],
                                        audios: [null],
                                        rwops: [null],
                                        music: { audio: null, volume: 1 },
                                        mixerFrequency: 22050,
                                        mixerFormat: 32784,
                                        mixerNumChannels: 2,
                                        mixerChunkSize: 1024,
                                        channelMinimumNumber: 0,
                                        GL: !1,
                                        glAttributes: {
                                            0: 3,
                                            1: 3,
                                            2: 2,
                                            3: 0,
                                            4: 0,
                                            5: 1,
                                            6: 16,
                                            7: 0,
                                            8: 0,
                                            9: 0,
                                            10: 0,
                                            11: 0,
                                            12: 0,
                                            13: 0,
                                            14: 0,
                                            15: 1,
                                            16: 0,
                                            17: 0,
                                            18: 0,
                                        },
                                        keyboardState: null,
                                        keyboardMap: {},
                                        canRequestFullscreen: !1,
                                        isRequestingFullscreen: !1,
                                        textInput: !1,
                                        startTime: null,
                                        initFlags: 0,
                                        buttonState: 0,
                                        modState: 0,
                                        DOMButtons: [0, 0, 0],
                                        DOMEventToSDLEvent: {},
                                        TOUCH_DEFAULT_ID: 0,
                                        eventHandler: null,
                                        eventHandlerContext: null,
                                        eventHandlerTemp: 0,
                                        keyCodes: {
                                            16: 1249,
                                            17: 1248,
                                            18: 1250,
                                            20: 1081,
                                            33: 1099,
                                            34: 1102,
                                            35: 1101,
                                            36: 1098,
                                            37: 1104,
                                            38: 1106,
                                            39: 1103,
                                            40: 1105,
                                            44: 316,
                                            45: 1097,
                                            46: 127,
                                            91: 1251,
                                            93: 1125,
                                            96: 1122,
                                            97: 1113,
                                            98: 1114,
                                            99: 1115,
                                            100: 1116,
                                            101: 1117,
                                            102: 1118,
                                            103: 1119,
                                            104: 1120,
                                            105: 1121,
                                            106: 1109,
                                            107: 1111,
                                            109: 1110,
                                            110: 1123,
                                            111: 1108,
                                            112: 1082,
                                            113: 1083,
                                            114: 1084,
                                            115: 1085,
                                            116: 1086,
                                            117: 1087,
                                            118: 1088,
                                            119: 1089,
                                            120: 1090,
                                            121: 1091,
                                            122: 1092,
                                            123: 1093,
                                            124: 1128,
                                            125: 1129,
                                            126: 1130,
                                            127: 1131,
                                            128: 1132,
                                            129: 1133,
                                            130: 1134,
                                            131: 1135,
                                            132: 1136,
                                            133: 1137,
                                            134: 1138,
                                            135: 1139,
                                            144: 1107,
                                            160: 94,
                                            161: 33,
                                            162: 34,
                                            163: 35,
                                            164: 36,
                                            165: 37,
                                            166: 38,
                                            167: 95,
                                            168: 40,
                                            169: 41,
                                            170: 42,
                                            171: 43,
                                            172: 124,
                                            173: 45,
                                            174: 123,
                                            175: 125,
                                            176: 126,
                                            181: 127,
                                            182: 129,
                                            183: 128,
                                            188: 44,
                                            190: 46,
                                            191: 47,
                                            192: 96,
                                            219: 91,
                                            220: 92,
                                            221: 93,
                                            222: 39,
                                            224: 1251,
                                        },
                                        scanCodes: {
                                            8: 42,
                                            9: 43,
                                            13: 40,
                                            27: 41,
                                            32: 44,
                                            35: 204,
                                            39: 53,
                                            44: 54,
                                            46: 55,
                                            47: 56,
                                            48: 39,
                                            49: 30,
                                            50: 31,
                                            51: 32,
                                            52: 33,
                                            53: 34,
                                            54: 35,
                                            55: 36,
                                            56: 37,
                                            57: 38,
                                            58: 203,
                                            59: 51,
                                            61: 46,
                                            91: 47,
                                            92: 49,
                                            93: 48,
                                            96: 52,
                                            97: 4,
                                            98: 5,
                                            99: 6,
                                            100: 7,
                                            101: 8,
                                            102: 9,
                                            103: 10,
                                            104: 11,
                                            105: 12,
                                            106: 13,
                                            107: 14,
                                            108: 15,
                                            109: 16,
                                            110: 17,
                                            111: 18,
                                            112: 19,
                                            113: 20,
                                            114: 21,
                                            115: 22,
                                            116: 23,
                                            117: 24,
                                            118: 25,
                                            119: 26,
                                            120: 27,
                                            121: 28,
                                            122: 29,
                                            127: 76,
                                            305: 224,
                                            308: 226,
                                            316: 70,
                                        },
                                        loadRect: function (A) {
                                            return {
                                                x: N[(A + 0) >> 2],
                                                y: N[(A + 4) >> 2],
                                                w: N[(A + 8) >> 2],
                                                h: N[(A + 12) >> 2],
                                            };
                                        },
                                        updateRect: function (A, I) {
                                            (N[A >> 2] = I.x),
                                                (N[(A + 4) >> 2] = I.y),
                                                (N[(A + 8) >> 2] = I.w),
                                                (N[(A + 12) >> 2] = I.h);
                                        },
                                        intersectionOfRects: function (A, I) {
                                            var g = Math.max(A.x, I.x),
                                                B = Math.max(A.y, I.y),
                                                Q = Math.min(A.x + A.w, I.x + I.w),
                                                C = Math.min(A.y + A.h, I.y + I.h);
                                            return {
                                                x: g,
                                                y: B,
                                                w: Math.max(g, Q) - g,
                                                h: Math.max(B, C) - B,
                                            };
                                        },
                                        checkPixelFormat: function (A) {},
                                        loadColorToCSSRGB: function (A) {
                                            var I = N[A >> 2];
                                            return (
                                                "rgb(" +
                                                (255 & I) +
                                                "," +
                                                ((I >> 8) & 255) +
                                                "," +
                                                ((I >> 16) & 255) +
                                                ")"
                                            );
                                        },
                                        loadColorToCSSRGBA: function (A) {
                                            var I = N[A >> 2];
                                            return (
                                                "rgba(" +
                                                (255 & I) +
                                                "," +
                                                ((I >> 8) & 255) +
                                                "," +
                                                ((I >> 16) & 255) +
                                                "," +
                                                ((I >> 24) & 255) / 255 +
                                                ")"
                                            );
                                        },
                                        translateColorToCSSRGBA: function (A) {
                                            return (
                                                "rgba(" +
                                                (255 & A) +
                                                "," +
                                                ((A >> 8) & 255) +
                                                "," +
                                                ((A >> 16) & 255) +
                                                "," +
                                                (A >>> 24) / 255 +
                                                ")"
                                            );
                                        },
                                        translateRGBAToCSSRGBA: function (A, I, g, B) {
                                            return (
                                                "rgba(" +
                                                (255 & A) +
                                                "," +
                                                (255 & I) +
                                                "," +
                                                (255 & g) +
                                                "," +
                                                (255 & B) / 255 +
                                                ")"
                                            );
                                        },
                                        translateRGBAToColor: function (A, I, g, B) {
                                            return A | (I << 8) | (g << 16) | (B << 24);
                                        },
                                        makeSurface: function (I, g, B, Q, C, E, i, o, e) {
                                            var t,
                                                a = 1 & (B = B || 0),
                                                n = 2097152 & B,
                                                r = 67108864 & B,
                                                s = HA(60),
                                                D = HA(44),
                                                G = n ? 1 : 4,
                                                h = 0;
                                            a || r || (h = HA(I * g * 4)),
                                                (N[s >> 2] = B),
                                                (N[(s + 4) >> 2] = D),
                                                (N[(s + 8) >> 2] = I),
                                                (N[(s + 12) >> 2] = g),
                                                (N[(s + 16) >> 2] = I * G),
                                                (N[(s + 20) >> 2] = h),
                                                (N[(s + 36) >> 2] = 0),
                                                (N[(s + 40) >> 2] = 0),
                                                (N[(s + 44) >> 2] = A.canvas.width),
                                                (N[(s + 48) >> 2] = A.canvas.height),
                                                (N[(s + 56) >> 2] = 1),
                                                (N[D >> 2] = -2042224636),
                                                (N[(D + 4) >> 2] = 0),
                                                (S[(D + 8) >> 0] = 8 * G),
                                                (S[(D + 9) >> 0] = G),
                                                (N[(D + 12) >> 2] = E || 255),
                                                (N[(D + 16) >> 2] = i || 65280),
                                                (N[(D + 20) >> 2] = o || 16711680),
                                                (N[(D + 24) >> 2] = e || 4278190080),
                                                (hA.GL = hA.GL || r),
                                                Q
                                                    ? (t = A.canvas)
                                                    : (((t =
                                                          hA.canvasPool.length > 0
                                                              ? hA.canvasPool.pop()
                                                              : document.createElement(
                                                                    "canvas"
                                                                )).width = I),
                                                      (t.height = g));
                                            var y = {
                                                    antialias:
                                                        0 != hA.glAttributes[13] &&
                                                        hA.glAttributes[14] > 1,
                                                    depth: hA.glAttributes[6] > 0,
                                                    stencil: hA.glAttributes[7] > 0,
                                                    alpha: hA.glAttributes[3] > 0,
                                                },
                                                c = DA.createContext(t, r, Q, y);
                                            return (
                                                (hA.surfaces[s] = {
                                                    width: I,
                                                    height: g,
                                                    canvas: t,
                                                    ctx: c,
                                                    surf: s,
                                                    buffer: h,
                                                    pixelFormat: D,
                                                    alpha: 255,
                                                    flags: B,
                                                    locked: 0,
                                                    usePageCanvas: Q,
                                                    source: C,
                                                    isFlagSet: function (A) {
                                                        return B & A;
                                                    },
                                                }),
                                                s
                                            );
                                        },
                                        copyIndexedColorData: function (I, g, B, Q, C) {
                                            if (I.colors) {
                                                var E = A.canvas.width,
                                                    i = A.canvas.height,
                                                    o = g || 0,
                                                    e = B || 0,
                                                    t = (Q || E - o) + o,
                                                    a = (C || i - e) + e,
                                                    n = I.buffer;
                                                I.image.data32 ||
                                                    (I.image.data32 = new Uint32Array(
                                                        I.image.data.buffer
                                                    ));
                                                for (
                                                    var r = I.image.data32, s = I.colors32, D = e;
                                                    D < a;
                                                    ++D
                                                )
                                                    for (var G = D * E, h = o; h < t; ++h)
                                                        r[G + h] = s[f[(n + G + h) >> 0]];
                                            }
                                        },
                                        freeSurface: function (A) {
                                            var I = A + 56,
                                                g = N[I >> 2];
                                            if (g > 1) N[I >> 2] = g - 1;
                                            else {
                                                var B = hA.surfaces[A];
                                                !B.usePageCanvas &&
                                                    B.canvas &&
                                                    hA.canvasPool.push(B.canvas),
                                                    B.buffer && UA(B.buffer),
                                                    UA(B.pixelFormat),
                                                    UA(A),
                                                    (hA.surfaces[A] = null),
                                                    A === hA.screen && (hA.screen = null);
                                            }
                                        },
                                        blitSurface: function (A, I, g, B, Q) {
                                            var C,
                                                E,
                                                i,
                                                o,
                                                e = hA.surfaces[A],
                                                t = hA.surfaces[g];
                                            if (
                                                ((C = I
                                                    ? hA.loadRect(I)
                                                    : { x: 0, y: 0, w: e.width, h: e.height }),
                                                (E = B
                                                    ? hA.loadRect(B)
                                                    : { x: 0, y: 0, w: e.width, h: e.height }),
                                                t.clipRect)
                                            ) {
                                                var a = Q && 0 !== C.w ? C.w / E.w : 1,
                                                    n = Q && 0 !== C.h ? C.h / E.h : 1;
                                                (E = hA.intersectionOfRects(t.clipRect, E)),
                                                    (C.w = E.w * a),
                                                    (C.h = E.h * n),
                                                    B && hA.updateRect(B, E);
                                            }
                                            if (
                                                (Q
                                                    ? ((i = E.w), (o = E.h))
                                                    : ((i = C.w), (o = C.h)),
                                                0 === C.w || 0 === C.h || 0 === i || 0 === o)
                                            )
                                                return 0;
                                            var r = t.ctx.globalAlpha;
                                            return (
                                                (t.ctx.globalAlpha = e.alpha / 255),
                                                t.ctx.drawImage(
                                                    e.canvas,
                                                    C.x,
                                                    C.y,
                                                    C.w,
                                                    C.h,
                                                    E.x,
                                                    E.y,
                                                    i,
                                                    o
                                                ),
                                                (t.ctx.globalAlpha = r),
                                                g != hA.screen &&
                                                    (D(
                                                        "WARNING: copying canvas data to memory for compatibility"
                                                    ),
                                                    GA(g),
                                                    t.locked--),
                                                0
                                            );
                                        },
                                        downFingers: {},
                                        savedKeydown: null,
                                        receiveEvent: function (I) {
                                            function g() {
                                                for (var A in hA.keyboardMap)
                                                    hA.events.push({
                                                        type: "keyup",
                                                        keyCode: hA.keyboardMap[A],
                                                    });
                                            }
                                            switch (I.type) {
                                                case "touchstart":
                                                case "touchmove":
                                                    I.preventDefault();
                                                    var B = [];
                                                    if ("touchstart" === I.type)
                                                        for (var Q = 0; Q < I.touches.length; Q++) {
                                                            var C = I.touches[Q];
                                                            1 != hA.downFingers[C.identifier] &&
                                                                ((hA.downFingers[C.identifier] =
                                                                    !0),
                                                                B.push(C));
                                                        }
                                                    else B = I.touches;
                                                    var E = B[0];
                                                    if (E) {
                                                        var i;
                                                        switch (
                                                            ("touchstart" == I.type &&
                                                                (hA.DOMButtons[0] = 1),
                                                            I.type)
                                                        ) {
                                                            case "touchstart":
                                                                i = "mousedown";
                                                                break;
                                                            case "touchmove":
                                                                i = "mousemove";
                                                        }
                                                        var o = {
                                                            type: i,
                                                            button: 0,
                                                            pageX: E.clientX,
                                                            pageY: E.clientY,
                                                        };
                                                        hA.events.push(o);
                                                    }
                                                    for (Q = 0; Q < B.length; Q++)
                                                        (C = B[Q]),
                                                            hA.events.push({
                                                                type: I.type,
                                                                touch: C,
                                                            });
                                                    break;
                                                case "touchend":
                                                    for (
                                                        I.preventDefault(), Q = 0;
                                                        Q < I.changedTouches.length;
                                                        Q++
                                                    )
                                                        (C = I.changedTouches[Q]),
                                                            !0 === hA.downFingers[C.identifier] &&
                                                                delete hA.downFingers[C.identifier];
                                                    for (
                                                        o = {
                                                            type: "mouseup",
                                                            button: 0,
                                                            pageX: I.changedTouches[0].clientX,
                                                            pageY: I.changedTouches[0].clientY,
                                                        },
                                                            hA.DOMButtons[0] = 0,
                                                            hA.events.push(o),
                                                            Q = 0;
                                                        Q < I.changedTouches.length;
                                                        Q++
                                                    )
                                                        (C = I.changedTouches[Q]),
                                                            hA.events.push({
                                                                type: "touchend",
                                                                touch: C,
                                                            });
                                                    break;
                                                case "DOMMouseScroll":
                                                case "mousewheel":
                                                case "wheel":
                                                    var e = -DA.getMouseWheelDelta(I),
                                                        t =
                                                            (e =
                                                                0 == e
                                                                    ? 0
                                                                    : e > 0
                                                                      ? Math.max(e, 1)
                                                                      : Math.min(e, -1)) > 0
                                                                ? 3
                                                                : 4;
                                                    hA.events.push({
                                                        type: "mousedown",
                                                        button: t,
                                                        pageX: I.pageX,
                                                        pageY: I.pageY,
                                                    }),
                                                        hA.events.push({
                                                            type: "mouseup",
                                                            button: t,
                                                            pageX: I.pageX,
                                                            pageY: I.pageY,
                                                        }),
                                                        hA.events.push({
                                                            type: "wheel",
                                                            deltaX: 0,
                                                            deltaY: e,
                                                        }),
                                                        I.preventDefault();
                                                    break;
                                                case "mousemove":
                                                    if (
                                                        (1 === hA.DOMButtons[0] &&
                                                            hA.events.push({
                                                                type: "touchmove",
                                                                touch: {
                                                                    identifier: 0,
                                                                    deviceID: -1,
                                                                    pageX: I.pageX,
                                                                    pageY: I.pageY,
                                                                },
                                                            }),
                                                        DA.pointerLock &&
                                                            ("mozMovementX" in I &&
                                                                ((I.movementX = I.mozMovementX),
                                                                (I.movementY = I.mozMovementY)),
                                                            0 == I.movementX && 0 == I.movementY))
                                                    )
                                                        return void I.preventDefault();
                                                case "keydown":
                                                case "keyup":
                                                case "keypress":
                                                case "mousedown":
                                                case "mouseup":
                                                    if (
                                                        (("keydown" === I.type &&
                                                            (hA.unicode || hA.textInput) &&
                                                            8 !== I.keyCode &&
                                                            9 !== I.keyCode) ||
                                                            I.preventDefault(),
                                                        "mousedown" == I.type)
                                                    )
                                                        (hA.DOMButtons[I.button] = 1),
                                                            hA.events.push({
                                                                type: "touchstart",
                                                                touch: {
                                                                    identifier: 0,
                                                                    deviceID: -1,
                                                                    pageX: I.pageX,
                                                                    pageY: I.pageY,
                                                                },
                                                            });
                                                    else if ("mouseup" == I.type) {
                                                        if (!hA.DOMButtons[I.button]) return;
                                                        hA.events.push({
                                                            type: "touchend",
                                                            touch: {
                                                                identifier: 0,
                                                                deviceID: -1,
                                                                pageX: I.pageX,
                                                                pageY: I.pageY,
                                                            },
                                                        }),
                                                            (hA.DOMButtons[I.button] = 0);
                                                    }
                                                    "keydown" === I.type || "mousedown" === I.type
                                                        ? (hA.canRequestFullscreen = !0)
                                                        : ("keyup" !== I.type &&
                                                              "mouseup" !== I.type) ||
                                                          (hA.isRequestingFullscreen &&
                                                              (A.requestFullscreen(!0, !0),
                                                              (hA.isRequestingFullscreen = !1)),
                                                          (hA.canRequestFullscreen = !1)),
                                                        "keypress" === I.type && hA.savedKeydown
                                                            ? ((hA.savedKeydown.keypressCharCode =
                                                                  I.charCode),
                                                              (hA.savedKeydown = null))
                                                            : "keydown" === I.type &&
                                                              (hA.savedKeydown = I),
                                                        ("keypress" !== I.type || hA.textInput) &&
                                                            hA.events.push(I);
                                                    break;
                                                case "mouseout":
                                                    for (Q = 0; Q < 3; Q++)
                                                        hA.DOMButtons[Q] &&
                                                            (hA.events.push({
                                                                type: "mouseup",
                                                                button: Q,
                                                                pageX: I.pageX,
                                                                pageY: I.pageY,
                                                            }),
                                                            (hA.DOMButtons[Q] = 0));
                                                    I.preventDefault();
                                                    break;
                                                case "focus":
                                                    hA.events.push(I), I.preventDefault();
                                                    break;
                                                case "blur":
                                                    hA.events.push(I), g(), I.preventDefault();
                                                    break;
                                                case "visibilitychange":
                                                    hA.events.push({
                                                        type: "visibilitychange",
                                                        visible: !document.hidden,
                                                    }),
                                                        g(),
                                                        I.preventDefault();
                                                    break;
                                                case "unload":
                                                    return void (
                                                        DA.mainLoop.runner &&
                                                        (hA.events.push(I), DA.mainLoop.runner())
                                                    );
                                                case "resize":
                                                    hA.events.push(I),
                                                        I.preventDefault && I.preventDefault();
                                            }
                                            hA.events.length >= 1e4 &&
                                                (s("SDL event queue full, dropping events"),
                                                (hA.events = hA.events.slice(0, 1e4))),
                                                hA.flushEventsToHandler();
                                        },
                                        lookupKeyCodeForEvent: function (A) {
                                            var I = A.keyCode;
                                            return (
                                                I >= 65 && I <= 90
                                                    ? (I += 32)
                                                    : ((I = hA.keyCodes[A.keyCode] || A.keyCode),
                                                      2 === A.location &&
                                                          I >= 1248 &&
                                                          I <= 1251 &&
                                                          (I += 4)),
                                                I
                                            );
                                        },
                                        handleEvent: function (A) {
                                            if (!A.handled)
                                                switch (((A.handled = !0), A.type)) {
                                                    case "touchstart":
                                                    case "touchend":
                                                    case "touchmove":
                                                        DA.calculateMouseEvent(A);
                                                        break;
                                                    case "keydown":
                                                    case "keyup":
                                                        var I = "keydown" === A.type,
                                                            g = hA.lookupKeyCodeForEvent(A);
                                                        (S[(hA.keyboardState + g) >> 0] = I),
                                                            (hA.modState =
                                                                (S[(hA.keyboardState + 1248) >> 0]
                                                                    ? 64
                                                                    : 0) |
                                                                (S[(hA.keyboardState + 1249) >> 0]
                                                                    ? 1
                                                                    : 0) |
                                                                (S[(hA.keyboardState + 1250) >> 0]
                                                                    ? 256
                                                                    : 0) |
                                                                (S[(hA.keyboardState + 1252) >> 0]
                                                                    ? 128
                                                                    : 0) |
                                                                (S[(hA.keyboardState + 1253) >> 0]
                                                                    ? 2
                                                                    : 0) |
                                                                (S[(hA.keyboardState + 1254) >> 0]
                                                                    ? 512
                                                                    : 0)),
                                                            I
                                                                ? (hA.keyboardMap[g] = A.keyCode)
                                                                : delete hA.keyboardMap[g];
                                                        break;
                                                    case "mousedown":
                                                    case "mouseup":
                                                        "mousedown" == A.type
                                                            ? (hA.buttonState |= 1 << A.button)
                                                            : "mouseup" == A.type &&
                                                              (hA.buttonState &= ~(1 << A.button));
                                                    case "mousemove":
                                                        DA.calculateMouseEvent(A);
                                                }
                                        },
                                        flushEventsToHandler: function () {
                                            if (hA.eventHandler)
                                                for (; hA.pollEvent(hA.eventHandlerTemp); )
                                                    BA(hA.eventHandler)(
                                                        hA.eventHandlerContext,
                                                        hA.eventHandlerTemp
                                                    );
                                        },
                                        pollEvent: function (A) {
                                            if (
                                                (512 & hA.initFlags &&
                                                    hA.joystickEventState &&
                                                    hA.queryJoysticks(),
                                                A)
                                            ) {
                                                for (; hA.events.length > 0; )
                                                    if (!1 !== hA.makeCEvent(hA.events.shift(), A))
                                                        return 1;
                                                return 0;
                                            }
                                            return hA.events.length > 0;
                                        },
                                        makeCEvent: function (I, g) {
                                            if ("number" == typeof I)
                                                return YA(g, I, 28), void UA(I);
                                            switch ((hA.handleEvent(I), I.type)) {
                                                case "keydown":
                                                case "keyup":
                                                    var B,
                                                        Q = "keydown" === I.type,
                                                        C = hA.lookupKeyCodeForEvent(I);
                                                    (B =
                                                        C >= 1024
                                                            ? C - 1024
                                                            : hA.scanCodes[C] || C),
                                                        (N[g >> 2] = hA.DOMEventToSDLEvent[I.type]),
                                                        (S[(g + 8) >> 0] = Q ? 1 : 0),
                                                        (S[(g + 9) >> 0] = 0),
                                                        (N[(g + 12) >> 2] = B),
                                                        (N[(g + 16) >> 2] = C),
                                                        (k[(g + 20) >> 1] = hA.modState),
                                                        (N[(g + 24) >> 2] =
                                                            I.keypressCharCode || C);
                                                    break;
                                                case "keypress":
                                                    N[g >> 2] = hA.DOMEventToSDLEvent[I.type];
                                                    for (
                                                        var E = fA(String.fromCharCode(I.charCode)),
                                                            i = 0;
                                                        i < E.length;
                                                        ++i
                                                    )
                                                        S[(g + (8 + i)) >> 0] = E[i];
                                                    break;
                                                case "mousedown":
                                                case "mouseup":
                                                case "mousemove":
                                                    "mousemove" != I.type
                                                        ? ((Q = "mousedown" === I.type),
                                                          (N[g >> 2] =
                                                              hA.DOMEventToSDLEvent[I.type]),
                                                          (N[(g + 4) >> 2] = 0),
                                                          (N[(g + 8) >> 2] = 0),
                                                          (N[(g + 12) >> 2] = 0),
                                                          (S[(g + 16) >> 0] = I.button + 1),
                                                          (S[(g + 17) >> 0] = Q ? 1 : 0),
                                                          (N[(g + 20) >> 2] = DA.mouseX),
                                                          (N[(g + 24) >> 2] = DA.mouseY))
                                                        : ((N[g >> 2] =
                                                              hA.DOMEventToSDLEvent[I.type]),
                                                          (N[(g + 4) >> 2] = 0),
                                                          (N[(g + 8) >> 2] = 0),
                                                          (N[(g + 12) >> 2] = 0),
                                                          (N[(g + 16) >> 2] = hA.buttonState),
                                                          (N[(g + 20) >> 2] = DA.mouseX),
                                                          (N[(g + 24) >> 2] = DA.mouseY),
                                                          (N[(g + 28) >> 2] = DA.mouseMovementX),
                                                          (N[(g + 32) >> 2] = DA.mouseMovementY));
                                                    break;
                                                case "wheel":
                                                    (N[g >> 2] = hA.DOMEventToSDLEvent[I.type]),
                                                        (N[(g + 16) >> 2] = I.deltaX),
                                                        (N[(g + 20) >> 2] = I.deltaY);
                                                    break;
                                                case "touchstart":
                                                case "touchend":
                                                case "touchmove":
                                                    var o = I.touch;
                                                    if (!DA.touches[o.identifier]) break;
                                                    var e = A.canvas.width,
                                                        t = A.canvas.height,
                                                        a = DA.touches[o.identifier].x / e,
                                                        n = DA.touches[o.identifier].y / t,
                                                        r = a - DA.lastTouches[o.identifier].x / e,
                                                        s = n - DA.lastTouches[o.identifier].y / t;
                                                    if (
                                                        (void 0 === o.deviceID &&
                                                            (o.deviceID = hA.TOUCH_DEFAULT_ID),
                                                        0 === r &&
                                                            0 === s &&
                                                            "touchmove" === I.type)
                                                    )
                                                        return !1;
                                                    (N[g >> 2] = hA.DOMEventToSDLEvent[I.type]),
                                                        (N[(g + 4) >> 2] =
                                                            (Date.now() - hA.startTime) | 0),
                                                        (j = [
                                                            o.deviceID >>> 0,
                                                            ((P = o.deviceID),
                                                            +Math.abs(P) >= 1
                                                                ? P > 0
                                                                    ? (0 |
                                                                          Math.min(
                                                                              +Math.floor(
                                                                                  P / 4294967296
                                                                              ),
                                                                              4294967295
                                                                          )) >>>
                                                                      0
                                                                    : ~~+Math.ceil(
                                                                          (P - +(~~P >>> 0)) /
                                                                              4294967296
                                                                      ) >>> 0
                                                                : 0),
                                                        ]),
                                                        (N[(g + 8) >> 2] = j[0]),
                                                        (N[(g + 12) >> 2] = j[1]),
                                                        (j = [
                                                            o.identifier >>> 0,
                                                            ((P = o.identifier),
                                                            +Math.abs(P) >= 1
                                                                ? P > 0
                                                                    ? (0 |
                                                                          Math.min(
                                                                              +Math.floor(
                                                                                  P / 4294967296
                                                                              ),
                                                                              4294967295
                                                                          )) >>>
                                                                      0
                                                                    : ~~+Math.ceil(
                                                                          (P - +(~~P >>> 0)) /
                                                                              4294967296
                                                                      ) >>> 0
                                                                : 0),
                                                        ]),
                                                        (N[(g + 16) >> 2] = j[0]),
                                                        (N[(g + 20) >> 2] = j[1]),
                                                        (u[(g + 24) >> 2] = a),
                                                        (u[(g + 28) >> 2] = n),
                                                        (u[(g + 32) >> 2] = r),
                                                        (u[(g + 36) >> 2] = s),
                                                        void 0 !== o.force
                                                            ? (u[(g + 40) >> 2] = o.force)
                                                            : (u[(g + 40) >> 2] =
                                                                  "touchend" == I.type ? 0 : 1);
                                                    break;
                                                case "unload":
                                                    N[g >> 2] = hA.DOMEventToSDLEvent[I.type];
                                                    break;
                                                case "resize":
                                                    (N[g >> 2] = hA.DOMEventToSDLEvent[I.type]),
                                                        (N[(g + 4) >> 2] = I.w),
                                                        (N[(g + 8) >> 2] = I.h);
                                                    break;
                                                case "joystick_button_up":
                                                case "joystick_button_down":
                                                    var D = "joystick_button_up" === I.type ? 0 : 1;
                                                    (N[g >> 2] = hA.DOMEventToSDLEvent[I.type]),
                                                        (S[(g + 4) >> 0] = I.index),
                                                        (S[(g + 5) >> 0] = I.button),
                                                        (S[(g + 6) >> 0] = D);
                                                    break;
                                                case "joystick_axis_motion":
                                                    (N[g >> 2] = hA.DOMEventToSDLEvent[I.type]),
                                                        (S[(g + 4) >> 0] = I.index),
                                                        (S[(g + 5) >> 0] = I.axis),
                                                        (N[(g + 8) >> 2] =
                                                            hA.joystickAxisValueConversion(
                                                                I.value
                                                            ));
                                                    break;
                                                case "focus":
                                                    (N[g >> 2] = hA.DOMEventToSDLEvent[I.type]),
                                                        (N[(g + 4) >> 2] = 0),
                                                        (S[(g + 8) >> 0] = 12);
                                                    break;
                                                case "blur":
                                                    (N[g >> 2] = hA.DOMEventToSDLEvent[I.type]),
                                                        (N[(g + 4) >> 2] = 0),
                                                        (S[(g + 8) >> 0] = 13);
                                                    break;
                                                case "visibilitychange":
                                                    var G = I.visible ? 1 : 2;
                                                    (N[g >> 2] = hA.DOMEventToSDLEvent[I.type]),
                                                        (N[(g + 4) >> 2] = 0),
                                                        (S[(g + 8) >> 0] = G);
                                                    break;
                                                default:
                                                    throw "Unhandled SDL event: " + I.type;
                                            }
                                        },
                                        makeFontString: function (A, I) {
                                            return (
                                                "'" != I.charAt(0) &&
                                                    '"' != I.charAt(0) &&
                                                    (I = '"' + I + '"'),
                                                A + "px " + I + ", serif"
                                            );
                                        },
                                        estimateTextWidth: function (A, I) {
                                            var g = A.size,
                                                B = hA.makeFontString(g, A.name),
                                                Q = hA.ttfContext;
                                            return (Q.font = B), 0 | Q.measureText(I).width;
                                        },
                                        allocateChannels: function (A) {
                                            if (
                                                !(hA.numChannels && hA.numChannels >= A && 0 != A)
                                            ) {
                                                (hA.numChannels = A), (hA.channels = []);
                                                for (var I = 0; I < A; I++)
                                                    hA.channels[I] = { audio: null, volume: 1 };
                                            }
                                        },
                                        setGetVolume: function (A, I) {
                                            if (!A) return 0;
                                            var g = 128 * A.volume;
                                            if (
                                                -1 != I &&
                                                ((A.volume = Math.min(Math.max(I, 0), 128) / 128),
                                                A.audio)
                                            )
                                                try {
                                                    (A.audio.volume = A.volume),
                                                        A.audio.webAudioGainNode &&
                                                            (A.audio.webAudioGainNode.gain.value =
                                                                A.volume);
                                                } catch (A) {
                                                    s(
                                                        "setGetVolume failed to set audio volume: " +
                                                            A
                                                    );
                                                }
                                            return g;
                                        },
                                        setPannerPosition: function (A, I, g, B) {
                                            A &&
                                                A.audio &&
                                                A.audio.webAudioPannerNode &&
                                                A.audio.webAudioPannerNode.setPosition(I, g, B);
                                        },
                                        playWebAudio: function (A) {
                                            if (A && !A.webAudioNode && hA.webAudioAvailable())
                                                try {
                                                    var I = A.resource.webAudio;
                                                    if (((A.paused = !1), !I.decodedBuffer))
                                                        return (
                                                            void 0 === I.onDecodeComplete &&
                                                                V(
                                                                    "Cannot play back audio object that was not loaded"
                                                                ),
                                                            void I.onDecodeComplete.push(
                                                                function () {
                                                                    A.paused || hA.playWebAudio(A);
                                                                }
                                                            )
                                                        );
                                                    (A.webAudioNode =
                                                        hA.audioContext.createBufferSource()),
                                                        (A.webAudioNode.buffer = I.decodedBuffer),
                                                        (A.webAudioNode.loop = A.loop),
                                                        (A.webAudioNode.onended = function () {
                                                            A.onended();
                                                        }),
                                                        (A.webAudioPannerNode =
                                                            hA.audioContext.createPanner()),
                                                        A.webAudioPannerNode.setPosition(
                                                            0,
                                                            0,
                                                            -0.5
                                                        ),
                                                        (A.webAudioPannerNode.panningModel =
                                                            "equalpower"),
                                                        (A.webAudioGainNode =
                                                            hA.audioContext.createGain()),
                                                        (A.webAudioGainNode.gain.value = A.volume),
                                                        A.webAudioNode.connect(
                                                            A.webAudioPannerNode
                                                        ),
                                                        A.webAudioPannerNode.connect(
                                                            A.webAudioGainNode
                                                        ),
                                                        A.webAudioGainNode.connect(
                                                            hA.audioContext.destination
                                                        ),
                                                        A.webAudioNode.start(0, A.currentPosition),
                                                        (A.startTime =
                                                            hA.audioContext.currentTime -
                                                            A.currentPosition);
                                                } catch (A) {
                                                    s("playWebAudio failed: " + A);
                                                }
                                        },
                                        pauseWebAudio: function (A) {
                                            if (A) {
                                                if (A.webAudioNode)
                                                    try {
                                                        (A.currentPosition =
                                                            (hA.audioContext.currentTime -
                                                                A.startTime) %
                                                            A.resource.webAudio.decodedBuffer
                                                                .duration),
                                                            (A.webAudioNode.onended = void 0),
                                                            A.webAudioNode.stop(0),
                                                            (A.webAudioNode = void 0);
                                                    } catch (A) {
                                                        s("pauseWebAudio failed: " + A);
                                                    }
                                                A.paused = !0;
                                            }
                                        },
                                        openAudioContext: function () {
                                            hA.audioContext ||
                                                ("undefined" != typeof AudioContext
                                                    ? (hA.audioContext = new AudioContext())
                                                    : "undefined" != typeof webkitAudioContext &&
                                                      (hA.audioContext = new webkitAudioContext()));
                                        },
                                        webAudioAvailable: function () {
                                            return !!hA.audioContext;
                                        },
                                        fillWebAudioBufferFromHeap: function (A, I, g) {
                                            for (
                                                var B = hA.audio, Q = B.channels, C = 0;
                                                C < Q;
                                                ++C
                                            ) {
                                                var E = g.getChannelData(C);
                                                if (E.length != I)
                                                    throw (
                                                        "Web Audio output buffer length mismatch! Destination size: " +
                                                        E.length +
                                                        " samples vs expected " +
                                                        I +
                                                        " samples!"
                                                    );
                                                if (32784 == B.format)
                                                    for (var i = 0; i < I; ++i)
                                                        E[i] =
                                                            k[(A + 2 * (i * Q + C)) >> 1] / 32768;
                                                else if (8 == B.format)
                                                    for (i = 0; i < I; ++i) {
                                                        var o = S[(A + (i * Q + C)) >> 0];
                                                        E[i] = (o >= 0 ? o - 128 : o + 128) / 128;
                                                    }
                                                else {
                                                    if (33056 != B.format)
                                                        throw (
                                                            "Invalid SDL audio format " +
                                                            B.format +
                                                            "!"
                                                        );
                                                    for (i = 0; i < I; ++i)
                                                        E[i] = u[(A + 4 * (i * Q + C)) >> 2];
                                                }
                                            }
                                        },
                                        debugSurface: function (A) {
                                            r(
                                                "dumping surface " +
                                                    [A.surf, A.source, A.width, A.height]
                                            );
                                            for (
                                                var I = A.ctx.getImageData(
                                                        0,
                                                        0,
                                                        A.width,
                                                        A.height
                                                    ).data,
                                                    g = Math.min(A.width, A.height),
                                                    B = 0;
                                                B < g;
                                                B++
                                            )
                                                r(
                                                    "   diagonal " +
                                                        B +
                                                        ":" +
                                                        [
                                                            I[B * A.width * 4 + 4 * B + 0],
                                                            I[B * A.width * 4 + 4 * B + 1],
                                                            I[B * A.width * 4 + 4 * B + 2],
                                                            I[B * A.width * 4 + 4 * B + 3],
                                                        ]
                                                );
                                        },
                                        joystickEventState: 1,
                                        lastJoystickState: {},
                                        joystickNamePool: {},
                                        recordJoystickState: function (A, I) {
                                            for (
                                                var g = new Array(I.buttons.length), B = 0;
                                                B < I.buttons.length;
                                                B++
                                            )
                                                g[B] = hA.getJoystickButtonState(I.buttons[B]);
                                            hA.lastJoystickState[A] = {
                                                buttons: g,
                                                axes: I.axes.slice(0),
                                                timestamp: I.timestamp,
                                                index: I.index,
                                                id: I.id,
                                            };
                                        },
                                        getJoystickButtonState: function (A) {
                                            return "object" == typeof A ? A.pressed : A > 0;
                                        },
                                        queryJoysticks: function () {
                                            for (var A in hA.lastJoystickState) {
                                                var I = hA.getGamepad(A - 1),
                                                    g = hA.lastJoystickState[A];
                                                if (void 0 === I) return;
                                                if (null === I) return;
                                                if (
                                                    "number" != typeof I.timestamp ||
                                                    I.timestamp != g.timestamp ||
                                                    !I.timestamp
                                                ) {
                                                    var B;
                                                    for (B = 0; B < I.buttons.length; B++) {
                                                        var Q = hA.getJoystickButtonState(
                                                            I.buttons[B]
                                                        );
                                                        Q !== g.buttons[B] &&
                                                            hA.events.push({
                                                                type: Q
                                                                    ? "joystick_button_down"
                                                                    : "joystick_button_up",
                                                                joystick: A,
                                                                index: A - 1,
                                                                button: B,
                                                            });
                                                    }
                                                    for (B = 0; B < I.axes.length; B++)
                                                        I.axes[B] !== g.axes[B] &&
                                                            hA.events.push({
                                                                type: "joystick_axis_motion",
                                                                joystick: A,
                                                                index: A - 1,
                                                                axis: B,
                                                                value: I.axes[B],
                                                            });
                                                    hA.recordJoystickState(A, I);
                                                }
                                            }
                                        },
                                        joystickAxisValueConversion: function (A) {
                                            return (
                                                (A = Math.min(1, Math.max(A, -1))),
                                                Math.ceil(32767.5 * (A + 1) - 32768)
                                            );
                                        },
                                        getGamepads: function () {
                                            var A =
                                                navigator.getGamepads ||
                                                navigator.webkitGamepads ||
                                                navigator.mozGamepads ||
                                                navigator.gamepads ||
                                                navigator.webkitGetGamepads;
                                            return void 0 !== A ? A.apply(navigator) : [];
                                        },
                                        getGamepad: function (A) {
                                            var I = hA.getGamepads();
                                            return I.length > A && A >= 0 ? I[A] : null;
                                        },
                                    },
                                    yA = {
                                        counter: 1,
                                        buffers: [],
                                        programs: [],
                                        framebuffers: [],
                                        renderbuffers: [],
                                        textures: [],
                                        shaders: [],
                                        vaos: [],
                                        contexts: [],
                                        offscreenCanvases: {},
                                        queries: [],
                                        stringCache: {},
                                        unpackAlignment: 4,
                                        recordError: function (A) {
                                            yA.lastError || (yA.lastError = A);
                                        },
                                        getNewId: function (A) {
                                            for (var I = yA.counter++, g = A.length; g < I; g++)
                                                A[g] = null;
                                            return I;
                                        },
                                        getSource: function (A, I, g, B) {
                                            for (var Q = "", C = 0; C < I; ++C) {
                                                var E = B ? N[(B + 4 * C) >> 2] : -1;
                                                Q += U(N[(g + 4 * C) >> 2], E < 0 ? void 0 : E);
                                            }
                                            return Q;
                                        },
                                        createContext: function (A, I) {
                                            A.getContextSafariWebGL2Fixed ||
                                                ((A.getContextSafariWebGL2Fixed = A.getContext),
                                                (A.getContext = function (I, g) {
                                                    var B = A.getContextSafariWebGL2Fixed(I, g);
                                                    return ("webgl" == I) ==
                                                        B instanceof WebGLRenderingContext
                                                        ? B
                                                        : null;
                                                }));
                                            var g = A.getContext("webgl", I);
                                            return g ? yA.registerContext(g, I) : 0;
                                        },
                                        registerContext: function (A, I) {
                                            var g = yA.getNewId(yA.contexts),
                                                B = {
                                                    handle: g,
                                                    attributes: I,
                                                    version: I.majorVersion,
                                                    GLctx: A,
                                                };
                                            return (
                                                A.canvas && (A.canvas.GLctxObject = B),
                                                (yA.contexts[g] = B),
                                                (void 0 === I.enableExtensionsByDefault ||
                                                    I.enableExtensionsByDefault) &&
                                                    yA.initExtensions(B),
                                                g
                                            );
                                        },
                                        makeContextCurrent: function (I) {
                                            return (
                                                (yA.currentContext = yA.contexts[I]),
                                                (A.ctx = wA =
                                                    yA.currentContext && yA.currentContext.GLctx),
                                                !(I && !wA)
                                            );
                                        },
                                        getContext: function (A) {
                                            return yA.contexts[A];
                                        },
                                        deleteContext: function (A) {
                                            yA.currentContext === yA.contexts[A] &&
                                                (yA.currentContext = null),
                                                "object" == typeof JSEvents &&
                                                    JSEvents.removeAllHandlersOnTarget(
                                                        yA.contexts[A].GLctx.canvas
                                                    ),
                                                yA.contexts[A] &&
                                                    yA.contexts[A].GLctx.canvas &&
                                                    (yA.contexts[A].GLctx.canvas.GLctxObject =
                                                        void 0),
                                                (yA.contexts[A] = null);
                                        },
                                        initExtensions: function (A) {
                                            if (
                                                (A || (A = yA.currentContext),
                                                !A.initExtensionsDone)
                                            ) {
                                                A.initExtensionsDone = !0;
                                                var I,
                                                    g = A.GLctx;
                                                !(function (A) {
                                                    var I =
                                                        A.getExtension("ANGLE_instanced_arrays");
                                                    I &&
                                                        ((A.vertexAttribDivisor = function (A, g) {
                                                            I.vertexAttribDivisorANGLE(A, g);
                                                        }),
                                                        (A.drawArraysInstanced = function (
                                                            A,
                                                            g,
                                                            B,
                                                            Q
                                                        ) {
                                                            I.drawArraysInstancedANGLE(A, g, B, Q);
                                                        }),
                                                        (A.drawElementsInstanced = function (
                                                            A,
                                                            g,
                                                            B,
                                                            Q,
                                                            C
                                                        ) {
                                                            I.drawElementsInstancedANGLE(
                                                                A,
                                                                g,
                                                                B,
                                                                Q,
                                                                C
                                                            );
                                                        }));
                                                })(g),
                                                    (function (A) {
                                                        var I =
                                                            A.getExtension(
                                                                "OES_vertex_array_object"
                                                            );
                                                        I &&
                                                            ((A.createVertexArray = function () {
                                                                return I.createVertexArrayOES();
                                                            }),
                                                            (A.deleteVertexArray = function (A) {
                                                                I.deleteVertexArrayOES(A);
                                                            }),
                                                            (A.bindVertexArray = function (A) {
                                                                I.bindVertexArrayOES(A);
                                                            }),
                                                            (A.isVertexArray = function (A) {
                                                                return I.isVertexArrayOES(A);
                                                            }));
                                                    })(g),
                                                    (function (A) {
                                                        var I =
                                                            A.getExtension("WEBGL_draw_buffers");
                                                        I &&
                                                            (A.drawBuffers = function (A, g) {
                                                                I.drawBuffersWEBGL(A, g);
                                                            });
                                                    })(g),
                                                    (g.disjointTimerQueryExt = g.getExtension(
                                                        "EXT_disjoint_timer_query"
                                                    )),
                                                    ((I = g).multiDrawWebgl =
                                                        I.getExtension("WEBGL_multi_draw")),
                                                    (g.getSupportedExtensions() || []).forEach(
                                                        function (A) {
                                                            A.includes("lose_context") ||
                                                                A.includes("debug") ||
                                                                g.getExtension(A);
                                                        }
                                                    );
                                            }
                                        },
                                    };
                                function cA(A) {
                                    try {
                                        return (
                                            G.grow((A - F.byteLength + 65535) >>> 16),
                                            J(G.buffer),
                                            1
                                        );
                                    } catch (A) {}
                                }
                                var wA,
                                    dA = {
                                        buffers: [null, [], []],
                                        printChar: function (A, I) {
                                            var g = dA.buffers[A];
                                            0 === I || 10 === I
                                                ? ((1 === A ? r : s)(H(g, 0)), (g.length = 0))
                                                : g.push(I);
                                        },
                                        varargs: void 0,
                                        get: function () {
                                            return (dA.varargs += 4), N[(dA.varargs - 4) >> 2];
                                        },
                                        getStr: function (A) {
                                            return U(A);
                                        },
                                        get64: function (A, I) {
                                            return A;
                                        },
                                    },
                                    FA = function (A, I, g, B) {
                                        A || (A = this),
                                            (this.parent = A),
                                            (this.mount = A.mount),
                                            (this.mounted = null),
                                            (this.id = tA.nextInode++),
                                            (this.name = I),
                                            (this.mode = g),
                                            (this.node_ops = {}),
                                            (this.stream_ops = {}),
                                            (this.rdev = B);
                                    };
                                Object.defineProperties(FA.prototype, {
                                    read: {
                                        get: function () {
                                            return 365 == (365 & this.mode);
                                        },
                                        set: function (A) {
                                            A ? (this.mode |= 365) : (this.mode &= -366);
                                        },
                                    },
                                    write: {
                                        get: function () {
                                            return 146 == (146 & this.mode);
                                        },
                                        set: function (A) {
                                            A ? (this.mode |= 146) : (this.mode &= -147);
                                        },
                                    },
                                    isFolder: {
                                        get: function () {
                                            return tA.isDir(this.mode);
                                        },
                                    },
                                    isDevice: {
                                        get: function () {
                                            return tA.isChrdev(this.mode);
                                        },
                                    },
                                }),
                                    (tA.FSNode = FA),
                                    tA.staticInit(),
                                    (A.requestFullscreen = function (A, I) {
                                        DA.requestFullscreen(A, I);
                                    }),
                                    (A.requestAnimationFrame = function (A) {
                                        DA.requestAnimationFrame(A);
                                    }),
                                    (A.setCanvasSize = function (A, I, g) {
                                        DA.setCanvasSize(A, I, g);
                                    }),
                                    (A.pauseMainLoop = function () {
                                        DA.mainLoop.pause();
                                    }),
                                    (A.resumeMainLoop = function () {
                                        DA.mainLoop.resume();
                                    }),
                                    (A.getUserMedia = function () {
                                        DA.getUserMedia();
                                    }),
                                    (A.createContext = function (A, I, g, B) {
                                        return DA.createContext(A, I, g, B);
                                    });
                                var SA = !1;
                                function fA(A, I, g) {
                                    var B = g > 0 ? g : l(A) + 1,
                                        Q = new Array(B),
                                        C = m(A, Q, 0, Q.length);
                                    return I && (Q.length = C), Q;
                                }
                                var kA =
                                    "function" == typeof atob
                                        ? atob
                                        : function (A) {
                                              var I,
                                                  g,
                                                  B,
                                                  Q,
                                                  C,
                                                  E,
                                                  i =
                                                      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
                                                  o = "",
                                                  e = 0;
                                              A = A.replace(/[^A-Za-z0-9\+\/\=]/g, "");
                                              do {
                                                  (I =
                                                      (i.indexOf(A.charAt(e++)) << 2) |
                                                      ((Q = i.indexOf(A.charAt(e++))) >> 4)),
                                                      (g =
                                                          ((15 & Q) << 4) |
                                                          ((C = i.indexOf(A.charAt(e++))) >> 2)),
                                                      (B =
                                                          ((3 & C) << 6) |
                                                          (E = i.indexOf(A.charAt(e++)))),
                                                      (o += String.fromCharCode(I)),
                                                      64 !== C && (o += String.fromCharCode(g)),
                                                      64 !== E && (o += String.fromCharCode(B));
                                              } while (e < A.length);
                                              return o;
                                          };
                                function NA(A) {
                                    if ($(A))
                                        return (function (A) {
                                            try {
                                                for (
                                                    var I = kA(A),
                                                        g = new Uint8Array(I.length),
                                                        B = 0;
                                                    B < I.length;
                                                    ++B
                                                )
                                                    g[B] = I.charCodeAt(B);
                                                return g;
                                            } catch (A) {
                                                throw new Error(
                                                    "Converting base64 string to bytes failed."
                                                );
                                            }
                                        })(A.slice(_.length));
                                }
                                var RA,
                                    uA = {
                                        i: function (A, I, g, B, Q, C, E, i) {
                                            return hA.makeSurface(
                                                I,
                                                g,
                                                A,
                                                !1,
                                                "CreateRGBSurface",
                                                Q,
                                                C,
                                                E,
                                                i
                                            );
                                        },
                                        e: function (A) {},
                                        a: function (A) {
                                            A && hA.freeSurface(A);
                                        },
                                        m: function (I) {
                                            if (
                                                ((hA.startTime = Date.now()),
                                                (hA.initFlags = I),
                                                !A.doNotCaptureKeyboard)
                                            ) {
                                                var g = A.keyboardListeningElement || document;
                                                g.addEventListener("keydown", hA.receiveEvent),
                                                    g.addEventListener("keyup", hA.receiveEvent),
                                                    g.addEventListener("keypress", hA.receiveEvent),
                                                    window.addEventListener(
                                                        "focus",
                                                        hA.receiveEvent
                                                    ),
                                                    window.addEventListener(
                                                        "blur",
                                                        hA.receiveEvent
                                                    ),
                                                    document.addEventListener(
                                                        "visibilitychange",
                                                        hA.receiveEvent
                                                    );
                                            }
                                            var B;
                                            return (
                                                window.addEventListener("unload", hA.receiveEvent),
                                                (hA.keyboardState = HA(65536)),
                                                (B = hA.keyboardState),
                                                65536,
                                                f.fill(0, B, B + 65536),
                                                (hA.DOMEventToSDLEvent.keydown = 768),
                                                (hA.DOMEventToSDLEvent.keyup = 769),
                                                (hA.DOMEventToSDLEvent.keypress = 771),
                                                (hA.DOMEventToSDLEvent.mousedown = 1025),
                                                (hA.DOMEventToSDLEvent.mouseup = 1026),
                                                (hA.DOMEventToSDLEvent.mousemove = 1024),
                                                (hA.DOMEventToSDLEvent.wheel = 1027),
                                                (hA.DOMEventToSDLEvent.touchstart = 1792),
                                                (hA.DOMEventToSDLEvent.touchend = 1793),
                                                (hA.DOMEventToSDLEvent.touchmove = 1794),
                                                (hA.DOMEventToSDLEvent.unload = 256),
                                                (hA.DOMEventToSDLEvent.resize = 28673),
                                                (hA.DOMEventToSDLEvent.visibilitychange = 512),
                                                (hA.DOMEventToSDLEvent.focus = 512),
                                                (hA.DOMEventToSDLEvent.blur = 512),
                                                (hA.DOMEventToSDLEvent.joystick_axis_motion = 1536),
                                                (hA.DOMEventToSDLEvent.joystick_button_down = 1539),
                                                (hA.DOMEventToSDLEvent.joystick_button_up = 1540),
                                                0
                                            );
                                        },
                                        h: GA,
                                        l: function (I, g, B, Q) {
                                            [
                                                "touchstart",
                                                "touchend",
                                                "touchmove",
                                                "mousedown",
                                                "mouseup",
                                                "mousemove",
                                                "DOMMouseScroll",
                                                "mousewheel",
                                                "wheel",
                                                "mouseout",
                                            ].forEach(function (I) {
                                                A.canvas.addEventListener(I, hA.receiveEvent, !0);
                                            });
                                            var C = A.canvas;
                                            return (
                                                0 == I && 0 == g && ((I = C.width), (g = C.height)),
                                                hA.addedResizeListener ||
                                                    ((hA.addedResizeListener = !0),
                                                    DA.resizeListeners.push(function (A, I) {
                                                        hA.settingVideoMode ||
                                                            hA.receiveEvent({
                                                                type: "resize",
                                                                w: A,
                                                                h: I,
                                                            });
                                                    })),
                                                (hA.settingVideoMode = !0),
                                                DA.setCanvasSize(I, g),
                                                (hA.settingVideoMode = !1),
                                                hA.screen &&
                                                    (hA.freeSurface(hA.screen), w(!hA.screen)),
                                                hA.GL && (Q |= 67108864),
                                                (hA.screen = hA.makeSurface(I, g, Q, !0, "screen")),
                                                hA.screen
                                            );
                                        },
                                        g: function (I) {
                                            w(!hA.GL);
                                            var g = hA.surfaces[I];
                                            if (g.locked && !(--g.locked > 0)) {
                                                if (g.isFlagSet(2097152))
                                                    hA.copyIndexedColorData(g);
                                                else if (g.colors)
                                                    for (
                                                        var B = A.canvas.width,
                                                            Q = A.canvas.height,
                                                            C = g.buffer,
                                                            E = ((a = g.image.data), g.colors),
                                                            i = 0;
                                                        i < Q;
                                                        i++
                                                    ) {
                                                        for (var o = i * B * 4, e = 0; e < B; e++) {
                                                            h = 4 * f[C++ >> 0];
                                                            var t = o + 4 * e;
                                                            (a[t] = E[h]),
                                                                (a[t + 1] = E[h + 1]),
                                                                (a[t + 2] = E[h + 2]);
                                                        }
                                                        C += 3 * B;
                                                    }
                                                else {
                                                    var a = g.image.data,
                                                        n = g.buffer;
                                                    w(n % 4 == 0, "Invalid buffer offset: " + n);
                                                    var r,
                                                        s = n >> 2,
                                                        D = 0,
                                                        G = I == hA.screen;
                                                    if (
                                                        "undefined" != typeof CanvasPixelArray &&
                                                        a instanceof CanvasPixelArray
                                                    )
                                                        for (r = a.length; D < r; ) {
                                                            var h = N[s];
                                                            (a[D] = 255 & h),
                                                                (a[D + 1] = (h >> 8) & 255),
                                                                (a[D + 2] = (h >> 16) & 255),
                                                                (a[D + 3] = G
                                                                    ? 255
                                                                    : (h >> 24) & 255),
                                                                s++,
                                                                (D += 4);
                                                        }
                                                    else {
                                                        var y = new Uint32Array(a.buffer);
                                                        if (G && hA.defaults.opaqueFrontBuffer) {
                                                            (r = y.length),
                                                                y.set(N.subarray(s, s + r));
                                                            var c = new Uint8Array(a.buffer),
                                                                d = 3,
                                                                F = d + 4 * r;
                                                            if (r % 8 == 0)
                                                                for (; d < F; )
                                                                    (c[d] = 255),
                                                                        (c[(d = (d + 4) | 0)] =
                                                                            255),
                                                                        (c[(d = (d + 4) | 0)] =
                                                                            255),
                                                                        (c[(d = (d + 4) | 0)] =
                                                                            255),
                                                                        (c[(d = (d + 4) | 0)] =
                                                                            255),
                                                                        (c[(d = (d + 4) | 0)] =
                                                                            255),
                                                                        (c[(d = (d + 4) | 0)] =
                                                                            255),
                                                                        (c[(d = (d + 4) | 0)] =
                                                                            255),
                                                                        (d = (d + 4) | 0);
                                                            else
                                                                for (; d < F; )
                                                                    (c[d] = 255), (d = (d + 4) | 0);
                                                        } else y.set(N.subarray(s, s + y.length));
                                                    }
                                                }
                                                g.ctx.putImageData(g.image, 0, 0);
                                            }
                                        },
                                        f: function (A, I, g, B) {
                                            return hA.blitSurface(A, I, g, B, !1);
                                        },
                                        d: function (A, I, g) {
                                            f.copyWithin(A, I, I + g);
                                        },
                                        k: function (A) {
                                            var I,
                                                g = f.length,
                                                B = 2147483648;
                                            if ((A >>>= 0) > B) return !1;
                                            for (var Q = 1; Q <= 4; Q *= 2) {
                                                var C = g * (1 + 0.2 / Q);
                                                if (
                                                    ((C = Math.min(C, A + 100663296)),
                                                    cA(
                                                        Math.min(
                                                            B,
                                                            ((I = Math.max(A, C)) % 65536 > 0 &&
                                                                (I += 65536 - (I % 65536)),
                                                            I)
                                                        )
                                                    ))
                                                )
                                                    return !0;
                                            }
                                            return !1;
                                        },
                                        c: function (A) {
                                            return 0;
                                        },
                                        j: function (A, I, g, B, Q) {},
                                        b: function (A, I, g, B) {
                                            for (var Q = 0, C = 0; C < g; C++) {
                                                var E = N[I >> 2],
                                                    i = N[(I + 4) >> 2];
                                                I += 8;
                                                for (var o = 0; o < i; o++)
                                                    dA.printChar(A, f[E + o]);
                                                Q += i;
                                            }
                                            return (N[B >> 2] = Q), 0;
                                        },
                                    },
                                    YA =
                                        ((function () {
                                            var I = { a: uA };
                                            function g(I, g) {
                                                var B,
                                                    Q = I.exports;
                                                (A.asm = Q),
                                                    J((G = A.asm.n).buffer),
                                                    (L = A.asm.r),
                                                    (B = A.asm.o),
                                                    p.unshift(B),
                                                    O();
                                            }
                                            function Q(A) {
                                                g(A.instance);
                                            }
                                            function C(A) {
                                                return (
                                                    n || "function" != typeof fetch
                                                        ? Promise.resolve().then(function () {
                                                              return AA(X);
                                                          })
                                                        : fetch(X, { credentials: "same-origin" })
                                                              .then(function (A) {
                                                                  if (!A.ok)
                                                                      throw (
                                                                          "failed to load wasm binary file at '" +
                                                                          X +
                                                                          "'"
                                                                      );
                                                                  return A.arrayBuffer();
                                                              })
                                                              .catch(function () {
                                                                  return AA(X);
                                                              })
                                                )
                                                    .then(function (A) {
                                                        return WebAssembly.instantiate(A, I);
                                                    })
                                                    .then(function (A) {
                                                        return A;
                                                    })
                                                    .then(A, function (A) {
                                                        s(
                                                            "failed to asynchronously prepare wasm: " +
                                                                A
                                                        ),
                                                            V(A);
                                                    });
                                            }
                                            if ((T(), A.instantiateWasm))
                                                try {
                                                    return A.instantiateWasm(I, g);
                                                } catch (A) {
                                                    return (
                                                        s(
                                                            "Module.instantiateWasm callback failed with error: " +
                                                                A
                                                        ),
                                                        !1
                                                    );
                                                }
                                            (n ||
                                            "function" != typeof WebAssembly.instantiateStreaming ||
                                            $(X) ||
                                            "function" != typeof fetch
                                                ? C(Q)
                                                : fetch(X, { credentials: "same-origin" }).then(
                                                      function (A) {
                                                          return WebAssembly.instantiateStreaming(
                                                              A,
                                                              I
                                                          ).then(Q, function (A) {
                                                              return (
                                                                  s(
                                                                      "wasm streaming compile failed: " +
                                                                          A
                                                                  ),
                                                                  s(
                                                                      "falling back to ArrayBuffer instantiation"
                                                                  ),
                                                                  C(Q)
                                                              );
                                                          });
                                                      }
                                                  )
                                            ).catch(B);
                                        })(),
                                        (A.___wasm_call_ctors = function () {
                                            return (A.___wasm_call_ctors = A.asm.o).apply(
                                                null,
                                                arguments
                                            );
                                        }),
                                        (A._WebPToSDL = function () {
                                            return (A._WebPToSDL = A.asm.p).apply(null, arguments);
                                        }),
                                        (A._memcpy = function () {
                                            return (YA = A._memcpy = A.asm.q).apply(
                                                null,
                                                arguments
                                            );
                                        })),
                                    HA = (A._malloc = function () {
                                        return (HA = A._malloc = A.asm.s).apply(null, arguments);
                                    }),
                                    UA = (A._free = function () {
                                        return (UA = A._free = A.asm.t).apply(null, arguments);
                                    }),
                                    mA = (A.stackSave = function () {
                                        return (mA = A.stackSave = A.asm.u).apply(null, arguments);
                                    }),
                                    lA = (A.stackRestore = function () {
                                        return (lA = A.stackRestore = A.asm.v).apply(
                                            null,
                                            arguments
                                        );
                                    }),
                                    JA = (A.stackAlloc = function () {
                                        return (JA = A.stackAlloc = A.asm.w).apply(null, arguments);
                                    });
                                function LA(A) {
                                    (this.name = "ExitStatus"),
                                        (this.message = "Program terminated with exit(" + A + ")"),
                                        (this.status = A);
                                }
                                function MA(I) {
                                    function B() {
                                        RA ||
                                            ((RA = !0),
                                            (A.calledRun = !0),
                                            c ||
                                                (A.noFSInit || tA.init.initialized || tA.init(),
                                                (tA.ignorePermissions = !1),
                                                oA.init(),
                                                IA(p),
                                                g(A),
                                                A.onRuntimeInitialized && A.onRuntimeInitialized(),
                                                (function () {
                                                    if (A.postRun)
                                                        for (
                                                            "function" == typeof A.postRun &&
                                                            (A.postRun = [A.postRun]);
                                                            A.postRun.length;

                                                        )
                                                            (I = A.postRun.shift()), K.unshift(I);
                                                    var I;
                                                    IA(K);
                                                })()));
                                    }
                                    (I = I || o),
                                        v > 0 ||
                                            ((function () {
                                                if (A.preRun)
                                                    for (
                                                        "function" == typeof A.preRun &&
                                                        (A.preRun = [A.preRun]);
                                                        A.preRun.length;

                                                    )
                                                        (I = A.preRun.shift()), M.unshift(I);
                                                var I;
                                                IA(M);
                                            })(),
                                            v > 0 ||
                                                (A.setStatus
                                                    ? (A.setStatus("Running..."),
                                                      setTimeout(function () {
                                                          setTimeout(function () {
                                                              A.setStatus("");
                                                          }, 1),
                                                              B();
                                                      }, 1))
                                                    : B()));
                                }
                                if (
                                    ((A.cwrap = function (A, I, g, B) {
                                        var Q = (g = g || []).every(function (A) {
                                            return "number" === A;
                                        });
                                        return "string" !== I && Q && !B
                                            ? d(A)
                                            : function () {
                                                  return (function (A, I, g, B, Q) {
                                                      var C = {
                                                              string: function (A) {
                                                                  var I = 0;
                                                                  if (null != A && 0 !== A) {
                                                                      var g = 1 + (A.length << 2);
                                                                      !(function (A, I, g) {
                                                                          m(A, f, I, g);
                                                                      })(A, (I = JA(g)), g);
                                                                  }
                                                                  return I;
                                                              },
                                                              array: function (A) {
                                                                  var I = JA(A.length);
                                                                  return (
                                                                      (function (A, I) {
                                                                          S.set(A, I);
                                                                      })(A, I),
                                                                      I
                                                                  );
                                                              },
                                                          },
                                                          E = d(A),
                                                          i = [],
                                                          o = 0;
                                                      if (B)
                                                          for (var e = 0; e < B.length; e++) {
                                                              var t = C[g[e]];
                                                              t
                                                                  ? (0 === o && (o = mA()),
                                                                    (i[e] = t(B[e])))
                                                                  : (i[e] = B[e]);
                                                          }
                                                      return (function (A) {
                                                          return (
                                                              0 !== o && lA(o),
                                                              (function (A) {
                                                                  return "string" === I
                                                                      ? U(A)
                                                                      : "boolean" === I
                                                                        ? Boolean(A)
                                                                        : A;
                                                              })(A)
                                                          );
                                                      })(E.apply(null, i));
                                                  })(A, I, g, arguments);
                                              };
                                    }),
                                    (W = function A() {
                                        RA || MA(), RA || (W = A);
                                    }),
                                    (A.run = MA),
                                    A.preInit)
                                )
                                    for (
                                        "function" == typeof A.preInit && (A.preInit = [A.preInit]);
                                        A.preInit.length > 0;

                                    )
                                        A.preInit.pop()();
                                return MA(), A.ready;
                            });
                    A.exports = g;
                },
            },
            I = {};
        function g(B) {
            var Q = I[B];
            if (void 0 !== Q) return Q.exports;
            var C = (I[B] = { exports: {} });
            return A[B](C, C.exports, g), C.exports;
        }
        (g.n = A => {
            var I = A && A.__esModule ? () => A.default : () => A;
            return g.d(I, { a: I }), I;
        }),
            (g.d = (A, I) => {
                for (var B in I)
                    g.o(I, B) &&
                        !g.o(A, B) &&
                        Object.defineProperty(A, B, { enumerable: !0, get: I[B] });
            }),
            (g.o = (A, I) => Object.prototype.hasOwnProperty.call(A, I)),
            (g.r = A => {
                "undefined" != typeof Symbol &&
                    Symbol.toStringTag &&
                    Object.defineProperty(A, Symbol.toStringTag, { value: "Module" }),
                    Object.defineProperty(A, "__esModule", { value: !0 });
            });
        var B = {};
        return (
            (() => {
                "use strict";
                g.r(B), g.d(B, { default: () => C, toCanvas: () => Q });
                var A = g(395),
                    I = g.n(A);
                function Q(A) {
                    return new Promise((g, B) => {
                        I()().then(I => {
                            try {
                                const Q = I.cwrap("WebPToSDL", "number", ["array", "number"]),
                                    C = new Uint8Array(A);
                                I.canvas = document.createElement("canvas");
                                const E = Q(C, C.length);
                                0 === E
                                    ? B(new Error("WebPToSDL failed with code " + E))
                                    : g(I.canvas);
                            } catch (A) {
                                B(A);
                            }
                        });
                    });
                }
                const C = Q;
            })(),
            B
        );
    })()
);
