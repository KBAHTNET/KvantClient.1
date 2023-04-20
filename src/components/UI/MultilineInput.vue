<template>
  <textarea
    @input="updateValue"
    name="message"
    rows="5"
    class="question"
    id="msg"
    required
    autocomplete="off"
  ></textarea>
  <label for="msg"
    ><span>{{ label }}</span></label
  >
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
  methods: {
    updateValue(event) {
      this.$emit("update:value", event.target.value);
    },
  },
  mounted() {
      this.$el.value = this.value;
  }
};
</script>

<style scoped>
span,
label,
textarea {
  font-family: "Ubuntu", sans-serif;
  display: block;
  margin: 10px;
  padding: 5px;
  border: none;
  font-size: 22px;
  color: var(--font-color);
}

textarea:focus {
  outline: 0;
}
/* Question */

textarea.question {
  resize: none;
  font-size: 24px;
  font-weight: 300;
  border-radius: 2px;
  background-color: rgba(0, 0, 0, 0);
  margin: 0;
  border: none;
  transition: padding-top 0.2s ease, margin-top 0.2s ease;
  overflow-x: hidden; /* Hack to make "rows" attribute apply in Firefox. */
}
textarea.question:focus {
    background: var(--theme-color);
}
/* Underline and Placeholder */
textarea.question + label {
  display: block;
  position: relative;
  white-space: nowrap;
  padding: 0;
  margin: 0;
  width: 10%;
  border-top: 1px solid red;
  -webkit-transition: width 0.4s ease;
  transition: width 0.4s ease;
  height: 0px;
}

textarea.question:focus + label {
  width: 100%;
}

textarea.question:valid,
textarea.question:focus {
  margin-top: 35px;
}

textarea.question:focus + label > span,
textarea.question:valid + label > span {
  top: -190px;
  font-size: 22px;
  color: var(--primary-color);
}

textarea.question:valid + label {
  border-color: var(--primary-color);
}

textarea.question:invalid {
  box-shadow: none;
}

textarea.question + label > span {
  font-weight: 300;
  margin: 0;
  position: absolute;
  color: #8f8f8f;
  font-size: 48px;
  top: -66px;
  left: 0px;
  -webkit-transition: top 0.2s ease, font-size 0.2s ease, color 0.2s ease;
  transition: top 0.2s ease, font-size 0.2s ease, color 0.2s ease;
}
</style>