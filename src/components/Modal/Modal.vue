<template>
  <div class="modal-container">
    <h3>Confirm Action</h3>
    <div>
      <button @click="$emit('confirm')">Confirm</button>
      <button @click="$emit('delete')">Delete</button>
      <!-- <button @click="$emit('edit')">Edit</button> -->
    </div>
  </div>
</template>

<script setup>
import "./Modal.scss";
</script>
