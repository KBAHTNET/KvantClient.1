<template>
  <div class="music-player">
    <div
      class="player-element"
      :style="activeMusic === index ? 'grid-template-rows: 1fr 50px;' : ''"
      v-for="(music, index) in playlist"
      :key="index"
    >
      <div class="music-item" @click="showClickEffect">
        <img
          @click="changeMusicStatus"
          v-if="activeMusic === index && musicStatusPlay"
          src="/icons/pause.svg"
          alt=""
        />
        <img
          @click="changeMusicStatus"
          v-else-if="activeMusic === index && !musicStatusPlay"
          src="/icons/play.svg"
          alt=""
        />
        <img @click="playThis(index)" v-else src="/icons/music.svg" alt="" />
        <div class="music-descr">
          {{ music.name }}
        </div>
        <div class="music-time">
          {{ formatTime(parseFloat(music.audio.duration).toFixed(2)) }}
        </div>
        <input
          type="number"
          @change="setOrder(index + 1, $event.target.value)"
        />
        <!-- <div class="up-arrow" @click="changeQueueUp(index)">
          <img class="queueControlButton" src="/icons/up.svg" alt="" />
        </div>
        <div class="down-arrow" @click="changeQueueDown(index)">
          <img class="queueControlButton" src="/icons/down.svg" alt="" />
        </div> -->
        <div class="del-music" @click="delFromQueue(index)">
          <img class="queueControlButton" src="/icons/recycle-bin.svg" alt="" />
        </div>
      </div>
      <div
        class="progress"
        :style="'grid-template-columns:' + musicProgressPercent + '% 1fr'"
        v-if="activeMusic === index"
        @click="setTime"
      >
        <div class="current-progress"></div>
        <div class="progress-background"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    playlist: {
      type: Array,
      require: true,
    },
    activeMusic: {
      type: Number,
      default: 0,
    },
    musicStatusPlay: {
      type: Boolean,
      default: false,
    },
    musicProgressPercent: {
      type: Number,
      default: 0,
    },
  },
  data: () => {
    return {
      musics: [], //array of int
    };
  },
  methods: {
    showClickEffect(e) {
      const elem = e.currentTarget; 
      elem.classList.add("click");
      setTimeout(() => {
        elem.classList.remove("click");
      }, 100);
    },
    setTime(e) {
      const percent =
        e.layerX / parseFloat(getComputedStyle(e.currentTarget).width);
      this.$emit("setTime", percent);
    },
    formatTime(seconds) {
      const dateFormatter = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Etc/UTC",
        hour12: false,
        minute: "2-digit",
        second: "2-digit",
      });

      try {
        const f = (seconds) => dateFormatter.format(new Date(seconds * 1000));
        return f(seconds);
      } catch {
        console.log(seconds);
        return 0;
      }
    },
    playThis(index) {
      this.$emit("playNew", index);
    },
    delFromQueue(index) {
      this.$emit("delItemFromQueue", index);
    },
    changeQueueDown(index) {
      this.$emit("downItemInQueue", index);
    },
    changeQueueUp(index) {
      this.$emit("upItemInQueue", index);
    },
    changeMusicStatus() {
      this.$emit("changeMusicStatus");
    },
    setOrder(oldPosition, newPosition) {
      const inputs = this.$el.querySelectorAll("input");
      if (newPosition > 0) {
        if (newPosition - 1 > this.playlist.length) {
          newPosition = this.playlist.length;
        }
        inputs[oldPosition - 1].value = oldPosition;
        this.$emit("setNewOrder", oldPosition, newPosition);
      } else {
        inputs[oldPosition - 1].value = oldPosition;
      }
    },
  },
  mounted() {
    const inputs = this.$el.querySelectorAll("input");
    for (const i in Array.from(inputs)) {
      inputs[i].value = parseInt(parseInt(i) + 1);
    }

    document.querySelector('.progress').scrollIntoView({
          behavior: "smooth",
          block: "end",
          inline: "nearest",
        });

    // const clickElems = this.$el.querySelectorAll(".music-item");
    // Array.from(clickElems).forEach((item, i) => {
    //   if (activeMusic === i) {
    //     clickElems[i].scrollIntoView({
    //       behavior: "smooth",
    //       block: "end",
    //       inline: "nearest",
    //     });
    //   }
    // });
  },
  // activated() {
  //   this.$el.querySelectorAll('img')[this.activeMusic * 4].click();
  //   this.$el.querySelectorAll('img')[this.activeMusic * 4].click();
  // },
};
</script>

<style scoped>
.music-player {
  overflow-y: auto;
  background-color: var(--theme-color);
  display: flex;
  flex-direction: column;
}
.music-item {
  display: grid;
  grid-template-columns: 50px 1fr 50px 50px 30px;
  grid-template-rows: repeat(auto-fit, 50px);
  justify-content: stretch;
  align-content: stretch;
  align-items: center;
  justify-items: center;
  color: var(--font-color);
}

.click {
  background-color: var(--primary-color);
}
/* смартфоны, устройства с сенсорным экраном, с которым работают пальцами */
@media (hover: none) and (pointer: coarse) {
   /*...*/
}
/* устройства с сенсорным экраном, с которым работают стилусом */
@media (hover: none) and (pointer: fine) {
  /* ... */
}
/* контроллер Nintendo Wii, Microsoft Kinect */
@media (hover: hover) and (pointer: coarse) {
  /* ... */
}
/* мышь, тачпад */
@media (hover: hover) and (pointer: fine) {
  .music-item:hover {
    background-color: var(--primary-color);
  }
}

.music-item img {
  width: 40px;
  height: 40px;
  padding: 1px;
  margin: 2px;
  border-radius: 5px;
  background-color: var(--font-color);
}
.music-item img:hover {
  cursor: pointer;
  background-color: var(--secondary-color);
}
.music-descr {
  overflow-x: auto;
  justify-self: start;
  max-height: 40px;
  overflow-y: auto;
  word-break: break-word;
}
.queueControlButton {
  width: 20px !important;
  height: 20px !important;
}
.progress {
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: 20% 1fr;
  background-color: var(--theme-color);
  height: 5px;
  width: 100%;
}
.current-progress {
  background-color: var(--primary-color);
}
.player-element {
  display: grid;
  grid-template-rows: 1fr;
  align-items: center;
}
.progress-background {
  background-color: gray;
}
input {
  width: 40px;
  border-radius: 10px;
  border-style: none;
  text-align: center;
}
</style>