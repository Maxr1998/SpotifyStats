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

<script lang="ts" setup>
import {databaseName, historyTableName} from '~/utils/constants'

const loaded = ref(-1)

onBeforeMount(async () => {
  const dbOpenRequest = window.indexedDB.open(databaseName)
  dbOpenRequest.onsuccess = (sender: any) => {
    loaded.value = (sender.target.result.objectStoreNames.contains(historyTableName)) ? 1 : 2;
    dbOpenRequest.result.close();
  }
  dbOpenRequest.onerror = () => {
    loaded.value = 2;
  }
})
</script>
