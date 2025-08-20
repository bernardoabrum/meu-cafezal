<template>
  <h1>App</h1>
  <Maps />
</template>

<script>
import { Maps } from "./components";

export default {
  name: "App",
  components: { Maps },
};
</script>

<style>
html,
body,
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: Arial, Helvetica, sans-serif;
}
</style>
