<template>
  <section class="side-card">
    <h3 class="card-title">{{ title }}</h3>
    <slot class="card-content" />
  </section>
</template>

<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<style scoped lang="scss">
.side-card {
  // background-color: $my-bg-card;
  transition:
    background-color 0.3s,
    border-color 0.3s;
}

.card-title {
  margin-bottom: 12px;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 1px;
  color: $my-text-light;
}
</style>
