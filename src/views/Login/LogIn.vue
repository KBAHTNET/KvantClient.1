<template>
  <Preview text1="KVANT" text2="NET" imgBackSrc="/kvantnet_preview.jpg" />

  <div class="wrapper">
    <canvas id="c"></canvas>
    <div class="reg-form">
      <Input
        class="nickname"
        label="Никнейм:"
        placeholder="Ваш никнейм..."
        maxInputAreaheight="80"
        v-model:value="nickname"
      />
      <Input
        class="pass"
        label="Пароль:"
        placeholder="Ваш пароль..."
        maxInputAreaheight="80"
        v-model:value="pass"
      />
      <div class="buttons">
        <Button class="login" text="Войти" @click="Login()" />
        <Button
          class="end"
          text="Зарегистрироваться"
          @click="$router.push('/signup')"
        />
      </div>
    </div>
    <SuccessWindow text="Аутентификация пройдена" ref="modal" />
    <ErrorWindow ref="error_modal" />
  </div>
</template>

<script>
const { hexagonStart } = require("./hexagon");
import Button from "@/components/UI/Button";
import Preview from "@/components/Preview";
import Input from "@/components/UI/Input";
import SuccessWindow from "@/components/SuccessWindow";
import ErrorWindow from "@/components/ErrorWindow";
export default {
  components: {
    Button,
    Preview,
    Input,
    SuccessWindow,
    ErrorWindow,
  },
  data() {
    return {
      inputData: null,
      nickname: "",
      phone: "",
      pass: "",
    };
  },
  methods: {
    Login() {
      const User = {
        nickname: this.nickname,
        pass: this.pass,
      };

      const app = this;
      fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json;charset=utf-8" },
        body: JSON.stringify(User),
      })
        .then((res) => res.text())
        .then((text) => {
          if (text === "OK") {
            this.$refs["modal"].ShowWindow();
            setTimeout(() => {
              app.$router.push({ path: "/" });
            }, 2000);
          } else {
            if (text.includes("Error")) {
              this.$refs["error_modal"].ShowWindow(text);
            } else {
              this.$refs["error_modal"].ShowWindow("Неверный логин или пароль");
            }
          }
        });
    },
  },
  mounted() {
    try {
      document.querySelector(".pass .input-area").style.webkitTextSecurity = "disc";
    } catch {}
    hexagonStart();

    try {
      if (
        document.cookie.split("authorized=")[1].split(";")[0].toString() ===
        "true"
      ) {
        this.$router.push("/");
      }
    } catch {}
  },
};
</script>

<style scoped>
canvas {
  position: absolute;

  top: 0;
  left: 0;

  z-index: 1;
}

.wrapper {
  display: grid;
  background-color: var(--back-color);
  min-width: 100vw;
  min-height: 100vh;
}
.reg-form {
  margin-top: 20vh;
  display: grid;

  grid-template-areas: ". nickname ." ". pass ." ". . ." ". . ." ". . ." ". . ." ". buttons .";
  grid-template-columns: 1fr 3fr 1fr;
  grid-template-rows: repeat(4, minmax(1fr, 2fr));

  z-index: 2;
}

@media screen and (orientation: portrait) {
  .reg-form {
    margin-top: 12vh;
    grid-template-areas: "nickname" "pass" "." "." "." "buttons";
    grid-template-columns: 1fr;
    grid-template-rows: 2fr repeat(5, minmax(1fr, 2fr));
  }
}

.nickname {
  grid-area: nickname;
  margin: 10px;
}

.pass {
  grid-area: pass;
  margin: 10px;
}

.end {
  grid-area: end;
  min-height: 40px;
  max-height: 45px;
}

.login {
  grid-area: login;
  min-height: 40px;
  max-height: 45px;

  margin-bottom: 10px;
}
.buttons {
  display: flex;
  flex-direction: column;
  grid-area: buttons;
}
</style>