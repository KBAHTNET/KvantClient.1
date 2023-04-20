<template>
  <div class="floating-button">
    <div id="my-button">{{ text }}</div>
  </div>
</template>

<script>
export default {
  name: "my-button",
  props: {
    text: {
      type: String,
      default: "",
    },
  },
};
</script>

<style scoped>
.floating-button {
  background-color: var(--theme-color);
  border-style: solid;
  border-color: var(--back-color);
  border-width: 2px;
  cursor: pointer;
  overflow: hidden;
  word-break: break-all;
  color: var(--font-color);
  box-shadow: 0 8px 15px rgba(var(--back-color), 0.1);
  transition: 0.3s;

  border-radius: 5px;

  letter-spacing: 3px;

  text-align: center;
  text-decoration: none;
  font-family: "Montserrat", sans-serif;
  font-size: 14px;
  text-transform: uppercase;
  display: flex;
  justify-content: center;
  align-content:center;
}
.floating-button:hover {
  box-shadow: 5px 15px 20px var(--primary-color);
  color: var(--primary-color);
  transform: translateY(-7px);
}

#my-button{
    align-self:center;
    justify-self: center;
}
</style>