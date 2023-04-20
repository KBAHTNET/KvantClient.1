<template>
  <div class="progress-wrapper">
    <div class="progress"></div>
  </div>
</template>

<script>
export default {
  methods: {
    // getScrollBarHeight() {
    //   const inner = document.createElement("p");
    //   inner.style.width = "100%";
    //   inner.style.height = "200px";

    //   const outer = document.createElement("div");
    //   outer.style.position = "absolute";
    //   outer.style.top = "0px";
    //   outer.style.left = "0px";
    //   outer.style.visibility = "hidden";
    //   outer.style.width = "200px";
    //   outer.style.height = "150px";
    //   outer.style.overflow = "hidden";
    //   outer.appendChild(inner);

    //   document.body.appendChild(outer);
    //   let w1 = inner.offsetWidth;
    //   outer.style.overflow = "scroll";
    //   let w2 = inner.offsetWidth;
    //   if (w1 == w2) w2 = outer.clientWidth;

    //   document.body.removeChild(outer);

    //   return w1 - w2;
    // },
    calculateProgressScroll() {
        const allHeight = document.body.scrollHeight - window.innerHeight;
        const currentHeight = window.pageYOffset;
        const currentPercentage = currentHeight / allHeight;

        const width = parseInt(getComputedStyle(this.$el).width);
        const widthDivPercentage = width * currentPercentage;

    //   const totalHeight = document.body.scrollHeight - window.innerHeight;
    //   const currentValue = document.scrollingElement.scrollTop;
    //   const offset = currentValue / totalHeight;

      this.$el.style.gridTemplateColumns = widthDivPercentage + "px 1fr";
    },
  },
  mounted() {
    document.addEventListener("scroll", () => this.calculateProgressScroll());
    window.addEventListener("resize", () => this.calculateProgressScroll());
  },
  unmounted() {
    document.removeEventListener("scroll", () =>
      this.calculateProgressScroll()
    );
    window.removeEventListener("resize", () => this.calculateProgressScroll());
  },
};
</script>

<style scoped>
.progress-wrapper {
  z-index: 4;
  width: 100vw;
  height: 2px;
  display: grid;
  grid-template-columns: 50px 1fr;
  grid-template-rows: 1fr;

  justify-content: stretch;
  align-content: stretch;

  position: fixed;

  background-color: gray;
}
.progress {
  background-color: var(--primary-color);
  box-shadow: 0 0 5px 3px var(--primary-color);
}
</style>