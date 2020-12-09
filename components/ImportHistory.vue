<template>
  <input @change="handleFiles()" ref="data" type="file" accept="application/zip">
</template>

<script lang="ts">
import Vue from 'vue';
import JSZip, {JSZipObject} from 'jszip';
import alasql from 'alasql';
import {databaseName, historyTableName} from '~/pages/index.vue';

// noinspection JSUnusedGlobalSymbols
export default Vue.extend({
  methods: {
    handleFiles() {
      const zipFile = (this.$refs.data as any).files[0];

      JSZip.loadAsync(zipFile).then((zip) => {
        const historyFiles = zip.filter((relPath, entry) => entry.name.includes("StreamingHistory"));
        historyFiles.forEach(this.importHistory)
      });
    },
    async importHistory(historyFile: JSZipObject) {
      const component = this;

      console.log("Importing " + historyFile.name);
      const historyJson = await historyFile.async("string");
      const history = JSON.parse(historyJson);
      alasql('\
        CREATE INDEXEDDB DATABASE IF NOT EXISTS ' + databaseName + '; \
        ATTACH INDEXEDDB DATABASE ' + databaseName + '; \
        USE ' + databaseName + '; \
        DROP TABLE IF EXISTS ' + historyTableName + '; \
        CREATE TABLE ' + historyTableName + '; \
        SELECT artistName, trackName, msPlayed, endTime INTO ' + historyTableName + ' FROM ?; \
        CREATE INDEX idx_artistName ON ' + historyTableName + ' (artistName);', [history], function () {
        component.$emit("success");
      });
    }
  }
});
</script>
