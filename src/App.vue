<template>
  <h1>App</h1>
  <Demarcate />
</template>

<script>
import { Demarcate } from "./pages";

export default {
  name: "App",
  components: { Demarcate },
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
