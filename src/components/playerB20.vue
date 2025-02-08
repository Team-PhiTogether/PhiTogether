<script>
    import shared from "../utils/js/shared.js";
    import { PhiZoneAPI as phizoneApi } from "../utils/phizone";
    import ploading from "@utils/js/ploading.js";

    const $ = query => document.getElementById(query);
    const $$ = query => document.body.querySelector(query);
    const $$$ = query => document.body.querySelectorAll(query);

    export default {
        name: "playerB20",
        data() {
            return {
                loaded: false,
                data: null,
            };
        },
        computed: {
            pzResUrlGlobal() {
                "res.phizone.cn";
            },
            loginInfo() {
                return shared.game.ptmain.gameConfig.account.userBasicInfo;
            },
        },
        async mounted() {
            try {
                ploading.l(this.$t("playerB20.loadB20"), "loadb20");
                const id = this.$route.query.id;
                this.data = await phizoneApi.getPlayerB20Asv1(
                    shared.game.ptmain.gameConfig.account.tokenInfo.access_token,
                    id
                );
                this.loaded = true;
            } catch (e) {
                shared.game.msgHandler.sendMessage(this.$t("playerB20.error"), "error");
            } finally {
                ploading.r("loadb20");
            }
        },
        deactivated() {
            ploading.r("loadb20");
        },
        methods: {
            scoreStr(t) {
                const a = t.toFixed(0);
                return "0".repeat(a.length < 7 ? 7 - a.length : 0) + a;
            },
        },
        watch: {},
    };
</script>

<template>
    <div>
        <div>
            <div :class="{ scoreMainContainer: true, playerB20Container: true }" v-if="loaded">
                <div id="scoreContent">
                    <div>
                        <div class="scoreRanking scoreRankingPerson">
                            <div>
                                <div class="scoreRankingTitle">
                                    <div class="playerB20Card">
                                        <div id="playerCardUsrAvatarParent">
                                            <div id="playerCardUsrAvatar">
                                                <img
                                                    :src="
                                                        loginInfo.avatar.replace(
                                                            'res.phi.zone',
                                                            pzResUrlGlobal
                                                        )
                                                    "
                                                />
                                            </div>
                                        </div>
                                        <div class="playerB20Info">
                                            <p class="name">{{ loginInfo.userName }}</p>
                                            <p class="id">ID: {{ loginInfo.id }}</p>
                                            <p class="rks">RKS: {{ loginInfo.rks.toFixed(3) }}</p>
                                            <p class="exp">
                                                EXP: {{ loginInfo.experience.toFixed(0) }}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div class="scoreRankingBody">
                                    <div class="scoreRankingBodyColum">
                                        <div
                                            class="scoreRankingCardEle"
                                            v-if="data.phi1 && data.phi1.chart"
                                        >
                                            <div class="scoreSongCard">
                                                <img :src="data.phi1.chart.song.illustration" />
                                                <div class="songCardCoverAll">
                                                    <div class="songCardID Phi">Phi</div>
                                                    <div class="songCardName">
                                                        {{ data.phi1.chart.song.name }}
                                                    </div>
                                                    <div class="songCardLevel">
                                                        {{ data.phi1.rks.toFixed(2) }}
                                                        <br />
                                                        {{ data.phi1.chart.level }}
                                                        {{ data.phi1.chart.difficulty }}
                                                    </div>
                                                    <div class="songCardScore">
                                                        {{ scoreStr(data.phi1.score) }}
                                                    </div>
                                                    <div class="songCardAcc">
                                                        {{ (data.phi1.accuracy * 100).toFixed(2) }}%
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            class="scoreRankingCardEle"
                                            v-for="(item, i) in data.best19"
                                        >
                                            <div class="scoreSongCard">
                                                <img :src="item.chart.song.illustration" />
                                                <div class="songCardCoverAll">
                                                    <div class="songCardID">#{{ i + 1 }}</div>
                                                    <div class="songCardName">
                                                        {{ item.chart.song.name }}
                                                    </div>
                                                    <div class="songCardLevel">
                                                        {{ item.rks.toFixed(2) }}
                                                        <br />
                                                        {{ item.chart.level }}
                                                        {{ item.chart.difficulty }}
                                                    </div>
                                                    <div class="songCardScore">
                                                        {{ scoreStr(item.score) }}
                                                    </div>
                                                    <div class="songCardAcc">
                                                        {{ (item.accuracy * 100).toFixed(2) }}%
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
    .songCardID.Phi {
        background-color: goldenrod;
    }

    .playerB20Container .scoreRankingCardEle {
        width: 25% !important;
    }

    .playerB20Card {
        display: flex;
        justify-content: space-around;
        align-items: center;
        max-width: 100%;
        width: 300px;
        background-color: #c5effb;
        border-radius: 20px;
        box-shadow:
            #002a8328 0px 0px 20px 5px,
            inset #002a8328 0px 0px 50px 8px;
        padding-top: 10px;
        padding-bottom: 10px;
    }

    .playerB20Card .playerB20Info {
        font-size: 0.7em;
        font-weight: normal;
    }

    .playerB20Container .scoreRankingTitle {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 10px;
    }

    .playerB20Container #playerCardUsrAvatarParent {
        margin-top: 0;
    }

    #playerCardUsrAvatar img {
        filter: unset;
    }

    .playerB20Card .name {
        font-size: 1.2em;
    }

    @media screen and (max-width: 700px) {
        .playerB20Container .scoreRankingCardEle {
            width: 33.3% !important;
        }
    }

    @media screen and (max-width: 600px) {
        .playerB20Container .scoreRankingCardEle {
            width: 50% !important;
        }
    }
</style>
