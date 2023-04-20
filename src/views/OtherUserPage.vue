<template>
  <div class="page-wrapper">
    <div class="overflow-wrapper">
      <div class="overflow-x">
        <div class="scroll-x"></div>
      </div>
      <div class="overflow-y">
        <div class="scroll-y"></div>
      </div>
      <div class="container"></div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      isDown: false,
    };
  },
  mounted() {
    this.$el.querySelector(".scroll-y").addEventListener("mousedown", (e) => {
      if (e.button == 0) {
        this.isDown = true;
        console.log(this.isDown);
      }
    });

    window.addEventListener("mouseup", (e) => {
      console.log(e);
      if (this.isDown && e.button == 0) {
        this.isDown = false;
      }
    });
    window.addEventListener("mousemove", (e) => {
    // console.log(e);
      if (this.isDown) {
        e.preventDefault();
       // console.log(e.offsetY);
        const over = this.$el.querySelector(".overflow-y");
        const scroll = this.$el.querySelector(".scroll-y");
        if (
          over.scrollHeight -
            parseInt(getComputedStyle(over).gridTemplateRows.split(" ")[0]) -
            e.movementY >
          50
        ) {
          over.style.gridTemplateRows =
            parseInt(getComputedStyle(over).gridTemplateRows.split(" ")[0]) +
            e.movementY +
            "px 1fr";

            const soot = parseInt(getComputedStyle(over).gridTemplateRows.split(" ")[0]) / over.scrollHeight;

        }
      }
    });
  },
};
</script>

<style scoped>
.page-wrapper {
  height: 100vh;
  width: 100vw;

  background-color: gray;
  display: grid;
  justify-items: center;
  justify-content: center;
  align-items: center;
  align-content: center;
}
.overflow-wrapper {
  width: 500px;
  height: 500px;

  background-color: #333;
  overflow: hidden;
  padding: 10px;
  display: grid;
  justify-items: center;
  align-items: center;

  position: relative;
}
.overflow-x {
  position: absolute;
  background-color: hotpink;

  bottom: 0;
  left: 0;
  width: 500px;
  height: 17px;
}
.overflow-y {
  position: absolute;
  background-color: hotpink;
  bottom: 0;
  right: 0;
  width: 17px;
  height: 500px;
  display: grid;
  grid-template-rows: 10px 1fr;
  grid-template-areas: "." "scrollY";
}
.scroll-x {
  background-color: greenyellow;

  width: 50px;
  height: 15px;

  align-self: center;
  justify-self: center;
}
.scroll-y {
  background-color: greenyellow;

  width: 15px;
  height: 50px;

  grid-area: scrollY;
}
.scroll-y:hover {
  cursor: pointer;
}
.container {
  width: 600px;
  height: 600px;
  background-color: honeydew;

  word-break: break-all;
}
</style>