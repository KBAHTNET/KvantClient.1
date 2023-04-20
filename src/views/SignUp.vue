<template>
  <Preview text1="KVANT" text2="NET" imgBackSrc="/kvantnet_preview.jpg"/>
  <div class="wrapper">
    <div class="reg-form">
      <div class="avatar" @click="choseAvatar">
        <img :src="avatar" alt="Загрузить картинку..." />
      </div>
      <Input
        class="nickname"
        label="Никнейм:"
        placeholder="Придумайте себе никнейм..."
        maxInputAreaheight="80"
        v-model:value="nickname"
      />
      <Input
        class="phone"
        label="Телефон:"
        placeholder="Введите номер телефона, к которому у вас есть доступ..."
        maxInputAreaheight="80"
        v-model:value="phone"
      />
      <Input
        class="pass"
        label="Пароль:"
        placeholder="Придумайте себе пароль..."
        maxInputAreaheight="80"
        v-model:value="pass"
      />
      <div class="buttons">
        <Button
          class="end"
          text="Зарегистрироваться"
          @click="registerNewUser"
        />
        <Button class="login" text="Войти" @click="$router.push('/login')" />
      </div>
    </div>
    <ModalPhotoEditor
      ref="modalPhotoEditor"
      :generateCrop="!showWindow"
      :canChangeCropWindow="showWindow"
      @dataSaved="closeModalPhotoEditor"
    />
    <SuccessWindow text="Пользователь создан" ref="modal" />
    <ErrorWindow ref="error_modal" />
  </div>
</template>

<script>
import Button from "@/components/UI/Button";
import Preview from "@/components/Preview";
import Input from "@/components/UI/Input";
import ModalPhotoEditor from "@/components/ImageCropper/ModalPhotoEditor";
import SuccessWindow from "@/components/SuccessWindow";
import ErrorWindow from "@/components/ErrorWindow";
export default {
  components: {
    Button,
    Preview,
    Input,
    ModalPhotoEditor,
    SuccessWindow,
    ErrorWindow,
  },
  data() {
    return {
      showWindow: false,
      inputData: null,
      avatar: "",
      nickname: "",
      phone: "",
      pass: "",
    };
  },
  mounted() {
    let imageData = "";
    document.querySelector("svg").classList.add("animate");
    const avatar_container = document.querySelector(".avatar img");
    this.inputData = document.createElement("input");
    this.inputData.type = "file";
    this.inputData.onchange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsBinaryString(file);
      reader.onload = () => {
        let type = "";
        try {
          type = file.name.split(".")[1];
        } catch {}
        if (type.length > 0 && (type == "jpg" || type == "jpeg")) {
          imageData = "data:image/jpeg;base64," + btoa(reader.result);
          avatar_container.src = imageData;
        } else if (type.length > 0 && type == "svg") {
          imageData = "data:image/svg+xml;base64," + btoa(reader.result);
          avatar_container.src = imageData;
        } else if (type.length > 0 && type == "gif") {
          imageData = "data:image/gif;base64," + btoa(reader.result);
          avatar_container.src = imageData;
        } else if (type.length > 0 && type == "png") {
          imageData = "data:image/png;base64," + btoa(reader.result);
          avatar_container.src = imageData;
        }
        this.avatar = imageData;
      };
    };
  },
  methods: {
    choseAvatar() {
      //this.inputData.click();
      this.$refs["modalPhotoEditor"].showWindow();
    },
    closeModalPhotoEditor(data) {
      this.avatar = data;
      this.$refs["modalPhotoEditor"].closeWindow();
    },
    getAvatarFromStore() {
      console.log(this.$store.state.imgToSave);
      this.avatar = this.$store.state.imgToSave;
    },
    registerNewUser() {
      const newUser = {
        avatar: this.avatar,
        nickname: this.nickname,
        phone: this.phone,
        pass: this.pass,
      };
      console.log(newUser);

      //#region Клиентская валидация
      if (this.nickname.length < 4) {
        this.$refs["error_modal"].ShowWindow(
          "Никнейм не может быть меньше 4 символов"
        );
        return;
      }
      if (this.pass.length < 4) {
        this.$refs["error_modal"].ShowWindow(
          "Пароль не может быть меньше 4 символов"
        );
        return;
      }
      //#endregion

      fetch("/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(newUser),
      })
        .then((res) => res.text())
        .then((text) => {
          if (text === "OK") {
            this.$refs["modal"].ShowWindow();
          } else {
            this.$refs["error_modal"].ShowWindow(text);
          }
        });
    },
  },
};
</script>

<style scoped>
.wrapper {
  display: grid;
  background-color: var(--back-color);
  min-width: 100vw;
  min-height: 100vh;

  overflow-y: auto;
}
.reg-form {
  margin-top: 20vh;
  display: grid;

  grid-template-areas: "avatar nickname" "avatar phone" "avatar pass" "buttons buttons";
  grid-template-columns: 1fr 2fr;
  grid-template-rows: repeat(3, minmax(1fr, 2fr), 3fr);

  overflow-y: auto;
}

@media screen and (orientation: portrait) {
  .reg-form {
    margin-top: 12vh;
    grid-template-areas: "avatar" "nickname" "phone" "pass" "buttons";
    grid-template-columns: 1fr;
    grid-template-rows: 2fr repeat(5, minmax(1fr, 2fr));
  }
}

.avatar {
  background-color: var(--theme-color);
  grid-area: avatar;
  margin: 10px;
  box-shadow: 0px 0px 10px 2px var(--primary-color);

  max-width: 400px;
  max-height: 400px;

  aspect-ratio: 1/1;

  align-self: center;
  justify-self: center;
  display: flex;
  justify-content: center;
  align-content: center;
}

.avatar:hover {
  box-shadow: 0px 0px 10px 2px var(--secondary-color);
}

.avatar img {
  margin: auto;

  width: 100%;
  height: 100%;
}

.nickname {
  grid-area: nickname;
  margin: 10px;
}

.phone {
  grid-area: phone;
  margin: 10px;
}

.pass {
  grid-area: pass;
  margin: 10px;
}

.confirm_pass {
  grid-area: confirm;
  margin: 10px;
}

.end {
  grid-area: end;
  margin-top: 10px;
  min-height: 40px;
  max-height: 45px;
}

.login {
  grid-area: login;
  margin-top: 10px;
  min-height: 40px;
  max-height: 45px;
}

.buttons {
  display: flex;
  flex-direction: column;
  grid-area: buttons;
}
</style>