import JSZip from 'jszip';
import {alaSqlPromise, databaseName, getStats, historyTableName} from "./index";

const zipInput = $("#zip-input");
zipInput.on("change", handleFiles);

function handleFiles() {
    const fileList = this.files;
    const zipFile = fileList[0];

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
        CREATE INDEX idx_artistName ON ' + historyTableName + ' (artistName);', [history], getStats);
}