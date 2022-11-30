<template>
  <input @change="handleFiles()" ref="data" type="file" accept="application/zip">
</template>

<script lang="ts">
import Vue from 'vue'
import JSZip, {JSZipObject} from 'jszip'
import alasql from 'alasql'
import {databaseName, historyTableName} from '~/pages/index.vue'

const attachStatement = `ATTACH INDEXEDDB DATABASE ${databaseName};USE ${databaseName};`

// noinspection JSUnusedGlobalSymbols
export default Vue.extend({
  methods: {
    handleFiles() {
      const zipFile = (this.$refs.data as any).files[0]
      console.log("Received zip file " + zipFile.name)

      JSZip.loadAsync(zipFile).then((zip) => {
        const streamingHistoryFiles = zip.filter((relPath, _) => relPath.includes('StreamingHistory') && relPath.endsWith('.json'))
        const extendedStreamingHistoryFiles = zip.filter((relPath, _) => relPath.includes('endsong_') && relPath.endsWith('.json'))
        if (streamingHistoryFiles.length > 0) {
          this.importHistory(streamingHistoryFiles, [null, 'artistName', 'trackName', null, 'msPlayed', 'endTime'])
        } else if (extendedStreamingHistoryFiles.length > 0) {
          this.importHistory(
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
        }
      })
    },
    async importHistory(historyFiles: JSZipObject[], columns: (string | null)[]) {
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
        await alasql.promise(`
            ${attachStatement}
            SELECT ${columns[0]} as uri,
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
      this.$emit("success")
    }
  }
})
</script>
