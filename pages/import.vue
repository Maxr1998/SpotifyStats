<template>
  <v-container>
    <v-card>
      <v-card-title>Select your Spotify GDPR archive</v-card-title>
      <v-card-text>
        You can select the ZIP archive that you downloaded from Spotify here.
        Both account data and extended streaming history are supported.
        Use extended streaming history for best results.
        <br>
        The file is normally named something like <code>my-spotify-data.zip</code>.
        <br>
        <i>
          Note: All data is processed locally in your browser and won't leave this device.
          No information is transmitted to the server.
        </i>
      </v-card-text>
      <v-card-text>
        <ImportHistory @success="showStats"/>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
useHead({
    title: 'Import archive',
})

function showStats() {
    useNuxtApp().$router.replace('/')
}
</script>
