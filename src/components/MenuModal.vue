<template>
  <div class="menu-wrapper" @click="emitCloseMenu">
    <div class="black-block"></div>
    <div class="buttons-wrapper" @click.stop>
      <div
        class="menu-button"
        @click="button.click"
        v-for="button in buttons"
        :key="button.text"
      >
        <router-link :to="button.link" v-if="button.link">
          <div class="glitch-btn">
            <div class="text">
              {{ button.text }}<span class="hidden"> ></span>
            </div>
            <div class="mask mask1">
              <span>{{ button.text }}</span>
            </div>
            <div class="mask mask2">
              <span>{{ button.text }}</span>
            </div>
            <div class="mask mask3">
              <span>{{ button.text }}</span>
            </div>
          </div>
        </router-link>
        <div class="button-wrapper" v-else>
          <div class="glitch-btn">
            <div class="text">
              {{ button.text }}<span class="hidden">></span>
            </div>
            <div class="mask mask1">
              <span>{{ button.text }}</span>
            </div>
            <div class="mask mask2">
              <span>{{ button.text }}</span>
            </div>
            <div class="mask mask3">
              <span>{{ button.text }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    //#region Button Model
    /* button: {
            text,
            link (router-link)
        } */
    //#endregion
    buttons: {
      default: [
        { text: "Меню", link: "" },
        { text: "Моя страница", link: "" },
        { text: "Настроки", link: "" },
        { text: "Выход", link: "" },
      ],
      type: Array,
    },
  },
  methods: {
    emitCloseMenu() {
      this.$emit("close");
    },
    checkPosition() {
      this.$el.style.gridTemplateRows = window.pageYOffset + "px 1fr 1px";
    },
    addClick(el) {
      console.log("click");
    },
    checkSizeBlock() {
      // const width = getComputedStyle(this.$el).gridTemplateColumns.split(
      //   " "
      // )[1];
      // const height = getComputedStyle(this.$el).gridTemplateRows.split(" ")[1];
      // const marginLeft = getComputedStyle(this.$el).gridTemplateColumns.split(
      //   " "
      // )[0];
      // const marginTop = getComputedStyle(this.$el).gridTemplateRows.split(
      //   " "
      // )[0];

      // const block = this.$el.querySelector(".black-block");
      // block.style.width = width;
      // block.style.height = height;
      // block.style.marginTop = marginTop;
      // block.style.marginLeft = marginLeft;

      // if (width > height) {
      //   this.$el.querySelector(".buttons-wrapper").style.justifySelf = "center";
      // } else {
      //   this.$el.querySelector(".buttons-wrapper").style.justifySelf = "end";
      // }
    },
  },
  mounted() {
    this.checkSizeBlock();
    window.addEventListener("resize", () => this.checkSizeBlock());
    document.addEventListener("resize", () => this.checkSizeBlock());
    // this.$el.style.height = document.querySelector("#app").scrollHeight + "px";
    // this.$el.style.gridTemplateRows = window.pageYOffset + "px 1fr 1px";
    // document.addEventListener("scroll", this.checkPosition);
  },
  unmounted() {
    //document.removeEventListener("scroll", this.checkPosition);
  },
};
</script>

<style scoped>
.menu-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.65);

  display: grid;
  grid-template-areas: ". . ." " . buttons . " ". . .";
  grid-template-rows: 1fr minmax(1fr, 10fr) 1fr;
  grid-template-columns: 1fr 3fr 1fr;

  z-index: 10;
}
.black-block {
  background-color: black;
  background: black;
  position: fixed;
  top: 0;
  left: 0;
  margin-top: 14vh;
  margin-left: 10vw;
  height: 70vh;
  width: 80vw;
  box-shadow: 0 0 10px 5px var(--primary-color);
  background-image: url("/img/menu-background.jpg");
  background-size: cover;
  animation-name: openModal;
  animation-duration: 1s;
  animation-direction: normal;
}
@keyframes openModal {
  0% {
    background-color: black;
    background: black;
    position: fixed;
    top: 0;
    left: 0;
    margin-top: 14vh;
    margin-left: 10vw;
    height: 0vh;
    width: 0vw;
    box-shadow: 0 0 0px 0px var(--primary-color);
    background-image: url("/img/menu-background.jpg");
    background-size: cover;
    border-radius: 100%;
  }
  100% {
    background-color: black;
    background: black;
    position: fixed;
    top: 0;
    left: 0;
    margin-top: 14vh;
    margin-left: 10vw;
    height: 70vh;
    width: 80vw;
    box-shadow: 0 0 10px 5px var(--primary-color);
    background-image: url("/img/menu-background.jpg");
    background-size: cover;
    border-radius: 5px;
  }
}
.buttons-wrapper {
  margin-top: 20px;
  margin-left: 10px;
  grid-area: buttons;
  justify-self: center;
  align-self: center;
  justify-content: center;
  align-content: center;

  position: relative;

  display: grid;
  grid-gap: 5vh;
  grid-template-columns: 1fr;
  grid-template-rows: repeat(auto-fill, 1fr);
}

.button-wrapper {
  cursor: pointer;
}

a {
  text-decoration: none;
}

.glitch-btn {
  transform: translate(-50%, -50%);
  font-size: 24px;
  transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
  color: #afafaf;

  margin-left: 60px;
}

@media screen and (orientation: portrait) {
  .glitch-btn {
    font-size: 16px;
  }
}

.glitch-btn .mask {
  position: absolute;
  width: 100%;
  overflow: hidden;
  display: none;
}

.glitch-btn .mask span {
  position: absolute;
  left: 50%;
  -webkit-transform: translateX(-50%);
  transform: translateX(-50%);
  width: 100%;
  top: -100%;
}

.glitch-btn:hover {
  color: #4e4e4e;
}

.glitch-btn:hover:before {
  background: var(--primary-color);
  transform: translateX(120%) scaleX(3) scaleY(0.8);
}

.glitch-btn:before {
  content: "";
  position: absolute;
  left: -15%;
  top: -50%;
  background: #4e4e4e;
  width: 40%;
  height: 200%;
  padding: 0px;
  z-index: -1;
  transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
}

.glitch-btn:after {
  content: "";
  position: absolute;
  left: -5%;
  top: 105%;
  background: var(--primary-color);
  width: 112%;
  height: 10%;
  padding: 0px;
  z-index: -1;
  transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
}

.glitch-btn:hover:after {
  background: #4e4e4e;
  transform: translateX(-55%) translateY(-600%) rotate(90deg) scaleX(0.3);
}

.glitch-btn .mask1 {
  height: 20%;
  top: 19%;
}

.glitch-btn .mask2 {
  height: 30%;
  top: 35%;
}

.glitch-btn .mask3 {
  height: 57%;
  top: 63%;
}

.hidden {
  opacity: 0;
}

.glitch-btn:hover .mask1 {
  animation: glitchin1 0.2s 0.3s both;
}

.glitch-btn:hover .mask2 {
  animation: glitchin2 0.2s 0.2s both;
}

.glitch-btn:hover .mask3 {
  animation: glitchin1 0.2s 0.2s both;
}

.glitch-btn:hover .hidden {
  animation: fade-in 0.1s 0.2s forwards;
}

.glitch-btn:hover .text {
  animation: fade-in 0.1s 0.2s forwards;
}

.glitch-btn:hover .mask {
  display: block;
}

@-webkit-keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@-webkit-keyframes glitchin1 {
  100% {
    opacity: 0;
    transform: translate(0px, 0px);
  }
  95% {
    opacity: 1;
    -webkit-transform: translate(0.5px, 0.05px);
    transform: translate(0.5px, 0.05px);
  }
  90% {
    -webkit-transform: translate(0.6px, -0.3px);
    transform: translate(0.6px, -0.3px);
  }
  85% {
    -webkit-transform: translate(1.2px, 0px);
    transform: translate(1.2px, 0px);
  }
  80% {
    -webkit-transform: translate(1.2px, 0.2px);
    transform: translate(1.2px, 0.2px);
  }
  75% {
    -webkit-transform: translate(0.5px, 1px);
    transform: translate(0.5px, 1px);
  }
  70% {
    -webkit-transform: translate(0.3px, 1.2px);
    transform: translate(0.3px, 1.2px);
  }
  65% {
    -webkit-transform: translate(-2.1px, 0.7px);
    transform: translate(-2.1px, 0.7px);
  }
  60% {
    -webkit-transform: translate(3.6px, 0.4px);
    transform: translate(3.6px, 0.4px);
  }
  55% {
    -webkit-transform: translate(0.45px, 1.8px);
    transform: translate(0.45px, 1.8px);
  }
  50% {
    -webkit-transform: translate(-3px, -1px);
    transform: translate(-3px, -1px);
  }
  45% {
    -webkit-transform: translate(-4.4px, 1.1px);
    transform: translate(-4.4px, 1.1px);
  }
  40% {
    -webkit-transform: translate(-4.2px, 2.4px);
    transform: translate(-4.2px, 2.4px);
  }
  35% {
    -webkit-transform: translate(2.6px, 1.3px);
    transform: translate(2.6px, 1.3px);
  }
  30% {
    -webkit-transform: translate(-1.4px, 2.8px);
    transform: translate(-1.4px, 2.8px);
  }
  25% {
    -webkit-transform: translate(6px, 0.75px);
    transform: translate(6px, 0.75px);
  }
  20% {
    -webkit-transform: translate(0px, -1.6px);
    transform: translate(0px, -1.6px);
  }
  15% {
    -webkit-transform: translate(-5.95px, -0.85px);
    transform: translate(-5.95px, -0.85px);
  }
  10% {
    -webkit-transform: translate(3.6px, 3.6px);
    transform: translate(3.6px, 3.6px);
  }
  5% {
    -webkit-transform: translate(-0.95px, -0.95px);
    transform: translate(-0.95px, -0.95px);
  }
  1% {
    opacity: 1;
  }
}
@keyframes glitchin1 {
  100% {
    opacity: 0;
    transform: translate(0px, 0px);
  }
  95% {
    opacity: 1;
    -webkit-transform: translate(0.5px, 0.05px);
    transform: translate(0.5px, 0.05px);
  }
  90% {
    -webkit-transform: translate(0.6px, -0.3px);
    transform: translate(0.6px, -0.3px);
  }
  85% {
    -webkit-transform: translate(1.2px, 0px);
    transform: translate(1.2px, 0px);
  }
  80% {
    -webkit-transform: translate(1.2px, 0.2px);
    transform: translate(1.2px, 0.2px);
  }
  75% {
    -webkit-transform: translate(0.5px, 1px);
    transform: translate(0.5px, 1px);
  }
  70% {
    -webkit-transform: translate(0.3px, 1.2px);
    transform: translate(0.3px, 1.2px);
  }
  65% {
    -webkit-transform: translate(-2.1px, 0.7px);
    transform: translate(-2.1px, 0.7px);
  }
  60% {
    -webkit-transform: translate(3.6px, 0.4px);
    transform: translate(3.6px, 0.4px);
  }
  55% {
    -webkit-transform: translate(0.45px, 1.8px);
    transform: translate(0.45px, 1.8px);
  }
  50% {
    -webkit-transform: translate(-3px, -1px);
    transform: translate(-3px, -1px);
  }
  45% {
    -webkit-transform: translate(-4.4px, 1.1px);
    transform: translate(-4.4px, 1.1px);
  }
  40% {
    -webkit-transform: translate(-4.2px, 2.4px);
    transform: translate(-4.2px, 2.4px);
  }
  35% {
    -webkit-transform: translate(2.6px, 1.3px);
    transform: translate(2.6px, 1.3px);
  }
  30% {
    -webkit-transform: translate(-1.4px, 2.8px);
    transform: translate(-1.4px, 2.8px);
  }
  25% {
    -webkit-transform: translate(6px, 0.75px);
    transform: translate(6px, 0.75px);
  }
  20% {
    -webkit-transform: translate(0px, -1.6px);
    transform: translate(0px, -1.6px);
  }
  15% {
    -webkit-transform: translate(-5.95px, -0.85px);
    transform: translate(-5.95px, -0.85px);
  }
  10% {
    -webkit-transform: translate(3.6px, 3.6px);
    transform: translate(3.6px, 3.6px);
  }
  5% {
    -webkit-transform: translate(-0.95px, -0.95px);
    transform: translate(-0.95px, -0.95px);
  }
  1% {
    opacity: 1;
  }
}
@-webkit-keyframes glitchin2 {
  100% {
    opacity: 0;
    transform: translate(0px, 0px);
  }
  95% {
    opacity: 1;
    -webkit-transform: translate(-0.5px, -0.05px);
    transform: translate(-0.5px, -0.05px);
  }
  90% {
    -webkit-transform: translate(-0.6px, 0.3px);
    transform: translate(-0.6px, 0.3px);
  }
  85% {
    -webkit-transform: translate(-1.2px, 0px);
    transform: translate(-1.2px, 0px);
  }
  80% {
    -webkit-transform: translate(-1.2px, -0.2px);
    transform: translate(-1.2px, -0.2px);
  }
  75% {
    -webkit-transform: translate(-0.5px, -1px);
    transform: translate(-0.5px, -1px);
  }
  70% {
    -webkit-transform: translate(-0.3px, -1.2px);
    transform: translate(-0.3px, -1.2px);
  }
  65% {
    -webkit-transform: translate(2.1px, -0.7px);
    transform: translate(2.1px, -0.7px);
  }
  60% {
    -webkit-transform: translate(-3.6px, -0.4px);
    transform: translate(-3.6px, -0.4px);
  }
  55% {
    -webkit-transform: translate(-0.45px, -1.8px);
    transform: translate(-0.45px, -1.8px);
  }
  50% {
    -webkit-transform: translate(3px, 1px);
    transform: translate(3px, 1px);
  }
  45% {
    -webkit-transform: translate(4.4px, -1.1px);
    transform: translate(4.4px, -1.1px);
  }
  40% {
    -webkit-transform: translate(4.2px, -2.4px);
    transform: translate(4.2px, -2.4px);
  }
  35% {
    -webkit-transform: translate(-2.6px, -1.3px);
    transform: translate(-2.6px, -1.3px);
  }
  30% {
    -webkit-transform: translate(1.4px, -2.8px);
    transform: translate(1.4px, -2.8px);
  }
  25% {
    -webkit-transform: translate(-6px, -0.75px);
    transform: translate(-6px, -0.75px);
  }
  20% {
    -webkit-transform: translate(0px, 1.6px);
    transform: translate(0px, 1.6px);
  }
  15% {
    -webkit-transform: translate(5.95px, 0.85px);
    transform: translate(5.95px, 0.85px);
  }
  10% {
    -webkit-transform: translate(-3.6px, -3.6px);
    transform: translate(-3.6px, -3.6px);
  }
  5% {
    -webkit-transform: translate(0.95px, 0.95px);
    transform: translate(0.95px, 0.95px);
  }
  1% {
    opacity: 1;
  }
}
@keyframes glitchin2 {
  100% {
    opacity: 0;
    transform: translate(0px, 0px);
  }
  95% {
    opacity: 1;
    -webkit-transform: translate(-0.5px, -0.05px);
    transform: translate(-0.5px, -0.05px);
  }
  90% {
    -webkit-transform: translate(-0.6px, 0.3px);
    transform: translate(-0.6px, 0.3px);
  }
  85% {
    -webkit-transform: translate(-1.2px, 0px);
    transform: translate(-1.2px, 0px);
  }
  80% {
    -webkit-transform: translate(-1.2px, -0.2px);
    transform: translate(-1.2px, -0.2px);
  }
  75% {
    -webkit-transform: translate(-0.5px, -1px);
    transform: translate(-0.5px, -1px);
  }
  70% {
    -webkit-transform: translate(-0.3px, -1.2px);
    transform: translate(-0.3px, -1.2px);
  }
  65% {
    -webkit-transform: translate(2.1px, -0.7px);
    transform: translate(2.1px, -0.7px);
  }
  60% {
    -webkit-transform: translate(-3.6px, -0.4px);
    transform: translate(-3.6px, -0.4px);
  }
  55% {
    -webkit-transform: translate(-0.45px, -1.8px);
    transform: translate(-0.45px, -1.8px);
  }
  50% {
    -webkit-transform: translate(3px, 1px);
    transform: translate(3px, 1px);
  }
  45% {
    -webkit-transform: translate(4.4px, -1.1px);
    transform: translate(4.4px, -1.1px);
  }
  40% {
    -webkit-transform: translate(4.2px, -2.4px);
    transform: translate(4.2px, -2.4px);
  }
  35% {
    -webkit-transform: translate(-2.6px, -1.3px);
    transform: translate(-2.6px, -1.3px);
  }
  30% {
    -webkit-transform: translate(1.4px, -2.8px);
    transform: translate(1.4px, -2.8px);
  }
  25% {
    -webkit-transform: translate(-6px, -0.75px);
    transform: translate(-6px, -0.75px);
  }
  20% {
    -webkit-transform: translate(0px, 1.6px);
    transform: translate(0px, 1.6px);
  }
  15% {
    -webkit-transform: translate(5.95px, 0.85px);
    transform: translate(5.95px, 0.85px);
  }
  10% {
    -webkit-transform: translate(-3.6px, -3.6px);
    transform: translate(-3.6px, -3.6px);
  }
  5% {
    -webkit-transform: translate(0.95px, 0.95px);
    transform: translate(0.95px, 0.95px);
  }
  1% {
    opacity: 1;
  }
}
</style>