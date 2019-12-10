<template>
    <input @change="handleFiles()" ref="data" type="file" accept="application/zip">
</template>

<script>
    import JSZip from 'jszip';
    import { alaSqlPromise, databaseName, historyTableName } from "./../index";

    function handleFiles() {
        const zipFile = this.$refs.data.files[0];

        JSZip.loadAsync(zipFile).then((zip) => {
            const historyFiles = zip.filter((relPath, entry) => entry.name.includes("StreamingHistory"));
            historyFiles.forEach(importHistory)
        });
    }

    async function importHistory(historyFile) {
        console.log("Importing " + historyFile.name);
        const historyJson = await historyFile.internalStream("string").accumulate(null);
        const history = JSON.parse(historyJson);
        const alaSql = (await alaSqlPromise).default;
        alaSql('\
        CREATE INDEXEDDB DATABASE IF NOT EXISTS ' + databaseName + '; \
        ATTACH INDEXEDDB DATABASE ' + databaseName + '; \
        USE ' + databaseName + '; \
        DROP TABLE IF EXISTS ' + historyTableName + '; \
        CREATE TABLE ' + historyTableName + '; \
        SELECT artistName, trackName, msPlayed, endTime INTO ' + historyTableName + ' FROM ?; \
        CREATE INDEX idx_artistName ON ' + historyTableName + ' (artistName);', [history], function() {
            window.vueApp.mode = 1;
        });
    }

    // noinspection JSUnusedGlobalSymbols
    export default {
        methods: {
            handleFiles
        }
    }
</script>