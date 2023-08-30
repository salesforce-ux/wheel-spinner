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
    <h1 id="game-sign" class="">Hey, this is a game sign!</h1>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        foo: "bar"
      }
    },
    computed: {
    },
    watch: {
    }
  }
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
    color: red;
  }
</style>
