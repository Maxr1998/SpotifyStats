<template>
  <v-container>
    <v-btn block class="mb-5" to="import" x-large>Reimport archive</v-btn>

    <v-select
      :items="this.stats.years ?? [currentYear]"
      :value="this.stats.years ? this.stats.years[0] : currentYear"
      solo
      v-on:change="refreshData"/>

    <v-card :loading="!this.stats.loaded" class="mb-5">
      <v-card-title>Total play time</v-card-title>
      <v-card-text>{{ this.stats.playTimeString }}</v-card-text>
    </v-card>

    <v-card :loading="!this.stats.loaded" class="mb-5">
      <v-card-title>My top artists</v-card-title>
      <v-list-item v-for="(artist, i) in this.stats.artists.slice(0,10)" :key="i">
        <div class="v-list-number" v-text="i + 1"/>
        <v-list-item-content>
          <v-list-item-title>{{ artist.name }}</v-list-item-title>
          <v-list-item-subtitle>{{ artist.playTimeString }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-card>

    <v-card :loading="!this.stats.loaded">
      <v-card-title>My top tracks</v-card-title>
      <v-list-item v-for="(track, i) in this.stats.tracks.slice(0,10)" :key="i">
        <div class="v-list-number" v-text="i + 1"/>
        <v-list-item-content>
          <v-list-item-title>{{ track.name }}</v-list-item-title>
          <v-list-item-subtitle>{{ track.playCount }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import alasql from "alasql"
import prettyMilliseconds from 'pretty-ms'
import {databaseName, historyTableName} from '~/pages/index.vue'

const attachStatement = `ATTACH INDEXEDDB DATABASE ${databaseName};USE ${databaseName};`

class Stats {
  loaded: boolean = false
  years: Array<number> | null = null
  playTimeMs: number = 0
  playTimeString: string = ''
  artists: Array<Artist> = []
  tracks: Array<Track> = []
}

interface Artist {
  name: string
  playTimeMs: number
  playTimeString: string
}

interface Track {
  name: string
  playCount: number
}

// noinspection JSUnusedGlobalSymbols
export default Vue.extend({
  data() {
    return {
      currentYear: new Date().getFullYear(),
      stats: new Stats(),
    }
  },
  async beforeMount() {
    await this.refreshData(this.currentYear)
  },
  methods: {
    async refreshData(year: number) {
      const stats = this.stats
      stats.loaded = false

      const yearsQuery = alasql.promise(`
        ${attachStatement}
        SELECT DISTINCT SUBSTRING(ts, 1, 4) ::number AS year
        FROM ${historyTableName}
        ORDER BY year DESC;`
      )
      const playTimeQuery = alasql.promise(`
        ${attachStatement}
        SELECT SUM(ms_played) AS playTime
        FROM ${historyTableName}
        WHERE ts LIKE "${year}%";`
      )
      const artistQuery = alasql.promise(`
        ${attachStatement}
        SELECT artist, SUM(ms_played) AS playTime
        FROM ${historyTableName}
        WHERE ts LIKE "${year}%"
        GROUP BY artist
        ORDER BY playTime DESC;`
      )
      const topTracksQuery = alasql.promise(`
        ${attachStatement}
        SELECT track, COUNT(*) AS playCount
        FROM ${historyTableName}
        WHERE ts LIKE "${year}%"
          AND ms_played > 3000
        GROUP BY track, artist
        ORDER BY playCount DESC;`
      )
      const artistCountQuery = alasql.promise(`
        ${attachStatement}
        SELECT artist, COUNT(*) AS playCount
        FROM ${historyTableName}
        WHERE ts LIKE "${year}%"
          AND ms_played > 3000
        GROUP BY artist
        ORDER BY playCount DESC;`
      )

      stats.years = (await yearsQuery)[2].map((v: any) => v.year)
      stats.playTimeMs = (await playTimeQuery)[2][0]['playTime']
      stats.playTimeString = prettyMilliseconds(stats.playTimeMs, {
        secondsDecimalDigits: 0,
        colonNotation: false
      })
      stats.artists = (await artistQuery)[2].map((v: any) => ({
        name: v.artist,
        playTimeMs: v.playTime,
        playTimeString: prettyMilliseconds(v.playTime, {
          secondsDecimalDigits: 0,
          colonNotation: false
        }),
      } as Artist))
      stats.tracks = (await topTracksQuery)[2].map((v: any) => ({
        name: v.track,
        playCount: v.playCount,
      } as Track))

      stats.loaded = true
    }
  }
})
</script>

<style>
/*noinspection CssUnusedSymbol*/
.v-list-item > .v-list-number {
  min-width: 48px;
  padding-right: 16px;
  text-align: center;
}
</style>
