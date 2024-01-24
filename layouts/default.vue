<template>
  <v-app dark>
    <v-app-bar app fixed>
      <v-app-bar-title
          style="cursor:pointer"
          @click="$router.push('/')">
        SpotifyStats
      </v-app-bar-title>
      <v-spacer/>
      <v-btn
          :icon="mdiGithub"
          href="//github.com/Maxr1998/SpotifyStats"
          target="_blank"/>
    </v-app-bar>
    <v-main>
      <v-container>
        <slot/>
      </v-container>
    </v-main>
    <v-footer absolute app>
      <span>Made by <a href="https://maxr1998.de">Maxr1998</a>. This site is not affiliated with Spotify AB.</span>
    </v-footer>
  </v-app>
</template>
<script lang="ts" setup>
import {mdiGithub} from '@mdi/js'
</script>
