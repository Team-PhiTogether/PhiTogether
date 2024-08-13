<script>
import { recordMgr } from "./recordMgr/recordMgr.js";
import { downloadText } from "../utils/js/fileSaver.js";

export default {
    name: "playing",
    data() {
        return {
            playFinished: false,
        };
    },
    mounted() {
        this.playFinished = false;
        recordMgr.reset();
        shared.game.isPlayFinished = () => this.playFinished;
        shared.game.finishToRecord = () => {
            this.playFinished = true;
        };
        shared.game.exportRecord = this.exportRecord;
        shared.game.restartClearRecord = () => {
            this.playFinished = false;
        };
    },
    activated() {
        shared.game.simphi.stage.style.display = "block";
    },
    deactivated() {
        shared.game.simphi.stage.style.display = "none";
    },
    methods: {
        exportRecord() {
            // if (!this.playFinished) return;
            const [data, original] = recordMgr.export();

            downloadText(
                `${original.chartInfo.songData.name}${original.chartInfo.chartData.level
                    }${original.chartInfo.chartData.difficulty}-${original.playerInfo.username
                    }-${new Date().format("YmdHis")}.ptr`,
                data,
                "application/json",
            );
        },
    },
};
</script>

<template>
    <div id="cacheManage" class="routerRealPage"><br /></div>
</template>