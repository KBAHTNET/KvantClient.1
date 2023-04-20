<template>
  <label :for="uniqueId" class="inp">
    <input
      @input="updateValue"
      @click="$event.target.focus()"
      type="text"
      :id="uniqueId"
      multiple="true"
      placeholder="&nbsp;"
      autocomplete="off"
    />
    <span class="label">{{ label }}</span>
    <span class="focus-bg"></span>
  </label>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: "",
    },
    value: {
      type: String,
      default: "",
    },
  },
  data: () => {
    return {
      uniqueId: 'id'
    }
  },
  methods: {
    updateValue(event) {
      this.$emit("update:value", event.target.value);
    },
    GenerateRandomString(symbolsCount) {
      const alph =
        "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890".split(
          ""
        );
      const length = symbolsCount || 40;
      let name = "";
      for (let i = 0; i < length; i += 1) {
        name += alph[parseInt((Math.random() * 1000) % alph.length)];
      }
      return name;
    },
  },
  mounted() {
    this.uniqueId = this.GenerateRandomString(10);
    console.log(this.uniqueId)
  }
};
</script>

<style scoped>
#inp {
  word-wrap: break-word;
}
.inp {
  position: relative;
  margin: auto;
  width: 100%;
  max-width: 280px;
  border-radius: 3px;
  overflow: hidden;

  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
}
.inp .label {
  position: absolute;
  top: 20px;
  left: 12px;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.5);
  font-weight: 500;
  transform-origin: 0 0;
  transform: translate3d(0, 0, 0);
  transition: all 0.2s ease;
  pointer-events: none;
}
.inp .focus-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.05);
  z-index: -1;
  transform: scaleX(0);
  transform-origin: left;
}
.inp input {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: 100%;
  border: 0;
  font-family: inherit;
  padding: 16px 12px 0 12px;
  height: 56px;
  font-size: 24px;
  background: rgba(0, 0, 0, 0.02);
  box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.3);
  color: var(--font-color);
  transition: all 0.15s ease;
}
.inp input:hover {
  background: rgba(0, 0, 0, 0.04);
  box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.5);
}
.inp input:not(:-moz-placeholder-shown) + .label {
  color: rgba(0, 0, 0, 0.5);
  transform: translate3d(0, -12px, 0) scale(0.75);
}
.inp input:not(:-ms-input-placeholder) + .label {
  color: rgba(0, 0, 0, 0.5);
  transform: translate3d(0, -12px, 0) scale(0.75);
}
.inp input:not(:placeholder-shown) + .label {
  color: rgba(0, 0, 0, 0.5);
  transform: translate3d(0, -12px, 0) scale(0.75);
}
.inp input:focus {
  background: var(--theme-color);
  outline: none;
  box-shadow: inset 0 -2px 0 var(--primary-color);
}
.inp input:focus + .label {
  color: var(--primary-color);
  transform: translate3d(0, -12px, 0) scale(0.75);
}
.inp input:focus + .label + .focus-bg {
  transform: scaleX(1);
  transition: all 0.1s ease;
}
</style>