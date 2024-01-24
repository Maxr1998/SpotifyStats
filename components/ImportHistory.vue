<template>
  <div>
    <input ref="data" accept="application/zip" type="file" @change="handleFiles()">

    <v-snackbar
        v-model="error"
        :timeout="2000"
        color="error">
      No streaming history files found in the zip file
    </v-snackbar>
  </div>
</template>

<script lang="ts" setup>
import JSZip, {JSZipObject} from 'jszip'
import alasql from 'alasql'
import {databaseName, historyTableName} from '~/utils/constants'

const attachStatement = `ATTACH INDEXEDDB DATABASE ${databaseName};USE ${databaseName};`

const data = ref<any>(null)
const error = ref(false)

const emit = defineEmits({
    success: () => true,
})

function handleFiles() {
    const zipFile = data.value.files[0]
    console.log(typeof data.value)
    console.log("Received zip file " + zipFile.name)

    JSZip.loadAsync(zipFile).then((zip) => {
        const streamingHistoryFiles = zip.filter((relPath, _) => relPath.includes('StreamingHistory') && relPath.endsWith('.json'))
        const extendedStreamingHistoryFiles = zip.filter((relPath, _) =>
            (relPath.includes('endsong_') || relPath.includes('Streaming_History_Audio')) && relPath.endsWith('.json')
        )
        if (streamingHistoryFiles.length > 0) {
            importHistory(streamingHistoryFiles, [null, 'artistName', 'trackName', null, 'msPlayed', 'endTime'])
        } else if (extendedStreamingHistoryFiles.length > 0) {
            importHistory(
                extendedStreamingHistoryFiles,
                [
                    'spotify_track_uri',
                    'master_metadata_album_artist_name',
                    'master_metadata_track_name',
                    'master_metadata_album_album_name',
                    'ms_played',
                    'ts',
                ]
            )
        } else {
            console.log("No streaming history files found in zip")
            error.value = true
        }
    })
}

async function importHistory(historyFiles: JSZipObject[], columns: (string | null)[]) {
    await alasql.promise(`
        CREATE INDEXEDDB DATABASE IF NOT EXISTS ${databaseName};
        ${attachStatement}
        DROP TABLE IF EXISTS ${historyTableName};
        CREATE TABLE ${historyTableName};`
    )
    for (const historyFile of historyFiles) {
        console.log("Importing " + historyFile.name)
        const historyJson = await historyFile.async("string")
        const history = JSON.parse(historyJson)
        // noinspection SqlNoDataSourceInspection
        await alasql.promise(
            `${attachStatement}
            SELECT ${columns[0]} AS uri,
                   ${columns[1]} AS artist,
                   ${columns[2]} AS track,
                   ${columns[3]} as album,
                   ${columns[4]} AS ms_played,
                   ${columns[5]} AS ts
            INTO ${historyTableName}
            FROM ?;`,
            [history],
        )
    }
    emit("success")
}
</script>
