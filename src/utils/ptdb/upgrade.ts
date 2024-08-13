import { ObjectStores } from "./ObjectStores";

/**
 * 升级数据库
 * @version 1
 * @param {IDBDatabase} db - 数据库
 * @returns {IDBDatabase} 升级后的数据库
*/
export function upgradeDB(db: IDBDatabase): IDBDatabase {
    // 使用者数据
    const userData = db.createObjectStore(ObjectStores.UserData, { keyPath: 'id' });

    // 谱面库
    const chart = db.createObjectStore(ObjectStores.Chart, { keyPath: "id" });
    chart.createIndex("levelId", "levelId", { unique: false });
    chart.createIndex("level", "level", { unique: false });
    chart.createIndex("difficulty", "difficulty", { unique: false });
    chart.createIndex("charter", "charter", { unique: false });
    chart.createIndex("md5", "md5", { unique: true });
    chart.createIndex("song", "song", { unique: false });
    
    // 曲目库
    const song = db.createObjectStore(ObjectStores.Song, { keyPath: "id" });
    song.createIndex("name", "name", { unique: false });
    song.createIndex("composer", "composer", { unique: false });
    
    const skin = db.createObjectStore(ObjectStores.Skin, { keyPath: "id" });
    skin.createIndex("name", "name", { unique: false });

    return db;
}