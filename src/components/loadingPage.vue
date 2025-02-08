<script>
    import shared from "../utils/js/shared";
    import ploading from "@utils/js/ploading.js";

    export default {
        name: "loadingPage",
        data() {
            return {
                ver: spec.thisVersion,
                loaded: false,
                animated: false,
                currentImageIndex: 0,
            };
        },
        computed: {},
        methods: {
            showNextImage() {
                const images = document.querySelectorAll(".loading-image");
                if (this.currentImageIndex >= images.length) {
                    this.animated = true;
                    if (this.loaded) {
                        if (this.$route.path === "/loading") this.$router.replace("/startPage");
                    } else ploading.l(this.$t("loadingPage.loadingRes"), "loadRes");
                    return;
                }

                images[this.currentImageIndex].style.display = "block";
                setTimeout(() => {
                    if (!images[this.currentImageIndex]) return;
                    images[this.currentImageIndex].style.display = "none";
                    this.currentImageIndex++;
                    this.showNextImage();
                }, 2500);
            },
        },
        activated() {
            if (this.loaded) this.$router.replace("/startPage");
        },
        async mounted() {
            shared.game.loaded = () => {
                this.loaded = true;
                if (window.spec.antiAdditionEnabled)
                    if (document.visibilityState !== "hidden")
                        window.nativeApi.antiAddiction_start();
                    else
                        shared.game.afterShow.push(
                            () => window.nativeApi && window.nativeApi.antiAddiction_start()
                        );
                if (this.animated) {
                    ploading.r("loadRes");
                    if (this.$route.path === "/loading") this.$router.replace("/startPage");
                }
            };

            const untilFullscreen = () => {
                return new Promise(res => {
                    const checkOnce = () => {
                        if (shared.game.requestedFullscreen) res();
                        else setTimeout(checkOnce, 100);
                    };
                    setTimeout(checkOnce, 100);
                });
            };

            await untilFullscreen();

            this.showNextImage();
        },
    };
</script>

<template>
    <div id="loadingPage">
        <img src="/src/core/ptwithtitle.png" class="loading-image" />
    </div>
</template>

<style>
    #loadingPage {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 85vh;
        margin-top: -7.5vh;
        /* top: 50%;
    position: fixed; */
    }

    .loading-image {
        display: none;
        position: absolute;
        max-width: 75%;
        animation: loadingFadeInOutAnimation 2s forwards;
    }

    @keyframes loadingFadeInOutAnimation {
        0%,
        100% {
            opacity: 0;
        }

        25%,
        75% {
            opacity: 1;
        }
    }
</style>
