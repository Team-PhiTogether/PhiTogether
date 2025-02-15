<script>
    // 保存自行上传的谱面

    import ptdb from "@components/ptdb";
    import shared from "@utils/js/shared";
    import { checkLocalChart } from "@components/ptdb/charts";
    import ploading from "@utils/js/ploading.js";
    import { uploader } from "@renderers/sim-phi/assetsProcessor/reader";
    export default {
        name: "chartupload",
        data() {
            return {
                target: null,
                targetInfo: {
                    name: "",
                    level: "",
                    difficulty: 0,
                    charter: "",
                },
                extraResource: null,
            };
        },
        async mounted() {
            if (this.$route.query.target) {
                const songInfo = JSON.parse(sessionStorage.getItem("chartDetailsData"));
                const chartInfo = JSON.parse(sessionStorage.getItem("loadedChart"));
                this.targetInfo.name = songInfo.name;
                this.targetInfo.level = chartInfo.level;
                this.targetInfo.difficulty = chartInfo.difficulty;
                this.targetInfo.charter = chartInfo.charter;
                this.target = this.$route.query.target;
            }
            shared.game.userChartUploaded = this.userChartUploaded;
            this.clearStatAll();
            const _this = this;
            const extra = $id("extraResource");
            extra.onchange = () => {
                const i = extra.files[0];
                const reader = new FileReader();
                reader.readAsArrayBuffer(i);
                reader.onload = evt => {
                    _this.extraResource = evt.target.result;
                };
            };
        },
        // deactivated() {
        //     ploading.r();
        // },
        methods: {
            clearStatAll() {
                const selectbg = $id("select-bg");
                const selectbgm = $id("select-bgm");
                const selectchart = $id("select-chart");
                const inputName = $id("input-name");
                const inputArtist = $id("input-artist");
                const inputCharter = $id("input-charter");
                const inputIllustrator = $id("input-illustrator");
                const selectDifficulty = $id("select-difficulty");
                const selectLevel = $id("select-level");
                selectbg.value = selectbgm.value = selectchart.value = "";
                inputName.value = this.$route.query.name || "";
                inputArtist.value = this.$route.query.composer || "";
                inputCharter.value = this.$route.query.charter || "";
                inputIllustrator.value = this.$route.query.illustrator || "";
                selectDifficulty.value = this.$route.query.level || "";
                selectLevel.value = this.$route.query.difficulty || "";
                shared.game.clearStat();
                uploader.reset();
                $id("extraResource").value = "";
                this.extraResource = null;
            },
            async userChartUploaded() {
                $id("add_library").classList.remove("disabled");
                const selectbg = $id("select-bg");
                const selectbgm = $id("select-bgm");
                const selectchart = $id("select-chart");
                const inputName = $id("input-name");
                const inputArtist = $id("input-artist");
                const inputCharter = $id("input-charter");
                const inputIllustrator = $id("input-illustrator");
                const selectDifficulty = $id("select-difficulty");
                const selectLevel = $id("select-level");
                if (hook.chartData.chartsMD5.size > 1) {
                    shared.game.msgHandler.sendMessage(
                        this.$t("userChartUpload.err.haveMultipleCharts"),
                        "error"
                    );
                }
                if (!selectchart.value)
                    return shared.game.msgHandler.sendMessage(
                        this.$t("userChartUpload.err.noChartSelected"),
                        "error"
                    );
                if (!selectbgm.value)
                    return shared.game.msgHandler.sendMessage(
                        this.$t("userChartUpload.err.noSongSelected"),
                        "error"
                    );
                if (!selectbg.value)
                    return shared.game.msgHandler.sendMessage(
                        this.$t("userChartUpload.err.noImageSelected"),
                        "error"
                    );

                inputName.value = this.$route.query.name || inputName.value;
                inputArtist.value = this.$route.query.composer || inputArtist.value;
                inputCharter.value = this.$route.query.charter || inputCharter.value;
                inputIllustrator.value = this.$route.query.illustrator || inputIllustrator.value;
                selectDifficulty.value = this.$route.query.level || selectDifficulty.value;
                selectLevel.value = this.$route.query.difficulty || selectLevel.value; // 定数

                // if (
                //     !inputName.value ||
                //     !inputArtist.value ||
                //     !inputIllustrator.value ||
                //     !inputCharter.value ||
                //     !selectDifficulty.value ||
                //     !selectLevel.value
                // )
                //     // if (
                    //     await shared.game.msgHandler.confirm(
                    //         this.$t("userChartEdit.askToFillWithUK")
                    //     )
                    // ) {
                // if (selectLevel.value.includes(".")) {
                //     const levelNum = parseFloat(selectLevel.value);
                //     if (
                //         !isNaN(levelNum) &&
                //         await shared.game.msgHandler.confirm(
                //             this.$t("userChartEdit.askToRemoveFraction")
                //         )
                //     ) {
                //         selectLevel.value = Math.floor(levelNum).toString();
                //     }
                // }
                inputName.value = inputName.value || "unknown";
                inputArtist.value = inputArtist.value || "unknown";
                inputIllustrator.value = inputIllustrator.value || "unknown";
                inputCharter.value = inputCharter.value || "unknown";
                selectDifficulty.value = selectDifficulty.value || "SP";
                selectLevel.value = selectLevel.value || "?";
                // } else return;

                if (this.$route.query.then === "playing") {
                    sessionStorage.removeItem("loadedChart");
                    return this.$router.replace({ path: "/playing", query: { auto: 1 } });
                }

                // 拼接url
                const md5 = hook.chartData.chartsMD5.get(hook.selectchart.value);

                // 校验
                if (this.target && md5 !== this.target) {
                    shared.game.msgHandler.failure(
                        this.$t("userChartUpload.fileDoesntMatch", [md5, this.target])
                    );
                    this.clearStatAll();
                    return;
                }

                if (await checkLocalChart(md5)) {
                    shared.game.msgHandler.sendMessage(
                        this.$t("userChartUpload.chartAdded"),
                        "error"
                    );
                    if (!this.target) this.$router.back();
                    return;
                }

                const selectedChart = hook.chartData.oriBuffers.get(selectchart.value);
                const selectedBg = hook.chartData.oriBuffers.get(selectbg.value);
                const selectedBgm = hook.chartData.oriBuffers.get(selectbgm.value);

                const mimeTable = {
                    mp3: "audio/mpeg",
                    mp4: "video/mp4",
                    zip: "application/zip",
                    ogg: "audio/ogg",
                    m4a: "audio/mp4",
                    png: "image/png",
                    jpg: "image/jpeg",
                    jpeg: "image/jpeg",
                    tiff: "image/tiff",
                    tif: "image/tiff",
                };

                let mimeSong = "audio/mpeg",
                    mimeIll = "image/png";
                let extSong = selectbgm.value.split("."),
                    extIll = selectbg.value.split(".");
                (extSong = extSong[extSong.length - 1]), (extIll = extIll[extIll.length - 1]);
                if (extSong in mimeTable) mimeSong = mimeTable[extSong];
                if (extIll in mimeTable) mimeIll = mimeTable[extIll];

                ploading.l(this.$t("userChartUpload.saving"), "saveChart");
                ptdb.chart.song
                    .download(
                        {
                            id: md5,
                            composer: inputArtist.value,
                            illustrator: inputIllustrator.value,
                            name: inputName.value,
                        },
                        new Blob([selectedBgm], { type: mimeSong }),
                        new Blob([selectedBg], { type: mimeIll })
                    )
                    .then(ptdb.chart.song.save)
                    .then(() =>
                        ptdb.chart.chart.download(
                            {
                                id: md5,
                                level: selectDifficulty.value,
                                difficulty: selectLevel.value,
                                charter: inputCharter.value,
                                song: md5,
                            },
                            new Blob([selectedChart], { type: "application/json" })
                        )
                    )
                    .then(ptdb.chart.chart.save)
                    .then(() => {
                        if (!this.target) ploading.r("saveChart");
                        shared.game.msgHandler.sendMessage(this.$t("userChartUpload.success"));

                        if (!this.target) {
                            this.$router.back();
                        } else {
                            const goNext = () => {
                                const chartData = JSON.parse(sessionStorage.getItem("loadedChart"));
                                const songData = JSON.parse(
                                    sessionStorage.getItem("chartDetailsData")
                                );
                                shared.game.multiInstance.loadChartSecond(songData, chartData);
                                shared.game.ptmain.$router.replace({
                                    path: "/chartSelect",
                                    query: { toSyncOrPlay: 3 },
                                });
                            };
                            if (this.extraResource) {
                                shared.game.userChartUploaded = goNext;
                                uploader.fireLoad({ name: "assets.zip" }, this.extraResource);
                            } else goNext();
                        }
                    });

                // if (this.extraResource) {
                //     const resURL = `/PTVirtual/charts/${md5}/assets.zip?type=assets&for=${md5}&id=${md5}`;
                //     await cache.put(
                //         resURL,
                //         new Response(
                //             new Blob([this.extraResource], { type: "application/zip" })
                //         )
                //     );
                // }
            },
        },
    };

    const $id = e => document.getElementById(e);
</script>

<template>
    <div id="cacheManage" class="routerRealPage">
        <div class="blur" :class="{ cacheUnit: true }" style="padding: 10px">
            <h3>{{ $t("userChartUpload.title") }}</h3>
            <p>
                {{ $t("userChartUpload.description.line0") }}
                <br />
                {{ $t("userChartUpload.description.line1") }}
                <br />
                {{ $t("userChartUpload.description.line2") }}
                <br />
                {{ $t("userChartUpload.description.line3") }}
            </p>
            <br />
            <p style="color: red" v-if="this.target">
                {{
                    $t("userChartUpload.target", [
                        targetInfo.name,
                        targetInfo.level,
                        targetInfo.difficulty,
                        targetInfo.charter,
                        target,
                    ])
                }}
            </p>
            {{ $t("userChartUpload.extraRes") }}：
            <input name="extraResource" type="file" id="extraResource" />
            <br />
            <br />
            <input
                type="button"
                id="add_library"
                class="disabled"
                :value="$t('userChartUpload.add')"
                @click="userChartUploaded()"
            />
            <input type="button" :value="$t('userChartUpload.clear')" @click="clearStatAll()" />
        </div>
    </div>
</template>
