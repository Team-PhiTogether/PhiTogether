<script>
import shared from "../utils/js/shared.js";
export default {
    name: "replayPage",
    data() {
        return {
            recordFile: null,
        };
    },
    async mounted() {
        const extra = $id("recordFile");
        const _this = this;
        extra.onchange = () => {
            const i = extra.files[0];
            const reader = new FileReader();
            reader.readAsText(i);
            reader.onload = evt => {
                _this.recordFile = evt.target.result;
            };
        };
    },
    methods: {
        playRecord() {
            shared.game.ptmain.playConfig = { practiseMode: true };
            shared.game.replayMgr.read(this.recordFile);
        },
    },
};

const $id = e => document.getElementById(e);
</script>

<template>
    <div id="cacheManage" class="routerRealPage">
        <div class="blur" :class="{ cacheUnit: true }" style="padding: 10px">
            <h3>{{ $t("replayPage.title") }}</h3>
            <p>
                {{ $t("replayPage.description") }}
            </p>
            <br />
            {{ $t("replayPage.recordFile") }}：
            <input name="recordFile" type="file" id="recordFile" />
            <br />
            <br />
            <input
                type="button"
                id="add_library"
                :class="{ disabled: !recordFile }"
                :value="$t('replayPage.play')"
                @click="playRecord()"
            />
        </div>
    </div>
</template>
