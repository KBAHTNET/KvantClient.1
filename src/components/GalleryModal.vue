<template>
  <div class="modal-gallery" @click="emitClose">
    <div class="selected-image" @click.stop>
      <div class="image-counter">{{ imageCounter }}</div>
      <img class="selected" src="" alt="" @click="showImg" />
    </div>
    <div class="selector-wrapper" @wheel.stop @click.stop>
      <div
        class="selector"
        @click="selectThis"
        v-for="(image, index) in images"
        :key="index"
      >
        <img :src="image" alt="" />
      </div>
    </div>
    <ImageModal
      :src="currentSrc"
      v-if="showImgModal"
      @click.stop
      @close="closeImg"
    />
  </div>
</template>

<script>
import ImageModal from "@/components/ImageModal";
export default {
  props: {
    //#region Images Model
    //массив ссылок
    //#endregion
    images: {
      type: Array,
      default: [],
    },
    selectedIndex: {
      type: Number,
      default: 0,
    },
  },
  data: () => {
    return {
      showImgModal: false,
      currentSrc: "",
      imageCounter: "",
    };
  },
  methods: {
    showImg() {
      this.showImgModal = !this.showImgModal;
    },
    closeImg() {
      this.showImgModal = false;
    },
    selectThis(event) {
      //   const selectors = Array.from(this.$el.querySelector('.selector'));
      //   selectors.forEach((selector) => {
      //       console.log(selector.classList);
      //   });

      //   try {
      let element = event.target;
      if (
        element &&
        event.target &&
        event.target.tagName &&
        event.target.tagName == "IMG"
      ) {
        element = event.target.parentElement;
      }
      let selectorsElem = this.$el.querySelectorAll("div.selector");
      let selectors = Array.from(selectorsElem);
      selectors.forEach((selector, i) => {
        selectorsElem[i].classList.remove("modal-active");
      });
      if (element && element.classList) {
        element.classList.add("modal-active");
      }

      selectorsElem = this.$el.querySelectorAll("div.selector");
      selectors = Array.from(selectorsElem);
      selectors.forEach((item, i) => {
        //console.log(selectorsElem[i].classList);
        if (selectorsElem[i].classList.contains("modal-active")) {
          this.imageCounter = `${i + 1} / ${this.images.length}`;
        }
      });

      const img = this.$el.querySelector("div.selected-image img");
      if (element && element.children && element.children[0].src) {
        img.src = element.children[0].src;
        this.currentSrc = img.src;
      }
      //   } catch {}
    },
    emitClose() {
      this.$emit("close", this.$el.querySelector(".selected").src);
    },
    horizontalScroll(e) {
      this.$el.querySelector(".selector-wrapper").scrollBy(e.deltaY, 0);
    },
  },
  mounted() {
    this.imageCounter = `${this.selectedIndex + 1} / ${this.images.length}`;

    const imageContainer = this.$el.querySelector(".selected-image img");
    imageContainer.src = this.images[this.selectedIndex];
    this.currentSrc = imageContainer.src;
    const click = new Event("click");
    const clickElems = this.$el.querySelectorAll(".selector");
    Array.from(clickElems).forEach((item, i) => {
      if (clickElems[i].children[0].src == imageContainer.src) {
        clickElems[i].classList.add("modal-active");
        clickElems[i].scrollIntoView({
          behavior: "smooth",
          block: "end",
          inline: "nearest",
        });
      }
    });

    window.addEventListener("wheel", this.horizontalScroll);
  },
  unmounted() {
    window.removeEventListener("wheel", this.horizontalScroll);
  },
  components: {
    ImageModal,
  },
};
</script>

<style scoped>
.modal-gallery {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.85);

  display: grid;
  grid-template-areas: ". . ." ". image ." ". selector .";
  grid-template-rows: 10px 65vh 120px;
  grid-template-columns: 30px 1fr 30px;
  justify-content: center;
  align-content: center;
  justify-items: center;
  align-items: center;
  padding: 20px;

  transition-duration: 0.4s;

  z-index: 5;
}
.selected-image {
  grid-area: image;
  display: grid;
  justify-content: center;
  align-content: center;
  justify-items: center;
  align-items: center;

  box-shadow: 0 0 5px 3px var(--primary-color);

  transition-duration: 0.4s;
  position: relative;
}
.selected-image img {
  align-self: center;
  justify-self: center;
  max-width: 100%;
  height: auto;
  max-height: 50vh;

  transition-duration: 0.4s;
}

.selected-image img:hover {
  cursor: pointer;
}

.selector-wrapper {
  grid-area: selector;
  background-color: var(--theme-color);
  padding: 2px;
  overflow-x: auto;
  display: flex;
  justify-content: stretch;
  align-content: stretch;
  justify-items: center;
  align-items: center;
  max-width: 80vw;

  position: relative;
}
.image-counter {
  position: absolute;

  top: 2px;
  left: 2px;
  border-radius: 3px;
  padding: 1px 3px;
  background-color: var(--theme-color);
  display: flex;

  justify-content: center;
  align-content: center;
  justify-items: center;
  align-items: center;

  color: var(--font-color);
}

.selector {
  min-width: 100px;
  background-color: gray;
  padding: 2px;
  margin: 5px;
  display: grid;
  align-self: center;
  justify-self: center;
  justify-content: stretch;
  align-content: stretch;
  justify-items: center;
  align-items: center;
  user-select: none;

  transition-duration: 0.4s;
}
.modal-active {
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
}
</style>