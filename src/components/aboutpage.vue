<script>
import sponsors from "./sponsors";
export default {
    name: "aboutpage",
    data() {
        return {
            ver: spec.thisVersion,
            vt: 0,
            sponsors,
        };
    },
    computed: {
        getLifeSpan() {
            let launchDate = new Date("March 11, 2023 20:20:00");
            let timeNow = new Date();
            let elapsedTime = (timeNow - launchDate) / 1000;
            let elapsedDays = Math.ceil(elapsedTime) / 86400;
            // console.log(elapsedTime);
            return this.$t("aboutPage.life", [Math.round(elapsedDays)]);
        },
        instanceName() {
            if (partyMgr.list.aprfool2024.activate) return "皮在一起";
            else return "PhiTogether";
        }
    },
    methods: {},
};
</script>

<template>
    <div id="about" style="width: 90%; margin: 0 auto; text-align: left;">
        <div style="display: flex; align-items: center;">
            <div style="display: block; line-height: 1.2em; width: 50%; margin-top: -75px;">
                <img id="aboutLogo" src="/src/core/lg512y512.png" style="margin-top: -40px; width: inherit;"><br>
                <div style="font-size:1.5em;">{{ instanceName }} {{ ver }}</div>
                <div style="color:grey;font-size:.85em;margin-top:10px;">{{ getLifeSpan }}</div>
            </div>

            <div style="display: block; line-height: 1.75em; width: 50%;">
                <div style="height: 25px;"></div>
                <div style="font-size:1.25em;">Made by <b>Team PhiTogether</b> with ❤️</div><br>
                <div style="font-size:1.25em;" v-html="$t('aboutPage.bio')"></div><br>
                <div style="font-size:1.25em;"> {{ $t("aboutPage.QQGuild") }} </div><br>
                <div style="line-height:1.5em;">
                    {{ $t("aboutPage.supportUs") }}
                </div>
                <a style="font-weight: bold;color:rgb(255, 102, 0);" target="_blank"
                    href="https://afdian.net/a/PhiTogether">{{
                    $t("aboutPage.supportus") }}</a><br /><br />
                <div style="font-size:1.08em;">Based on
                    <a target="_blank" href="https://github.com/lchzh3473/sim-phi"
                        style="font-weight:bold; color:midnightblue;">
                        sim-phi
                    </a><br />
                    Special thanks to
                    <a target="_blank" href="https://space.bilibili.com/274753872"
                        style="font-weight:bold; color:midnightblue;">
                        @lchzh3473
                    </a>&nbsp;
                    <a target="_blank" href="https://space.bilibili.com/295247346"
                        style="font-weight:bold; color:midnightblue;">
                        @HERO-科艺-P
                    </a><br /><br />
                    <b> {{ $t("aboutPage.relationshipWithPG") }} </b>
                </div>
            </div>
        </div>
        <br /><br />
        <div style="display: flex;">
            <div style="display: block; line-height: 1.75em; font-size: 120%; width: 50%;">
                {{ $t("aboutPage.roles.projectCreator") }}：<a target="_blank"
                    href="https://space.bilibili.com/343672879" style="font-weight:bold; color:midnightblue;">
                    花降らし
                </a><br />
                {{ $t("aboutPage.roles.developers") }}：<a target="_blank" href="https://space.bilibili.com/343672879"
                    style="font-weight:bold; color:midnightblue;">
                    hxWulgc
                </a> | <a target="_blank" href="https://space.bilibili.com/544365132"
                    style="font-weight:bold; color:midnightblue;">
                    小翁同学
                </a> | <a target="_blank" href="https://space.bilibili.com/484759721"
                    style="font-weight:bold; color:midnightblue;">
                    飞机上的长电视
                </a>
                | <a target="_blank" href="https://space.bilibili.com/472170134"
                    style="font-weight:bold; color:midnightblue;">
                    星鸿SeRazon
                </a><br />
                {{ $t("aboutPage.roles.gameArtist") }}：<a target="_blank" href="https://space.bilibili.com/483612966"
                    style="font-weight:bold; color:midnightblue;">
                    卡西_Quasimodo
                </a> | <a target="_blank" href="https://space.bilibili.com/544365132"
                    style="font-weight:bold; color:midnightblue;">
                    kev1nweng
                </a> | <a target="_blank" href="https://space.bilibili.com/484759721"
                    style="font-weight:bold; color:midnightblue;">
                    realtvop <b
                        style="font-size: 12px; padding-left: 2px; font-weight: normal; color: dimgrey;">(最拉垮)</b>
                </a><br />
                {{ $t("aboutPage.roles.soundDesigner") }}：<a target="_blank" href="https://space.bilibili.com/544365132"
                    style="font-weight:bold; color:midnightblue;">
                    kW <b style="font-size: 12px; padding-left: 2px; font-weight: normal; color: dimgrey;">(已摆烂)</b>
                </a><br />
                {{ $t("aboutPage.roles.visualEffects") }}：<a target="_blank" href="https://space.bilibili.com/343672879"
                    style="font-weight:bold; color:midnightblue;">
                    cgluWxh
                </a><br />
                {{ $t("aboutPage.roles.communityManager") }}：<a target="_blank"
                    href="https://space.bilibili.com/604608241" style="font-weight:bold; color:midnightblue;">
                    小白熊
                </a> | <a target="_blank" href="https://space.bilibili.com/484759721"
                    style="font-weight:bold; color:midnightblue;">
                    长电视下的飞机 <b style="font-size: 12px; padding-left: 2px; font-weight: normal; color: dimgrey;">(逊了)</b>
                </a> | <a target="_blank" href="https://space.bilibili.com/485913861"
                    style="font-weight:bold; color:midnightblue;">
                    土豆上的绿芽 <b
                        style="font-size: 12px; padding-left: 2px; font-weight: normal; color: dimgrey;">(不可食用)</b>
                </a><br /><br /><br />
                {{ $t("aboutPage.thanksToOther") }}
                <br /><br />
                <b style="font-size:1.25em;">
                    {{ $t("aboutPage.externalLinks") }}
                </b><br>
                <a target="_blank" href="https://insider.phizone.cn/" style="font-weight:bold; color:midnightblue;">
                    PhiZone
                </a>
                &nbsp;|&nbsp;
                <a target="_blank" href="https://www.phigrim.cn/" style="font-weight:bold; color:midnightblue;">
                    Phigrim
                </a>
                &nbsp;|&nbsp;
                <a target="_blank" href="https://www.phira.moe/" style="font-weight:bold; color:midnightblue;">
                    Phira
                </a><br />
                <a target="_blank" href="https://blog.xhsr.org.cn/" style="font-weight:bold; color:midnightblue;">
                    星鸿的博客
                </a>
                &nbsp;|&nbsp;
                <a target="_blank" href="https://www.jizhiku.net/" style="font-weight:bold; color:midnightblue;">
                    机智库
                </a>
            </div>
            <div style="display: block; line-height: 1.75em; width: 50%; text-align: justify;">
                <b style="font-size:1.25em;">
                    {{ $t("aboutPage.sponsors") }}
                </b><br>
                <!-- <b v-for="sponsor in sponsors"><br />{{ sponsor }}</b> -->
                {{ sponsors.join(" | ") }}
            </div>
        </div>
    </div>
</template>

<style>
#aboutLogo {
    width: 50%;
}

@media screen and (min-width: 600px) and (max-width: 1500px) {
    #aboutLogo {
        width: 25%;
    }
}

@media screen and (min-width: 1500px) {
    #aboutLogo {
        width: 15%;
    }
}
</style>
