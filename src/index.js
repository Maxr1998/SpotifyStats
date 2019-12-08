const databaseName = "statistics";
const historyTableName = "history";

const statsSection = $(".stats-section");
const importSection = $(".import-section");

const databaseInitialised = new Promise((resolve, reject) => {
    const dbOpenRequest = window.indexedDB.open(databaseName);
    dbOpenRequest.onsuccess = (sender) => {
        if (sender.target.result.objectStoreNames.contains(historyTableName)) resolve();
        else reject("Table doesn't exist!");
        dbOpenRequest.result.close();
    };
});

function getStats() {
    return import(/* webpackChunkName: "stats" */ './stats').then(() => {
        statsSection.show();
        importSection.hide();
    });
}

function getHistory() {
    return import(/* webpackChunkName: "importHistory" */ './import_history').then(() => {
        statsSection.hide();
        importSection.show();
    });
}

databaseInitialised.then(() => {
    getStats();
}).catch(() => {
    getHistory();
});

module.exports = {
    databaseName, historyTableName,
    getStats, getHistory,
    alaSqlPromise: import(/* webpackChunkName: "alasql" */ /* webpackMode: "lazy" */ 'alasql')
};