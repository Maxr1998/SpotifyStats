<template>
    <div id="app">
        <h1>Spotify Stats</h1>
        <Stats v-if="mode === 1"/>
        <ImportHistory v-else-if="mode === 2"/>
    </div>
</template>

<script>
    export default {
        components: {
            ImportHistory: () => import(/* webpackChunkName: "ImportHistory" */ './components/ImportHistory.vue'),
            Stats: () => import(/* webpackChunkName: "Stats" */ './components/Stats.vue')
        },
        props: {
            mode: Number
        }
    }
</script>