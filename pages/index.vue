<template>
  <v-container>
    <Stats v-if="loaded === 1"/>
    <v-card v-else-if="loaded === 2">
      <v-card-title>No data loaded</v-card-title>
      <v-card-text>
        You may want to
        <NuxtLink to="import">import</NuxtLink>
        your Spotify data export.
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';

export const databaseName = "statistics";
export const historyTableName = "history";

// noinspection JSUnusedGlobalSymbols
export default Vue.extend({
  data() {
    return {
      loaded: -1
    }
  },
  async created() {
    const dbOpenRequest = window.indexedDB.open(databaseName);
    dbOpenRequest.onsuccess = (sender: any) => {
      this.loaded = (sender.target.result.objectStoreNames.contains(historyTableName)) ? 1 : 2;
      dbOpenRequest.result.close();
    };
    dbOpenRequest.onerror = () => {
      this.loaded = 2;
    };
  },
  methods: {
    showStats() {
      this.loaded = 1;
    }
  }
});
</script>

<style lang="scss" scoped>
@import '~vuetify/src/styles/styles.sass';
</style>
