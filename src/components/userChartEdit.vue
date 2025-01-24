<script>
import shared from "../utils/js/shared.js";
import ptdb from "../utils/ptdb";
export default {
    name: "userChartEdit",
    data() {
        return {
            songData: {
                composer: "",
                name: "",
                illustrator: "",
                charts: [],
            },
            // chartData: {
            //     charter: "",
            //     level: "",
            //     difficulty: "",
            // }
        };
    },
    mounted() {
        this.songData = JSON.parse(sessionStorage.getItem("chartDetailsData"));
        // this.chartData = this.songData.charts[0];
    },
    methods: {
        async save() {
            if (!this.songData.composer || !this.songData.name || !this.songData.illustrator)
                if (
                    await shared.game.msgHandler.confirm(this.$t("userChartEdit.askToFillWithUK"))
                ) {
                    this.songData.composer = this.songData.composer || "unknown";
                    this.songData.name = this.songData.name || "unknown";
                    this.songData.illustrator = this.songData.illustrator || "unknown";
                } else return;
            const md5 = this.songData.id;

            await ptdb.chart.song
                .get(md5)
                .then(s => {
                    s.composer = this.songData.composer;
                    s.name = this.songData.name;
                    s.illustrator = this.songData.illustrator;
                    return s;
                })
                .then(ptdb.chart.song.save)
                .then(async () => {
                    for (const i in this.songData.charts) {
                        await ptdb.chart.chart
                            .get(this.songData.charts[i].id)
                            .then(c => {
                                c.charter = this.songData.charts[i].charter || "unknown";
                                c.level = this.songData.charts[i].level || "SP";
                                c.difficulty = this.songData.charts[i].difficulty || "?";
                                return c;
                            })
                            .then(ptdb.chart.chart.save)
                            .catch(e => console.log(e, "error"));
                    }
                })
                .catch(e => console.log(e, "error"));

            try {
                shared.game.msgHandler.sendMessage(this.$t("userChartEdit.success"));
                sessionStorage.setItem("chartDetailsData", JSON.stringify(this.songData));
                this.$router.back();
            } catch (e) {
                shared.game.msgHandler.sendMessage(this.$t("userChartEdit.error"), "error");
            }
        },
    },
};
</script>

<template>
    <div id="userChartEdit" class="routerRealPage">
        <h1 class="userChartEditRow" style="font-size: 2em">{{ $t("userChartEdit.title") }}</h1>
        <div class="userChartEditRow">
            {{ $t("userChartEdit.songName") }}：
            <input class="input textInput" style="width: calc(100% / 2)" v-model="songData.name" />
        </div>
        <div class="userChartEditRow">
            {{ $t("userChartEdit.composer") }}：
            <input
                class="input textInput"
                style="width: calc(100% / 4.75)"
                v-model="songData.composer"
            />

            {{ $t("userChartEdit.illustrator") }}：
            <input
                class="input textInput"
                style="width: calc(100% / 4.75)"
                v-model="songData.illustrator"
            />
        </div>
        <br />
        <div v-for="chartData in songData.charts" class="userChartEditRow">
            <h3>ID: {{ chartData.id }}</h3>
            <div class="userChartEditRow">
                {{ $t("userChartEdit.charter") }}：
                <input
                    class="input textInput"
                    style="width: calc(100% / 2)"
                    v-model="chartData.charter"
                />
            </div>
            <div class="userChartEditRow">
                {{ $t("userChartEdit.level") }}：
                <input
                    class="input textInput"
                    style="width: calc(100% / 4.5)"
                    v-model="chartData.level"
                />
                {{ $t("userChartEdit.difficulty") }}：
                <input
                    class="input textInput"
                    style="width: calc(100% / 4.5)"
                    v-model="chartData.difficulty"
                />
            </div>
        </div>
        <div class="userChartEditRow">
            <input
                type="button"
                style="width: auto; font-size: 1.5em"
                :value="$t('userChartEdit.save')"
                @click="save()"
            />
        </div>
    </div>
</template>

<style>
#userChartEdit {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    align-content: center;
    margin-top: 50px;
}

.userChartEditRow {
    width: 100%;
    margin: 10px;
}

.userChartEditRow input:not([type="button"]) {
    width: 70%;
    height: 2em;
}

.userChartEditRow input[type="button"] {
    font-size: 1.6em;
    width: 40%;
    margin: 6px;
}
</style>
