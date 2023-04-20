<template>
  <Preview :text2="nickname" :imgSrc="avatar" @click="showMenuModal" />
  <div class="wrapper">
    <ProgressPage class="progress-bar" />
    <div class="userpage-buttons">
      <div @click="showCreatePostForm" class="user-actionbtn create-postbutton">
        <div class="action-text">Создать пост</div>
      </div>
      <div class="user-actionbtn create-categorybutton">
        <div class="action-text">Добавить категорию</div>
      </div>
    </div>
    <div class="categories-tabs">
      <div
        class="category"
        v-for="(category, index) in [
          'Общее',
          'Избранное',
          'Категория1',
          'Категория2',
          'Категория3',
        ]"
        :key="index"
      >
        <div class="category-name">{{ category }}</div>
      </div>
    </div>
    <FlatInput class="finding" label="Поиск" />
    <div class="posts-wrapper">
      <PostList
        @postDeleted="getPosts"
        :posts="posts"
        v-if="posts && posts.length > 0"
      />
      <div class="no-posts" v-if="!isLoadedUserData && posts?.length == 0">
        Нет ни одного поста
      </div>
    </div>
    <div class="loading-form" v-if="isLoadedUserData">
      <RingLoader class="loader" />
    </div>
    <MenuModal
      v-if="showMenu"
      @close="closeMenuModal"
      :buttons="[
        { text: 'Моя страница', link: '/' },
        { text: 'Контакты', link: '/contacts' },
        { text: 'Диалоги', link: '/messages' },
        { text: 'Музыка', link: '/music' },
        { text: 'Файлы', link: '/files' },
        { text: 'Настройки', link: '/settings' },
        {
          text: 'Выход',
          click: async () => {
            await this.quit();
          },
        },
      ]"
    />
    <PostCreatorForm
      v-if="showCreatePost"
      @close="closeCreatePostForm"
      @postCreated="getPosts"
    />
    <ErrorWindow ref="error_modal" />
  </div>
</template>

<script>
import Button from "@/components/UI/Button";
import Preview from "@/components/Preview";
import FlatInput from "@/components/UI/FlatInput";
import SuccessWindow from "@/components/SuccessWindow";
import ErrorWindow from "@/components/ErrorWindow";
import TextView from "@/components/UI/TextView";
import RingLoader from "@/components/UI/RingLoader";
import MenuModal from "@/components/MenuModal";
import PostList from "@/components/PostList";
import PostCreatorForm from "@/components/PostCreatorForm";
import ProgressPage from "@/components/ProgressPage";
export default {
  components: {
    Button,
    Preview,
    FlatInput,
    SuccessWindow,
    ErrorWindow,
    TextView,
    RingLoader,
    MenuModal,
    PostList,
    PostCreatorForm,
    ProgressPage,
  },
  data() {
    return {
      avatar: "",
      nickname: "",
      phone: "",
      posts: [],
      isLoadedUserData: false,
      showMenu: false,
      showCreatePost: false,
    };
  },
  methods: {
    GetCookieValue(key) {
      const doc = document;
      doc.cookie.split(";").forEach((it) => {
        const key2 = it.split("=")[0];
        const val = it.split("=")[1];
        if (key2 === key) {
          return val;
        }
      });
      return "";
    },
    async getPosts() {
      this.posts = await fetch("/getuserposts/" + this.nickname).then((res) =>
        res.json()
      );
    },
    showMenuModal() {
      this.showMenu = !this.showMenu;
    },
    closeMenuModal() {
      this.showMenu = false;
    },
    showCreatePostForm() {
      setTimeout(() => {
        this.showMenu = false;
        this.showCreatePost = true;
      }, 500);
    },
    closeCreatePostForm() {
      this.showCreatePost = false;
    },
    async quit() {
      await fetch("/logout");
      this.$router.push("/login");
    },
    async tryFetch() {
      const auth = this.GetCookieValue('authorized');
      if (auth === '') {
        await this.quit();
      } else if (auth === "false") {
        await this.quit();
      }
      this.isLoadedUserData = true;
      await fetch("/", { method: "POST" })
        .then((res) => res.json())
        .then(async (json) => {
          if (
            json &&
            typeof json === "object" &&
            (json.avatar || json.nickname)
          ) {
            this.$store.commit("SetCurrentUser", json);
            this.nickname = this.$store.state.currentUser.nickname;
            this.phone = this.$store.state.currentUser.phone;
            this.avatar = this.$store.state.currentUser.avatar;

            if (this.nickname.length > 3) {
              document.title = this.nickname;
            }

            this.posts = await fetch("/getuserposts/" + this.nickname)
              .then((res) => res.json())
              .catch((e) => console.log("userpage:134", e));
            this.isLoadedUserData = false;
          } else {
            await this.quit();
          }
        })
        .catch((e) => {
          console.log(e);
          if (window.location.pathname === "/") {
            setTimeout(() => {
              this.tryFetch();
            }, 1000);
          }
        });
    },
  },
  async mounted() {
    this.tryFetch();
  },
};
</script>

<style scoped>
.wrapper {
  display: grid;
  background-color: var(--back-color);
  min-width: 100vw;
  min-height: 100vh;
}

.userpage-buttons {
  margin-top: 20vh;
  margin-left: 10px;
  margin-right: 10px;
  border-radius: 5px;
  padding: 10px;
  height: 50px;
  background-color: var(--theme-color);
  color: var(--font-color);
  display: grid;
  justify-items: center;
  align-items: center;

  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
}
@media screen and (orientation: portrait) {
  .userpage-buttons {
    margin-top: 16vh;
  }
}
.create-postbutton {
  margin-right: 5px;
}
.create-categorybutton {
  margin-left: 5px;
}
.finding {
  min-width: 95%;
  background-color: var(--theme-color);
  padding: 10px;
  display: grid;
  grid-template-columns: 1fr;
  justify-content: stretch;
  align-content: stretch;
  justify-self: center;
}
.user-actionbtn {
  width: 100%;
  height: 100%;
  border-radius: 5px;
  background-color: var(--back-color);
  transition-duration: 0.4s;

  text-align: center;
  word-break: break-all;
  overflow-x: auto;
  display: grid;
  align-items: center;
  justify-items: center;
}
.user-actionbtn:hover {
  background-color: var(--primary-color);
  transition-duration: 0.4s;
  cursor: pointer;
}
.categories-tabs {
  background-color: var(--theme-color);
  display: flex;
  justify-content: space-between;
  overflow-x: auto;
  align-items: center;
  align-content: stretch;
  height: 50px;
  margin: 10px;
  border-radius: 5px;
  overflow-y: hidden;
}
.categories-tabs .category {
  margin: 10px;
  width: 100%;
  height: 100%;
  transition-duration: 0.4s;
  cursor: pointer;
  text-align: center;
  display: grid;
  align-items: center;
  justify-items: center;
}
.categories-tabs .category:hover {
  background-color: var(--primary-color);
  transition-duration: 0.4s;
}

.posts-wrapper {
  min-height: 400px;
}
/* .posts-wrapper{
    margin-top: 20vh;
}
@media screen and (orientation: portrait) {
  .posts-wrapper{
    margin-top: 10vh;
  }
} */

.loading-form {
  display: grid;

  grid-template-areas: ". . ." ". loader ." ". . .";
  grid-template-columns: 2fr 1fr 2fr;
  grid-template-rows: 2fr 1fr 2fr;
}

.loader {
  grid-area: loader;
}

.no-posts {
  color: var(--font-color);
  margin-top: 10vh;
  padding: 10px;
  text-align: center;
  font-size: 40px;
}

.progress-bar {
  width: 100vw;
  margin-top: 18vh;
  min-height: 1px;
  position: fixed;
}

@media screen and (orientation: portrait) {
  .progress-bar {
    margin-top: 12vh;
    min-height: 1px;
    position: fixed;
  }
}
</style>