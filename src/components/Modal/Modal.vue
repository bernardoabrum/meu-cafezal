<template>
  <div class="cmp-modal">
    <h3>Are you sure?</h3>
    <div>
      <button @click="$emit('confirm')">Confirm</button>
      <button @click="$emit('delete')">Delete</button>
    </div>
  </div>
</template>

<script setup>
import "./Modal.scss";
</script>
