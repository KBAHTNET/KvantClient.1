<template>
<div class="tree-wrapper">
  <div class="folder" v-for="(folder, index) in data.folders" :key="index"></div>
  <div class="file" v-for="(file, index) in data.files" :key="index"></div>
</div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped>
</style>