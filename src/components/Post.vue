<template>
  <div class="post">
    <img
      @click="showMenuModal(post.id)"
      class="post-more"
      src="/icons/more.svg"
      alt=""
    />
    <PostCard
      :id="post.id"
      :title="post.title"
      :body="post.body"
      :preview="
        post.hasOwnProperty('images') && post.images.length > 0
          ? '/getpostfilebypath?file=' + post.images[0].file
          : ''
      "
      :date="new Date(post.date).toLocaleDateString()"
      :likes="post.likes"
      :comments="post.comments"
    />
    <MenuModal
      class="menu"
      v-if="showMenu"
      @close="closeMenuModal"
      :buttons="[
        {
          text: 'Открыть',
          click: () => {
            this.$router.push('/posts/' + this.postIdClicked);
          },
        },
        { text: 'В избранное', link: '' },
        {
          text: 'Удалить',
          click: () => {
            this.deletePost();
          },
        },
      ]"
    />
  </div>
</template>

<script>
import PostCard from "@/components/PostCard";
import MenuModal from "@/components/MenuModal";
export default {
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  data: () => {
    return {
      postIdClicked: "",
      showMenu: false,
    };
  },
  methods: {
    closeMenuModal() {
      this.showMenu = false;
      console.log("close");
    },
    showMenuModal(id) {
      this.showMenu = !this.showMenu;
      this.postIdClicked = id;
    },
    async deletePost() {
      console.log("try delete post");
      console.log(this.postIdClicked);
      await fetch("/deletepost/" + this.postIdClicked, { method: "POST" })
        .then((res) => res.text())
        .then((text) => {
          this.$emit("postDeleted");
          console.log(text);
          this.showMenu = false;
        })
        .catch((e) => {
          this.emit("errorDelete", e.message);
        });
    },
  },
  components: {
    PostCard,
    MenuModal,
  },
};
</script>

<style scoped>
.post {
  margin: 0 auto;
  min-width: 60%;
  max-width: 95%;
  margin-bottom: 10px;
  padding: 50px;
  background-color: var(--theme-color);
  border-radius: 5px;
  position: relative;
  display: grid;
  justify-content: stretch;
  align-content: stretch;
  justify-items: center;
  align-items: center;
}
.post-more {
  position: absolute;
  height: 35px;
  width: 20px;
  right: 15px;
  top: 10px;
}
.post-more:hover {
  background-color: var(--primary-color);
  border-radius: 20px;
}
.menu {
  padding-left: 50px;
}
</style>