<template>
  <div class="audio-modal" @click="emitClose">
    <img class="close" src="/icons/cancel.svg" alt="" />
    <div class="fft">
      <canvas id="canvas" width="720"></canvas>
    </div>
    <audio autoplay="autoplay" class="audio" :src="src" controls @click.stop />
    <div class="controls-wrapper">
      <!-- <div class="play"></div>
      <div class="volume"></div> -->
    </div>
  </div>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      default: "",
    },
  },
  methods: {
    emitClose() {
      this.$emit("close");
    },
  },
  mounted() {
    const audioEl = this.$el.querySelector("audio");
    audioEl.volume = 1;
    audioEl.onended = () => {
      this.$emit("ended", this.src);
    };

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
      var bars = getFFTbars(analyser, 72);
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
    const audio = this.$el.querySelector("audio.audio");
    audio.addEventListener("play", function () {
      if (!initialized) {
        canvas = document.getElementById("canvas");
        canvasCtx = canvas.getContext("2d");
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        source = audioCtx.createMediaElementSource(audio);
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
  },
  watch: {
    // src() {
    //   const imgEl = this.$el.querySelector("img");
    //   if (img.width < img.height) {
    //     imgEl.style.width = "100%";
    //     imgEl.style.heigh = "auto";
    //   }
    // },
  },
};
</script>

<style scoped>
.audio-modal {
  width: 100vw;
  height: 100vh;
  max-width: 100vw;
  max-height: 100vh;

  background-color: rgba(0, 0, 0, 0.75);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 50;
  /* display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr; */
  justify-content: stretch;
  align-content: stretch;
}
.audio {
  max-height: 100%;

  align-self: center;
  justify-self: center;

  max-width: 100vw;
  max-height: 100vh;
}

.close {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.308);
  justify-self: end;
  height: 30px;
  width: auto;
  right: 0;
  cursor: pointer;
}

.fft {
  display: grid;
  justify-content: stretch;
  align-content: stretch;
  justify-items: center;
  align-items: center;
  min-height: 85%;
}
canvas {
  width: 90%;
  height: 100%;
}

audio.audio {
  width: 100%;
}

@media screen and (orientation: portrait) {
  audio.audio {
    /* margin-bottom: 10vh; */
  }
}
</style>