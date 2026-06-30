<template>
  <div class="trashschedule-vis2-wrapper">
    <TrashSchedule
      :id="id"
      :data="data"
      :style="style"
    />
  </div>
</template>

<script setup>
import TrashSchedule from './TrashSchedule.vue';

defineProps({
  id: {
    type: String,
    default: '',
  },
  data: {
    type: Object,
    default: () => ({}),
  },
  style: {
    type: Object,
    default: () => ({}),
  },
});
</script>

<style scoped>
.trashschedule-vis2-wrapper {
  width: 100%;
  height: 100%;
}
</style>
