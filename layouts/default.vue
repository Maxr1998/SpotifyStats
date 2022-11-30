<template>
  <v-app dark>
    <v-app-bar fixed app>
      <v-toolbar-title v-text="title"
                       @click="$router.push('/')"
                       style="cursor:pointer"/>
      <v-spacer/>
      <v-btn icon href="//github.com/Maxr1998/SpotifyStats" target="_blank">
        <v-icon>mdi-github</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt/>
      </v-container>
    </v-main>
    <v-footer app absolute>
      <span>Made by <a href="https://maxr1998.de">Maxr1998</a>. This site is not affiliated with Spotify AB.</span>
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
