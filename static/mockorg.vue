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
  <b-modal :active.sync="winnerDialogVisible" full-screen scroll="keep" :onCancel="closeModal" :class="{
    'result-enter': introResult,
  }" >
    <div class="modal-card" style="width: auto">
      <section class="modal-card-body can-go-dark">


        <!-- <img src="/images/result-screens/org-mock-82-100-100.jpg" style="vertical-align: middle" /> -->
        <div class="result-screen-container">
          <!--
            <iframe id="result-screen-base" :src="iframeBaseUrl" @load="onIframeLoaded"></iframe>
            <iframe id="result-screen-overlay" :src="iframeOverlayUrl" @load="onIframeLoaded"></iframe>
          -->
          <img id="result-screen-base" :src="iframeBaseUrl" @load="onImgLoaded"/>
          <img id="result-screen-overlay" :src="iframeOverlayUrl" @load="onImgLoaded"/>
        </div>
        <!-- <h1 class="title">
          <img v-if="winnerImage" :src="winnerImage" style="height:200px;vertical-align:middle">
          <span v-if="winnerTextIsLink">
            <a target="_new" :href="winnerText">
              {{winnerText}}
            </a>
          </span>
          <span v-if="!winnerTextIsLink">
            {{winnerText}}
          </span>
        </h1> -->
      </section>
      <footer class="modal-card-foot" style="justify-content: flex-start">
        <b-field grouped group-multiline>
          <p class="control">
            <b-button size="is-medium" @click="close">
              {{ $t("common.Close") }}
            </b-button>
          </p>
          <p class="control default-cruft" v-show="showRemoveButton">
            <b-button
              size="is-medium"
              type="is-info"
              ref="removeButton"
              @click="removeWinner"
            >
              {{ $t("winnerdialog.Remove") }}
            </b-button>
          </p>
          <p class="control default-cruft" v-show="showRemoveAllButton">
            <b-button size="is-medium" type="is-primary" @click="removeWinnerAll">
              {{ $t("winnerdialog.Remove all instances") }}
            </b-button>
          </p>
          <p class="control default-cruft" v-show="showHideButton">
            <b-button size="is-medium" type="is-primary" @click="hideWinner">
              {{ $t("winnerdialog.Hide") }}
            </b-button>
          </p>
        </b-field>
      </footer>
    </div>
  </b-modal>
</template>

<script>
import * as Util from "./Util.js";
import { mapGetters } from "vuex";
import './images/result-screens/blue-50.png';
import './images/result-screens/cloud-blue-60.png';
import './images/result-screens/green-70.png';
import './images/result-screens/hot-orange-60.png';
import './images/result-screens/indigo-40.png';
import './images/result-screens/orange-70.png';
import './images/result-screens/pink-50.png';
import './images/result-screens/purple-40.png';
import './images/result-screens/red-50.png';
import './images/result-screens/teal-70.png';
import './images/result-screens/violet-30.png';
import './images/result-screens/yellow-80.png';


export default {
  data() {
    return {
      winnerDialogVisible: false,
      winnerText: "",
      winnerImage: "",
      winnerEntry: "",
      iframeBaseUrl: "",
      iframeOverlayUrl: "",
      iframeBaseLoaded: false,
      iframeOverlayLoaded: false,
      introResult: false,

    };
  },
  computed: {
    winnerMessage() {
      return this.winnerEntry.message || this.wheelConfig.winnerMessage;
    },
    winnerTextIsLink() {
      const re = /https?:\/\//;
      return re.test(this.winnerText);
    },
    showRemoveButton() {
      return this.wheelConfig.displayRemoveButton && !this.wheelConfig.autoRemoveWinner;
    },
    showRemoveAllButton() {
      const winnerInstances = Util.getOccurences(
        this.wheelConfig.getTexts(),
        this.winnerText
      );
      const displayRemoveButton = this.wheelConfig.displayRemoveButton;
      const autoRemoveWinner = this.wheelConfig.autoRemoveWinner;
      return displayRemoveButton && !autoRemoveWinner && winnerInstances > 1;
    },
    showHideButton() {
      return (
        this.wheelConfig.isAdvanced &&
        !this.wheelIsShared &&
        this.wheelConfig.displayHideButton &&
        !this.wheelConfig.autoRemoveWinner
      );
    },
    ...mapGetters(["wheelConfig", "wheelIsShared"]),
  },
  methods: {
    closeModal(howClosed) {
      console.log("modal closed:", howClosed);
      this.winnerDialogVisible = false;
      this.introResult = false;
      this.$emit("dialog-closed", this.winnerEntry);
    },
    startKeyListener() {
      document.addEventListener("keyup", (event) => {
        console.log("mockorg keyup", event);
      });
    },
    show(winnerEntry) {
      console.log("winnerEntry", winnerEntry);
      this.handleResultDisplay();
      this.winnerEntry = winnerEntry;
      this.winnerText = winnerEntry.text;
      this.winnerImage = winnerEntry.image;
      this.winnerDialogVisible = true;
      this.iframeBaseUrl = this.getImgUrl(winnerEntry.colorName, winnerEntry.colorTint);
      this.iframeOverlayUrl = this.getImgUrl(winnerEntry.colorName, winnerEntry.colorTint);
      this.setFocusOnRemoveButton();
    },
    getImgUrl(colorName, colorTint) {
      return `/images/${colorName.replace(" ", "-").toLowerCase()}-${colorTint}.png`;
    },
    setFocusOnRemoveButton() {
      this.$nextTick(() => {
        setTimeout(() => {
          if (this.$refs.removeButton) this.$refs.removeButton.$el.focus();
        }, 100);
      });
    },
    close() {
      console.log("close", this.winnerEntry);
      this.closeModal("close");
    },
    removeWinner() {
      this.$emit("remove-entry", this.winnerEntry);
      this.winnerDialogVisible = false;
    },
    removeWinnerAll() {
      this.$emit("remove-entry-all", this.winnerEntry);
      this.winnerDialogVisible = false;
    },
    hideWinner() {
      this.$emit("hide-entry", this.winnerEntry);
      this.winnerDialogVisible = false;
    },
    onIframeLoaded(e) {
      // This method is called when the iframe DOMContentLoaded event is emitted
      console.log('The iframe DOMContentLoaded event has been emitted!', e.target);
      // this.introResult = true;
      console.log("e.target.id", e.target.id);
      if(e.target.id === "result-screen-base") this.iframeBaseLoaded = true;
      if(e.target.id === "result-screen-overlay") this.iframeOverlayLoaded = true;
    },
    onImgLoaded(e) {
      // This method is called when the image DOMContentLoaded event is emitted
      console.log(`The image ${e.type} event has been emitted!`, e.target);
      if(e.target.id === "result-screen-base") this.iframeBaseLoaded = true;
      if(e.target.id === "result-screen-overlay") this.iframeOverlayLoaded = true;
    },
    handleResultDisplay() {
      let intervalCheck;
      // make a timeout for 4 seconds, that then creates an interval for every second
      setTimeout(() => {
        this.introResult = false;
        intervalCheck = setInterval(() => {
          console.log("intervalCheck", this.iframeBaseLoaded, this.iframeOverlayLoaded);
          if (this.iframeBaseLoaded && this.iframeOverlayLoaded) {
            clearInterval(intervalCheck);
            this.introResult = true;
          }
        }, 1200);
      }, 3200);
    }
  },
  mounted() {
    this.startKeyListener();
  },
};
</script>

<style lang="scss">
.modal button.modal-close {
  visibility: hidden;
}
.modal footer .field {
  &,
  .control,
  .control button  {
    width: 100%;
  }
}

.modal footer button {
  padding-block: 40px;
  opacity: 0;
  &:hover {
    opacity: 0.5;
  }
}
</style>

<style lang="scss" scoped>
section {
  position: relative;
  overflow-y: hidden;
}

.result-screen-container {
  // border: 8px solid rebeccapurple;
  position: relative;
  width: 60%;
  height: 100%;
  margin-inline: auto;
  margin-top: 4%;

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: auto;
  }
}

.modal.is-active, .result-leave-active, .result-enter-active {
  .result-screen-container {
    transition: transform 0.8s ease-in-out;
    transform: translateY(50vw);
  }
  img {
    transition: opacity 1.2s ease-in-out;
    opacity: 0;
  }
}
.modal.is-active.result-enter {
  .result-screen-container {
    transform: translateY(0vw);
  }

  #result-screen-base {
    transition-delay: 0.6s;
    opacity: 1;
    -webkit-filter: grayscale(100%);
    -moz-filter: grayscale(100%);
    -ms-filter: grayscale(100%);
    -o-filter: grayscale(100%);
    filter: grayscale(100%);
  }

  #result-screen-overlay {
    transition-delay: 2.4s;
    opacity: 1;
  }
}

</style>
