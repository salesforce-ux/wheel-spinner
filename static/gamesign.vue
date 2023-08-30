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
  <div class="wrapper">
    <h1 id="game-sign" :style="bgImg">Design with Styling Hooks</h1>
  </div>
</template>

<script>
import './images/sign-dust.png';

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
  left: 50%;
  margin-left: -25vw;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50vw;
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
}
</style>
