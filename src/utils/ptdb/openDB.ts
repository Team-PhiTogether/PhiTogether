import { upgradeDB } from "./upgrade";

const openedDB = {};

/**
 * 打开PT主数据库
 * @param {string} [dbName=PTv0] - 数据库名称
 * @param {number} [ver=1] - 数据库版本
 */
function openDB(dbName: string = "PTv0", ver: number = 1): Promise<IDBDatabase> {
    return new Promise((res, rej) => {
        if (openedDB[dbName]) return res(openedDB[dbName]);
        if (!window.indexedDB) rej("IndexedDB Not Found");
        const req = window.indexedDB.open(dbName, ver);
        req.onerror = e => rej(e);
        req.onsuccess = e => res(openedDB[dbName] = req.result);
        req.onupgradeneeded = e => {
            const target = e.target as IDBRequest;
            upgradeDB(target.result);
            const transaction = target.transaction as IDBTransaction;
            transaction.oncomplete = e => res(openedDB[dbName] = target.result);
        };
    });
}

export { openDB };
export default openDB;