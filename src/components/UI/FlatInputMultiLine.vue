<template>
  <div class="group">
    <textarea type="textarea" rows="5"></textarea><span class="highlight"></span
    ><span class="bar"></span>
    <label>Message</label>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
:before,
:after {
  box-sizing: border-box;
}

.group {
    display: flex;
    flex-direction: column;

    justify-content: stretch;
    align-content: stretch;

    padding: 0 30px;
    margin: 0 30px;
    background-color: rgb(56, 56, 56);
}

textarea {
  resize: none;
}

textarea {
  background: none;
  color: #c6c6c6;
  font-size: 18px;
  padding: 10px 10px 10px 5px;
  display: block;
  border: none;
  border-radius: 0;
  border-bottom: 1px solid #c6c6c6;
}
textarea:focus {
  outline: none;
}
textarea:focus ~ label,
textarea:valid ~ label {
  top: -14px;
  font-size: 12px;
  color: #2196f3;
}
textarea:focus ~ .bar:before {
  width: 100%;
}

label {
  color: #c6c6c6;
  font-size: 16px;
  font-weight: normal;
  position: absolute;
  pointer-events: none;
  left: 5px;
  top: 10px;
  transition: 300ms ease all;
}

.bar {
  position: relative;
  display: block;
}
.bar:before {
  content: "";
  height: 2px;
  width: 0;
  bottom: 0px;
  position: absolute;
  background: #2196f3;
  transition: 300ms ease all;
  left: 0%;
}
</style>