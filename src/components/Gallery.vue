<template>
  <div class="gallery-wrapper">
    <div class="selected-image">
      <img class="selected" @click="showModal" src="" alt="" />
    </div>
    <div class="selector-wrapper" :style="images.length === 1 ? 'display:none;':''">
      <div
        class="selector"
        @click="selectThis"
        @contextmenu.prevent="showImageMenu"
        v-for="(image, index) in images"
        :key="index"
      >
        <img :src="image" alt="" />
      </div>
    </div>
    <GalleryModal
      v-if="showGalleryModal"
      :images="images"
      :selectedIndex="selectedIndex"
      @close="closeModal"
    />
    <MenuModal
      v-if="showMenuModal"
      @close="closeMenuModal"
      :buttons="[
        {
          text: 'Открыть',
          click: () => {
            this.showMenuModal = false;
            this.showModal();
          },
        },
        { text: 'Удалить' },
      ]"
    />
  </div>
</template>

<script>
import GalleryModal from "@/components/GalleryModal";
import MenuModal from "@/components/MenuModal";
export default {
  props: {
    //#region Images Model
    //массив ссылок
    //#endregion
    images: {
      type: Array,
      default: [
        "https://static4.aniimg.com/upload/20180531/5583/X/1/M/X1MlEF.jpg",
        "https://c.wallhere.com/photos/05/8d/anime_anime_girls_long_hair_Granblue_Fantasy_blonde_wings_red_eyes_tail-1349631.jpg!d",
        "https://static.zerochan.net/Kirigiri.Kyouko.full.1605784.jpg",
        "https://cdn.architecturendesign.net/wp-content/uploads/2014/07/Baltimor.jpg",
        "https://w-dog.ru/wallpapers/1/28/433049099536487/gornoe-ozero-sosny-eli.jpg",
        "https://youtravel.me/upload/tours/6b4/6b49836d8cc197d081303864591a431d.jpg",
        "https://s.zefirka.net/images/2017-12-01/krasota-kanadskoj-prirody-ot-stacy-william-head/krasota-kanadskoj-prirody-ot-stacy-william-head-1.jpg",
        "https://vsthemes.org/uploads/posts/2018-12/1581997840_bleach_vsthemes_ru-9.jpg",
        "https://oir.mobi/uploads/posts/2020-08/1596286116_20-p-blich-art-32.jpg",
        "https://pbs.twimg.com/media/ENnJ5P6WwAYpJi3.jpg",
      ],
    },
  },
  data: () => {
    return {
      showGalleryModal: false,
      showMenuModal: false,
      selectedIndex: 0,
    };
  },
  methods: {
    showImageMenu() {
      this.showMenuModal = true;
    },
    closeMenuModal() {
      this.showMenuModal = false;
    },
    selectThis(event) {
      let element = event.target;
      if (
        element &&
        event.target &&
        event.target.tagName &&
        event.target.tagName == "IMG"
      ) {
        element = event.target.parentElement;
      }
      const selectorsElem = this.$el.querySelectorAll("div.selector");
      const selectors = Array.from(selectorsElem);
      selectors.forEach((selector, i) => {
        selectorsElem[i].classList.remove("active");
      });
      if (element && element.classList) {
        element.classList.add("active");
      }

      const img = this.$el.querySelector("div.selected-image img");
      if (element && element.children && element.children[0].src) {
        img.src = element.children[0].src;
      }
      setTimeout(() => {
        const height = getComputedStyle(img).height;
        this.$el.style.gridTemplateRows = height + " 1fr";
      }, 50);
      //   } catch {}
    },
    showModal() {
      this.$el.style.height = "100vh";
      this.$el.style.width = "100vw";
      //console.log(this.$el.querySelector('.selected-image img').src);
      this.selectedIndex = this.images.indexOf(
        "/" +
          this.$el
            .querySelector(".selected-image img")
            .src.split("/")
            .splice(
              3,
              this.$el.querySelector(".selected-image img").src.split("/")
                .length
            )
            .join("/")
      );
      this.showGalleryModal = true;
    },
    closeModal() {
      this.showGalleryModal = false;
      this.$el.style.height = "";
      this.$el.style.width = "";
    },
  },
  mounted() {
    const element = this.$el.querySelector("div.selector");

    const selectorsElem = this.$el.querySelectorAll("div.selector");
    const selectors = Array.from(selectorsElem);
    selectors.forEach((selector, i) => {
      selectorsElem[i].classList.remove("active");
    });
    if (element && element.classList) {
      element.classList.add("active");
    }

    const img = this.$el.querySelector("div.selected-image img");
    if (element && element.children && element.children[0].src) {
      img.src = element.children[0].src;
    }
    setTimeout(() => {
      const height = getComputedStyle(img).height;
      this.$el.style.gridTemplateRows = height + " 1fr";
    }, 50);
    setTimeout(() => {
      this.$el.querySelector(".selector").dispatchEvent(new Event("click"));
    }, 1000);
    this.$el.querySelector(".selector.active").dispatchEvent(new Event("click"));
  },
  components: {
    GalleryModal,
    MenuModal,
  },
};
</script>

<style scoped>
.gallery-wrapper {
  margin: auto;
  display: grid;
  grid-template-columns: 1fr;

  justify-content: center;
  align-content: center;
  justify-items: center;
  align-items: center;
  padding: 20px;

  transition-duration: 0.4s;
}
.selector-wrapper {
  max-height: 25vh;
  overflow-y: auto;
  margin: 10px;

  background-color: var(--theme-color);

  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  transition-duration: 0.4s;
}
.selector {
  width: 100px;
  background-color: gray;
  padding: 2px;
  margin: 5px;
  display: grid;
  justify-content: stretch;
  align-content: stretch;
  justify-items: center;
  align-items: center;
  user-select: none;

  transition-duration: 0.4s;
}
.selector.active {
  background-color: var(--primary-color);
  box-shadow: 0 0 5px 3px var(--primary-color);

  transition-duration: 0.4s;
}
.selector img {
  max-width: 100px;
  max-height: 100px;
  width: 100%;
  height: 100%;

  transition-duration: 0.4s;

  cursor: pointer;
}
.selected-image {
  display: grid;
  justify-content: center;
  align-content: center;
  justify-items: center;
  align-items: center;

  box-shadow: 0 0 5px 3px var(--primary-color);

  transition-duration: 0.4s;
}
.selected-image img {
  align-self: center;
  justify-self: center;
  max-width: 100%;
  height: auto;
  max-height: 50vh;

  transition-duration: 0.4s;

  cursor: pointer;
}
</style>