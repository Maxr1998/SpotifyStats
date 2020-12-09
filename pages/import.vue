<template>
  <v-container>
    <v-card>
      <v-card-title>Select your Spotify GDPR archive</v-card-title>
      <v-card-text>
        You can select the ZIP archive that you downloaded from Spotify here.
        <br>
        It's normally named something like <code>my-spotify-data.zip</code>.
        <br>
        <i>All data is processed locally and will stay on this device. No information will be sent to the server.</i>
      </v-card-text>
      <v-card-text>
        <ImportHistory @success="showStats"/>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

// noinspection JSUnusedGlobalSymbols
export default Vue.extend({
  methods: {
    showStats() {
      this.$nuxt.$router.replace('/')
    }
  }
});
</script>
