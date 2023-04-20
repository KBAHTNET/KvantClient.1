<template>
  <div ref="main" class="app">
    <div
      @mouseenter="clearHideToolTipInterval"
      @mouseleave="hideToolTip"
      v-if="showToolTip"
      class="song-name"
    >
      {{ currentPlayList[currentMusicIndex].name }}
    </div>
    <div
      @mouseenter="clearHideToolTipInterval"
      @mouseleave="hideToolTip"
      v-if="showToolTip"
      @click="NextMusic"
      class="next-song change-song"
      :style="nextBtnStyle"
    ></div>
    <div
      @mouseenter="clearHideToolTipInterval"
      @mouseleave="hideToolTip"
      v-if="showToolTip"
      @click="PreviousMusic"
      class="previous-song change-song"
      :style="prevBtnStyle"
    ></div>
    <div :style="timeTextStyle" v-if="showTextTime" class="timeText">
      {{ timeText }}
    </div>
    <svg
      @mousedown="isMoving = true"
      @mouseup="isMoving = false"
      @mouseenter="showTextTime = true"
      @mouseleave="showTextTime = false"
      v-show="currentPlayList.length > 0 && isPlay"
      class="progress-ring"
      width="60"
      height="60"
      @click="setTime"
      @mousemove="getTime"
    >
      <circle
        @mouseup="isMoving = false"
        class="back_circle"
        stroke="black"
        stroke-width="4"
        cx="30"
        cy="30"
        r="20"
        fill="gray"
      ></circle>
      <circle
        @mouseup="isMoving = false"
        class="progress-ring__circle"
        stroke="var(--primary-color)"
        stroke-width="4"
        cx="30"
        cy="30"
        r="20"
        fill="transparent"
      ></circle>
    </svg>
    <canvas
      @mouseup="isMoving = false"
      @click="togglePlay"
      @mouseenter="showToolTip = true"
      @mouseleave="hideToolTip"
      @contextmenu.prevent="showPlayer = true"
      v-show="currentPlayList.length > 0 && isPlay"
      id="audio-canvas"
    ></canvas>
    <img
      @contextmenu.prevent="showPlayer = true"
      @mouseup="isMoving = false"
      @click="togglePlay"
      v-if="currentPlayList.length > 0 && !isPlay"
      src="/icons/music.svg"
      id="audio-canvas"
      alt=""
      :style="imgBtnStyle"
    />
    <router-view />
    <audio
      @timeupdate="
        (e) => {
          const percent = (e.target.currentTime / e.target.duration) * 100;
          this.setProgress(percent);
          this.currentMusicProgress = percent;
        }
      "
      ref="audio-app"
      id="audio-app"
      :src="
        currentPlayList.length > 0
          ? currentPlayList[currentMusicIndex].file
          : ''
      "
    ></audio>
    <div class="player" v-if="showPlayer" @click="showPlayer = false">
      <MusicPlayer
        :playlist="currentPlayList"
        :musicStatusPlay="isPlay"
        :activeMusic="currentMusicIndex"
        :musicProgressPercent="currentMusicProgress"
        @click.stop
        @changeMusicStatus="togglePlay"
        @upItemInQueue="upItemInQueuePlayList"
        @downItemInQueue="downItemInQueuePlayList"
        @delItemFromQueue="delMusicFromPlayList"
        @playNew="SetCurrentIndex"
        @setTime="setTimeFromPlayer"
        @setNewOrder="changeOrder"
      />
    </div>
  </div>
</template>

<script>
import MusicPlayer from "@/components/MusicPlayer";
export default {
  data: () => {
    return {
      audio: null,
      currentVolume: 1,
      currentPlayList: [], //{file: fileSourceLink, name: musicName}
      currentMusicIndex: null,
      currentTime: 0,
      isPlay: false,
      showToolTip: false,
      showPlayer: false,

      timeText: "",
      showTextTime: false,
      timeoutControlsHide: null,

      //moving widget music
      isMoving: false,
      nextBtnStyle: "",
      prevBtnStyle: "",
      imgBtnStyle: "",
      timeTextStyle: "",
      ////////////////////
      currentMusicProgress: "",
    };
  },
  components: {
    MusicPlayer,
  },
  mounted() {
    //#region Moving Widget Music

    window.onmousedown = (e) => {
      if (this.isMoving) {
        e.preventDefault();
      }
    };
    window.onmousemove = (e) => {
      if (this.isMoving) {
        const svg = document.querySelector(".progress-ring");
        const canvas = document.querySelector("canvas");
        svg.style.right = "";
        svg.style.top = e.clientY - 30 + "px";
        svg.style.left = e.clientX - 30 + "px";
        canvas.style.top = e.clientY - 15 + "px";
        canvas.style.left = e.clientX - 15 + "px";

        this.imgBtnStyle = `top:${canvas.style.top};left:${canvas.style.left};`;
        this.nextBtnStyle = `top:${parseInt(canvas.style.top) + 45}px;left:${
          parseInt(canvas.style.left) + 15
        }px;`;
        this.prevBtnStyle = `top:${parseInt(canvas.style.top) + 45}px;left:${
          parseInt(canvas.style.left) - 15
        }px;`;

        this.timeTextStyle = `top:${parseInt(svg.style.top) - 25}px;left:${
          parseInt(svg.style.left) - 15
        }px;`;
      }
    };
    //#endregion

    console.log("mount");
    this.$store.commit("SetApp", this);
    this.audio = this.$el.querySelector("#audio-app");
    document.body.style.overflowX = "hidden";

    this.audio.onended = () => {
      this.NextMusic();
    };
    //#region Music Canvas FFT Render

    // audioEl.onended = () => {
    //   this.$emit("ended", this.src);
    // };

    function getPos(Hz, minHz, maxHz, max) {
      if (Hz > minHz) {
        var posMin = Math.log10(minHz) * max;
        return (
          ((Math.log10(Hz) - Math.log10(minHz)) * max) /
          (Math.log10(maxHz) - Math.log10(minHz))
        );
      } else {
        return 0;
      }
    }

    function getFFTbars(fft, barCount) {
      var minHz =
        arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 20;
      var maxHz =
        arguments.length > 3 && arguments[3] !== undefined
          ? arguments[3]
          : 12000;
      var dataArray = new Float32Array(bufferLength);
      fft.getFloatFrequencyData(dataArray);
      var pos;
      var out = [];

      for (let i in dataArray) {
        pos = Math.round(
          getPos((i * 24000) / dataArray.length, minHz, maxHz, barCount)
        );
        if (pos < barCount)
          if (!out[pos] || out[pos] < dataArray[i]) out[pos] = dataArray[i];
      }

      for (let i = 0; i < barCount; i++) {
        if (!out[i]) {
          var prevIndex = void 0,
            prevValue = void 0;

          if ((prevIndex = i - 1) < 0) {
            prevIndex = 0;
            prevValue = 0;
          } else {
            prevValue = out[prevIndex];
          }

          var nextIndex = void 0,
            nextValue = void 0;

          for (let k = i; k < barCount; k++) {
            if (out[k]) {
              nextIndex = k;
              nextValue = out[k];
              break;
            }
          }

          if (!nextIndex) {
            nextIndex = barCount - 1;
            nextValue = 0;
          }

          out[i] =
            prevValue + (nextValue - prevValue) / (nextIndex - prevIndex);
        }
      }

      return out;
    }

    function draw() {
      var bars = getFFTbars(analyser, 32);
      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
      canvasCtx.fillStyle = "#ff0040";
      canvasCtx.beginPath();

      for (let i in bars) {
        canvasCtx.rect(
          i * 10,
          canvas.height - ((bars[i] + 64) * canvas.height) / 64,
          8,
          canvas.height
        );
      }

      canvasCtx.fill();
    }

    var canvas,
      canvasCtx,
      audioCtx,
      source,
      analyser,
      bufferLength,
      dataArray,
      gainNode;
    var initialized = false;
    this.audio.addEventListener("play", function (e) {
      if (!initialized) {
        canvas = document.getElementById("audio-canvas");
        canvasCtx = canvas.getContext("2d");
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        source = audioCtx.createMediaElementSource(e.target);
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 4096;
        bufferLength = analyser.frequencyBinCount;
        dataArray = new Float32Array(bufferLength);
        gainNode = audioCtx.createGain();
        source.connect(analyser);
        source.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        setInterval(draw, 16);
        initialized = true;
      }
    });

    //#endregion

    //#region Music Rounded ProgressBar

    //#endregion
  },
  methods: {
    clearHideToolTipInterval() {
      if (this.timeoutControlsHide !== null) {
        clearInterval(this.timeoutControlsHide);
      }
    },
    hideToolTip() {
      this.timeoutControlsHide = setTimeout(() => {
        this.showToolTip = false;
      }, 5000);
    },
    formatTime(seconds) {
      const dateFormatter = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Etc/UTC",
        hour12: false,
        minute: "2-digit",
        second: "2-digit",
      });

      const f = (seconds) => dateFormatter.format(new Date(seconds * 1000));
      return f(seconds);
    },
    getTime(e) {
      const x = e.layerX;
      const y = e.layerY;
      console.log(x, y);
      const gip = Math.sqrt(Math.pow(x - 30, 2) + Math.pow(y - 30, 2));
      let deg = Math.asin(Math.abs(x - 30) / gip) * 57.3;
      if (x - 30 > 0 && y - 30 < 0) {
      } else if (x - 30 > 0 && y - 30 > 0) {
        deg = 180 - deg;
      } else if (x - 30 < 0 && y - 30 > 0) {
        deg += 180;
      } else if (x - 30 < 0 && y - 30 < 0) {
        deg = 360 - deg;
      }
      this.timeText =
        this.formatTime(
          parseFloat(this.audio.duration * (deg / 360)).toFixed(1)
        ) +
        " / " +
        this.formatTime(parseFloat(this.audio.duration).toFixed(1));
    },
    setTimeFromPlayer(percent) {
      this.audio.currentTime = this.audio.duration * percent;
    },
    setTime(e) {
      if (!this.isMoving) {
        const x = e.layerX;
        const y = e.layerY;
        console.log(x, y);
        const gip = Math.sqrt(Math.pow(x - 30, 2) + Math.pow(y - 30, 2));
        let deg = Math.asin(Math.abs(x - 30) / gip) * 57.3;
        if (x - 30 > 0 && y - 30 < 0) {
        } else if (x - 30 > 0 && y - 30 > 0) {
          deg = 180 - deg;
        } else if (x - 30 < 0 && y - 30 > 0) {
          deg += 180;
        } else if (x - 30 < 0 && y - 30 < 0) {
          deg = 360 - deg;
        }
        console.log(deg);
        //const percent = (deg / 360) * 100;
        //console.log(percent);

        this.audio.currentTime = this.audio.duration * (deg / 360);
      }
    },
    setProgress(percent) {
      const circle = document.querySelector(".progress-ring__circle");
      const radius = circle.r.baseVal.value;
      const circleLength = 2 * Math.PI * radius;

      circle.style.strokeDasharray = ` ${circleLength} ${circleLength} `;
      circle.style.strokeDashoffset = circleLength;

      const offset = circleLength - (percent / 100) * circleLength;
      circle.style.strokeDashoffset = offset;
    },
    togglePlay() {
      this.isPlay = !this.isPlay;
      if (!this.isPlay) {
        this.Stop();
      } else {
        this.Play();
      }
    },
    renderFFT() {},
    Play() {
      console.log(this.currentTime);
      this.audio.volume = this.currentVolume;
      this.audio.src = this.currentPlayList[this.currentMusicIndex].file;
      this.audio.load();
      this.audio
        .play()
        .then(() => {
          this.audio.currentTime = this.currentTime;
          this.isPlay = true;
        })
        .catch((e) => {
          setTimeout(() => {
            this.Play();
          }, 200);
        });
    },
    Stop() {
      this.currentTime = this.audio.currentTime;
      this.audio.pause();
    },
    Close() {
      this.currentPlayList = [];
      this.currentMusicIndex = null;
    },
    SetPlayList(newPlayList) {
      this.currentPlayList = newPlayList;
      for (const i in this.currentPlayList) {
        this.currentPlayList[i].audio = new Audio(this.currentPlayList[i].file);
      }
      this.currentTime = 0;
    },
    SetCurrentMusic(music) {
      this.currentMusicIndex = this.currentPlayList.indexOf(music);
    },
    SetCurrentIndex(index) {
      this.currentMusicIndex = index;
      this.currentTime = 0;
      if (this.currentMusicIndex >= this.currentPlayList.length) {
        this.currentMusicIndex = 0;
      }
      this.Play();
    },
    NextMusic() {
      this.currentMusicIndex += 1;
      this.currentTime = 0;
      if (this.currentMusicIndex >= this.currentPlayList.length) {
        this.currentMusicIndex = 0;
      }
      this.Play();
    },
    PreviousMusic() {
      this.currentMusicIndex -= 1;
      this.currentTime = 0;
      if (this.currentMusicIndex < 0) {
        this.currentMusicIndex = this.currentPlayList.length - 1;
      }
      this.Play();
    },
    downItemInQueuePlayList(index) {
      if (this.currentPlayList.length - 1 !== index) {
        const temp = this.currentPlayList[index + 1];
        this.currentPlayList[index + 1] = this.currentPlayList[index];
        this.currentPlayList[index] = temp;
        if (this.currentMusicIndex == index) {
          this.SetCurrentIndex(this.currentMusicIndex + 1);
        }
      } else {
        const temp = this.currentPlayList[0];
        this.currentPlayList[0] = this.currentPlayList[index];
        this.currentPlayList[index] = temp;
        this.SetCurrentIndex(0);
      }
    },
    upItemInQueuePlayList(index) {
      if (index !== 0) {
        const temp = this.currentPlayList[index - 1];
        this.currentPlayList[index - 1] = this.currentPlayList[index];
        this.currentPlayList[index] = temp;
        if (this.currentMusicIndex == index) {
          this.SetCurrentIndex(this.currentMusicIndex - 1);
        }
      } else {
        const temp = this.currentPlayList[this.currentPlayList.length - 1];
        this.currentPlayList[this.currentPlayList.length - 1] =
          this.currentPlayList[index];
        this.currentPlayList[index] = temp;
        this.SetCurrentIndex(this.currentPlayList.length - 1);
      }
    },
    changeOrder(oldPosition, newPosition) {
      if (newPosition > -1) {
        if (newPosition - 1 > this.currentPlayList.length) {
          newPosition = this.currentPlayList.length;
        }
        const temp = this.currentPlayList[newPosition - 1];
        this.currentPlayList[newPosition - 1] = this.currentPlayList[oldPosition - 1];
        this.currentPlayList[oldPosition - 1] = temp;
      }
    },
    delMusicFromPlayList(index) {
      if (this.currentMusicIndex > index) {
        this.currentMusicIndex -= 1;
      } else if (this.currentMusicIndex > index) {
        this.currentMusicIndex = 0;
      }
      this.currentPlayList = this.currentPlayList.filter(
        (it, i) => i !== index
      );
    },
  },
  watch() {},
};
</script>

<style>
.player {
  position: fixed;
  background-color: rgba(0, 0, 0, 0.75);
  width: 100vw;
  height: 100vh;
  z-index: 10;
  display: grid;
  align-content: stretch;
  justify-content: stretch;
  padding: 100px;
  top: 0;
  left: 0;
}
@media screen and (orientation: portrait) {
  .player {
    padding: 100px 0;
  }
}
.song-name {
  position: fixed;
  max-width: 100%;
  word-break: break-all;
  color: var(--font-color);
  top: 0;
  right: 0;
  z-index: 10;
  overflow-x: auto;
  overflow-y: hidden;
  transition-duration: 0.4s;
}
.progress-ring {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 10;
  transition-duration: .4s;
}
.progress-ring__circle {
  transform-origin: center;
  transform: rotate(-90deg);
  transition-duration: 0.4s;
  position: absolute;
}
.change-song {
  border-radius: 100%;
  background-color: rgb(42, 42, 42);
  position: fixed;
  width: 25px;
  height: 25px;
  transition-duration: 0.4s;
  background-size: contain;
  background-position: center;
  background-size: 15px;
  background-repeat: no-repeat;
  z-index: 10;
}
.change-song:hover {
  background-color: var(--primary-color);
  transition-duration: 0.4s;
}
.next-song {
  top: 65px;
  right: 10px;
  background-image: url("/icons/next.svg");
}
.previous-song {
  top: 65px;
  right: 45px;
  background-image: url("/icons/previous.svg");
}
.progress-ring:hover {
  border-radius: 100%;
  box-shadow: 0 0 10px 5px var(--primary-color);
  transition-duration: 0.4s;
}
.timeText {
  position: fixed;
  color: var(--font-color);
  top: 0px;
  right: 0px;
  z-index: 10;
}
#audio-canvas {
  position: fixed;
  width: 30px;
  height: 30px;
  border-radius: 100%;
  background-color: rgb(42, 42, 42);
  top: 25px;
  right: 25px;
  z-index: 10;
  transition-duration: 0.4s;
}
img#audio-canvas {
  border-radius: 0%;
  transition-duration: 0.4s;
}
#audio-canvas:hover {
  background-color: var(--secondary-color);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
/* W3C standard
   сейчас только для Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: #333 #ff0040;
}

/* для Chrome/Edge/Safari */
*::-webkit-scrollbar {
  height: 5px;
  width: 8px;
}
*::-webkit-scrollbar-track {
  background: #333;
  border-style: solid;
  border-color: #ff004050;
  border-width: 1px;
}
*::-webkit-scrollbar-thumb {
  background-color: #ff0040;
  border: 2px solid black;
  /* box-shadow: 0 0 30px 10px #ff0040; */
  border-radius: 4px;
}
*::-webkit-scrollbar-thumb:hover {
  background-color: rgb(0, 0, 0);
  border-radius: 4px;
  border: 1px solid #ff0040;
  border-radius: 4px;
  /* box-shadow: 0 0 30px 30px #ff0040; */
}
::selection {
  background: #ff0040;
  color: black;
}
#app {
  --primary-color: #ff0040;
  --secondary-color: #00ffc8;
  --back-color: black;
  --theme-color: #333;
  --font-color: white;
}
</style>
