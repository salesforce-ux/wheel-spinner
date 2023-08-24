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
  <b-modal :active.sync="winnerDialogVisible" full-screen scroll="keep">
    <div class="modal-card" style="width: auto">
      <section class="modal-card-body can-go-dark">


        <!-- <img src="/images/org-mock-82-100-100.jpg" style="vertical-align: middle" /> -->
        <iframe :src="iframeUrl"></iframe>

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
      <footer class="modal-card-foot" style="justify-content: flex-end">
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

export default {
  data() {
    return {
      MOCK_ORG_URL: "https://df23-styling-hooks-518c2f9ded87.herokuapp.com/",
      winnerDialogVisible: false,
      winnerText: "",
      winnerImage: "",
      winnerEntry: "",
      iframeUrl: "",
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
    show(winnerEntry) {
      console.log("winnerEntry", winnerEntry);
      this.winnerEntry = winnerEntry;
      this.winnerText = winnerEntry.text;
      this.winnerImage = winnerEntry.image;
      this.winnerDialogVisible = true;
      this.iframeUrl = `${this.MOCK_ORG_URL}?display-mode&color=${winnerEntry.color.substring(1)}`;
      this.setFocusOnRemoveButton();
    },
    setFocusOnRemoveButton() {
      this.$nextTick(() => {
        setTimeout(() => {
          if (this.$refs.removeButton) this.$refs.removeButton.$el.focus();
        }, 100);
      });
    },
    close() {
      this.winnerDialogVisible = false;
      this.$emit("dialog-closed", this.winnerEntry);
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
  },
};
</script>

<style>
iframe {
  width: 75%;
  height: 100%;
  margin-left: 25%;
}
button.modal-close {
  display: none;
}
</style>
