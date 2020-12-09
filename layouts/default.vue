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
      <span>&copy; {{ new Date().getFullYear() }}</span>
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
