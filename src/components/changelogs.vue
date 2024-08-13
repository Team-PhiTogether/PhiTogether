<script>
import releaseNotes from "./changelogs";
export default {
    name: "changelogs",
    data() {
        return {
            ver: spec.thisVersion,
            vt: 0,
        };
    },
    computed: {
        releaseNotes() { return releaseNotes.releaseNotes; }
    },
    methods: {

    },
};
</script>

<template>
    <div id="changelogs">
        <h1> {{ $t("changelogs.title") }} </h1>
        <div v-for="update in releaseNotes">
            <h2>{{ update.ver }} - {{ update.time }}</h2>
            <ul>
                <li v-for="note in (update.notes[$i18n.locale] || update.notes['zh_CN'])">{{ note }}</li>
            </ul>
        </div>
    </div>
</template>

<style>
#changelogs {
    text-align: left;
    margin-left: 5%;
}
</style>