<template>
  <v-container>
    <v-btn block x-large to="import" class="mb-5">Reimport archive</v-btn>

    <v-select :items="this.years" :value="this.years[0]" v-on:change="refreshData" solo/>

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
import Vue from 'vue';
import alasql from "alasql";
import prettyMilliseconds from 'pretty-ms'
import {databaseName, historyTableName} from '~/pages/index.vue';

const attachStatement = 'ATTACH INDEXEDDB DATABASE ' + databaseName + '; USE ' + databaseName + '; ';

class Stats {
  loaded: Boolean = false;
  playTimeMs: Number = 0;
  artists: Array<Artist> = [];
  tracks: Array<Track> = [];
}

interface Artist {
  name: String
  playTimeMs: Number
  playTimeString: String
}

interface Track {
  name: String
  playCount: Number
}

// noinspection JSUnusedGlobalSymbols
export default Vue.extend({
  data() {
    return {
      years: Array.from({length: 6}, (value, key) => (2020 - key).toString()),
      stats: new Stats(),
    };
  },
  async beforeMount() {
    this.refreshData("2020");
  },
  methods: {
    async refreshData(year: string) {
      const stats = this.stats;
      stats.loaded = false;

      const playTimeQuery = alasql.promise(`${attachStatement}
        SELECT SUM(msPlayed) AS playTime FROM ${historyTableName}
        WHERE endTime LIKE "${year}%"`);
      const artistQuery = alasql.promise(`${attachStatement}
        SELECT artistName, SUM(msPlayed) AS playTime FROM ${historyTableName}
        WHERE endTime LIKE "${year}%"
        GROUP BY artistName ORDER BY playTime DESC;`);
      const topTracksQuery = alasql.promise(`${attachStatement}
        SELECT trackName, COUNT(*) AS playCount FROM ${historyTableName}
        WHERE endTime LIKE "${year}%"
        GROUP BY trackName, artistName ORDER BY playCount DESC;`);
      const artistCountQuery = alasql.promise(`${attachStatement}
        SELECT artistName, COUNT(*) AS playCount FROM ${historyTableName}
        WHERE endTime LIKE "${year}%"
        GROUP BY artistName ORDER BY playCount DESC;`);

      stats.playTimeMs = (await playTimeQuery)[2][0].playTime;
      stats.artists = (await artistQuery)[2].map((v: any) => ({
        name: v.artistName,
        playTimeMs: v.playTime,
        playTimeString: prettyMilliseconds(v.playTime, {
          secondsDecimalDigits: 0,
          colonNotation: false
        }),
      } as Artist));
      stats.tracks = (await topTracksQuery)[2].map((v: any) => ({
        name: v.trackName,
        playCount: v.playCount,
      } as Track));

      stats.loaded = true;
    }
  }
});
</script>

<style type="text/scss">
.v-list-item > .v-list-number {
  min-width: 48px;
  padding-right: 16px;
  text-align: center;
}
</style>
