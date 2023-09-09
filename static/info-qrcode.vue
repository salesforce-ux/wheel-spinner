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
  <div class="wrapper slds-hide">
    <button class="slds-button slds-button_icon" title="More Options">
      <span class="slds-icon_container slds-icon_container_circle slds-icon-action-info" title="Description of icon when needed">
        <!-- <svg class="slds-icon" aria-hidden="true">
          <use xlink:href="/assets/icons/action-sprite/svg/symbols.svg#info"></use>
        </svg> -->
        <img src="https://cdn.jsdelivr.net/npm/@salesforce-ux/design-system@2.21.5/assets/icons/action/info.svg"/>
        <span class="slds-assistive-text">Description of icon when needed</span>
      </span>
    </button>
  </div>
</template>

<script>

export default {
  data() {
    return {
      bgImg: "background-image: url('/images/sign-dust.png')",
    };
  },
  computed: {},
  watch: {},
};
</script>

<style scoped>
.wrapper {
  position: absolute;
  top: 3rem;
  margin-left: 50vw;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
}
h1 {
  font-family: ITC Avant Garde, sans-serif;
  font-weight: 800;
  color: #fff;
  background: no-repeat center center;
  background-color: #371493;
  background-size: contain;
  border-radius: 10rem;
  font-size: 4rem;
  vertical-align: middle;
  padding-inline: 8rem;
  line-height: 1.66;
  white-space: nowrap;
}
</style>
