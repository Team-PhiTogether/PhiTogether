<script>
import shared from "../utils/js/shared.js";
import md5 from "md5";
import ptdb from "../utils/ptdb";
export default {
    name: "cacheManage",
    data() {
        return {
            cacheList: [],
        };
    },
    async activated() {
        this.cacheList = await ptdb.chart.renderCacheList();
        console.log(this.cacheList);
    },
    methods: {
        getDifficultyActual(chartInfo) {
            if (typeof chartInfo.difficulty === "string") return chartInfo.difficulty;
            else
                return chartInfo.difficulty === 0
                    ? "?"
                    : chartInfo.difficulty.toFixed(1);
        },
        getFileNameGeneral(i) {
            const t = i.split("/");
            return decodeURIComponent(t[t.length - 1]);
        },
        async deleteCache(i, type, hid = false) {
            if(type==="song") await ptdb.chart.song.delete(i);
            else if(type==="chart") await ptdb.chart.chart.delete(i);
            else return;
            hid || shared.game.msgHandler.sendMessage(this.$t("cacheManage.deletedSuccessfully"));
            this.cacheList = await ptdb.chart.renderCacheList();
        },
        async deleteCacheAll(i) {
            let lst = [];
            if (i.id && i.song) {
                await this.deleteCache(i.id, "song", true);
            }
            if (i.charts) {
                for (let j = 0; j < i.charts.length; j++) {
                    if (i.charts[j].id) await this.deleteCache(i.charts[j].id, "chart", true);
                }
            }
            shared.game.msgHandler.sendMessage(this.$t("cacheManage.deletedSuccessfully"));
            this.cacheList = await ptdb.chart.renderCacheList();
        },
        async clearAll(t) {
            if (
                !(await shared.game.msgHandler.confirm(
                    this.$t("cacheManage.confirmBeforeDeleteData"),
                    this.$t("info.info"),
                    this.$t("cacheManage.delete"),
                    this.$t("info.cancel")
                ))
            )
                return;
            switch (t) {
                case "charts":
                    caches.delete("PTv0-Charts").then(async () => {
                        await indexedDB.deleteDatabase("PTv0");
                        location.reload();
                    });
                    break;
                case "self":
                    caches.delete("PTv0-Main").then(() => {
                        location.reload();
                    });
                    break;
                case "all":
                    caches.delete("PTv0-Main").then(() => {
                        caches.delete("PTv0-Charts").then(() => {
                            caches.delete("PTv0-User").then(async() => {
                                await indexedDB.deleteDatabase("PTv0");
                                shared.game.msgHandler.success(
                                    this.$t("cacheManage.allDataDeleted")
                                );
                            });
                        });
                    });
                    break;
            }
        },
        // exportUserData() {
        //     const odata = JSON.stringify(localStorage.getItem("PhiTogetherSettings"));
        //     const data = `${btoa(odata)}${md5(odata.replaceAll('"', " "))}`;
        //     shared.game.msgHandler.sendMessage("正在上传数据(实验性功能)");
        //     const formData = new FormData();
        //     formData.append("text", data);
        //     const filename = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        //         /[xy]/g,
        //         function (c) {
        //             var r = (Math.random() * 16) | 0,
        //                 v = c == "x" ? r : (r & 0x3) | 0x8;
        //             return v.toString(16);
        //         }
        //     );
        //     formData.append("filename", "UserProfile_" + filename);
        //     fetch("/record/upload", {
        //         method: "POST",
        //         body: formData,
        //     })
        //         .then((response) => response.text())
        //         .then((downloadurl) => {
        //             shared.game.msgHandler.info(
        //                 `请在其他设备中粘贴导入 若未复制成功请手动输入: ${filename}`,
        //                 "ID已复制"
        //             );
        //             if (navigator.clipboard) navigator.clipboard.writeText(filename);
        //         })
        //         .catch(function (err) {
        //             shared.game.msgHandler.sendMessage(err, "error");
        //             shared.game.msgHandler.sendMessage("上传失败,请重试", "error");
        //             console.log(err);
        //         });
        // },
        // importUserData() {
        //     shared.game.msgHandler.prompt("", "输入配置ID").then((t) =>
        //         fetch(`/record/uploaddownload/UserProfile_${t}`)
        //             .then((r) => r.text())
        //             .then((t) => {
        //                 const a = t.slice(0, -32);
        //                 const b = t.slice(-32);
        //                 if (shared.game.msgHandler.confirm("确认覆盖配置?")) {
        //                     if (md5(a.replaceAll('"', " ")) === b) {
        //                         const c = JSON.parse(a);
        //                         localStorage.setItem("PhiTogetherSettings", c);
        //                     }
        //                     hared.game.msgHandler.info("配置已成功导入", "导入成功");
        //                 }
        //             })
        //             .fetch((e) =>
        //                 shared.game.msgHandler.sendMessage("配置导入失败", "error")
        //             )
        //     );
        // },
    },
};
</script>

<template>
    <div id="cacheManage" class="routerRealPage">
        <div class="blur cacheUnit" style="padding: 10px;">
            <h3>{{ $t("cacheManage.manageAll") }}</h3>
            <input type="button" :value="$t('cacheManage.deleteAllCharts')" @click="clearAll('charts')" />
            <input type="button" :value="$t('cacheManage.forceVersionUpdate')" @click="clearAll('self')" /><br />
            <input type="button" :value="$t('cacheManage.clearAllData')" @click="clearAll('all')" />
            <!-- <input type="button" value="导入用户配置" @click="importUserData()" v-if="false" />
            <input type="button" value="导出用户配置" @click="exportUserData()" v-if="false" /> -->
        </div>
        <div class="blur cacheUnit" v-for="cache in cacheList">
            <h3>{{ $t("cacheManage.cachedFileTitle", [ cache.name ? cache.name : $t("cacheManage.separate") ]) }}</h3>
            <input type="button" @click="deleteCacheAll(cache)" :value="$t('cacheManage.deleteThisGroupOfFiles')" />
            <div class="cacheTable">
                <div class="chartListChartItem">
                    <div class="file"> {{ $t("cacheManage.file") }} </div>
                    <div class="type"> {{ $t("cacheManage.type") }} </div>
                    <div class="play"> {{ $t("cacheManage.operation") }} </div>
                </div>
                <div class="chartListChartItem" v-if="cache.id && cache.song">
                    <div class="file">{{ getFileNameGeneral(cache.song) }}</div>
                    <div class="type"> {{ $t("cacheManage.music_illustration") }} </div>
                    <div class="play">
                        <input type="button" @click="deleteCache(cache.id, 'song')" :value="$t('cacheManage.delete')" />
                    </div>
                </div>
                <div v-for="chart in cache.charts">
                    <div class="chartListChartItem">
                        <div class="file">{{ getFileNameGeneral(chart.chart) }}</div>
                        <div class="type">
                            {{ $t("cacheManage.chart") }} {{ chart.level }} {{ getDifficultyActual(chart) }}
                        </div>
                        <div class="play">
                            <input type="button" @click="deleteCache(chart.id, 'chart')" :value="$t('cacheManage.delete')" />
                        </div>
                    </div>
                    <!-- <div class="chartListChartItem" v-if="chart.assets">
                        <div class="file">{{ getFileNameGeneral(chart.assets) }}</div>
                        <div class="type">
                            {{ $t("cacheManage.chart") }} {{ chart.level }} {{ getDifficultyActual(chart) }} {{ $t("cacheManage.additionRes") }}
                        </div>
                        <div class="play">
                            <input type="button" @click="deleteCache(chart.assets)" :value="$t('cacheManage.delete')" />
                        </div>
                    </div> -->
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.cacheUnit {
    margin: 25px;
    padding: 5px;
    border-radius: 20px;
    box-shadow: #002a8328 0px 0px 20px 5px, inset #002a8328 0px 0px 50px 8px;
}

.chartListChartItem div {
    display: inline-block;
}

.chartListChartItem {
    display: flex;
    justify-content: space-around;
    margin: 10px;
}

.chartListChartItem>div {
    flex: 2;
    word-break: break-word;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
}
</style>