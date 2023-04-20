<template>
  <div class="photo-editor-wrapper" ref="cropperWrapper">
    <div class="ring-wrapper" v-if="isImageLoading">
      <RingLoader />
    </div>
    <VueCropper
      class="photo-editor-cropper"
      ref="cropper"
      :key="componentKey"
      :img="option.img"
      :outputSize="option.size"
      :outputType="option.outputType"
      :info="true"
      :full="option.full"
      :canMove="option.canMove"
      :canMoveBox="option.canMoveBox"
      :fixedBox="option.fixedBox"
      :original="option.original"
      :autoCrop="option.autoCrop"
      :autoCropWidth="option.autoCropWidth"
      :autoCropHeight="option.autoCropHeight"
      :centerBox="option.centerBox"
      :high="option.high"
      :infoTrue="option.infoTrue"
      :maxImgSize="option.maxImgSize"
      @realTime="realTime"
      @imgLoad="imgLoad"
      @cropMoving="cropMoving"
      :enlarge="option.enlarge"
      :mode="option.mode"
      :limitMinSize="option.limitMinSize"
    ></VueCropper>
    <div class="photo-editor-buttons">
      <img
        class="upload-button"
        @click="uploadClick"
        src="/icons/upload.svg"
        alt="Загрузить изображение"
      />
      <img
        v-show="canChangeCropWindow"
        class="crop-button"
        @click="createCropper"
        id="createCropper"
        src="/icons/crop.svg"
        alt=""
      />
      <img
        class="move-button"
        @click="toggleMove"
        id="toggleMove"
        src="/icons/move.svg"
        alt=""
      />
      <img
        class="clear-crop-button"
        @click="clearCrop"
        src="/icons/clear-crop.svg"
        alt=""
      />
      <img
        class="refresh-button"
        @click="refreshCrop"
        src="/icons/refresh.svg"
        alt=""
      />
      <img
        class="recycle-bin-button"
        @click="() => (option.img = '')"
        src="/icons/recycle-bin.svg"
        alt=""
      />
      <img
        class="rotate-left-button"
        @click="rotateLeft"
        src="/icons/rotate-left.svg"
        alt=""
      />
      <img
        class="rotate-right-button"
        @click="rotateRight"
        src="/icons/rotate-right.svg"
        alt=""
      />
      <img
        class="save-button"
        @click="saveInRes(saveImgFormat)"
        src="/icons/save.svg"
        alt=""
      />
    </div>
    <div
      ref="cropperPreviews"
      class="photo-editor-previews"
      v-if="showPreview.isPreviewsShown"
    >
      <h3 class="previews-title">Предпросмотр</h3>
      <!-- <section class="item-big">
        <p>Размер поля для скриншота</p>
        <div
          class="show-preview"
          :style="{
            width: previews.w + 'px',
            height: previews.h + 'px',
            overflow: 'hidden',
            margin: '5px',
          }"
        >
          <div :style="previews.div">
            <img :src="previews.url" :style="previews.img" />
          </div>
        </div>
      </section> -->

      <section class="item-medium">
        <div :style="previewStyle1">
          <div :style="previews.div">
            <img :src="previews.url" :style="previews.img" />
          </div>
        </div>
      </section>

      <section class="item-small">
        <div :style="previewStyle2">
          <div :style="previews.div">
            <img :src="previews.url" :style="previews.img" />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import VueCropper from "@/components/ImageCropper/core/ImageCropper";
import RingLoader from "@/components/UI/RingLoader";
export default {
  props: {
    saveImgFormat: {
      type: String,
      default: "base64",
    },
    generateCrop: {
      type: Boolean,
      default: false,
    },
    generatedCropSize: {
      type: Object,
      default: {
        width: 400,
        height: 400,
      },
    },
    canChangeCropWindow: {
      type: Boolean,
      default: true,
    },
  },
  data: () => {
    return {
      showPreview: {
        menuButtonClass: "photo-editor-icon",
        defaultMenuButtonClass: "photo-editor-icon",
        isPreviewsShownAddClass: "active-menu",
        isPreviewsShown: true,

        setActive: function () {
          this.menuButtonClass =
            this.defaultMenuButtonClass + " " + this.isPreviewsShownAddClass;
        },

        deactivate: function () {
          this.menuButtonClass = this.defaultMenuButtonClass;
        },
      },
      uploadInput: {},
      componentKey: 0,
      isImageLoading: false,
      isCreatingCrop: false,
      option: {
        img: "",
        size: 1,
        full: true,
        outputType: "png",
        canMove: false,
        fixedBox: true,
        original: false,
        canMoveBox: true,
        autoCrop: false,
        // Ширина и высота вступят в силу только в том случае, если включен автоматический снимок экрана
        autoCropWidth: 400, //начальная ширина окна вырезания
        autoCropHeight: 400, //начальная высота окна вырезания
        centerBox: false, //Ограничено ли поле скриншота изображением (оно может вступить в силу только при автоматическом создании поля скриншота)
        high: false,
        cropData: {},
        enlarge: 1,
        mode: "contain",
        maxImgSize: 10000,
        limitMinSize: [100, 100],
      },
      previews: {},
      previewStyle1: {},
      previewStyle2: {},
      previewStyle3: {},
      previewStyle4: {},
      maxFileSizeInMBytes: 10,
    };
  },
  components: {
    VueCropper,
    RingLoader,
  },
  mounted() {
    this.option.fixedBox = !this.canChangeCropWindow;
    this.option.canMove = !this.canChangeCropWindow;
    this.option.autoCrop = this.generateCrop;
    this.option.autoCropWidth = this.generatedCropSize.width;
    this.option.autoCropHeight = this.generatedCropSize.height;

    if (window.innerHeight > window.innerWidth) {
      this.$refs["cropperWrapper"].classList.add("portrait");
      if (this.$refs["cropperPreviews"].style.display != "none") {
        this.$refs["cropperPreviews"].style.display = "none";
      }
    } else {
      this.$refs["cropperWrapper"].classList.remove("portrait");
      if (this.$refs["cropperPreviews"].style.display != "grid") {
        this.$refs["cropperPreviews"].style.display = "grid";
      }
    }

    this.$refs["cropperWrapper"].style.gridTemplateAreas = '"cropper buttons"';
    this.$refs["cropperWrapper"].style.gridTemplateRows = "1fr";
    this.$refs["cropperWrapper"].style.gridTemplateColumns = "3fr 2fr";
    this.$refs["cropperPreviews"].style.display = "none";

    //#region Create Input For Uploading Image
    this.uploadInput = document.createElement("input");
    this.uploadInput.type = "file";
    this.uploadInput.accept = "image/png, image/jpeg, image/gif, image/jpg";
    this.uploadInput.ref = "uploadImg";
    this.uploadInput.addEventListener("change", (event) => {
      this.uploadImg(event, 1);
    });
    //#endregion

    window.addEventListener("resize", () => {
      //#region Force Re-rendering
      if (this.componentKey < 10) {
        this.componentKey += 1;
      } else {
        this.componentKey += 1;
      }
      //#endregion

      if (this.isCreatingCrop) {
        this.stopCrop();
        this.option.fixedBox = false;
        document.getElementById("createCropper").classList.remove("active");
      }

      if (window.innerHeight > window.innerWidth) {
        this.$refs["cropperWrapper"].classList.add("portrait");
        if (this.$refs["cropperPreviews"].style.display != "none") {
          this.$refs["cropperPreviews"].style.display = "none";
        }
      } else {
        this.$refs["cropperWrapper"].classList.remove("portrait");
        if (this.$refs["cropperPreviews"].style.display != "grid") {
          this.$refs["cropperPreviews"].style.display = "grid";
        }
      }
    });
  },
  methods: {
    uploadClick() {
      this.uploadInput.click();
    },
    realTime(data) {
      if (!this.$refs["cropperWrapper"].classList.contains("portrait")) {
        if (data.w > 10 && data.h > 10) {
          this.$refs["cropperWrapper"].style.gridTemplateAreas =
            '"cropper buttons" "cropper previews"';
          this.$refs["cropperWrapper"].style.gridTemplateRows = "1fr 4fr";
          this.$refs["cropperWrapper"].style.gridTemplateColumns = "3fr 2fr";
          this.$refs["cropperPreviews"].style.display = "grid";
        } else {
          this.$refs["cropperWrapper"].style.gridTemplateAreas =
            '"cropper buttons"';
          this.$refs["cropperWrapper"].style.gridTemplateRows = "1fr";
          this.$refs["cropperWrapper"].style.gridTemplateColumns = "3fr 2fr";
          this.$refs["cropperPreviews"].style.display = "none";
        }
      }

      let previews = data;
      let h = 0.5;
      let w = 0.2;
      this.previewStyle1 = {
        width: previews.w + "px",
        height: previews.h + "px",
        overflow: "hidden",
        margin: "0",
        zoom: h,
      };
      this.previewStyle2 = {
        width: previews.w + "px",
        height: previews.h + "px",
        overflow: "hidden",
        margin: "0",
        zoom: w,
      };
      this.previewStyle3 = {
        width: previews.w + "px",
        height: previews.h + "px",
        overflow: "hidden",
        margin: "0",
        zoom: 100 / previews.w,
      };
      this.previewStyle4 = {
        width: previews.w + "px",
        height: previews.h + "px",
        overflow: "hidden",
        margin: "0",
        zoom: 100 / previews.h,
      };
      this.previews = data;
    },
    imgLoad(msg) {
      this.isImageLoading = false;
    },
    cropMoving(data) {
      this.option.cropData = data;
    },
    uploadImg(e, num) {
      window.getSelection().removeAllRanges(); //delete focus

      let file = e.target.files[0];
      if (parseInt(file.size / 8 / 1024 / 1024) > this.maxFileSizeInMBytes) {
        alert("Файл не должен превышать " + this.maxFileSizeInMBytes + " МБайт");
        return false;
      }
      if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
        alert(
          "Файл должен быть изображением из следующих форматов(.gif,jpeg,jpg,png,bmp)"
        );
        return false;
      }
      this.isImageLoading = true; //show RingLoader

      const reader = new FileReader();
      reader.onload = (e) => {
        let data;
        if (typeof e.target.result === "object") {
          data = window.URL.createObjectURL(new Blob([e.target.result]));
        } else {
          data = e.target.result;
        }
        if (num === 1) {
          this.option.img = data;
        }
        this.uploadInput.value = "";
      };
      reader.readAsArrayBuffer(file);
    },
    saveInRes(type) {
      try {
        if (type === "blob") {
          this.$refs.cropper.getCropBlob((data) => {
            this.$store.commit("saveImg", window.URL.createObjectURL(data));
            this.$emit("dataSaved", window.URL.createObjectURL(data));
          });
        } else {
          this.$refs.cropper.getCropData((data) => {
            this.$store.commit("saveImg", data);
            this.$emit("dataSaved", data);
          });
        }
      } catch {}
    },
    startCrop() {
      this.isCreatingCrop = true;
      this.$refs.cropper.startCrop();
    },
    stopCrop() {
      this.isCreatingCrop = false;
      this.$refs.cropper.stopCrop();
    },
    createCropper() {
      if (this.isCreatingCrop) {
        this.stopCrop();
        this.option.fixedBox = false;
        document.getElementById("createCropper").classList.remove("active");
      } else {
        this.startCrop();
        this.option.fixedBox = true;
        document.getElementById("createCropper").classList.add("active");
      }

      if (this.option.canMove) {
        this.option.canMove = !this.option.canMove;
        this.option.canMoveBox = !this.option.canMove;
        if (this.option.canMove) {
          document.getElementById("toggleMove").classList.add("active");
        } else {
          document.getElementById("toggleMove").classList.remove("active");
        }
      }
    },
    toggleMove() {
      if (this.isCreatingCrop) {
        this.stopCrop();
        this.option.fixedBox = false;
        document.getElementById("createCropper").classList.remove("active");
      }

      this.option.canMove = !this.option.canMove;
      this.option.canMoveBox = !this.option.canMove;
      if (this.option.canMove) {
        document.getElementById("toggleMove").classList.add("active");
      } else {
        document.getElementById("toggleMove").classList.remove("active");
      }
    },
    clearCrop() {
      this.$refs.cropper.clearCrop();
    },
    refreshCrop() {
      this.$refs.cropper.refresh();
    },
    rotateLeft() {
      this.$refs.cropper.rotateLeft();
    },
    rotateRight() {
      this.$refs.cropper.rotateRight();
    },
  },
};
</script>

<style scoped>
.ring-wrapper {
  width: 20vw;
  height: 20vh;
  background-color: rgb(255, 255, 255, 0);

  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;

  justify-content: center;
  align-content: center;
  align-items: center;
  justify-items: center;

  position: absolute;

  top: 18vh;
  left: 33vw;

  z-index: 999999;
}
/* @media screen and (orientation: landscape) {
  .ring-wrapper {
    justify-content: center;
    align-content: center;
    align-items: center;
    justify-items: center;

    position: absolute;
    left: 70vw;
    top: 50vh;
  }
}

@media screen and (orientation: portrait) {
  .ring-wrapper {
    justify-content: center;
    align-content: center;
    align-items: center;
    justify-items: center;

    position: absolute;
    left: 35vw;
    top: 70vh;
    z-index: 9999999999999;
  }
} */

.photo-editor-wrapper {
  background-color: #333;
  display: grid;
  grid-template-areas: "cropper buttons" "cropper previews";
  grid-template-columns: 3fr 2fr;
  grid-template-rows: 1fr 4fr;
  width: 100vh;
  height: 65vh;

  border-style: solid;
  border-color: var(--primary-color);
  border-width: 2px;

  position: relative;
}

.photo-editor-wrapper.portrait {
  grid-template-areas: "cropper" "buttons" !important;
  grid-template-columns: 1fr !important;
  grid-template-rows: 3fr 1fr !important;
  width: 90vw !important;
  height: 80vh !important;
}

/* .photo-editor-menu {
  background-color: var(--primary-color);
  position: absolute;
  width: 100vw;
  height: 37px;

  top: 0;
  left: 0;

  display: grid;
  grid-template-areas: "icon . close";
  grid-template-columns: 40px 1fr 40px;
  grid-template-rows: 1fr;

  align-content: stretch;
  justify-content: stretch;
}

.photo-editor-close {
  grid-area: close;
  align-self: center;
  justify-self: center;
  width: 100%;
  height: 20px;
}

.photo-editor-icon {
  grid-area: icon;
  align-self: center;
  justify-self: center;
  width: 100%;
  height: 35px;
  background-color: var(--theme-color);
} */

/* @media screen and (orientation: portrait) {
  .photo-editor-wrapper {
    width: 60vw;
    height: 60vw;
    grid-template-areas: "previews" "previews";
    grid-template-columns: 1fr;
    grid-template-rows: 3fr 1fr;
    width: 90vw;
    height: 70vh;
  }
  .photo-editor-closePreview {
    grid-template-areas: "cropper" "buttons" !important;
  }
} */

.photo-editor-cropper {
  grid-area: cropper;

  width: 100%;
  height: 100%;
}
.photo-editor-buttons {
  grid-area: buttons;

  display: grid;
  grid-template-areas: "upload crop move" "clear refresh recycle" "rleft . rright" "save save save";
  grid-template-rows: repeat(3, minmax(40px, 1fr));
  grid-template-columns: repeat(3, minmax(40px, 1fr));
  padding: 10px;

  justify-content: space-between;
  align-content: space-between;
  justify-items: stretch;
  align-items: stretch;
}
.photo-editor-buttons img {
  align-self: center;
  justify-self: center;

  width: 40px;
  height: 40px;

  padding: 3px;
  margin: 3px;

  border-style: solid;
  border-color: var(--primary-color);
  border-width: 1px;
}
.photo-editor-buttons img:hover {
  background-color: var(--primary-color);
  box-shadow: 0 0 3px 1px var(--primary-color);
}

.upload-button {
  grid-area: upload;
}
.crop-button {
  grid-area: crop;
}
.move-button {
  grid-area: move;
}
.clear-crop-button {
  grid-area: clear;
}
.refresh-button {
  grid-area: refresh;
}
.recycle-bin-button {
  grid-area: recycle;
}
.rotate-left-button {
  grid-area: rleft;
}
.rotate-right-button {
  grid-area: rright;
}
.save-button {
  grid-area: save;
}
.photo-editor-previews {
  grid-area: previews;

  display: grid;

  grid-template-areas: "title" "medium" "small";
  grid-template-columns: 1fr;
  grid-template-rows: 30px 2fr 1fr;

  position: relative;
  width: 100%;
  height: 100%;

  overflow: auto;

  justify-content: stretch;
  justify-items: center;

  align-content: stretch;
  align-items: center;
}

.item-big {
  align-self: center;
  justify-self: center;
  grid-area: big;
}

.previews-title {
  grid-area: title;
}

.item-medium {
  align-self: center;
  justify-self: center;
  grid-area: medium;

  border-style: solid;
  border-width: 2px;
  border-color: var(--primary-color);
}

.item-small {
  align-self: center;
  justify-self: center;
  grid-area: small;

  border-style: solid;
  border-width: 2px;
  border-color: var(--primary-color);
}
.active {
  background-color: var(--primary-color);
}

.active-menu {
  background-color: var(--primary-color);
}

.hidden {
  display: none !important;
}
</style>