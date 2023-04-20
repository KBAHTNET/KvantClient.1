<template>
  <div class="post-creator-wrapper" @click="emitClose">
    <div class="post-form" @click.stop>
      <FlatInput class="title" label="Заголовок" v-model:value="title" />
      <div class="body">
        <MultilineInput label="Текст..." v-model:value="body" />
      </div>
      <div class="uploader-wrapper">
        <div class="loaded-files-preview">
          0">
          <div
            @wheel="horizontalScroll"
            class="flex-wrapper"
            v-if="images.length > 0"
          >
            <div class="text-label">Изображения</div>

            <div class="image" v-for="(image, index) in images" :key="index">
              <div class="overlay-panel" v-if="!uploadingProcess">
                <img
                  @click="deleteImage(index)"
                  src="/icons/cancel.svg"
                  alt=""
                />
              </div>
              <img :src="image.url" alt="" @click="showImg" />
            </div>
          </div>
          <div
            @wheel="horizontalScroll"
            class="flex-wrapper"
            v-if="videos.length > 0"
          >
            <div class="text-label">Видео</div>

            <div class="video" v-for="(video, index) in videos" :key="index">
              <div class="overlay-panel" v-if="!uploadingProcess">
                <img
                  @click="deleteVideo(index)"
                  src="/icons/cancel.svg"
                  alt=""
                />
              </div>
              <video
                @click="showVideo"
                :src="video.url"
                :type="video.type"
              ></video>
            </div>
          </div>
          <div
            @wheel="horizontalScroll"
            class="flex-wrapper"
            v-if="audios.length > 0"
          >
            <div class="text-label">Музыка</div>
            <div class="audio" v-for="(audio, index) in audios" :key="index">
              <div class="overlay-panel" v-if="!uploadingProcess">
                <img
                  @click="deleteAudio(index)"
                  src="/icons/cancel.svg"
                  alt=""
                />
              </div>
              <img
                class="play"
                @click="showAudio"
                src="/icons/play.svg"
                alt=""
              />
              <audio :src="audio.url" :type="audio.type"></audio>
              <div class="overlay-namepanel">
                {{ audio.name }}
              </div>
            </div>
          </div>
          <div
            @wheel="horizontalScroll"
            class="flex-wrapper"
            v-if="files.length > 0"
          >
            <div class="text-label">Файлы</div>
            <div class="file" v-for="(file, index) in files" :key="index">
              <div class="overlay-panel" v-if="!uploadingProcess">
                <img
                  @click="deleteFile(index)"
                  src="/icons/cancel.svg"
                  alt=""
                />
              </div>
              <img
                class="file-icon"
                @click="showFile"
                src="/icons/file.svg"
                alt=""
              />
              <audio :src="file.url" :type="file.type"></audio>
              <div class="overlay-namepanel">
                {{ file.name }}
              </div>
            </div>
          </div>
        </div>
        <div class="buttons-wrapper">
          <img @click="uploadImages" src="/icons/photo.svg" alt="" />
          <img @click="uploadVideos" src="/icons/video.svg" alt="" />
          <img @click="uploadAudios" src="/icons/music.svg" alt="" />
          <img @click="uploadFiles" src="/icons/documents.svg" alt="" />
        </div>
        <!-- <Button
          @click="uploadFiles"
          class="button-preview"
          text="Загрузить изображения/файлы"
        /> -->
      </div>
      <!-- <Button
        @click="showModal"
        class="button-preview"
        text="Выбрать картинку для поста"
      /> -->
      <Button
        @click="createPost"
        class="button-create"
        text="Создать пост"
        v-if="!uploadingProcess"
      />
      <div
        ref="progress-bar"
        class="button-create uploading-progress"
        v-else-if="uploadingProcess"
      >
        <div class="upload-progressbar"></div>
        <div class="upload-text">Загрузка на сервер: {{ uploadText }}</div>
      </div>
    </div>
    <ImageModal
      :src="currentSrc"
      v-if="showImgModal"
      @click.stop
      @close="closeImg"
    />
    <VideoModal
      :src="currentVideoSrc"
      v-if="showVideoModal"
      @click.stop
      @close="closeVideo"
    />
    <AudioModal
      :src="currentAudioSrc"
      v-if="showAudioModal"
      @click.stop
      @close="closeAudio"
    />
    <GalleryModal
      v-if="showGalleryModal"
      :images="files"
      :selectedIndex="0"
      @close="closeModal"
      @click.stop
    />
    <SuccessWindow text="Пост создан" ref="modal" />
    <ErrorWindow ref="error_modal" />
  </div>
</template>

<script>
import FlatInput from "@/components/UI/FlatInput";
import Button from "@/components/UI/Button";
import MultilineInput from "@/components/UI/MultilineInput";
import GalleryModal from "@/components/GalleryModal";
import ImageModal from "@/components/ImageModal";
import VideoModal from "@/components/VideoModal";
import AudioModal from "@/components/AudioModal";
import SuccessWindow from "@/components/SuccessWindow";
import ErrorWindow from "@/components/ErrorWindow";
export default {
  data: () => {
    return {
      uploadingProcess: false,
      uploadText: "",
      title: "",
      body: "",
      images: [],
      videos: [],
      audios: [],
      files: [],
      linksToUploadedFiles: [], //give server after uploading by API '/upload' method post
      preview: "",
      showImgModal: false,
      currentSrc: "",
      showVideoModal: false,
      currentVideoSrc: "",
      showAudioModal: false,
      currentAudioSrc: "",
      showGalleryModal: false,
    };
  },
  methods: {
    horizontalScroll(e) {
      e.preventDefault();
      e.currentTarget.scrollBy(e.deltaY, 0);
    },
    deleteImage(index) {
      this.images.splice(index, 1);
    },
    deleteVideo(index) {
      this.videos.splice(index, 1);
    },
    deleteAudio(index) {
      this.audios.splice(index, 1);
    },
    deleteFile(index) {
      this.files.splice(index, 1);
    },
    showModal(event) {
      if (this.files.length > 0) {
        this.showGalleryModal = !this.showGalleryModal;
      } else {
        const input = document.createElement("input");
        input.type = "file";
        input.multiple = false;
        input.addEventListener("change", async (e) => {
          const file = e.target.files[0];

          const reader = new FileReader();
          reader.addEventListener("load", (e) => {
            const url = URL.createObjectURL(new Blob([e.target.result]));
            this.preview = url;

            this.$el.children[0].style.backgroundImage = `url('${this.preview}')`;
            this.$el.children[0].style.backgroundSize = "cover";
          });
          reader.readAsArrayBuffer(file);
        });
        input.click();
      }
    },
    closeModal(src) {
      this.showGalleryModal = false;

      this.$el.children[0].style.backgroundImage = `url('${src}')`;
      this.$el.children[0].style.backgroundSize = "cover";
      this.preview = src;
    },
    showImg(event) {
      this.currentSrc = event.target.src;
      this.showImgModal = !this.showImgModal;
    },
    showVideo(event) {
      this.currentVideoSrc = event.target.src;
      this.showVideoModal = !this.showVideoModal;
    },
    showAudio(event) {
      this.currentAudioSrc = event.target.nextElementSibling.src;
      this.showAudioModal = !this.showAudioModal;
    },
    closeImg() {
      this.showImgModal = false;
    },
    closeVideo() {
      this.showVideoModal = false;
    },
    closeAudio() {
      this.showAudioModal = false;
    },
    emitClose() {
      if (!this.uploadingProcess) {
        document.body.style.overflowY = "auto";
        const postForm = this.$el.querySelector(".post-form");
        if (window.outerHeight > window.outerWidth) {
          postForm.style.minHeight = "";
          postForm.style.minWidth = "";
          postForm.style.height = "70vw";
          postForm.style.width = "70vw";
        } else {
          postForm.style.minHeight = "";
          postForm.style.minWidth = "";
          postForm.style.height = "70vh";
          postForm.style.width = "70vh";
        }
        postForm.style.borderRadius = "100%";
        postForm.style.overflow = "";
        this.$el.style.overflow = "";
        postForm.style.overflow = "hidden";
        this.$el.style.overflow = "hidden";
        setTimeout(() => {
          let i = 70;
          const t = setInterval(() => {
            if (i < 0) {
              clearInterval(t);
            } else {
              if (window.outerHeight > window.outerWidth) {
                postForm.style.height = i + "vw";
                postForm.style.width = i + "vw";
              } else {
                postForm.style.height = i + "vh";
                postForm.style.width = i + "vh";
              }
              i -= 2;
            }
          }, 5);
          setTimeout(() => {
            this.$emit("close");
          }, 1000);
        }, 200);
      }
    },
    checkPosition() {
      this.$el.style.gridTemplateRows = window.pageYOffset + "px 1fr 1px";
    },
    uploadImages() {
      const input = document.createElement("input");
      input.type = "file";
      input.accept =
        "image/png, image/jpeg, image/gif, image/jpg, image/svg+xml, image/webp";
      input.multiple = true;
      input.addEventListener("change", async (e) => {
        const images = e.target.files;

        let i = 0;
        const reader = new FileReader();
        reader.addEventListener("load", (e) => {
          let url = URL.createObjectURL(new Blob([e.target.result]));
          this.images.push({
            name: input.files[i].name,
            type: input.files[i].type,
            url: url,
          });
          if (i + 1 != images.length) {
            i += 1;
            reader.readAsArrayBuffer(images[i]);
          }
        });
        reader.readAsArrayBuffer(images[i]);
      });
      input.click();
    },
    uploadVideos() {
      const input = document.createElement("input");
      input.type = "file";
      input.accept =
        "video/mpeg, video/mp4, video/ogg, video/x-flv, video/x-msvideo, video/webm";
      input.multiple = true;
      input.addEventListener("change", async (e) => {
        const videos = e.target.files;

        let i = 0;
        const reader = new FileReader();
        reader.addEventListener("load", (e) => {
          let url = URL.createObjectURL(new Blob([e.target.result]));
          this.videos.push({
            name: input.files[i].name,
            type: input.files[i].type,
            url: url,
          });
          if (i + 1 != videos.length) {
            i += 1;
            reader.readAsArrayBuffer(videos[i]);
          }
        });
        reader.readAsArrayBuffer(videos[i]);
      });
      input.click();
    },
    uploadAudios() {
      const input = document.createElement("input");
      input.type = "file";
      input.accept =
        "audio/mp4, audio/mpeg, audio/ogg, audio/webm, audio/basic, audio/L24, audio/aac";
      input.multiple = true;
      input.addEventListener("change", async (e) => {
        const audios = e.target.files;

        let i = 0;
        const reader = new FileReader();
        reader.addEventListener("load", (e) => {
          let url = URL.createObjectURL(new Blob([e.target.result]));
          this.audios.push({
            name: input.files[i].name,
            type: input.files[i].type,
            url: url,
          });
          if (i + 1 != audios.length) {
            i += 1;
            reader.readAsArrayBuffer(audios[i]);
          }
        });
        reader.readAsArrayBuffer(audios[i]);
      });
      input.click();
    },
    uploadFiles() {
      const input = document.createElement("input");
      input.type = "file";
      input.multiple = true;
      input.addEventListener("change", async (e) => {
        const files = e.target.files;

        let i = 0;
        const reader = new FileReader();
        reader.addEventListener("load", (e) => {
          let url = URL.createObjectURL(new Blob([e.target.result]));
          this.files.push({
            name: input.files[i].name,
            type: input.files[i].type,
            url: url,
          });
          if (i + 1 != files.length) {
            i += 1;
            reader.readAsArrayBuffer(files[i]);
          }
        });
        reader.readAsArrayBuffer(files[i]);
      });
      input.click();
    },
    async readResBody(res) {
      const chunks = [];
      const reader = res.body.getReader();
      while (true) {
        const aaa = await reader.read();
        chunks.push(aaa.value);
        if (aaa.done) {
          return new Blob(chunks);
        }
      }
    },
    async createPost() {
      const allFiles = [
        ...this.images,
        ...this.videos,
        ...this.audios,
        ...this.files,
      ];

      console.log(allFiles);
      const allLinks = [];

      let i = 0;
      const xhr = new XMLHttpRequest();

      xhr.upload.onprogress = (e) => {
        const percent = (e.loaded / e.total) * 100;
        this.$refs["progress-bar"].style.gridTemplateColumns =
          percent + "% 1fr";
        console.log(percent);
      };

      xhr.onload = async (e) => {
        const link = xhr.responseText;
        allLinks.push({
          uploadName: allFiles[allLinks.length].name,
          file: link,
        });
        console.log(allLinks);
        if (i + 1 != allFiles.length) {
          i += 1;
          this.uploadText = i + " из " + allFiles.length;
          const res = await fetch(allFiles[i].url);
          const blob = await this.readResBody(res);
          xhr.open("POST", "/uploadpostfile", true);
          xhr.send(blob);
        } else {
          const imageLinks = allLinks.slice(0, this.images.length);
          const videoLinks = allLinks.slice(
            this.images.length,
            this.images.length + this.videos.length
          );
          const audioLinks = allLinks.slice(
            this.images.length + this.videos.length,
            this.images.length + this.videos.length + this.audios.length
          );
          const fileLinks = allLinks.slice(
            this.images.length + this.videos.length + this.audios.length,
            this.images.length +
              this.videos.length +
              this.audios.length +
              this.files.length
          );
          const post = {
            title: this.title,
            body: this.body,
            images: imageLinks,
            videos: videoLinks,
            audios: audioLinks,
            files: fileLinks,
            nickname: this.$store.state.currentUser.nickname,
          };

          fetch("/createpost", {
            method: "POST",
            headers: {
              "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify(post),
          })
            .then((response) => response.text())
            .then((text) => {
              this.uploadingProcess = false;
              if (text === "OK") {
                this.$refs["modal"].ShowWindow();
                this.$emit("postCreated");
                this.emitClose();
              } else {
                this.$refs["error_modal"].ShowWindow(text.toString());
                this.emitClose();
              }
            });
        }
      };

      if (allFiles.length > 0) {
        const res = await fetch(allFiles[0].url);
        const blobBegin = await this.readResBody(res);
        xhr.open("POST", "/uploadpostfile", true);
        xhr.send(blobBegin);
        this.uploadingProcess = true;
        this.uploadText = "0 из " + allFiles.length;
      } else {
        const post = {
          title: this.title,
          body: this.body,
          images: [],
          videos: [],
          audios: [],
          files: [],
          nickname: this.$store.state.currentUser.nickname,
        };

        fetch("/createpost", {
          method: "POST",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
          body: JSON.stringify(post),
        })
          .then((response) => response.text())
          .then((text) => {
            //console.log(text);
            if (text === "OK") {
              this.$refs["modal"].ShowWindow();
              this.$emit("postCreated");
              this.emitClose();
            } else {
              this.$refs["error_modal"].ShowWindow(text.toString());
              this.emitClose();
            }
          });
      }
    },
    uloadFileToServer(files) {
      console.log(files);
      return new Promise((resolve, reject) => {
        let links = [];
        let i = 0;
        const reader = new FileReader();
        reader.addEventListener("load", async (e) => {
          const link = await fetch("/uploadpostfile", {
            method: "POST",
            body: e.target.result,
          })
            .then((res) => res.text())
            .catch((e) => {
              reject(e.toString());
            });
          links.push(link);
          if (i + 1 != files.length) {
            i += 1;
            const blob = await fetch(files[i]).then((r) => r.blob());
            reader.readAsArrayBuffer(blob);
          } else {
            resolve(links);
          }
        });
      });
    },
  },
  mounted() {
    const postForm = this.$el.querySelector(".post-form");
    postForm.style.height = "1vh";
    postForm.style.width = "1vw";
    postForm.style.overflow = "hidden";
    this.$el.style.overflow = "hidden";
    postForm.style.borderRadius = "100%";

    setTimeout(() => {
      postForm.style.borderRadius = "5px";
      postForm.style.width = "80vw";
      postForm.style.height = "70vh";
    }, 1000);

    setTimeout(() => {
      postForm.style.overflow = "auto";
      this.$el.style.overflow = "auto";
    }, 1500);

    let i = 0;
    const t = setInterval(() => {
      if (i > 70) {
        clearInterval(t);
      } else {
        if (window.outerHeight > window.outerWidth) {
          postForm.style.height = i + "vw";
          postForm.style.width = i + "vw";
        } else {
          postForm.style.height = i + "vh";
          postForm.style.width = i + "vh";
        }
        postForm.style.borderRadius = 100 - i + "%";
        i += 2;
      }
    }, 5);
    //document.body.style.overflowY = "hidden";
    //this.checkPosition();
    //this.$el.style.height = document.querySelector("#app").scrollHeight + "px";
    //document.addEventListener("scroll", this.checkPosition);
  },
  components: {
    FlatInput,
    MultilineInput,
    Button,
    ImageModal,
    VideoModal,
    AudioModal,
    GalleryModal,
    SuccessWindow,
    ErrorWindow,
  },
};
</script>

<style scoped>
.post-creator-wrapper {
  width: 100vw;
  min-height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  position: fixed;
  margin: 0 auto;

  z-index: 10;

  display: grid;
  grid-template-areas: ". . ." ". postform . " ". . .";
  grid-template-columns: 1fr 5fr 1fr;
  grid-template-rows: 1fr minmax(1fr, 10fr) 1fr;
}
.post-form {
  align-self: center;
  justify-self: center;

  grid-area: postform;
  /* min-width: 80vw;
  min-height: 70vh; */
  max-height: 70vh;
  background-color: black;

  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: minmax(80px, 1fr) minmax(190px, 2fr) 2fr 48px;
  border-radius: 20px;
  grid-gap: 10px;

  box-shadow: 0 0 10px 5px var(--primary-color);
  overflow-y: auto;
  /* 
  animation-name: postFormOpen;
  animation-direction: normal;
  animation-duration: 1s; */
  transition-duration: 1s;
}
@keyframes postFormOpen {
  0% {
    box-shadow: 0 0 0px 0px var(--primary-color);
    width: 0px;
    height: 0px;
    overflow: hidden;
  }
  100% {
    box-shadow: 0 0 10px 5px var(--primary-color);
    overflow-y: auto;
    width: 80vw;
    height: 70vh;
  }
}

.title {
  background-color: rgb(73, 73, 73);
  min-width: 95%;
  padding: 10px;
  min-height: 80px;
}
.body {
  align-self: center;
  justify-self: stretch;
  background-color: rgb(73, 73, 73);
  padding: 5px;
  margin: 15px;
  border-radius: 4px;
  display: grid;
  justify-content: stretch;
  align-content: stretch;
  min-height: 190px;
}

.buttons-wrapper {
  display: flex;
  flex-wrap: wrap;

  justify-content: flex-end;
  align-content: center;
  padding: 4px;
  height: 45px;
  margin: 0 20px;
}

.buttons-wrapper img {
  aspect-ratio: 1/1;
  width: auto;
  height: 30px;
  margin: 0 5px;
  background-color: var(--font-color);
  border-radius: 4px;
  padding: 2px;
}
.buttons-wrapper img:hover {
  box-shadow: 0 0 5px 3px var(--primary-color);
}
/* .button-preview {
  margin: 5px;
  cursor: pointer;
} */
.button-create {
  background-color: gray;
  user-select: none;
  cursor: pointer;
}
.uploading-progress {
  position: relative;
  bottom: 0;
  left: 0;
  height: 40px;
  width: 100%;
  display: grid;
  background-color: gray;
  grid-template-columns: 0 1fr;
  align-content: stretch;
  align-items: center;
}
.upload-progressbar {
  height: 100%;
  background-color: rgb(21, 255, 0);
}
.upload-text {
  position: absolute;
  width: 100%;
  text-align: center;
}
.uploader-wrapper {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 58px;
}

.loaded-files-preview {
  display: grid;
  overflow-x: auto;
  overflow-y: hidden;

  grid-template-columns: 1fr;
  grid-template-rows: repeat(auto-fit, 1fr);
}
.flex-wrapper {
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  color: var(--font-color);
}
.file,
.image,
.video,
.audio {
  margin: 5px;
  width: 100%;
  height: 100%;
  max-width: 100px;
  max-height: 100px;
  min-width: 100px;
  min-height: 100px;

  background-color: rgba(0, 0, 0, 0.75);

  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  justify-content: stretch;
  align-content: stretch;

  box-shadow: 0 0 4px 2px var(--primary-color);

  position: relative;
}
.image img {
  max-height: 100%;
  width: auto;

  align-self: center;
  justify-self: center;

  max-width: 75px;
  max-height: 75px;

  cursor: pointer;
}
.video video {
  max-height: 100%;
  width: auto;

  align-self: center;
  justify-self: center;

  max-width: 75px;
  max-height: 75px;

  cursor: pointer;
}
.audio .play {
  padding: 20px;

  max-height: 100%;
  width: auto;

  align-self: center;
  justify-self: center;

  max-width: 75px;
  max-height: 75px;

  cursor: pointer;

  background-color: var(--primary-color);
  border-radius: 100%;
}
.play:hover {
  background-color: var(--secondary-color);
}
.file-icon {
  padding: 20px;

  max-height: 100%;
  width: auto;

  align-self: center;
  justify-self: center;

  max-width: 75px;
  max-height: 75px;

  cursor: pointer;

  background-color: var(--primary-color);
  border-radius: 25%;
}
.file-icon:hover {
  background-color: var(--secondary-color);
}
.overlay-panel {
  position: absolute;
  display: grid;
  grid-template-columns: 1fr 30px;
  grid-template-areas: ". close";

  height: 20px;
  width: 100%;

  background-color: rgba(0, 0, 0, 0.644);
}

.overlay-panel img {
  grid-area: close;
  margin: 2px;
  background-color: white;

  height: 15px;
  width: auto;
}
.overlay-panel video {
  grid-area: close;
  margin: 2px;
  background-color: white;

  height: 15px;
  width: auto;
}

.text-label {
  width: 100px;
  text-align: center;
}

.overlay-namepanel {
  position: absolute;
  display: grid;
  grid-template-columns: 1fr;

  bottom: 0;
  height: 30px;
  width: 100%;
  word-break: break-all;
  font-size: 10px;
  background-color: rgba(0, 0, 0, 0.644);
  overflow-y: auto;
}
</style>