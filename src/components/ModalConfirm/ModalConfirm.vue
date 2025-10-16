<template>
  <div class="cmp-modal-confirm">
    <h3>Are you sure?</h3>
    <div>
      <button @click="$emit('delete')">Delete</button>
      <button @click="$emit('confirm')">Confirm</button>
    </div>
  </div>
</template>

<script setup>
import "./ModalConfirm.scss";
</script>
