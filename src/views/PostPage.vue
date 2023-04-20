<template>
  <div class="post-wrapper">
    <div class="title">
      <div class="back-button" @click="$router.go(-1)">
        <img src="/icons/back.svg" alt="" />
      </div>
      <div class="text-title">{{ post.title }}</div>
    </div>
    <div class="body" v-if="post.body && post.body.length > 0">
      <p align="justify" :innerText="post.body"></p>
      <!-- {{ post.body }} -->
    </div>
    <div v-if="post.images?.length > 0" class="images">
      <Gallery
        :images="
          [...post.images].map(
            (it) => (it = '/getpostfilebypath?file=' + it.file)
          )
        "
      />
    </div>
    <div v-if="videoDataLoaded && post.videos?.length > 0" class="videos">
      <div @wheel="flexHorizontalScroll" class="text-label">Видео</div>
      <div
        @wheel="horizontalScroll"
        class="flex-wrapper"
        :style="post.videos.length === 1 ? 'justify-content:center;' : ''"
      >
        <div class="video" v-for="(video, index) in post.videos" :key="index">
          <!-- <div class="progress-download" v-if="!blobVideos[index]">
            <div class="prog">
              <div class="procent">{{ videoProgress[index] }}</div>
            </div>
            <div class="progAll"></div>
          </div> -->
          <div class="video-name">
            {{ video.uploadName }}
          </div>
          <div :id="'player-' + index"></div>
          <!-- <video
            v-else
            @click="showVideo"
            :src="blobVideos[index] + '#t=1'"
            :type="video.type"
          ></video> -->
        </div>
      </div>
    </div>
    <div class="videos" v-if="!videoDataLoaded && post.videos?.length > 0">
      <RingLoader />
    </div>
    <div v-if="audioDataLoaded && post.audios?.length > 0" class="audios">
      <div @wheel="flexHorizontalScroll" class="text-label">Музыка</div>
      <div @wheel="horizontalScroll" class="flex-wrapper">
        <div class="audio" v-for="(audio, index) in post.audios" :key="index">
          <!-- <div class="progress-download" v-if="!blobAudios[index]">
            <div class="prog">
              <div class="procent">{{ audioProgress[index] }}</div>
            </div>
            <div class="progAll"></div>
          </div> -->
          <img
            class="play"
            @click="showAudio(index)"
            src="/icons/play.svg"
            alt=""
          />
          <audio
            :src="'/getpostfilebypath?file=' + audio.file"
            :type="audio.type"
          ></audio>
          <div class="overlay-namepanel">
            {{ audio.uploadName }}
          </div>
        </div>
      </div>
    </div>
    <div class="audios" v-if="!audioDataLoaded && post.audios?.length > 0">
      <RingLoader />
    </div>
    <div v-if="post.files?.length > 0" class="files">
      <div @wheel="flexHorizontalScroll" class="text-label">Файлы</div>
      <div @wheel="horizontalScroll" class="flex-wrapper">
        <div class="file" v-for="(file, index) in post.files" :key="index">
          <img
            class="file-icon"
            @click="downloadFile"
            src="/icons/file.svg"
            alt=""
          />
          <a
            :href="'/getpostfilebypath?file=' + file.file"
            :download="file.uploadName"
            :type="file.type"
          ></a>
          <div class="overlay-namepanel">
            {{ file.uploadName }}
          </div>
        </div>
      </div>
    </div>
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
      @ended="playNext"
    />
  </div>
</template>

<script>
import Gallery from "@/components/Gallery";
import VideoModal from "@/components/VideoModal";
import AudioModal from "@/components/AudioModal";
import RingLoader from "@/components/UI/RingLoader";
export default {
  props: {
    title: {
      type: String,
      default: "",
    },
    body: {
      type: String,
      default: "",
    },
    images: {
      type: Array,
      default: [],
    },
    videos: {
      type: Array,
      default: [],
    },
    audios: {
      type: Array,
      default: [],
    },
    files: {
      type: Array,
      default: [],
    },
  },
  data: () => {
    return {
      post: {},
      showVideoModal: false,
      currentVideoSrc: "",
      showAudioModal: false,
      currentAudioSrc: "",
      blobAudios: [],
      audioProgress: [],
      blobVideos: [],
      videoProgress: [],
      videoDataLoaded: false,
      audioDataLoaded: false,
    };
  },
  methods: {
    flexHorizontalScroll(e) {
      e.preventDefault();
      e.target.nextSibling.scrollBy(e.deltaY, 0);
    },
    horizontalScroll(e) {
      e.preventDefault();
      e.target.scrollBy(e.deltaY, 0);
    },
    goBack() {
      if (this.post.nickname === this.$store.state.currentUser.nickname) {
        this.$router.push("/");
      } else {
        this.$router.push("/" + this.post.nickname);
      }
    },
    playNext(src) {
      const obj = this.post.audios.filter((it) => it.file == src);
      const endedIndex = this.post.audios.indexOf(obj);
      const nextIndex = (endedIndex + 1) % this.post.audios.length;
      this.currentAudioSrc = this.$el.querySelectorAll("audio")[nextIndex].src;
      console.log(this.currentAudioSrc);
    },
    showVideo(event) {
      this.currentVideoSrc = event.target.src;
      this.showVideoModal = !this.showVideoModal;
    },
    showAudio(index) {
      const playList = [];
      for (const i in this.post.audios) {
        playList.push({
          file: "/getpostfilebypath?file=" + this.post.audios[i].file,
          name: this.post.audios[i].uploadName,
        });
      }
      this.$store.state.app.SetPlayList(playList);
      this.$store.state.app.SetCurrentIndex(index);
    },
    closeVideo() {
      this.showVideoModal = false;
    },
    closeAudio() {
      this.showAudioModal = false;
    },
    downloadFile(e) {
      e.target.nextElementSibling.click();
    },
    initPlayers() {
      setTimeout(() => {
        if (this.post.hasOwnProperty("videos") && this.post.videos.length > 0) {
          for (let i = 0; i < this.post.videos.length; i += 1) {
            const playerId = "player-" + i;
            const fileUrl =
              "/getpostfilebypath?file=" + this.post.videos[i].file;
            console.log(playerId, fileUrl);
            try {
              const player = new Playerjs({
                id: playerId,
                file: fileUrl,
              });
            } catch {
              this.initPlayers();
            }
          }
        }
      }, 2000);
    },
  },
  async mounted() {
    console.log(this.$route.params.id);

    this.post = await fetch("/getpost/" + this.$route.params.id).then((res) =>
      res.json()
    );

    if (this.post.title.length > 3) {
      document.title = this.post.title;
    }

    this.videoDataLoaded = true;
    this.initPlayers();
    // setTimeout(() => {
    //   if (this.post.hasOwnProperty("videos") && this.post.videos.length > 0) {
    //     for (let i = 0; i < this.post.videos.length; i += 1) {
    //       const playerId = "player-" + i;
    //       const fileUrl = "/getpostfilebypath?file=" + this.post.videos[i].file;
    //       console.log(playerId, fileUrl);
    //       const player = new Playerjs({
    //         id: playerId,
    //         file: fileUrl,
    //       });
    //     }
    //   }
    // }, 2000);

    if (this.post.hasOwnProperty("audios") && this.post.audios.length > 0) {
      // for (const i in this.post.audios) {
      //   this.audioProgress[i] = 0;
      //   this.blobAudios.push(false);
      // }
      this.audioDataLoaded = true;

      // for (const i in this.post.audios) {
      //   // Шаг 1: начинаем загрузку fetch, получаем поток для чтения
      //   let response = await fetch(
      //     "/getpostfilebypath?file=" + this.post.audios[i].file
      //   ).catch((e) => console.log(e));

      //   const reader = response.body.getReader();

      //   // Шаг 2: получаем длину содержимого ответа
      //   const contentLength = +response.headers.get("Content-Length");

      //   // Шаг 3: считываем данные:
      //   let receivedLength = 0; // количество байт, полученных на данный момент
      //   let chunks = []; // массив полученных двоичных фрагментов (составляющих тело ответа)
      //   while (true) {
      //     const { done, value } = await reader.read().catch((e) => {
      //       console.log(e);
      //     });

      //     if (done) {
      //       break;
      //     }

      //     chunks.push(value);
      //     receivedLength += value.length;

      //     const percent = (receivedLength / contentLength) * 100;
      //     this.audioProgress[i] = parseFloat(percent).toFixed(2);

      //     try {
      //       document.querySelector(
      //         ".progress-download"
      //       ).style.gridTemplateColumns = percent + "% 1fr";
      //     } catch {}
      //   }

      //   // Шаг 4: соединим фрагменты в общий типизированный массив Uint8Array
      //   let chunksAll = new Uint8Array(receivedLength); // (4.1)
      //   let position = 0;
      //   for (let chunk of chunks) {
      //     chunksAll.set(chunk, position); // (4.2)
      //     position += chunk.length;
      //   }

      //   this.blobAudios[i] = URL.createObjectURL(new Blob(chunks));
      // }
    }
  },
  components: {
    Gallery,
    VideoModal,
    AudioModal,
    RingLoader,
  },
};
</script>

<style scoped>
.post-wrapper {
  min-width: 100vw;
  min-height: 100vh;
  overflow-x: hidden;
  background-color: var(--back-color);
  display: grid;
  grid-template-areas: "title" "body" "images" "videos" "audios" "files";
}

.title {
  grid-area: title;
  min-height: 55px;
  max-height: 300px;
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: 1fr;
  margin: 0 15px;
}
.text-title {
  color: var(--font-color);
  text-align: center;
  font-size: 30px;
  overflow-y: auto;
  overflow-x: hidden;
}

.back-button {
  background-color: rgba(0, 0, 0, 0);
  width: 55px;
  height: 55px;
  padding: 10px;
}
.back-button img {
  background-color: grey;
  width: 35px;
  height: 35px;
  border-radius: 100%;
  position: fixed;
  z-index: 4;
}
.body {
  color: var(--font-color);
  overflow-y: auto;
  font-size: 18px;
  grid-area: body;
  background-color: var(--theme-color);
  border-radius: 5px;
  margin: 5px 10px;
}
.back-button img:hover {
  background-color: var(--primary-color);
  cursor: pointer;
}
.images {
  grid-area: images;
  background-color: var(--theme-color);
  border-radius: 5px;
  margin: 5px 10px;
}
.videos {
  grid-area: videos;
  background-color: var(--theme-color);
  border-radius: 5px;
  display: grid;
  margin: 5px 10px;
}
.audios {
  grid-area: audios;
  background-color: var(--theme-color);
  border-radius: 5px;
  display: grid;
  margin: 5px 10px;
}
.text-label {
  text-align: center;
  color: var(--font-color);
  padding: 10px;
  font-size: 24px;
  user-select: none;
}
.files {
  grid-area: files;
  margin: 5px 10px;
  background-color: var(--theme-color);
  border-radius: 5px;
  display: grid;
}

.flex-wrapper {
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  color: var(--font-color);
  margin: 0 10px;
  padding: 10px;
}

.video {
  margin: 5px;
  min-width: 70%;
  height: auto;

  background-color: rgba(0, 0, 0, 0.75);

  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 50px 1fr;
  justify-content: stretch;
  align-content: stretch;
  align-items: end;
  box-shadow: 0 0 4px 2px var(--primary-color);

  position: relative;
}
.video-name {
  word-break: break-all;
  overflow-y: auto;
  max-height: 50px;
  min-height: 50px;
}

.file,
.image,
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
/* .video video {
  max-height: 100%;
  width: auto;
  align-self: center;
  justify-self: center;
  max-width: 75px;
  max-height: 75px;
  cursor: pointer;
} */
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

.progress-download {
  display: grid;
  grid-template-columns: 0px 1fr;
  height: 15px;
  grid-template-rows: 1fr;
}
.prog {
  background-color: rgb(71, 255, 47);
}
.progAll {
  background-color: grey;
}
</style>