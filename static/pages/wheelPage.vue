<!--
Copyright 2020 Google LLC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
-->
<template>
  <div style="height: 100vh; /* 99vh */">
    <div
      id="background-elements"
      :class="{
        'wheel-aside-enter': wheelAside,
      }"
    >
      <div id="background-einstein" class="background-element" :style="bgAstroLeft"></div>
      <div
        id="background-clouds"
        class="background-element"
        :style="bgCloudsMiddle"
      ></div>
      <div id="background-codey" class="background-element" :style="bgCodyRight"></div>
      <!-- <img src="/images/einstein-left.png"/> -->
    </div>

    <div
      v-if="!wheelIsShared"
      :style="$mq == 'desktop' ? 'height: 100vh; /* 99vh */' : ''"
    >
      <toolbar
        default-cruft
        v-on:show-snackbar-message="showSnackbarMessage"
        v-on:reset-wheel="resetWheel()"
        v-on:open-open-dialog="openOpenDialog()"
        v-on:open-save-dialog="openSaveDialog()"
        v-on:open-share-dialog="openShareDialog()"
        v-on:open-customize-dialog="openCustomizeDialog()"
        v-on:open-twitter-dialog="openTwitterDialog()"
        v-on:open-sheet-dialog="openSheetDialog()"
        v-on:open-account-dialog="openAccountDialog()"
        v-on:set-locale="setLocale"
      ></toolbar>
      <section
        class="section slds-align_absolute-center"
        style="height: 100vh; /* 99vh */ ;"
      >
        <spinningwheel
          ref="spinningwheel"
          v-on:wheel-started="wheelStarted"
          v-on:name-changed="nameChanged"
          v-on:wheel-stopped="wheelStopped"
        ></spinningwheel>
      </section>
      <button class="slds-button slds-button--neutral button-reset" @click="resetWheel">
        Reset Wheel
      </button>
    </div>

    <div v-if="wheelIsShared">
      <section class="section" style="">
        <div class="columns">
          <div class="column is-3" style="font-family: Inter">
            <h3 v-if="wheelTitle" class="subtitle is-3">{{ wheelTitle }}</h3>
            <p v-if="wheelDescription">{{ wheelDescription }}</p>
            <br />
            <b-button
              v-if="!wheelIsCopyable"
              :disabled="wheelIsBusy"
              @click="createYourOwn"
            >
              <i class="fas fa-pencil-alt"></i>&nbsp;{{ $t("app.Create your own") }}
            </b-button>
            <b-button v-if="wheelIsCopyable" :disabled="wheelIsBusy" @click="copyWheel">
              <i class="far fa-clone"></i>&nbsp;{{ $t("app.Copy this wheel") }}
            </b-button>
            <muteToggle />
          </div>
          <div class="column is-7">
            <spinningwheel
              ref="spinningwheel"
              v-on:wheel-started="wheelStarted"
              v-on:name-changed="nameChanged"
              v-on:wheel-stopped="wheelStopped"
            ></spinningwheel>
          </div>
        </div>
      </section>
    </div>

    <hr />

    <aboutCards v-if="!fullScreen" />

    <opendialog
      ref="opendialog"
      v-on:show-snackbar-message="showSnackbarMessage"
      v-on:start-wait-animation="startWaitAnimation"
      v-on:stop-wait-animation="stopWaitAnimation"
      v-on:auth-error="authError"
      v-on:reset-wheel-rotation="resetWheelRotation"
      v-on:reset-address-bar="resetAddressBar"
    ></opendialog>
    <savedialog
      ref="savedialog"
      v-on:show-snackbar-message="showSnackbarMessage"
      v-on:start-wait-animation="startWaitAnimation"
      v-on:stop-wait-animation="stopWaitAnimation"
      v-on:auth-error="authError"
      v-on:reset-address-bar="resetAddressBar"
    ></savedialog>
    <optionsdialog
      ref="optionsdialog"
      v-on:show-snackbar-message="showSnackbarMessage"
    ></optionsdialog>
    <sharedialog
      ref="sharedialog"
      v-on:show-snackbar-message="showSnackbarMessage"
      v-on:start-wait-animation="startWaitAnimation"
      v-on:stop-wait-animation="stopWaitAnimation"
      v-on:auth-error="authError"
    ></sharedialog>
    <twitterdialog
      ref="twitterdialog"
      v-on:show-snackbar-message="showSnackbarMessage"
      v-on:start-wait-animation="startWaitAnimation"
      v-on:stop-wait-animation="stopWaitAnimation"
    ></twitterdialog>
    <sheetdialog
      ref="sheetdialog"
      v-on:show-snackbar-message="showSnackbarMessage"
      v-on:auth-error="authError"
    ></sheetdialog>
    <accountdialog
      ref="accountdialog"
      v-on:show-snackbar-message="showSnackbarMessage"
      v-on:start-wait-animation="startWaitAnimation"
      v-on:stop-wait-animation="stopWaitAnimation"
      v-on:auth-error="authError"
    ></accountdialog>
    <mockorg
      ref="mockorg"
      v-on:remove-entry="removeEntry"
      v-on:remove-entry-all="removeEntryAll"
      v-on:hide-entry="hideEntry"
      v-on:dialog-closed="readyTheWheel"
    ></mockorg>
    <winnerdialog
      ref="winnerdialog"
      v-on:remove-entry="removeEntry"
      v-on:remove-entry-all="removeEntryAll"
      v-on:hide-entry="hideEntry"
    ></winnerdialog>
    <titleAndDescriptionDialog
      ref="titleAndDescriptionDialog"
      v-on:setTitleAndDescription="setTitleAndDescription"
    ></titleAndDescriptionDialog>

    <winneranimation ref="winneranimation"> </winneranimation>
    <confetti ref="confetti" v-if="showMeConfetti"></confetti>
    <infoQrcode ref="infoQrcode"></infoQrcode>
  </div>
</template>

<script>
import toolbar from "../toolbar.vue";
import spinningwheel from "../spinningwheel.vue";
import nameTabs from "../nameTabs.vue";
import aboutCards from "../cards/aboutCards.vue";
import opendialog from "../opendialog.vue";
import savedialog from "../savedialog.vue";
import optionsdialog from "../optionsdialog.vue";
import sharedialog from "../sharedialog.vue";
import twitterdialog from "../twitterdialog.vue";
import sheetdialog from "../sheetdialog.vue";
import accountdialog from "../accountdialog.vue";
import winnerdialog from "../winnerdialog.vue";
import mockorg from "../mockorg.vue";
import confetti from "../confetti.vue";
import infoQrcode from "../info-qrcode.vue";
import titleAndDescriptionDialog from "../titleAndDescriptionDialog.vue";
import titleAndDescription from "../titleAndDescription.vue";
import muteToggle from "../muteToggle.vue";
import winneranimation from "../winneranimation.vue";
import * as ConfettiLauncher from "../ConfettiLauncher.js";
import * as Util from "../Util.js";
import PageReloader from "../PageReloader.js";
import * as Audio from "../audio.js";
import * as Locales from "../Locales.js";
import * as i18nSetup from "../i18n-setup.js";
import { mapGetters } from "vuex";

import "../images/einstein-left.png";
import "../images/clouds-middle.png";
import "../images/codey-right.png";

export default {
  components: {
    toolbar,
    spinningwheel,
    nameTabs,
    opendialog,
    mockorg,
    winnerdialog,
    savedialog,
    optionsdialog,
    sharedialog,
    twitterdialog,
    sheetdialog,
    accountdialog,
    winneranimation,
    aboutCards,
    titleAndDescription,
    muteToggle,
    titleAndDescriptionDialog,
    confetti,
    infoQrcode,
  },
  async mounted() {
    this.$store.state.wheel.$t = this.translateMe;
    try {
      await Promise.all([
        i18nSetup.loadLanguage(this.$route.params.lang),
        this.$store.dispatch("loadInitialWheel", this.$route.params.sharedWheelPath),
      ]);
    } catch (ex) {
      Util.trackException(ex);
      alert(ex);
    }
    this.$store.dispatch("loadPreferences");
    this.setDocLangAndTitle();
    this.startFullscreenDetection();
    this.startOnlineDetection();
    this.startVisibilityDetection();
    this.refreshWheelOnFontLoad();
    this.warnInternetExplorerUsers();
  },
  data() {
    return {
      showMeConfetti: false,
      wheelAside: false,
      waitAnimation: {},
      // imgAstroLeft: require('../images/einstein-left.png'),
      bgAstroLeft: "background-image: url('/images/einstein-left.png')",
      bgCloudsMiddle: "background-image: url('/images/clouds-middle.png')",
      bgCodyRight: "background-image: url('/images/codey-right.png')",
      // bgAstroLeftRequire: `background-image: url('${require('../images/einstein-left.png')}')`,
    };
  },
  computed: {
    wheelTitle() {
      if (this.wheelConfig.showTitle) {
        return this.wheelConfig.title;
      }
    },
    wheelDescription() {
      if (this.wheelConfig.showTitle) {
        return this.wheelConfig.description;
      }
    },
    locale() {
      return this.$i18n.locale;
    },
    ...mapGetters([
      "wheelConfig",
      "fullScreen",
      "wheelIsBusy",
      "darkMode",
      "wheelIsShared",
      "wheelIsCopyable",
    ]),
  },
  watch: {
    wheelConfig(newValue, oldValue) {
      Util.updateColorStyles(this.darkMode, "#777", this.wheelConfig.pageBackgroundColor);
      Audio.preloadSounds(newValue.duringSpinSound, newValue.afterSpinSound);
      this.setDocLangAndTitle();
    },
    darkMode() {
      Util.updateColorStyles(this.darkMode, "#777", this.wheelConfig.pageBackgroundColor);
    },
    locale() {
      this.displayLanguageTip();
    },
    wheelAside(newValue, oldValue) {
      console.log("wheelAside", newValue);
      document.body.classList.toggle("wheel-aside-enter", newValue);
    },
  },
  methods: {
    startFullscreenDetection() {
      const self = this;
      document.addEventListener("fullscreenchange", (event) => {
        self.$store.commit("fullScreenChanged");
      });
    },
    startOnlineDetection() {
      const self = this;
      window.addEventListener("online", (event) => {
        self.$store.commit("setOnline", navigator.onLine);
      });
      window.addEventListener("offline", (event) => {
        self.$store.commit("setOnline", navigator.onLine);
      });
    },
    startVisibilityDetection() {
      const reloader = new PageReloader();
      document.addEventListener("visibilitychange", function () {
        reloader.reloadOutdatedPage(document.hidden);
      });
    },
    displayLanguageTip() {
      if (this.wheelIsShared) return;
      const tipLocale = Locales.getLangTipLocale(this.$i18n.locale, navigator.languages);
      if (tipLocale) {
        setTimeout(async () => {
          const file = Locales.getMessagesFileName(tipLocale);
          const messages = (
            await import(/* webpackChunkName: "locale-[request]" */ `../locales/${file}`)
          ).default;
          const msg = messages["app"]["Click the Language menu"];
          this.showSnackbarMessage(msg);
        }, 3000);
      }
    },
    setDocLangAndTitle() {
      document.documentElement.setAttribute("lang", this.$i18n.locale);
      const wheelTitle = this.wheelConfig.title;
      if (wheelTitle) {
        document.title = wheelTitle;
      } else {
        document.title = "... | " + this.$t("app.Random name picker");
      }
      const desc = this.$t("app.Free and easy to use");
      document.querySelector('meta[name="description"]').setAttribute("content", desc);
    },
    refreshWheelOnFontLoad() {
      if (document.fonts) {
        const self = this;
        document.fonts.ready.then(function () {
          self.$refs.spinningwheel.refresh();
        });
      }
    },
    warnInternetExplorerUsers() {
      if (Util.browserIsIE()) {
        this.$buefy.dialog.alert({
          title: this.$t("app.Warning"),
          message: this.$t("app.It looks like you are using Internet Explorer"),
          type: "is-warning",
          hasIcon: true,
          ariaRole: "alertdialog",
          ariaModal: true,
        });
      }
    },
    resetWheel() {
      this.$store.dispatch("resetWheel");
      this.$refs.spinningwheel.resetRotation();
      this.showSnackbarMessage(this.$t("app.Loaded default names and options"));
      this.resetAddressBar();
    },
    openOpenDialog() {
      Util.trackEvent("Wheel", "ShowOpenDialog", "");
      this.$refs.opendialog.show();
    },
    openSaveDialog() {
      Util.trackEvent("Wheel", "ShowSaveDialog", "");
      this.$refs.savedialog.show();
    },
    openShareDialog() {
      Util.trackEvent("Wheel", "GetSharableLink", "");
      this.$refs.sharedialog.show();
    },
    openCustomizeDialog() {
      Util.trackEvent("Wheel", "ShowCustomizeDialog", "");
      this.$refs.optionsdialog.show();
    },
    openTwitterDialog() {
      Util.trackEvent("Wheel", "ShowSocialMediaDialog", "");
      this.$refs.twitterdialog.show();
    },
    openSheetDialog() {
      Util.trackEvent("Wheel", "ShowSpreadsheetDialog", "");
      this.$refs.sheetdialog.show();
    },
    openAccountDialog() {
      Util.trackEvent("Wheel", "ShowAccountDialog", "");
      this.$refs.accountdialog.show();
    },
    nameChanged() {
      if (this.wheelIsBusy && this.wheelConfig.shouldPlayTicks()) {
        Audio.playTick(this.wheelConfig.duringSpinSoundVolume);
      }
    },
    wheelStarted() {
      Audio.startMusic(
        this.wheelConfig.duringSpinSound,
        this.wheelConfig.duringSpinSoundVolume
      );
    },
    wheelStopped(winningEntry) {
      console.log("wheelStopped", winningEntry);
      this.wheelAside = true;
      if(winningEntry.accessible) { this.showMeConfetti = true; }
      Audio.fadeMusic();
      this.$store.commit("addWinner", winningEntry);
      if (this.wheelConfig.animateWinner) {
        this.$refs.winneranimation.show(winningEntry);
      }
      // if (this.wheelConfig.launchConfetti) {
      //   ConfettiLauncher.launch(this.wheelConfig.getCoalescedColors());
      // }
      // this.$refs.confetti.start();
      if (this.wheelConfig.displayWinnerDialog) {
        this.$refs.mockorg.show(winningEntry);
        // this.$refs.winnerdialog.show(winningEntry);
      }
      if (this.wheelConfig.autoRemoveWinner) {
        const duration = 5;
        this.$store.commit("setWheelBusy", true);
        setTimeout((_) => this.removeEntry(winningEntry), 1000 * duration);
        setTimeout((_) => this.$store.commit("setWheelBusy", false), 1000 * duration);
        let toast = this.$buefy.toast.open({
          message: this.$t("app.Removing winner in", { seconds: duration }),
          duration: 1000 * duration,
          queue: false,
        });
        for (let i = duration - 1; i > 0; i--) {
          setTimeout(
            (_) => (toast.message = this.$t("app.Removing winner in", { seconds: i })),
            1000 * (duration - i)
          );
        }
      }
      if (winningEntry.accessible) {
        Audio.playAfterSpin(
          winningEntry.sound || this.wheelConfig.afterSpinSound,
          winningEntry.text,
          this.wheelConfig.afterSpinSoundVolume,
          this.$i18n.locale
        );
      }
    },
    showSnackbarMessage(msg) {
      this.$buefy.toast.open({ message: Util.escapeHtml(msg), duration: 6000 });
    },
    startWaitAnimation() {
      this.waitAnimation = this.$buefy.loading.open({ container: null });
    },
    stopWaitAnimation() {
      this.waitAnimation.close();
    },
    removeEntry(entry) {
      if (this.wheelConfig.playClickWhenWinnerRemoved) {
        Audio.playClick(this.wheelConfig.afterSpinSoundVolume);
      }
      this.$store.commit("removeEntry", entry);
      const msg = this.$t("app.Removed", { name: entry.text });
      this.showSnackbarMessage(msg);
    },
    removeEntryAll(entry) {
      if (this.wheelConfig.playClickWhenWinnerRemoved) {
        Audio.playClick(this.wheelConfig.afterSpinSoundVolume);
      }
      this.$store.commit("removeEntryAll", entry);
      const msg = this.$t("app.Removed", { name: entry.text });
      this.showSnackbarMessage(msg);
    },
    hideEntry(entry) {
      // this is the handler when the dialog close button is clicked
      if (this.wheelConfig.playClickWhenWinnerRemoved) {
        Audio.playClick(this.wheelConfig.afterSpinSoundVolume);
      }
      this.$store.commit("hideEntry", entry);
    },
    authError(ex) {
      const msg = this.$t("app.authError", { error: ex.toString() });
      Util.trackEvent("AuthError", ex.toString(), navigator.userAgent);
      this.$buefy.dialog.alert({
        title: this.$t("app.Error"),
        message: msg,
        type: "is-danger",
        hasIcon: true,
        ariaRole: "alertdialog",
        ariaModal: true,
        onConfirm: () => location.reload(true),
      });
    },
    readyTheWheel() {
      console.log("ready the wheel");
      this.wheelAside = false;
      this.showMeConfetti = false;
      this.$refs.spinningwheel.readyMarkSet();
    },
    resetWheelRotation() {
      this.$refs.spinningwheel.resetRotation();
    },
    resetAddressBar() {
      const url = Locales.getRelativeUrl(location.hostname, this.$i18n.locale);
      window.history.replaceState({}, "", url);
    },
    translateMe(val) {
      return this.$t(val);
    },
    async setLocale(locale) {
      this.$router.push(`/${Util.getNonEnglishLocale(locale)}`).catch((err) => {});
      await i18nSetup.loadLanguage(locale);
      this.setDocLangAndTitle();
    },
    async createYourOwn() {
      this.$store.commit("setUnshared");
      this.$nextTick(async function () {
        await this.$store.dispatch("resetWheel");
      });
      this.$router.push(`/${Util.getNonEnglishLocale(this.$i18n.locale)}`);
    },
    copyWheel() {
      this.$store.commit("clearWinners");
      this.$store.commit("setUnshared");
      this.$router.push(`/${Util.getNonEnglishLocale(this.$i18n.locale)}`);
    },
    openTitleAndDescriptionDialog() {
      this.$refs.titleAndDescriptionDialog.show();
    },
    setTitleAndDescription(params) {
      this.$store.commit("setWheelTitle", params.title);
      this.$store.commit("setWheelDescription", params.description);
    },
  },
};
</script>

<style lang="scss">
body {
  background-color: var(--bg-color, #fff);
  background-image: var(--bg-image);
  background-repeat: no-repeat;
  background-position: var(--bg-position-x, 0) var(--bg-position-y, 0);
  background-size: cover;
  transition-property: background-position-x, transform;
  transition-duration: 1.2s;
  transition-timing-function: ease-in-out;

  &.wheel-aside-enter {
    --bg-position-x: 50%;
  }
}

.can-go-dark {
}

.section {
  padding: 0;
}

.button-reset {
  position: absolute;
  left: 1rem;
  top: 1rem;
  opacity: 0;
  z-index: 100;

  &:hover {
    opacity: 1;
  }
}

#background-elements,
.background-element {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-repeat: no-repeat;
  transition-property: background-position-x, transform;
  transition-timing-function: ease-in-out;
}

#background-einstein {
  background-position: -5% bottom;
  background-size: 30%;
  transition-duration: 1s;
}

#background-clouds {
  background-position: 70vw bottom;
  background-size: 45%;
  transition-duration: 1s;
}

#background-codey {
  background-position: 120vw bottom;
  transition-duration: 1.5s;
  width: 25vw;
  left: auto;
  right: 0;
  background-size: 145%;
  bottom: 0;
  top: auto;
  z-index: 50;
}

.wheel-aside-enter {

  #background-einstein {
    background-position-x: -75%;
  }

  #background-clouds {
    background-position-x: -10vw;
  }

  #background-codey {
    background-position-x: -7vw;
  }
}
</style>
