<template>
  <div class="image-modal" @click="emitClose">
    <img class="close" src="/icons/cancel.svg" alt="">
    <img class="picture" :src="src" alt="" />
  </div>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      default: "",
    },
  },
  methods: {
    emitClose() {
      this.$emit("close");
    },
  },
  mounted() {
    const imgEl = this.$el.querySelector("img");
    const img = new Image();
    img.src = this.src;

    if (imgEl.width < imgEl.height) {
      imgEl.style.maxWidth = "100%";
      imgEl.style.heigh = "auto";
    }
    // console.log(img.height);
    // console.log(img.width);
    // if(img.width > img.height) {
    //   imgEl.style.width = '100%';
    //   imgEl.style.heigh = 'auto';
    // } else {
    //   imgEl.style.heigh = '100%';
    //   imgEl.style.width = 'auto';
    //   console.log(parseInt(img.width)/parseInt(img.heigh));
    //   console.log(Math.abs(1-(parseFloat(img.width)/parseFloat(img.heigh))));
    //   if(Math.abs(1-(img.width/img.heigh)) < 0.05) {
    //     console.log('tyty')
    //     imgEl.style.padding = "50px";
    //   }

    // }
  },
  watch: {
    // src() {
    //   const imgEl = this.$el.querySelector("img");
    //   if (img.width < img.height) {
    //     imgEl.style.width = "100%";
    //     imgEl.style.heigh = "auto";
    //   }
    // },
  },
};
</script>

<style scoped>
.image-modal {
  width: 100vw;
  height: 100vh;
  max-width: 100vw;
  max-height: 100vh;

  background-color: rgba(0, 0, 0, 0.75);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 50;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  justify-content: stretch;
  align-content: stretch;
}
.picture {
  max-height: 100%;
  width: auto;

  align-self: center;
  justify-self: center;

  max-width: 100vw;
  max-height: 100vh;
}

.close {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.308);
  justify-self: end;
  height: 30px;
  width: auto;
}
</style>