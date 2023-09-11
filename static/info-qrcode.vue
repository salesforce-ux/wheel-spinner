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
  <div class="wrapper" ref="wrapper">
    <button
      class="slds-button slds-button_icon"
      title="More Options"
      @click="handleIconClick"
      ref="button"
    >
      <span
        class="slds-icon_container slds-icon_container_circle slds-icon-action-info"
        title="Description of icon when needed"
      >
        <!-- <svg class="slds-icon" aria-hidden="true">
          <use xlink:href="/assets/icons/action-sprite/svg/symbols.svg#info"></use>
        </svg> -->
        <img
          src="https://cdn.jsdelivr.net/npm/@salesforce-ux/design-system@2.21.5/assets/icons/action/info.svg"
        />
        <span class="slds-assistive-text">Description of icon when needed</span>
      </span>
    </button>
    <section
      aria-label="Dialog title"
      aria-describedby="popover-qr-code"
      class="slds-popover slds-nubbin_right-bottom"
      role="dialog"
      ref="popover"
    >
      <div id="popover-qr-code" class="slds-popover__body">
        <img src="/images/qrcode.jpg" />
      </div>
    </section>
  </div>
</template>

<script>
import "./images/qrcode.jpg";

export default {
  data() {
    return {};
  },
  computed: {},
  methods: {
    handleIconClick(event) {
      const wrapper = this.$refs.wrapper;
      wrapper.classList.toggle("open");
    },
  },
  watch: {},
};
</script>

<style scoped lang="scss">
.wrapper {
  position: absolute;
  right: 1rem;
  bottom: 1.5rem;
  margin-left: 50vw;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 200;
}

button.slds-button {
  opacity: 0.33;

  .open & {
    opacity: 1;
  }
}

.slds-popover {
  display: none;
  .open & {
    display: block;
  }
}

section.slds-popover {
  position: absolute;
  height: auto;
  bottom: 0.625rem;
  right: 6rem;
  /* transform: translateX(-50%); */

  img {
    display: block;
  }
}
</style>
