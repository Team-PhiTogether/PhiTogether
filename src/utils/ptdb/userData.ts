import openDB from "./openDB";
import { GameConfig, defaultGameConfig } from "../ptmain/types/GameConfig";

/**
 * 保存用户设置
 * @param {Object} gameConfig - ptAppInstance中的gameConfig
 */
export function saveGameConfig(gameConfig: GameConfig | Object, id: string = "gameConfig") {
    if (!gameConfig) gameConfig = id === "gameConfig" ? defaultGameConfig : {};
    return new Promise((res, rej) => {
        gameConfig = JSON.parse(JSON.stringify(gameConfig));
        openDB()
            .then(db => {
                const objStore = db.transaction(['userData'], 'readwrite').objectStore('userData');
                const getReq = objStore.get(id);
                getReq.onsuccess = e => {
                    if (getReq.result) objStore.put({ id, gameConfig });
                    else objStore.add({ id, gameConfig });
                    res(true);
                };
                getReq.onerror = e => rej(e);
            })
            .catch(e => rej(e));
        });
}

/**
 * 读取用户设置
 */
export function getGameConfig(id: string = "gameConfig", defaultConfig?: Object): Promise<Object | null> {
    return new Promise((res, rej) => {
        openDB()
            .then(db => {
                const objStore = db.transaction(['userData']).objectStore('userData');
                const getReq = objStore.get(id);
                getReq.onsuccess = async e => {
                    const result = getReq.result;
                    if (result) res(result.gameConfig)
                    else if (defaultConfig) {
                        await saveGameConfig(defaultConfig, id);
                        res(defaultConfig);
                    } else rej(e);
                };
                getReq.onerror = e => rej(e);
            })
            .catch(e => rej(e));
    });
}

interface ParsedGameConfig {
    gameConfig: GameConfig,
    ptBestRecords: Object | null,
}
/**
 * Parse gameConfig(废)
 */
function parseGameConfig(gameConfig: GameConfig): ParsedGameConfig {
    const parsed: ParsedGameConfig = {
        gameConfig: {
            account: {
                tokenInfo: null,
                userBasicInfo: null,
                defaultConfigID: null,
                defaultConfig: null,
                pzBestRecords: null,
            },
            showPoint: false,
            showTimer: false,
            JITSOpen: false,
            defaultRankMethod: "",
            denyChartSettings: false,
            showTransition: false,
            feedback: false,
            imageBlur: false,
            highLight: false,
            showCE2: false,
            lineColor: false,
            showAcc: false,
            showStat: false,
            lowRes: false,
            noUIBlur: false,
            enhanceRankVis: false,
            lockOri: false,
            aspectRatio: "",
            noteScale: "",
            backgroundDim: "",
            volume: "",
            inputOffset: "",
            notifyFinished: false,
            isMaxFrame: false,
            maxFrame: 0,
            isForcedMaxFrame: false,
            enableVP: false,
            enableFR: false,
            autoDelay: false,
            usekwlevelOverbgm: false,
            resourcesType: "",
            enableFilter: false,
            filterInput: "",
            customResourceLink: "",
            autoplay: false,
            competeMode: false,
            customChartServer: "",
            fullScreenJudge: false,
            stopWhenNoLife: false,
            useSeparateOffscreenCanvas: false,
            reviewWhenResume: false,
        },
        ptBestRecords: null,
    };
    for (const i in gameConfig) {
        switch (i) {
            case "ptBestRecords":
                parsed.ptBestRecords = gameConfig.ptBestRecords || {};
                break;
            default:
                parsed.gameConfig[i] = gameConfig[i];
        }
    }
    return parsed;
}