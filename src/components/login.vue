<script>
import { PhiZoneAPI as phizoneApi } from "../utils/phizone";
import { TapTapApi } from "../utils/phizone/taptap";
import shared from "../utils/js/shared.js";
export default {
    name: "login",
    data() {
        return {
            username: "",
            password: "",
            taptapAvailable: false,
            taptapToBind: null,
            taptapTapped: false,
        };
    },
    mounted() {
        this.taptapAvailable = window.nativeApi && window.nativeApi.loginWithTapTap;
    },
    methods: {
        jumpReg() {
            location.href =
                "https://www.phi.zone/session/register?redirect=" +
                encodeURIComponent(location.href);
        },
        async doLogin() {
            const msgHandler = shared.game.msgHandler;
            if (!this.username || !this.password) {
                msgHandler.sendMessage(this.$t("login.usernameAndPasswordCantBeEmpty"), "error");
                return;
            }
            msgHandler.sendMessage(this.$t("login.loggingin"));
            phizoneApi
                .refreshLogin(this.password, "password", this.username)
                .then(e => {
                    shared.game.ptmain.gameConfig.account.tokenInfo = e;
                    shared.game.ptmain
                        .loadUserRelatedInfo(e.access_token)
                        .then(async () => {
                            if (!this.taptapToBind) this.$router.back();
                            else {
                                // console.log(this.taptapToBind)
                                if (
                                    await msgHandler.confirm(
                                        this.$t("login.askTapTapBinding", {
                                            username: this.taptapToBind.name,
                                        })
                                    )
                                ) {
                                    msgHandler.sendMessage(this.$t("login.bindingTapTap"));
                                    phizoneApi
                                        .bindTapTap(e.access_token, this.taptapToBind.unionId)
                                        .then(e => {
                                            msgHandler.sendMessage(
                                                this.$t("login.bindTapTapSuccess"),
                                                "success",
                                                true
                                            );
                                            this.$router.back();
                                        })
                                        .catch(() => {
                                            msgHandler.sendMessage(
                                                this.$t("login.bindTapTapFailure"),
                                                "error",
                                                true
                                            );
                                        });
                                } else {
                                    this.$router.back();
                                }
                            }
                        })
                        .catch(() => {});
                })
                .catch(e => {
                    shared.game.loadHandler.r();
                    msgHandler.failure(e);
                });
        },
        async loginWithTapTap() {
            if (this.taptapTapped) return;
            this.taptapTapped = true;
            const msgHandler = shared.game.msgHandler;
            await TapTapApi.loginWithTapTap()
                .then(e => {
                    // this.$router.back();
                    msgHandler.sendMessage(this.$t("login.loggingin"));
                    phizoneApi
                        .refreshLogin(e.accessToken, "password", e.macKey, true)
                        .then(e => {
                            // console.log(e)
                            this.$router.back();
                            shared.game.ptmain.gameConfig.account.tokenInfo = e;
                            shared.game.ptmain
                                .loadUserRelatedInfo(e.access_token)
                                // .then(() => this.$router.back())
                                .catch(() => {});
                        })
                        .catch(() => {
                            msgHandler.failure(this.$t("login.noTapTapBinding"));
                            this.taptapToBind = e;
                            this.taptapAvailable = false;
                        });
                })
                .catch(() => {});
            this.taptapTapped = false;
        },
    },
};
</script>

<template>
    <div id="loginPage" class="routerRealPage">
        <h1 class="loginPageRow" style="font-size: 2em">{{ $t("phizone.login.withPhiZone") }}</h1>
        <div class="loginPageRow">
            {{ $t("login.email") }}：
            <input
                class="input textInput"
                style="width: calc(100% / 2)"
                v-model="username"
                autocomplete="username"
            />
        </div>
        <div class="loginPageRow">
            {{ $t("login.passwd") }}：
            <input
                class="input textInput"
                v-model="password"
                style="width: calc(100% / 2)"
                type="password"
                autocomplete="current-password"
                @keyup.enter="doLogin"
            />
        </div>
        <div class="loginPageRow">
            <input
                type="button"
                style="width: auto; font-size: 1.5em"
                :value="$t('login.signin')"
                @click="doLogin()"
            />
            <input
                type="button"
                style="width: auto; font-size: 1.5em"
                :value="$t('login.signup')"
                @click="jumpReg()"
            />
        </div>
        <h1 class="loginPageRow" style="font-size: 2em" v-if="taptapAvailable">
            {{ $t("phizone.login.withTapTap") }}
        </h1>
        <div class="loginPageRow">
            <img
                src="/src/core/loginWithTapTap.png"
                style="width: 10em"
                v-if="taptapAvailable"
                @click="loginWithTapTap()"
                alt="Login With TapTap"
            />
        </div>
    </div>
</template>

<style>
#loginPage {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    align-content: center;
    margin-top: 50px;
}

.loginPageRow {
    width: 100%;
    margin: 10px;
}

.loginPageRow input:not([type="button"]) {
    width: 70%;
    height: 2em;
}

.loginPageRow input[type="button"] {
    font-size: 1.6em;
    width: 40%;
    margin: 6px;
}
</style>
