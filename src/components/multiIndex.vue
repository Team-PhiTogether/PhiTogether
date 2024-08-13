<script>
import shared from "../utils/js/shared.js";

export default {
    name: "multiIndex",
    data() {
        return {
            roomList: [],
            filterType: "id",
            filterParam1: "",
            filterParam2: "",
            createConfig: {
                id: "",
                description: "",
                isPublic: false,
            },
            selectChoice: "join",
        };
    },
    computed: {
        isSingle() {
            return shared.game.ptmain.gameMode === "single";
        },
        isAprFl() {
            return partyMgr.list.aprfool2024.activate
        }
    },
    mounted() {
        this.loadPage();
    },
    deactivated() {
        shared.game.loadHandler.r("loadRoomInfo");
    },
    methods: {
        doSearch() {
            if (!this.filterParam1 && !this.filterParam2) {
                this.loadPage();
                return;
            }
            if (
                this.filterType === "id" &&
                this.filterParam1.startsWith("【PhiTogether")
            ) {
                this.filterParam1 = this.filterParam1.match(/\$\$\$([^$]+)\$\$\$/)[1];
            }
            this.loadPage(this.filterType, this.filterParam1, this.filterParam2);
        },
        async loadPage(by = "none", param1 = "", param2 = "") {
            try {
                shared.game.loadHandler.l(
                    this.$t("multiIndex.loadRoomInfo"),
                    "loadRoomInfo"
                );
                const t = JSON.parse(
                    await (
                        await fetch(
                            `${import.meta.env.VITE_MP_SERVER}/api/multi/searchRoom?by=${by}&param1=${param1}&param2=${param2}`
                        )
                    ).text()
                ); //别用.json()
                for (let i = 0; i < t.length; i++) {
                    if (t[i].stage != 0 || t[i].player_number >= 20) {
                        t[i].canJoin = false;
                        t[i].joinText =
                            t[i].stage != 0
                                ? this.$t("multiIndex.roomLocked")
                                : this.$t("multiIndex.roomFull");
                    } else {
                        t[i].canJoin = true;
                        t[i].joinText = this.$t("multiIndex.join");
                    }
                }
                this.roomList = t;
                shared.game.loadHandler.r("loadRoomInfo");
            } catch (e) {
                console.error(e);
                shared.game.loadHandler.r("loadRoomInfo");
            }
        },
        joinRoom(roomid) {
            shared.game.loadHandler.l(this.$t("multiIndex.joining"), "joinRoom");
            fetch(`${import.meta.env.VITE_MP_SERVER}/api/multi/requestRoom/${roomid}?v=${spec.thisVersion}`)
                .then((response) => response.json())
                .then((result) => {
                    const server_addr = result.server_addr;
                    if (result.code !== 0) {
                        shared.game.msgHandler.failure(this.$t(`serverMsg.${result.msg}`));
                        shared.game.loadHandler.r("joinRoom");
                        return;
                    }
                    shared.game.multiInstance.doJoinRoom(roomid, server_addr);
                })
                .catch(() => {
                    shared.game.msgHandler.sendMessage(this.$t("multiIndex.err"));
                    shared.game.loadHandler.r("joinRoom");
                });
        },
        createRoom() {
            let roomid = this.createConfig.id.trim();
            if (roomid.indexOf("$") > -1) {
                shared.game.msgHandler.failure(this.$t("multiIndex.roomIdCantContainsDollar"));
                return;
            }
            if (!roomid) {
                shared.game.msgHandler.sendMessage(
                    this.$t("multiIndex.roomId_cannot_be_empty"),
                    "error"
                );
                return;
            }
            if (!this.createConfig.description)
                this.createConfig.description = "No description.";
            shared.game.loadHandler.l(this.$t("multiIndex.joining"), "createRoom");
            fetch(`${import.meta.env.VITE_MP_SERVER}/api/multi/requestRoom/${roomid}?v=${spec.thisVersion}`)
                .then((response) => response.json())
                .then((result) => {
                    const server_addr = result.server_addr;
                    if (result.code !== -2) {
                        shared.game.msgHandler.failure(this.$t(`serverMsg.${result.msg}`));
                        shared.game.loadHandler.r("createRoom");
                        return;
                    }
                    shared.game.multiInstance.doCreateRoom(
                        roomid,
                        server_addr,
                        this.createConfig.description,
                        this.createConfig.isPublic
                    );
                })
                .catch(() => {
                    shared.game.msgHandler.sendMessage(this.$t("multiIndex.err"));
                    shared.game.loadHandler.r("createRoom");
                });
        },
    },
    meta: {
        keepAlive: false,
    },
};
</script>

<template>
    <div id="songSelect" style="width: 95%; margin: 0 auto;">
        <div class="songsSourceSelectContainer">
            <div class="songsSourceSelect">
                <div>
                    <input type="radio" id="sc1" name="selectChoice" v-model="selectChoice" value="join">
                    <label for="sc1">{{ isAprFl ? "上车" : $t("multiIndex.join") }}</label>
                </div>

                <div>
                    <br />
                    <input type="radio" id="sc0" name="selectChoice" v-model="selectChoice" value="create">
                    <label for="sc0">{{ isAprFl ? "开车" : $t("multiIndex.create") }}</label>
                </div>
            </div>
        </div>

        <div id="songAndChartSelector" class="blur"
            :style="{ width: '90vw', 'border-radius': '12px', overflow: 'hidden' }">
            <Transition name="upslide-fade">
                <div v-if="selectChoice === 'join'" class="multiServer">
                    <div class="multiServerSearch" style="width: 83vw; margin: 0 auto;">
                        <input class="input" v-model="filterParam1" style="padding-right: 5px;" />
                        <span v-if="filterType != 'id'" style="font-weight: bold; font-size: 24px;">~</span>
                        <input class="input" v-model="filterParam2" v-if="filterType != 'id'" />
                        <select v-model="filterType">
                            <option value="id">{{ $t("multiIndex.byId") }}</option>
                            <option value="rks">{{ $t("multiIndex.byRks") }}</option>
                            <option value="playerNumber">{{ $t("multiIndex.byPlayerNumber") }}</option>
                        </select>
                        <input type="button"
                            v-bind:value="(filterParam1 || filterParam2) ? $t('multiIndex.search') : $t('multiIndex.refresh')"
                            @click="doSearch()">
                    </div>
                    <div class="multiServerList">
                        <div style="width:100%;height:100%;font-size:xx-large;display:flex;align-items:center;justify-content:center;color:dimgrey;margin-top:-2.5vh;"
                            v-if="!roomList.length">
                            <span>{{ $t("multiIndex.roomListEmpty") }}</span>
                        </div>
                        <div class="multiServerDisp" v-for="item in roomList">
                            <div class="line">
                                <div class="name">{{ item.id }}</div>
                                <div class="playernumber">
                                    <div class="present">{{ item.player_number }}</div>
                                    <div class="total">/20</div>
                                </div>
                                <div class="avgRks">{{ $t("multiIndex.avgRks") }}: {{ item.avg_rks.toFixed(2) }}</div>
                            </div>
                            <div class="line">
                                {{ item.description }}
                            </div>
                            <div class="line">
                                <div class="ownerName">{{ $t("multiIndex.owner") }}: {{ item.owner_info }}</div>
                                <input type="button" v-bind:value="item.joinText" @click="joinRoom(item.id)"
                                    v-if="item.canJoin">
                                <span v-if="!item.canJoin">{{ item.joinText }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Transition>
            <Transition name="upslide-fade">
                <div v-if="selectChoice === 'create'"
                    style="display:flex;align-items:center;justify-content:center;width:100%;flex-direction:column;">
                    <div class="loginPageRow">
                        {{ $t("multiIndex.roomId") }}: <input class="input" style="width:calc(100%/2);"
                            v-model="createConfig.id" />
                    </div>
                    <div class="loginPageRow">
                        {{ $t("multiIndex.description") }}: <input class="input" style="width:calc(100%/2);"
                            v-model="createConfig.description" />
                    </div>
                    <div class="loginPageRow">
                        <input type="checkbox" id="public" v-model="createConfig.isPublic"><label for="public">{{
                            $t("multiIndex.goPublic") }}</label>
                    </div>
                    <div class="loginPageRow">
                        <input type="button" v-bind:value="$t('multiIndex.create')" @click="createRoom" id="createBtn"
                            style="width: 6em;">
                    </div>
                </div>
            </Transition>
        </div>
    </div>
</template>

<style>
.multiServer {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.multiServerSearch {
    width: 100%;
    padding-top: 20px;
    padding-bottom: 20px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    /* flex: 1; */
}

.multiServerSearch .input {
    flex: 3;
}

.multiServerSearch select {
    flex: 1;
}

.multiServerList {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    overflow-y: scroll;
    flex: 15;
}

.multiServerDisp {
    flex: 1;
    height: 150px;
    background: #ffffff90;
    padding: 22px;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    margin-left: 2%;
    margin-top: 2%;
    margin-right: 2%;
    padding-top: 30px;
    min-width: 40%;
    max-width: 40.2%;
}

.multiServerDisp .line {
    display: flex;
    flex: 1;
    justify-content: space-between;
    flex-wrap: wrap;
    max-width: 100%;
    max-height: 34%;
    overflow: hidden;
}

.multiServerDisp .name {
    font-weight: bold;
    font-size: x-large;
    max-width: 80%;
    overflow: hidden;
    text-overflow: ellipsis;
}

.multiServerDisp .playernumber {
    display: flex;
    margin-top: .4em;
}

.present {
    font-size: x-large;
    margin-top: -.3em;
}

.multiServerDisp input#createBtn {
    height: 2em;
    width: 2em;
}

.multiServerDisp .ownerName {
    max-width: 60%;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-top: .2em;
}

.multiServerDisp .line:nth-child(3) {
    margin-top: 1em;
}

.multiServerDisp .avgRks {
    margin-top: .3em;
}
</style>