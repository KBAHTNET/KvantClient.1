<template>
  <div id="preview">
    <div id="text-1">{{ text1 }}</div>
    <img :src="imgSrc" alt="" />
    <div id="text-2">{{ text2 }}</div>
  </div>
</template>

<script>
export default {
  name: "preview-menu",
  props: {
    onClick: {
      type: Function,
      default: null,
    },
    text1: {
      type: String,
      default: "",
    },
    text2: {
      type: String,
      default: "",
    },
    imgSrc: {
      type: String,
      default: "",
    },
    imgBackSrc: {
      type: String,
      default: "",
    },
  },
  methods: {
    checkStyle() {
      let baseStyle = '"text1 img img img text2"';
      if (this.text1.length == 0) {
        baseStyle = baseStyle.replace("text1 ", "");
        this.$el.style.gridTemplateAreas = baseStyle;
      }
      if (this.text2.length === 0) {
        baseStyle = baseStyle.replace(" text2", "");
        this.$el.style.gridTemplateAreas = baseStyle;
      }

      if (this.imgBackSrc) {
        this.$el.style.backgroundImage = `url("${this.imgBackSrc}")`;
        this.$el.style.backgroundSize = "cover";
      }
      if (this.imgSrc) {
        this.$el.querySelector("img").src = this.imgSrc;
      } else {
        this.$el.querySelector("img").src = "/kvantnet_logo.svg";
      }

      if (this.text1 === "KVANT" && this.text2 === "NET") {
        this.$el.style.gridTemplateAreas = '"text1 img text2"';
        this.$el.style.gridTemplateColumns = "30vw 1fr 30vw";
      }
    },
  },
  mounted() {
    if (this.onClick) {
      this.$el.querySelector("img").addEventListener("click", this.onClick);
    }
    this.checkStyle();
  },
  watch: {
    imgBackSrc() {
      if (this.imgBackSrc) {
        this.$el.style.backgroundImage = `url("${this.imgBackSrc}")`;
      }
    },
    imgSrc() {
      this.checkStyle();
    },
    text1() {
      this.checkStyle();
    },
    text2() {
      this.checkStyle();
    },
    imgSrc() {
      this.checkStyle();
    },
  },
};
</script>

<style scoped>
#preview {
  background-position: center;
  background-size: 100%;
  position: fixed;
  height: 18vh;
  width: 100vw;
  background-color: var(--theme-color);

  justify-content: stretch;

  display: grid;

  grid-template-areas: "text1 img img img text2";

  overflow-y: auto;
  transition-duration: 1s;
  transition-delay: 0.4s;

  z-index: 9;

  overflow: hidden;
}

#preview:hover {
  height: 75vh;
  transition-duration: 1s;
  transition-delay: 0.4s;
}

#preview:hover img {
  height: 62vh;
  width: 62vh;

  transition-duration: 1s;
  transition-delay: 0.4s;

  cursor: pointer;
}
#preview img {
  transition-duration: 1s;
  transition-delay: 0.4s;
  justify-self: center;
  align-self: end;

  border-style: solid;
  border-color: #ff6600;
  border-width: 1px;
  box-shadow: 0px 0px 7px 2px #ff9100;
  border-radius: 50%;

  height: 16vh;
  width: 16vh;

  grid-area: img;

  margin-top: 8px;
  margin-bottom: 8px;

  transition-duration: 1s;
  transition-delay: 0.4s;
}

@media screen and (orientation: portrait) {
  #preview {
    height: 12vh;
  }
  #preview:hover {
    height: 12vh;
    transition-duration: 1s;
    transition-delay: 0.4s;
  }
  #preview:hover img {
    height: 10vh;
    width: 10vh;
    align-self: center;
  }
  #preview img {
    height: 10vh;
    width: 10vh;

    align-self: center;
  }
  #text-1 {
    font-size: 24px !important;
  }
  #text-2 {
    font-size: 24px !important;
  }
}

#text-1 {
  grid-area: text1;
  align-self: center;
  justify-self: end;
  color: black;
  font-size: 48px;

  -webkit-animation: glow 1s ease-in-out infinite alternate;
  -moz-animation: glow 1s ease-in-out infinite alternate;
  animation: glow 1s ease-in-out infinite alternate;
}
#text-1:hover {
  cursor: default;
}

#text-2:hover {
  cursor: default;
}

#text-2 {
  grid-area: text2;
  align-self: center;
  justify-self: start;
  color: var(--back-color);
  font-size: 48px;
  -webkit-animation: glow 1s ease-in-out infinite alternate;
  -moz-animation: glow 1s ease-in-out infinite alternate;
  animation: glow 1s ease-in-out infinite alternate;
}

@-webkit-keyframes glow {
  from {
    text-shadow: 0 0 5px var(--font-color), 0 0 8px var(--font-color),
      0 0 11px var(--font-color), 0 0 14px var(--font-color);
  }
  to {
    text-shadow: 0 0 8px var(--primary-color), 0 0 11px var(--primary-color),
      0 0 14px var(--primary-color);
  }
}
</style>