import { createApp } from "vue/dist/vue.esm-bundler";
import * as VueRouter from "vue-router";
import { msgHandler } from "@utils/js/msgHandler";
import eruda from "eruda";

import packageConfig from "../package.json";

import { routes } from "@components/router";
import multiplayerinst from "@components/multiplayer.vue";

import { uploader } from "@renderers/sim-phi/assetsProcessor/reader";
import shared from "@utils/js/shared.js";
import i18n from "@locales";
import { PhiZoneAPI as phizoneApi, getUserColor } from "@utils/phizone";
import ploading from "@utils/js/ploading.js";
import { full } from "@utils/js/common.js";
import { tipsHandler } from "@components/tips";
import { recordMgr } from "@components/recordMgr/recordMgr.js";
import { replayMgr } from "@components/recordMgr/replayMgr.js";
import ptdb from "@utils/ptdb";
import "@utils/js/errHandler";
if (import.meta.env.DEV) self.ptdb = ptdb;

import { renderers } from "@utils/renderer";

var searchParams;

ploading.init({
  whenShow: () => {
    ploading.tip = tipsHandler.getTip(ploading.msg);
  },
});
const loadHandler = ploading;

const mainCtn = document.querySelector("div.main");
const requestFullscreen = async (forced) => {
  if (
    !forced &&
    (spec.isPhiTogetherApp ||
      spec.isDesktop ||
      location.hostname === "localhost" ||
      (searchParams &&
        searchParams.get("flag") &&
        searchParams.get("flag").includes("noRequestingFullscreen")))
  ) {
    shared.game.requestedFullscreen = true;
    return;
  }
  if (spec.isiOSDevice && !spec.isPhiTogetherApp) {
    if (
      await msgHandler.confirm(
        i18n.global.t("requestFullscreen.requestDownloadiOSApp")
      )
    )
      window.location.href = "https://testflight.apple.com/join/jMbjenat";
    shared.game.requestedFullscreen = true;
    return;
  }
  if (!full.enabled) {
    msgHandler.sendMessage(
      i18n.global.t("requestFullscreen.unsupported"),
      "error"
    );
    shared.game.requestedFullscreen = true;
    return;
  }
  if (!full.check(mainCtn)) {
    if (
      await msgHandler.confirm(
        i18n.global.t("requestFullscreen.requestFullscreen"),
        i18n.global.t("info.info"),
        i18n.global.t("requestFullscreen.clickToFullscreen"),
        i18n.global.t("info.cancel")
      )
    )
      full.toggle(mainCtn);
    shared.game.requestedFullscreen = true;
  }
  return;
};
shared.game.requestedFullscreen = false;
shared.game.requestFullscreen = requestFullscreen;

if (window.devicePixelRatio >= 3)
  document.documentElement.style.fontSize = "80%";
if (location.hash.split("?")[1]) {
  searchParams = new URLSearchParams(
    location.hash.slice(location.hash.indexOf("?") + 1)
  );
}

if (!location.hash || location.hash != "#/loading") location.hash = "#/loading";
scrollTo(0, 0);
document.body.style.overflow = "hidden";

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes,
});

router.beforeEach((to, from) => {
  $("btn-play").value === "停止" && $("btn-play").click();
  document.getElementById("pageTitle").innerText = i18n.global
    .t(`pages.${to.path.toLocaleLowerCase()}`)
    .toUpperCase();
  if (!["/chartSelect"].includes(to.path))
    document.querySelector("#app").scrollTop = 0;
  let s;
  switch (to.path) {
    case "/chartUpload":
      s = document.getElementById("select2");
      shared.game.clearStat();
      break;
    case "/settings":
      s = document.getElementById("settings");
      break;
    case "/multipanel":
      shared.game.multiInstance.forceOpen = true;
      shared.game.multiInstance.panelOpen = true;
      break;
    case "/playing":
      shared.game.bubbleAnimator.stop();
      document.getElementById("backgroundCanvas").style.display = "none";
      document.querySelector(".background").style.display = "none";
      const gameConfig = shared.game.ptmain.gameConfig;
      if (gameConfig && gameConfig.account && gameConfig.account.defaultConfig)
        shared.game.judgeManager.setJudgeTime(
          gameConfig.account.defaultConfig.perfectJudgment / 1000,
          gameConfig.account.defaultConfig.goodJudgment / 1000,
          gameConfig.account.defaultConfig.perfectJudgment / 2000
        );
      else shared.game.judgeManager.setJudgeTime();
      if (window.spec.antiAdditionEnabled)
        if (document.visibilityState !== "hidden")
          window.nativeApi.antiAddiction_enterGame();
        else
          shared.game.afterShow.push(
            () => window.nativeApi && window.nativeApi.antiAddiction_enterGame()
          );
      break;
  }
  if (s) {
    s.classList.remove("out");
    s.classList.remove("to");
    s.classList.add("from");
    s.classList.add("in");
    s.style.display = "block";
    setTimeout(() => { s.classList.remove("from"); }, 50);
  }
  let s2;
  switch (from.path) {
    case "/chartUpload":
      s2 = document.getElementById("select2");
      break;
    case "/settings":
      s2 = document.getElementById("settings");
      break;
    case "/multipanel":
      shared.game.multiInstance.forceOpen = false;
      shared.game.multiInstance.panelOpen = false;
      break;
    case "/playing":
      document.getElementById("backgroundCanvas").style.display = "block";
      document.querySelector(".background").style.display = "block";
      shared.game.bubbleAnimator.start();
      shared.game.ptmain._pzFollowAspectRatio = false;
      if (window.spec.antiAdditionEnabled)
        if (document.visibilityState !== "hidden")
          window.nativeApi.antiAddiction_leaveGame();
        else
          shared.game.afterShow.push(
            () => window.nativeApi && window.nativeApi.antiAddiction_leaveGame()
          );
      break;
  }
  if (s2) {
    s2.classList.remove("in");
    s2.classList.remove("from");
    s2.classList.add("out");
    setTimeout(() => { s2.classList.add("to"); }, 50);
    setTimeout(() => { s2.style.display = "none"; }, 400);
  }
  if (to.path != "/playing") {
    stage.style.display = "none";
    replayMgr.replaying = false;
  } else {
    stage.style.display = "block";
    shared.game.app.resizeCanvas();
    if (to.query.auto) {
      btnPlay.click();
    }
  }
  const gameAdjustPage = ["/playing"];
  if (gameAdjustPage.includes(from.path) && !gameAdjustPage.includes(to.path)) {
    $("gameAdjust").style.display = "none";
  }
  if (
    ["/chartSelect", "/startPage", "/replayPage", "/loading"].includes(to.path)
  ) {
    document.body.style.overflow = "hidden";
    document.querySelector("div.main").overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
    document.querySelector("div.main").overflow = "auto";
  }
  if (window.spec.isiOSDevice && window.spec.isPhiTogetherApp)
    document
      .querySelectorAll(".textInput")
      .forEach((i) => (i.disabled = !(i.disabled = !i.disabled)));
});

const ptAppInstance = createApp({
  template: document.getElementById("app").innerHTML,
  data() {
    return {
      _pzFollowAspectRatio: false,
      currentRenderer: renderers.simphi,
      mpServerURL: "",
      gameConfig: {
        _followAspectRatio: false,
        account: {
          tokenInfo: null,
          userBasicInfo: null,
          defaultConfigID: null,
          defaultConfig: null,
          pzBestRecords: {},
        },
        ptBestRecords: {},
        showPoint: false,
        showTimer: false,
        JITSOpen: true,
        defaultRankMethod: "score",
        denyChartSettings: false,
        showTransition: true,
        feedback: false,
        imageBlur: true,
        highLight: true,
        showCE2: false,
        lineColor: true,
        showAcc: true,
        showStat: false,
        lowRes: false,
        noUIBlur: false,
        enhanceRankVis: false,
        lockOri: true,
        aspectRatio: "1.5",
        noteScale: "1.15",
        backgroundDim: "0.6",
        volume: "1",
        inputOffset: "0",
        notifyFinished: false,
        isMaxFrame: false,
        maxFrame: 60,
        isForcedMaxFrame: false,
        enableVP: false,
        enableFR: false,
        autoDelay: true,
        usekwlevelOverbgm: false,
        resourcesType: "together-pack-1",
        customChartServer: "ptc.realtvop.top",
        prprRespackID: "",
        enableFilter: false,
        enableLife: true,
        filterInput: "",
        customResourceLink: "",
        autoplay: false,
        competeMode: false,
        fullScreenJudge: false,
        stopWhenNoLife: false,
        useSeparateOffscreenCanvas: false,
        reviewWhenResume: false,
        lastVersion: "lastVer",
      },
      debugEnabled: false,
      multiInstance: null,
      noAccountMode: true,
      gameMode: "single",
      externalHooks: {
        chartLoaded: null,
        playerFinished: null,
      },
      chartOffsetSurface: 0,
      lastLoad: null,
      playConfig: {
        practiseMode: false,
      },
      thisVersion: packageConfig.version,
      afterSimphiLoadedHook: null,
      isSimphiLoaded: false,
      prprRespacks: [],
      canplay: !window.spec.antiAdditionEnabled,
      localeValue: localStorage.getItem("ptlocale"),
    };
  },
  mounted() {
    if (!this.localeValue)
      this.localeValue = navigator.language.replace("-", "_") || "zh_CN";
    this.localeValue = this.localeValue.startsWith("en")
      ? "en_US"
      : `zh_${this.localeValue.endsWith("HK") || this.localeValue.endsWith("TW")
        ? "TW"
        : "CN"
      }`;

    this.$i18n.locale = this.localeValue;
  },
  computed: {
    aspectRatioComputed() {
      if (this.gameConfig._followAspectRatio || this._pzFollowAspectRatio)
        return this._pzFollowAspectRatio ? 1.5 : parseFloat(this.gameConfig.aspectRatio);
      else
        return null;
    },
    chartOffsetActual() {
      return this.chartOffsetSurface * 1 + this.gameConfig.inputOffset * 1;
    },
    canBack() {
      if (this.gameMode === "single") {
        return !["/loading", "/startPage"].includes(this.$route.path);
      } else {
        return (
          this.$route.path === "/chartUpload" &&
          shared.game.multiInstance.user.isOwner
        );
      }
    },
    canSet() {
      if (this.gameMode === "single") {
        return ![
          "/startPage",
          "/settings",
          "/playing",
          "/calibrate",
          "/aboutPage",
          "/chartUpload",
        ].includes(this.$route.path);
      } else {
        return false;
      }
    },
    shouldNotSaveScore() {
      return (
        this.playConfig.practiseMode ||
        this.playConfig.mode === "preview" ||
        shared.game.app.speed != 1 ||
        this.gameConfig.fullScreenJudge ||
        replayMgr.replaying
      );
    },
    shouldNotUploadPhiZone() {
      return this.noAccountMode || this.shouldNotSaveScore;
    },
    userColor() {
      return getUserColor(
        this.gameConfig.account.userBasicInfo
          ? this.gameConfig.account.userBasicInfo.role
          : null
      );
    },
  },
  watch: {
    gameConfig: {
      handler(newVal, oldVal) {
        // localStorage.setItem("PhiTogetherSettings", JSON.stringify(newVal));
        ptdb.gameConfig.save(newVal);

        if (newVal.noUIBlur === loadHandler.useBlur) {
          if (newVal.noUIBlur) document.body.classList.add("noUIBlur");
          else document.body.classList.remove("noUIBlur");
          loadHandler.useBlur = !newVal.noUIBlur;
          loadHandler.refreshBlurState();
        }
      },
      deep: true,
    },
    "gameConfig.prprRespackID": {
      async handler(newVal, oldVal) {
        if (!this.isSimphiLoaded) return;
        if (
          this.gameConfig.resourcesType === "prpr-custom" &&
          newVal !== oldVal &&
          newVal
        ) {
          this.updatePrprCustomRespack();
        }
      },
      deep: true,
    },
    "gameConfig.noteScale": {
      handler(newVal) {
        shared.game.simphi.setNoteScale(Number(newVal));
      },
    },
    debugEnabled: {
      handler(newVal, oldVal) {
        const ele = document.querySelector("#eruda");
        if (newVal) {
          eruda.init({
            container: document.querySelector("#forEruda"),
          });
          ele && (ele.style.display = "block");
        } else {
          ele && (ele.style.display = "none");
        }
      },
    },
    chartOffsetSurface: {
      handler(newVal, oldVal) {
        const lc = sessionStorage.getItem("loadedChart");
        if (!lc) return;
        let saved;
        saved = localStorage.getItem("PTSavedOffsets");
        if (!saved) saved = {};
        else saved = JSON.parse(saved);
        const ct = JSON.parse(lc);
        saved[ct.id] = newVal;
        localStorage.PTSavedOffsets = JSON.stringify(saved);
      },
    },
    "gameConfig.resourcesType": {
      async handler(newVal, oldVal) {
        if (loadHandler.currentId) return;
        if (newVal.startsWith("together-pack") || newVal === "pt-custom") {
          try {
            if (oldVal === "prpr-custom") {
              const cache = await caches.open("PTv0-User");
              await cache.delete("/PTVirtual/user/respack.zip");
            }
          } catch (e) { }
          if (
            newVal.startsWith("together-pack")
          )
            this.currentRenderer.loadRespack("/src/respack/" + newVal);
        } else if (newVal === "prpr-custom") {
          return;
        }
      },
    },
    playConfig: {
      handler(newVal, oldVal) {
        document.getElementById("select-speed").value = newVal.speed || "";
        document.getElementById("select-flip").value = newVal.mirror
          ? "1"
          : "0";
        shared.game.simphi.mirrorView(
          document.getElementById("select-flip").value
        );
        shared.game.simphi.speed =
          2 **
          ({ Slowest: -9, Slower: -4, "": 0, Faster: 3, Fastest: 5 }[
            document.getElementById("select-speed").value
          ] /
            12);
        if (newVal.videoRecorder)
          shared.game.simphiPlugins.videoRecorder.enable();
        else shared.game.simphiPlugins.videoRecorder.disable();
      },
    },
    localeValue: {
      async handler(newVal) {
        this.$i18n.locale = this.localeValue;
        document.getElementById("pageTitle").innerText = this.$t(
          `pages.${this.$route.path.toLocaleLowerCase()}`
        ).toUpperCase();
        localStorage.setItem("ptlocale", newVal);
      },
    },
  },
  methods: {
    loadCustomRes() {
      msgHandler.sendMessage(this.$t("loadingPage.loadingRes"));
      shared.game.simphi.reloadRes(this.gameConfig.customResourceLink, true);
    },
    async removeThisRespack() {
      try {
        await ptdb.skin.delete(this.gameConfig.prprRespackID);
        this.prprRespacks = await ptdb.skin.getAll();
        this.gameConfig.prprRespackID = null;
        msgHandler.sendMessage(i18n.global.t("respack.customResRemoved"));
      } catch {
        msgHandler.sendMessage(i18n.global.t("respack.customResRemoveFailed"));
      }
    },
    uploadCustomRespack() {
      const input = Object.assign(document.createElement("input"), {
        type: "file",
        accept: "",
        /**@this {HTMLInputElement} */
        onchange() {
          const file = this.files[0];
          const reader = new FileReader();
          reader.readAsArrayBuffer(file);
          reader.onload = async (evt) => {
            try {
              const buffer = evt.target.result;
              const id = await shared.game.loadSkinFromBuffer(
                buffer,
                false,
                ptdb.skin.save
              );
              ptmain.prprRespacks = await ptdb.skin.getAll();
              ptmain.gameConfig.prprRespackID = id;
              msgHandler.sendMessage(i18n.global.t("respack.customResApplied"));
            } catch (e) {
              console.err(e);
              ptmain.gameConfig.resourcesType = oldVal;
            }
          };
        },
      });
      input.click();
    },
    openMultiPanel() {
      shared.game.multiInstance.panelOpen = true;
      shared.game.multiInstance.panelChoice = "messages";
    },
    doCalibrate() {
      this.$router.push("/calibrate");
    },
    ptAppPause(i) {
      btnPause.value == "暂停" && btnPause.click(); //
    },
    async modJudgment() {
      try {
        if (this.noAccountMode) {
          msgHandler.failure(this.$t("phizone.modJudgment.offline"));
          return;
        }
        const current = this.gameConfig.account.defaultConfig;
        if (
          await msgHandler.confirm(
            this.$t("phizone.modJudgment.current", [
              current.perfectJudgment,
              current.goodJudgment,
            ]),
            this.$t("info.info"),
            this.$t("info.mod"),
            this.$t("info.cancel")
          )
        ) {
          setTimeout(async () => {
            const res1 = parseInt(
              await msgHandler.prompt(this.$t("phizone.modJudgment.enterPJ"))
            );
            if (isNaN(res1) || !(res1 >= 25 && res1 <= 100)) {
              msgHandler.sendMessage(
                this.$t("phizone.modJudgment.inputDosentMatchRequirement"),
                "error"
              );
              return;
            }
            setTimeout(async () => {
              const res2 = parseInt(
                await msgHandler.prompt(this.$t("phizone.modJudgment.enterGJ"))
              );
              if (isNaN(res2) || !(res2 > res1 && res2 >= 60 && res2 <= 180)) {
                msgHandler.sendMessage(
                  this.$t("phizone.modJudgment.inputDosentMatchRequirement"),
                  "error"
                );
                return;
              }
              try {
                loadHandler.l(
                  this.$t("phizone.modJudgment.modifying"),
                  "modJudgment"
                );
                await phizoneApi.patchSpecConfiguration(
                  this.gameConfig.account.tokenInfo.access_token,
                  this.gameConfig.account.defaultConfigID,
                  {
                    perfectJudgment: res1,
                    goodJudgment: res2,
                  }
                );
                msgHandler.sendMessage(this.$t("phizone.modJudgment.success"));
              } catch {
                msgHandler.sendMessage(
                  this.$t("phizone.modJudgment.error"),
                  "error"
                );
              } finally {
                loadHandler.r("modJudgment");
              }
            }, 500);
          }, 500);
        }
      } catch {
        msgHandler.sendMessage(this.$t("phizone.modJudgment.error"), "error");
        loadHandler.r("modJudgment");
      }
    },
    async genPlayToken() {
      try {
        const chartData = JSON.parse(sessionStorage.getItem("loadedChart"));
        const playInfo = JSON.parse(sessionStorage.getItem("pzPlayInfo"));
        if (
          chartData.isFromPhiZone &&
          (!playInfo || playInfo.for !== chartData.id)
        ) {
          loadHandler.l(this.$t("phizone.scoreUpload.getToken"), "playChart", true, true);
          const resp = await phizoneApi.playChart(
            this.gameConfig.account.tokenInfo.access_token,
            chartData.id,
            this.gameConfig.account.defaultConfigID
          );
          const res = await resp.json();
          res.data.for = chartData.id;
          sessionStorage.setItem("pzPlayInfo", JSON.stringify(res.data));
        }
        loadHandler.r("playChart");
      } catch (e) {
        loadHandler.r("playChart");
        shared.game.msgHandler.failure(
          this.$t("phizone.scoreUpload.getTokenErr")
        );
        return;
      }
    },
    async retry() {
      await this.genPlayToken();
      recordMgr.reset();
      shared.game.restartClearRecord();
    },
    async playChart(settings) {
      if (this.gameMode !== "multi" && !this.shouldNotUploadPhiZone)
        await this.genPlayToken();

      if (settings) this.playConfig = JSON.parse(JSON.stringify(settings));
      this.$router.push({ path: "/playing", query: { auto: 1 } });
      if (shared.game.restartClearRecord) shared.game.restartClearRecord();
    },
    async playFinished() {
      if (
        replayMgr.replaying ||
        (shared.game.multiInstance.room.compete_mode &&
          shared.game.multiInstance.owner)
      ) {
        scoreLoadingAndResultData.display = false;
        return;
      }
      shared.game.finishToRecord && shared.game.finishToRecord();
      const chartData = JSON.parse(sessionStorage.getItem("loadedChart"));
      // const shouldNotUploadPhiZone = this.noAccountMode || typeof chartData.id !== 'number' || this.gameConfig.autoplay || shared.game.app.speed != 1 || this.gameConfig.fullScreenJudge;
      const isMulti = shared.game.ptmain.gameMode === "multi";
      const uploadPhizone = () => {
        return new Promise(async (res) => {
          scoreLoadingAndResultData.display = false;

          if (chartData && chartData.id && chartData.id == "c9e42da0-2149-4037-98be-e50070be9ad6") {
            res(true);
            return; // 水渍 特判
          }
          if (this.shouldNotUploadPhiZone || !chartData.isFromPhiZone) {
            res(true);
            return;
          }
          if (!sessionStorage.getItem("pzPlayInfo")) {
            res(true);
            return;
          }

          const stdDeviation = recordMgr.stdDeviation;

          if(isNaN(stdDeviation) ||stdDeviation === "NaN") {
            res(true);
            return;
          }

          scoreLoadingAndResultData.display = true;
          scoreLoadingAndResultData.text = this.$t(
            "phizone.scoreUpload.uploading"
          );
          scoreLoadingAndResultData.startTime = null;
          scoreLoadingAndResultData.loaded = 0;

          const stat = shared.game.stat;
          const pzStat = {
            chart: chartData.id,
            max_combo: stat.maxcombo,
            perfect: stat.noteRank[4] + stat.noteRank[5] + stat.noteRank[1],
            good_early: stat.noteRank[7],
            good_late: stat.noteRank[3],
            bad: stat.noteRank[6],
            miss: stat.noteRank[2],
            stdDeviation,
          };
          phizoneApi
            .recordEncrypted(pzStat, this.gameConfig.account)
            .then((e) => {
              this.gameConfig.account.userBasicInfo.rks = e.player.rks;
              this.gameConfig.account.userBasicInfo.experience =
                e.player.experience;
              scoreLoadingAndResultData.text = `EXP+${e.experienceDelta} RKS+${(
                e.player.rks - e.rksBefore
              ).toFixed(3)}`;
              scoreLoadingAndResultData.data = {
                name: this.gameConfig.account.userBasicInfo.userName,
                rks: e.player.rks.toFixed(3),
                exp:
                  this.gameConfig.account.userBasicInfo.experience +
                  e.experienceDelta,
              };
              scoreLoadingAndResultData.loaded = 1;
              sessionStorage.removeItem("pzPlayInfo");
              // nmm 这玩意有bug 个🐔8
              phizoneApi
                .getUserBestRecords(
                  this.gameConfig.account.tokenInfo.access_token,
                  e.player.id
                )
                .then(async (e) => {
                  try {
                    this.gameConfig.account.pzBestRecords = e;
                    res(true);
                  } catch {
                    rej(false);
                  }
                });
              res(true);
            })
            .catch(async (e) => {
              loadHandler.r("uploadScore");
              if (
                !(await msgHandler.confirm(
                  this.$t("phizone.scoreUpload.failed"),
                  this.$t("info.error")
                ))
              ) {
                res(true);
                scoreLoadingAndResultData.display = false;
                return;
              }
              await uploadPhizone();
              res(true);
            });
        });
      };
      const savePTCRLocally = () => {
        return new Promise(async (res) => {
          if (this.shouldNotSaveScore || chartData.isFromPhiZone) {
            res(true);
            return;
          }

          try {
            const stat = shared.game.stat;
            const ptStat = {
              chart: chartData.id,
              score: stat.scoreNum.toFixed(0),
              acc: stat.accNum,
              isFC: stat.lineStatus == 3,
            };

            if (!this.gameConfig.ptBestRecords)
              this.gameConfig.ptBestRecords = {};
            const toCompare = this.gameConfig.ptBestRecords[ptStat.chart] || [
              ptStat.score,
              ptStat.acc,
              ptStat.isFC,
            ];
            toCompare[0] = Math.max(toCompare[0], ptStat.score);
            toCompare[1] = Math.max(toCompare[1], ptStat.acc);
            toCompare[2] = toCompare[2] || ptStat.isFC;

            this.gameConfig.ptBestRecords[ptStat.chart] = toCompare;

            res(true);
          } catch (e) {
            res(false);
          }
        });
      };
      // const autoUpload = async () => {
      //   const stat = shared.game.stat;
      //   const ptStat = {
      //     chart: chartData.id,
      //     score: stat.scoreNum.toFixed(0),
      //     acc: stat.accNum,
      //     isFC: stat.lineStatus == 3,
      //   };
      //   recordMgr.chartInfo.playScore = [ptStat.score, ptStat.acc, ptStat.isFC];
      //   const [data, original] = recordMgr.export();
      //   const formData = new FormData();
      //   formData.append("text", data);
      //   formData.append(
      //     "filename",
      //     encodeURI(
      //       `AutoUpload_${original.chartInfo.songData.name}${
      //         original.chartInfo.chartData.level
      //       }${original.chartInfo.chartData.difficulty}-${
      //         original.playerInfo.userName
      //       }-${new Date().format("YmdHis")}.ptr`
      //     )
      //   );
      //   fetch("/record/upload", {
      //     method: "POST",
      //     body: formData,
      //   })
      //     .then(r => r.json())
      //     .then(j => {
      //       if (!j.ce) {
      //         const formData = new FormData();
      //         const meta = JSON.parse(sessionStorage.getItem("chartDetailsData"));
      //         meta.chart = JSON.parse(sessionStorage.getItem("loadedChart"));
      //         formData.append("m", JSON.stringify(meta));
      //         self.hook.oriBuffers.forEach((v, k) => formData.append("f", new Blob([v]), k));
      //         fetch("/record/ctupload", {
      //           method: "POST",
      //           body: formData,
      //         })
      //       }
      //     });
      // };
      await uploadPhizone();
      await savePTCRLocally();
      // await autoUpload();
      if (isMulti) {
        shared.game.multiInstance.uploadScore();
      }
    },
    async playerLoaded() {
      // add lchzh pause
      self.hook.pause = this.ptAppPause;
      // 恢复保存的设置并使其生效
      await ptdb.gameConfig
        .get()
        .catch(() =>
          JSON.parse(localStorage.getItem("PhiTogetherSettings") || "{}")
        )
        .then((parsed) => {
          let upgrade = false;
          for (const item of Object.keys(ptmain.gameConfig)) {
            if (item in parsed) ptmain.gameConfig[item] = parsed[item];
            else upgrade = true;
          }
          if (upgrade) ptdb.gameConfig.save(ptmain.gameConfig);

          for (const item of Object.keys(ptmain.gameConfig)) {
            const val = ptmain.gameConfig[item];
            if (item == "volume") {
              shared.game.app.musicVolume = Math.min(1, 1 / val);
              shared.game.app.soundVolume = Math.min(1, val);
            } else if (item == "aspectRatio") {
              shared.game.stage.resize(Number(val));
            } else if (item == "noteScale") {
              shared.game.app.setNoteScale(Number(val));
            } else if (item == "backgroundDim") {
              shared.game.app.brightness = Number(val);
            } else if (item == "highLight") {
              shared.game.app.multiHint = val;
            } else if (item == "lowRes") {
              shared.game.app.setLowResFactor(
                val ? (window.devicePixelRatio < 2 ? 0.85 : 0.5) : 1
              );
            } else if (item == "enableVP") {
              shared.game.app.enableVP = val;
            } else if (item == "enableFR") {
              shared.game.app.enableFR = val;
            } else if (item == "maxFrame") {
              if (ptmain.gameConfig.isMaxFrame)
                shared.game.frameAnimater.setFrameRate(
                  val,
                  ptmain.gameConfig.isForcedMaxFrame
                );
              else
                shared.game.frameAnimater.setFrameRate(
                  0,
                  ptmain.gameConfig.isForcedMaxFrame
                );
            } else if (item == "enableFilter") {
              $("enableFilter").dispatchEvent(new Event("change"));
            } else if (item == "filterInput") {
              $("filterInput").dispatchEvent(new Event("change"));
            }
          }
        });

      // if (this.gameConfig.noUIBlur) {
      //   // document.getElementById("ptTitle").classList.remove("blur");
      //   loadHandler.useBlur = false;
      //   loadHandler.refreshBlurState();
      //   document.body.classList.add("noUIBlur");
      // }

      // 请求通知权限以便发送通知
      if (!this.gameConfig.notifyFinished) {
        let onerr = (e) => {
          if (window.spec.isPhiTogetherApp) return;
          msgHandler.sendMessage(
            this.$t("askPermission.notification.err"),
            "error",
            false
          );
          this.gameConfig.notifyFinished = true;
        };
        if ("Notification" in self) {
          if (
            await msgHandler.confirm(this.$t("askPermission.notification.msg"))
          ) {
            Notification.requestPermission()
              .then(() => {
                this.gameConfig.notifyFinished = true;
              })
              .catch(onerr);
          } else onerr();
        } else onerr();
      }

      // 版本更新
      try {
        const resp = await fetch(`/latestVersion.json?nocacahe=nocache`);
        const result = await resp.json();
        if (window.spec.thisVersion != result.ver) {
          if (
            await msgHandler.confirm(
              this.$t("update.newVersionNotify", [
                window.spec.thisVersion,
                result.ver,
              ])
            )
          ) {
            this.update();
            return;
          }
        }
      } catch (e) {
        msgHandler.sendMessage(
          this.$t("update.autoUpdateCheckFailed"),
          "error"
        );
      }

      document.addEventListener("fullscreenchange", () => {
        if (full.check(mainCtn)) {
          if (this.$route.path === "/playing") {
            if (!shared.game.app.isFull) shared.game.doFullScreen();
          }
        } else requestFullscreen();
      });

      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
          if (shared.game.afterShow) {
            for (const i of shared.game.afterShow) i();
            shared.game.afterShow = [];
          }
          requestFullscreen();
        }
      });

      const requestLandscape = async () => {
        if (!full.check(mainCtn) && window.innerHeight > window.innerWidth)
          requestFullscreen();
      };

      this.prprRespacks = await ptdb.skin.getAll();

      window.addEventListener("resize", Utils.throttle(requestLandscape, 200));

      setTimeout(requestLandscape, 500);

      const account = this.gameConfig.account;
      if (account.tokenInfo && account.userBasicInfo) {
        this.pzRefreshLogin();
      }

      shared.game.loaded();

      stage.style.display = "none";

      if (searchParams && searchParams.get("play")) {
        this.loadFromRedirect();
      }
    },
    updatePrprCustomRespack() {
      loadHandler.l(this.$t("loadingPage.loadingRes"), "loadResPack");
      shared.game
        .loadSkinFromDB(this.gameConfig.prprRespackID)
        .catch(() =>
          shared.game.msgHandler.sendMessage(
            this.$t("simphi.prprCustomRes.err"),
            "error"
          )
        )
        .then(() => loadHandler.r("loadResPack"));
    },
    async simphiLoaded() {
      if (this.afterSimphiLoadedHook) {
        loadHandler.r("simphiloading");
        this.afterSimphiLoadedHook();
      } else this.afterSimphiLoadedHook = true;
      this.isSimphiLoaded = true;
      if (this.gameConfig.resourcesType === "prpr-custom")
        this.updatePrprCustomRespack();
    },
    async loadFromRedirect() {

      loadHandler.l(this.$t("loadChart.loading"), "loadChartfr");

      try {
        let chartData;
        if (searchParams.get("type") === "pz") {
          chartData = await phizoneApi.getChartAndItsSongAsv1(
            searchParams.get("chart")
          );

          shared.game.judgeManager.setJudgeTime();
          const pzpi = {
            token: searchParams.get("token"),
            for: searchParams.get("chart"),
            timestamp: searchParams.get("timestamp"),
          };
          sessionStorage.setItem("pzPlayInfo", JSON.stringify(pzpi));
          const config = await phizoneApi.getSpecConfiguration(
            "",
            searchParams.get("configuration")
          );
          shared.game.judgeManager.setJudgeTime(
            config.perfectJudgment / 1000,
            config.goodJudgment / 1000,
            config.perfectJudgment / 2000
          );
        } else if (searchParams.get("type") === "custom") {
          chartData = {
            id: searchParams.get("name"),
            // song: searchParams.get("name"),
            charter: searchParams.get("charter"),
            chart: searchParams.get("chart"),
            level: searchParams.get("level"),
            difficulty: searchParams.get("difficulty"),
            ranked: false,
            isFromURL: true,
            song: {
              id: searchParams.get("name"),
              composer: searchParams.get("composer"),
              name: searchParams.get("name"),
              song: searchParams.get("song"),
              edition: "From URL",
              illustration: searchParams.get("illustration"),
              illustrator: searchParams.get("illustrator"),
              bpm: "0",
              duration: "00:00:00",
              preview_start: "00:00:00",
              isFromURL: true,
            },
          };
          if (searchParams.get("mode") === "preview")
            this.playConfig = {
              mode: "preview",
              practiseMode: true,
            };
          if (
            searchParams.get("flag") &&
            searchParams.get("flag").includes("adjustOffset")
          )
            this.playConfig.adjustOffset = true;
          this._pzFollowAspectRatio = true;
        } else if (searchParams.get("type") === "selfUploadChart") {
          if (searchParams.get("mode") === "preview")
            this.playConfig = {
              mode: "preview",
              practiseMode: true,
            };
          if (
            searchParams.get("flag") &&
            searchParams.get("flag").includes("adjustOffset")
          )
            this.playConfig.adjustOffset = true;

          let resources = [];
          if (searchParams.get("illustration"))
            resources.push(
              searchParams.get("illustration") + "?nocacahe=nocache"
            );
          if (searchParams.get("song"))
            resources.push(searchParams.get("song") + "?nocacahe=nocache");
          if (searchParams.get("assets")) {
            try {
              const assets = searchParams.get("assets").split(",");
              for (const asset of assets)
                resources.push(asset + "?nocacahe=nocache");
            } catch { }
          }

          // 清 加载完的东西
          shared.game.clearStat();

          const resNum = resources.length;
          uploader.reset(resNum);
          if (resNum)
            Promise.all(
              resources.map((e) => {
                return fetch(e).then(async (e) => {
                  return e;
                });
              })
            )
              .then(async (responses) => {
                let loaded = 0;
                for (const response of responses) {
                  loaded++;
                  loadHandler.l(
                    this.$t("loadChart.info", { loaded, resNum }),
                    "loadSong"
                  );
                  uploader.fireLoad(
                    { name: response.url },
                    await response.arrayBuffer()
                  );
                }
              })
              .catch((e) => {
                msgHandler.sendMessage(this.$t("loadChart.failed"), "error"),
                  loadHandler.r("loadSong");
              });
          else loadHandler.r("loadChartfr");

          return this.$router.push({
            path: "/chartUpload",
            query: {
              name: searchParams.get("name"),
              composer: searchParams.get("composer"),
              charter: this.cleanStr(searchParams.get("charter")),
              illustrator: searchParams.get("illustrator"),
              level: searchParams.get("level"),
              difficulty: searchParams.get("difficulty"),
              then: "playing",
            },
          });
        }
        loadHandler.l(this.$t("loadChart.loading"), "loadChart");
        this.loadChart(chartData.song, chartData, () => {
          loadHandler.r("loadChartfr");
          loadHandler.r("playChart");
          loadHandler.r("loadChart");
          msgHandler.info(this.$t("simphi.askActionForSound"))
            .then(() => {
              shared.game.ptmain.$router.push({
                path: "/playing",
                query: { auto: 1 },
              });
            })
        });
      } catch (err) {
        msgHandler.sendMessage(
          this.$t("loadChart.failedFromPZRedirect"),
          "error"
        );
        console.error(err);
        loadHandler.r("loadChartfr");
      }
    },
    async pzRefreshLogin() {
      const account = this.gameConfig.account;
      if (account.userBasicInfo.username) {
        // 本地数据还是PZ v1
        return (this.gameConfig.account = {
          tokenInfo: null,
          userBasicInfo: null,
          defaultConfigID: null,
          defaultConfig: null,
          pzBestRecords: {},
          ptBestRecords: {},
        });
      }
      // loadHandler.l("正在自动登录到PhiZone", "login");
      msgHandler.sendMessage(this.$t("phizone.login.autologgingin"), "info");
      phizoneApi
        .refreshLogin(
          account.tokenInfo.refresh_token,
          "refresh_token",
          account.userBasicInfo.userName
        )
        .then(async (e) => {
          account.tokenInfo = e;
          await this.loadUserRelatedInfo(e.access_token);
        })
        .catch(async (e) => {
          // loadHandler.r("login");
          msgHandler.sendMessage(
            this.$t("phizone.login.autologinFailed"),
            "error"
          );
          recordMgr.reset(this.gameConfig.account.userBasicInfo);
        });
    },
    update() {
      caches.delete("PTv0-Main").then(() => {
        const url = `/#${searchParams
          ? `/updateAndPlayChart?${searchParams.toString()}`
          : "update"
          }`;
        fetch(url, {
          headers: {
            Pragma: "no-cache",
            Expires: "-1",
            "Cache-Control": "no-cache",
          },
        }).then(() => {
          window.location.href = url;
          window.location.reload();
        });
      });
    },
    loadUserRelatedInfo(access_token) {
      // loadHandler.l("正在更新用户信息", "login");
      msgHandler.sendMessage(this.$t("phizone.login.updatingUserInfo"), "info");
      return new Promise((res, rej) => {
        const account = this.gameConfig.account;
        phizoneApi
          .getUserBasicInfo(access_token)
          .then(async (e) => {
            account.userBasicInfo = e;

            recordMgr.reset(e);
            phizoneApi.getUserConfigurations(access_token).then(async (e) => {
              try {
                this.noAccountMode = false;
                if (!account.defaultConfigID)
                  (account.defaultConfigID = e[0].id),
                    (account.defaultConfig = e[0]);
                else {
                  const idx = e.findIndex(
                    (f) => f.id == account.defaultConfigID
                  );
                  if (idx == -1)
                    (account.defaultConfigID = e[0].id),
                      (account.defaultConfig = e[0]);
                  else account.defaultConfig = e[idx];
                }
                msgHandler.sendMessage(
                  this.$t("phizone.login.success", {
                    userName: account.userBasicInfo.userName,
                  }),
                  "success",
                  true
                );
                res(true);
              } catch {
                rej(false);
              } finally {
                // loadHandler.r("login");
              }
            });
            phizoneApi
              .getUserBestRecords(access_token, e.id)
              .then(async (e) => {
                try {
                  account.pzBestRecords = e;
                  res(true);
                } catch {
                  rej(false);
                }
              });
          })
          .catch((e) => {
            loadHandler.r("login");
            rej(false);
          });
      });
    },
    cleanStr(i) {
      return (
        i &&
        i.replace(
          new RegExp(
            [
              ...i.matchAll(
                new RegExp(
                  "\\[PZ([A-Za-z]+):([0-9]+):((?:(?!:PZRT]).)*):PZRT\\]",
                  "g"
                )
              ),
            ].length === 0
              ? "\\[PZ([A-Za-z]+):([0-9]+):([^\\]]+)\\]" // legacy support
              : "\\[PZ([A-Za-z]+):([0-9]+):((?:(?!:PZRT]).)*):PZRT\\]",
            "gi"
          ),
          "$3"
        )
      );
    },
    chartLoadedCB() {
      if (this.$route.path === "/chartUpload") {
        shared.game.adjustInfo();
        $("uploader").classList.remove("disabled");
        loadHandler.r("loadChart");
        shared.game.userChartUploaded();
        this.lastLoad = hook.chartsMD5.get(hook.selectchart.value);
        return;
      }

      const chartInfo = JSON.parse(sessionStorage.getItem("loadedChart"));
      const songInfo = JSON.parse(sessionStorage.getItem("chartDetailsData"));
      this.lastLoad = chartInfo.id;
      const inputName = $("input-name");
      const inputArtist = $("input-artist");
      const inputCharter = $("input-charter");
      const inputIllustrator = $("input-illustrator");
      const selectDifficulty = $("select-difficulty");
      const selectLevel = $("select-level");
      inputName.value = songInfo.name;
      inputIllustrator.value = songInfo.illustrator;
      inputArtist.value = songInfo.composer;
      inputCharter.value = this.cleanStr(chartInfo.charter);
      if (typeof chartInfo.difficulty === "string")
        selectLevel.value = chartInfo.difficulty;
      else
        selectLevel.value =
          chartInfo.difficulty === 0
            ? "?"
            : Math.floor(chartInfo.difficulty).toString();
      selectDifficulty.value = chartInfo.level;
      shared.game.updateLevelText(0);
      shared.game.updateLevelText(1);
      let saved;
      saved = localStorage.getItem("PTSavedOffsets");
      if (saved) {
        saved = JSON.parse(saved);
        if (saved[chartInfo.id]) this.chartOffsetSurface = saved[chartInfo.id];
        else this.chartOffsetSurface = 0;
      }
      this.externalHooks.chartLoaded &&
        this.externalHooks.chartLoaded(songInfo, chartInfo);
    },
    loadChart(songInfo, chartInfo, callback) {
      console.log(
        "songInfo: ",
        songInfo,
        "chartInfo: ",
        chartInfo,
        "callback: ",
        callback,
        "-> loadChart"
      );
      if (!this.afterSimphiLoadedHook) {
        loadHandler.l(this.$t("loadChart.simphiLoading"), "simphiloading");
        return (this.afterSimphiLoadedHook = () =>
          this.loadChart(songInfo, chartInfo, callback));
      }
      const speedInfo = {
        val: $("select-speed").selectedIndex,
        disp: $("select-speed").selectedOptions[0].value,
      };
      recordMgr.chartInfo = {
        songData: songInfo,
        chartData: chartInfo,
        speedInfo,
      };
      let resources = [songInfo.illustration, songInfo.song, chartInfo.chart];
      if (chartInfo.assets) resources.push(chartInfo.assets);
      else if (chartInfo.assetsNum) {
        for (let i = 0; i < chartInfo.assetsNum; i++) {
          resources.push(`/PTVirtual/assets/${chartInfo.id}/${i}`);
        }
      }
      sessionStorage.setItem("loadedChart", JSON.stringify(chartInfo));
      sessionStorage.setItem("chartDetailsData", JSON.stringify(songInfo));

      let customRes = chartInfo["customRes"];
      if (!customRes && chartInfo.origin && chartInfo.origin.customRes)
        customRes = chartInfo.origin.customRes;

      if (customRes) shared.game.simphi.reloadRes(customRes);
      else shared.game.simphi.reloadRes();

      this.externalHooks.chartLoaded = callback;
      if (this.lastLoad === chartInfo.id) {
        this.chartLoadedCB();
        return;
      }
      // 清 加载完的东西
      shared.game.clearStat();

      //if (this.isMulti) this.chartLoaded = false; // 多人模式：标记谱面未加载
      const resNum = resources.length;
      // console.log(resNum);
      uploader.reset(resNum);
      // window.debug = { chartInfo, songInfo }
      ptdb.chart.getChartsFiles
        .meta(chartInfo, songInfo)
        .then(async (blobs) => {
          let loaded = 0;
          const responses = {
            song: new Response(blobs[0]),
            illustration: new Response(blobs[1]),
            chart: new Response(blobs[2]),
          };
          for (const i in responses) {
            loaded++;
            loadHandler.l(
              this.$t("loadChart.info", { loaded, resNum }),
              "loadChart"
            );
            uploader.fireLoad(
              { name: `${chartInfo.id}/${i}` },
              await responses[i].arrayBuffer()
            );
          }
          if (blobs[3]) {
            for (const i of blobs[3]) {
              loaded++;
              loadHandler.l(
                this.$t("loadChart.info", { loaded, resNum }),
                "loadChart"
              );
              uploader.fireLoad(
                { name: i.name },
                await new Response(i.file).arrayBuffer()
              );
            }
          }
        })
        .catch((e) => {
          msgHandler.sendMessage(this.$t("loadChart.failed"), "error"),
            loadHandler.r("loadChart");
          console.error(e);
        });
    },
  },
});

const graphicHandler = {
  wpHookList: [],
  resultHookList: [],
  whilePlayingHook: function (ctx, ctxos, lineScale) {
    for (let i = 0; i < this.wpHookList.length; i++) {
      this.wpHookList[i](ctx, ctxos, lineScale);
    }
  },
  resultHook: function (ctx, ctxos) {
    for (let i = 0; i < this.resultHookList.length; i++) {
      this.resultHookList[i](ctx, ctxos);
    }
  },
  register: function (hookType, hookContent) {
    if (hookType == "whilePlayingHook") {
      this.wpHookList.push(hookContent);
    } else if (hookType == "resultHook") {
      this.resultHookList.push(hookContent);
    }
  },
};

let scoreLoadingAndResultData = {
  text: i18n.global.t("phizone.scoreUpload.uploading"),
  loaded: 0,
  startTime: null,
  display: false,
  data: null,
};

function drawRoundRect(ctx, x, y, w, h, r) {
  if (w < 2 * r) {
    r = w / 2;
  }
  if (h < 2 * r) {
    r = h / 2;
  }
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  return ctx;
}

graphicHandler.register("resultHook", function (ctx, ctxos) {
  if (!scoreLoadingAndResultData.display) return;

  if (!scoreLoadingAndResultData.startTime) {
    scoreLoadingAndResultData.startTime = performance.now();
  }
  (ctxos.shadowBlur = 20), (ctxos.shadowColor = "#000000");

  const now = performance.now();

  let text = scoreLoadingAndResultData.text;
  let tmp = (now - scoreLoadingAndResultData.startTime) % 2000;
  const cond1 = now < scoreLoadingAndResultData.loaded;
  if (scoreLoadingAndResultData.loaded === 1) {
    scoreLoadingAndResultData.loaded = now + 2000 - tmp;
    if (tmp > 1000) tmp = 2000 - tmp;
    text = i18n.global.t("phizone.scoreUpload.uploading");
  } else if (scoreLoadingAndResultData.loaded === 0 || cond1) {
    if (tmp > 1000) tmp = 2000 - tmp;
    if (cond1) text = i18n.global.t("phizone.scoreUpload.uploading");
  } else {
    tmp = now - scoreLoadingAndResultData.loaded;
    if (tmp > 1000) tmp = 1000;
  }

  const mt = ctxos.measureText(text);

  let spec = {
    length: mt.width + 350,
    baseY: 975,
  };

  drawRoundRect(
    ctxos,
    960 - spec.length / 2,
    spec.baseY - 40,
    spec.length,
    80,
    30
  );
  ctxos.fillStyle = "#000000";
  ctxos.globalAlpha = (tmp / 1000) * 0.5;
  ctxos.fill();

  ctxos.fillStyle = "#fff";
  ctxos.textAlign = "center";
  ctxos.font = "35px Saira";
  ctxos.globalAlpha = tmp / 1000;
  ctxos.fillText(text, 960, spec.baseY + 5);
});

ptAppInstance.use(router);
ptAppInstance.use(i18n);

const multiPlayerInstance = createApp(multiplayerinst);
multiPlayerInstance.use(i18n);
multiPlayerInstance.mount("#multiplayer");

const ptmain = ptAppInstance.mount("#app");

document.getElementById("app").style.display = "block";

//全局暴露
shared.game.ptmain = ptmain;
shared.game.msgHandler = msgHandler;
shared.game.loadHandler = loadHandler;
shared.game.graphicHandler = graphicHandler;
shared.game.recordMgr = recordMgr;
shared.game.replayMgr = replayMgr;
shared.game.init = true;
shared.game.i18n = i18n.global;
shared.game.afterShow = [];
shared.game.antiAddictionCallback = (canplay) => (ptmain.canplay = canplay);
self.shared = shared;

const $ = (q) => document.getElementById(q);
const stage = $("stage");
const btnPlay = $("btn-play");
const btnPause = $("btn-pause");
const selectflip = $("select-flip");
