<template>
  <div class="modal-confirm">
    <h3>Confirm Action</h3>
    <div class="modal-actions">
      <button class="btn btn-cancel" @click="$emit('cancel')">Cancel</button>
      <button class="btn btn-confirm" @click="$emit('confirm')">Confirm</button>
    </div>
  </div>
</template>

<script setup>
import "./ModalConfirm.scss";
</script>
