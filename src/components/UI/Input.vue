<template>
  <div>
    <div id="my-input" @click="focusTextbox()" ref="parent">
      <div class="label">{{ label }}</div>
      <div
        class="input-area"
        contenteditable="true"
        :data-text="placeholder"
        @input="updateValue"
      >
        {{ value }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "my-input",
  props: {
    label: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
    value: {
      type: String,
      default: "",
    },
    maxInputAreaheight: {
      type: String,
      default: 0,
    },
  },
  methods: {
    updateValue(event) {
      this.$emit("update:value", event.target.textContent);
    },
    focusTextbox(){
      this.$refs['parent'].querySelector('.input-area').textContent = "";
      this.$refs['parent'].querySelector('.input-area').focus();
    },
    focusThis(event){
      this.focusTextbox();
      // const s = window.getSelection();
      // const r = document.createRange();
      // r.setStart(event.target, 0);
      // r.setEnd(event.target, 0);
      // s.removeAllRanges();
      // s.addRange(r);
    }
  },
  mounted() {
    if (+this.maxInputAreaheight > 0) {
      let inputArea = this.$el.querySelector(".input-area");
      inputArea.style.maxHeight = this.maxInputAreaheight.toString() + "px";
    }
  },
};
</script>

<style scoped>
#my-input {
  display: grid;
  background-color: var(--theme-color);
  color: var(--font-color);
  grid-template-columns: 1fr;
  grid-template-rows: 1fr minmax(1fr, 3fr);

  border-style: solid;
  border-width: 3px;
  border-color: var(--font-color);
  border-radius: 10px;
  box-shadow: 0px 0px 10px 3px var(--primary-color);
  margin: 3px;
}
#my-input:hover {
  box-shadow: 0px 0px 10px 3px var(--secondary-color);
}
[contentEditable="true"]:empty:not(:focus):before {
  content: attr(data-text);
  color: gray;
}
.label {
  user-select: none;

  align-self: center;
  justify-self: center;
  letter-spacing: 3px;
  font-size: 32px;
  text-shadow: 0px 0px 10px var(--primary-color);

  word-break: break-all;
}
.label:hover{
  cursor: default;
}
.input-area {
  margin: 15px;
  overflow-y: auto;
  word-break: break-all;

  caret-color: var(--primary-color);

}
.input-area::selection{
  background-color: var(--primary-color);
}
[contenteditable]:focus {
  outline: 0px solid transparent;
}
.input-area:focus {
  border-style: solid;
  border-color: var(--primary-color);
  border-width: 1px;

  transition-duration: 1s;
}
</style>