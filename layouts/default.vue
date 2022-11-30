<template>
  <v-app dark>
    <v-app-bar fixed app>
      <v-toolbar-title v-text="title"/>
      <v-spacer/>
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt/>
      </v-container>
    </v-main>
    <v-footer app absolute>
      <span>Made by <a href="https://maxr1998.de">Maxr1998</a>.</span>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
// noinspection JSUnusedGlobalSymbols
export default {
  data() {
    return {
      title: 'SpotifyStats',
    }
  }
}
</script>
