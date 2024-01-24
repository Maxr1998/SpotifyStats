<template>
  <v-container>
    <v-btn block class="mb-5" to="import" x-large>Reimport archive</v-btn>

    <v-select
        v-model="selectedYear"
        :items="stats.years ?? [currentYear]"
        variant="solo"/>

    <v-card :loading="!stats.loaded" class="mb-5">
      <v-card-title>Total play time</v-card-title>
      <v-card-text>{{ stats.playTimeString }}</v-card-text>
    </v-card>

    <v-card :loading="!stats.loaded" class="mb-5">
      <v-card-title>My top artists</v-card-title>
      <v-list-item
          v-for="(artist, i) in stats.artists.slice(0,10)"
          :key="i"
          :subtitle="artist.playTimeString"
          :title="artist.name">
        <template v-slot:prepend>
          <div class="v-list-number" v-text="i + 1"/>
        </template>
      </v-list-item>
    </v-card>

    <v-card :loading="!stats.loaded">
      <v-card-title>My top tracks</v-card-title>
      <v-list-item
          v-for="(track, i) in stats.tracks.slice(0,10)"
          :key="i"
          :subtitle="track.playCount"
          :title="track.name">
        <template v-slot:prepend>
          <div class="v-list-number" v-text="i + 1"/>
        </template>
      </v-list-item>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import alasql from "alasql"
import prettyMilliseconds from 'pretty-ms'
import {databaseName, historyTableName} from '~/utils/constants'

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

const currentYear = new Date().getFullYear()
const selectedYear = ref<number>(currentYear)
const stats = ref<Stats>(new Stats())

async function refreshData(year: number) {
    const currentStats = stats.value
    currentStats.loaded = false

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

    currentStats.years = (await yearsQuery)[2].map((v: any) => v.year)
    currentStats.playTimeMs = (await playTimeQuery)[2][0]['playTime']
    currentStats.playTimeString = prettyMilliseconds(currentStats.playTimeMs, {
        secondsDecimalDigits: 0,
        colonNotation: false
    })
    currentStats.artists = (await artistQuery)[2].map((v: any) => ({
        name: v.artist,
        playTimeMs: v.playTime,
        playTimeString: prettyMilliseconds(v.playTime, {
            secondsDecimalDigits: 0,
            colonNotation: false
        }),
    } as Artist))
    currentStats.tracks = (await topTracksQuery)[2].map((v: any) => ({
        name: v.track,
        playCount: v.playCount,
    } as Track))

    currentStats.loaded = true
}

onBeforeMount(async () => {
    await refreshData(currentYear)
})

watch(selectedYear, async (year) => {
    await refreshData(year)
})
</script>

<style scoped>
/*noinspection CssUnusedSymbol*/
.v-list-item .v-list-number {
    min-width: 48px;
    padding-right: 16px;
    text-align: center;
}
</style>
