import Vue from 'vue';
import App from './App.vue'

export const alaSqlPromise = import(/* webpackChunkName: "alasql" */ /* webpackMode: "lazy" */ 'alasql');

export const databaseName = "statistics";
export const historyTableName = "history";

const databaseInitialised = new Promise((resolve, reject) => {
    const dbOpenRequest = window.indexedDB.open(databaseName);
    dbOpenRequest.onsuccess = (sender) => {
        if (sender.target.result.objectStoreNames.contains(historyTableName)) resolve();
        else reject("Table doesn't exist!");
        dbOpenRequest.result.close();
    };
});

databaseInitialised.then(() => {
    vueApp.mode = 1;
}).catch(() => {
    vueApp.mode = 2;
});

// noinspection JSUnusedGlobalSymbols
export const vueApp = new Vue({
    el: '#app',
    data() {
        return {
            mode: -1
        }
    },
    render(h) {
        return h(App, {
            props: {
                mode: this.mode
            }
        });
    }
});
window.vueApp = vueApp;