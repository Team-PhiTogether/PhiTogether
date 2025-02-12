<script>
    import shared from "@utils/js/shared";
    export default {
        name: "calibrate",
        data() {
            return {
                audiobuffer: null,
                bfs: null,
                actxStartTime: null,
                calibrateActx: null,
                forceExit: null,
            };
        },
        mounted() {
            document.querySelector("#result1").innerText = "-";
            document.querySelector("#result2").innerText = "-";
            document.querySelector("#result3").innerText = "-";
            document.querySelector("#result4").innerText = "-";
            shared.game.msgHandler.sendMessage(this.$t("calibrate.loadFile"), "info", false);
            fetch("/src/core/calibrate.mp3")
                .then(t => t.arrayBuffer())
                .then(t => {
                    shared.game.msgHandler.sendMessage(this.$t("calibrate.loadSuccess"));
                    this.audiobuffer = t;
                })
                .catch(() => {
                    shared.game.msgHandler.sendMessage(this.$t("calibrate.loadError"), "error");
                });
        },
        beforeUnmount() {
            this.forceExit = true;
            if (this.bfs) this.bfs.stop();
            document.body.onkeydown = null;
        },
        methods: {
            caliOnce(evt) {
                if (evt) evt.preventDefault();
                const e = this.calibrateActx.currentTime - this.actxStartTime;
                var r = 1;
                e > 0 && e <= 2 && (r = 1),
                    e > 2 && e <= 4 && (r = 2),
                    e > 4 && e <= 6 && (r = 3),
                    e > 6 && e <= 8 && (r = 4);
                const cur = document.querySelector("#result" + r);
                cur && (cur.innerText = Math.round(1e3 * (e - (2 * r - 1))));
            },
            caliStart() {
                document.getElementById("startBtn").blur();
                (this.calibrateActx = null),
                    (window.oggCompatible = !!new Audio().canPlayType("audio/ogg")),
                    (this.calibrateActx = new (
                        window.oggCompatible
                            ? window.AudioContext ||
                              window.webkitAudioContext ||
                              window.mozAudioContext ||
                              window.msAudioContext
                            : oggmented.OggmentedAudioContext
                    )()),
                    this.calibrateActx.decodeAudioData(
                        this.audiobuffer,
                        t => {
                            (this.bfs = this.calibrateActx.createBufferSource()),
                                (this.bfs.buffer = t),
                                this.bfs.connect(this.calibrateActx.destination),
                                (this.actxStartTime = this.calibrateActx.currentTime),
                                this.bfs.start(0),
                                (document.body.onkeydown = this.caliOnce),
                                this.bfs.addEventListener("ended", async () => {
                                    if (this.forceExit) return;
                                    null == this.calibrateActx || this.calibrateActx.close(),
                                        (this.calibrateActx = void 0),
                                        (this.calibrateActx = null);
                                    const d = [];
                                    for (let i = 1; i <= 4; i++) {
                                        const ele = document.querySelector(`#result${i}`);
                                        if (ele.innerText != "-") d.push(parseInt(ele.innerText));
                                    }
                                    const c = Math.round(d.reduce((a, b) => a + b) / d.length);
                                    if (
                                        await shared.game.msgHandler.confirm(
                                            this.$t("calibrate.confirm", { c })
                                        )
                                    )
                                        shared.game.ptmain.gameConfig.inputOffset = c.toString();
                                    shared.game.ptmain.$router.back();
                                });
                        },
                        () => {
                            shared.game.msgHandler.sendMessage(
                                this.$t("calibrate.decodeError"),
                                "error"
                            );
                        }
                    );
            },
        },
    };
</script>

<template>
    <div id="caliContainer">
        <div id="calibrate">
            <div class="calititle">{{ $t("calibrate.title") }}</div>
            <div class="content">
                <div class="description">
                    {{ $t("calibrate.description1") }}
                    <br />
                    {{ $t("calibrate.description2") }}
                </div>
                <button
                    id="clickBtn"
                    @click="caliOnce()"
                    :class="{ disabled: actxStartTime === null }"
                >
                    {{ $t("calibrate.click") }}
                </button>
                <div class="results">
                    <div id="result1">-</div>
                    <div id="result2">-</div>
                    <div id="result3">-</div>
                    <div id="result4">-</div>
                </div>
            </div>
            <div class="footer">
                <button
                    id="startBtn"
                    @click="caliStart()"
                    :class="{ disabled: !audiobuffer || actxStartTime !== null }"
                >
                    {{ $t("calibrate.start") }}
                </button>
            </div>
        </div>
    </div>
</template>

<style>
    #caliContainer {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 16px;
        height: calc(100vh - 70px);
        width: 100%;
        text-align: center;
        /* overflow: hidden; */
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    div#calibrate {
        height: 300px;
        width: 500px;
        background: #dddddf;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        overflow: hidden;
        border-radius: 15px;
    }

    div#calibrate div.calititle {
        width: 100%;
        padding: 10px;
        background: #90caf9;
        color: #fff;
        text-align: center;
        font-weight: bold;
        text-shadow: 0px 1px #00000077;
    }

    div#calibrate div.content {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: max-content;
    }

    div#calibrate div.content div.description {
        font-size: 12px;
        padding: 10px;
        text-align: center;
    }

    div#calibrate div.content button#clickBtn {
        width: 50px;
        height: 50px;
        margin: 10px;
        background: #b7b6bb;
        color: #000;
        border: 1.5px solid #939394;
        color: #fff;
        text-shadow: 1px 1px 1px #9f9f9f;
        font-weight: bold;
        cursor: pointer;
    }

    div#calibrate div.content div.results {
        width: 60%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        color: #000;
        text-align: center;
    }

    div#calibrate div.content div.results div:first-child {
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
        border-left: 1.4px #9f9f9f solid;
    }

    div#calibrate div.content div.results div:last-child {
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
        border-right: 1.4px #9f9f9f solid;
    }

    div#calibrate div.content div.results div {
        border: 1.2px #9f9f9f solid;
        width: 25%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #fff;
    }

    div#calibrate div.footer {
        display: flex;
        flex-direction: row;
        width: 100%;
        justify-content: center;
        align-items: center;
    }

    div#calibrate div.footer button {
        width: 100%;
        padding: 5px;
        cursor: pointer;
    }

    div#calibrate div.footer button#startBtn {
        background: #90caf9;
        color: #fff;
        font-size: 16px;
        border: none;
        border-right: 1px solid #fff;
        text-shadow: 0px 1px #00000033;
    }

    div#calibrate div.footer button:disabled {
        background: grey !important;
        color: lightgrey !important;
        cursor: default;
    }
</style>
