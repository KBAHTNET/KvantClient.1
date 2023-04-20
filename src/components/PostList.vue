<template>
  <div class="posts">
    <Post
      v-for="(post, index) in posts"
      :key="index"
      :post="post"
      @postDeleted="showMessage"
      @errorDelete="showErrorMessage"
    />
    <SuccessWindow text="Пост удален" ref="modal" />
    <ErrorWindow ref="error_modal" />
  </div>
</template>

<script>
import Post from "@/components/Post";
import SuccessWindow from "@/components/SuccessWindow";
import ErrorWindow from "@/components/ErrorWindow";
export default {
  props: {
    posts: {
      type: Array,
      default: [],
    },
  },
  data: () => {
    return {};
  },
  methods: {
    showMessage() {
      this.$refs["modal"].ShowWindow();
    },
    showErrorMessage(message) {
      this.$refs["error-modal"].ShowWindow(message);
    },
  },
  components: {
    Post,
    SuccessWindow,
    ErrorWindow,
  },
};
</script>

<style scoped>
.posts {
  height: 90%;
  width: 100%;

  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: repeat(auto-fit, 1fr);
  justify-content: end;
  
  padding: 10px;
}
</style>