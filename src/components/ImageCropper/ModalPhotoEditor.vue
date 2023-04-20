<template>
  <div class="modal-wrapper" v-show="show" @click="closeWindow">
    <PhotoEditor
      @click.stop
      class="editor"
      :saveImgFormat="saveImgFormat"
      :generateCrop="generateCrop"
      :generatedCropSize="generatedCropSize"
      :canChangeCropWindow="canChangeCropWindow"
      @dataSaved="dataSavedEmit"
    />
  </div>
</template>

<script>
import PhotoEditor from "@/components/ImageCropper/PhotoEditor";
export default {
  components: {
    PhotoEditor,
  },
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
  data() {
    return {
      show: false,
    };
  },
  methods: {
    showWindow() {
      this.show = true;

      this.$el.style.height = document.getElementById('app').scrollHeight + 'px';
    },
    closeWindow() {
      this.show = false;
    },
    dataSavedEmit(data) {
      this.$emit("dataSaved", data);
    },
  },
  mounted() {
      this.$el.style.height = document.getElementById('app').scrollHeight + 'px';
  },
};
</script>

<style scoped>
.modal-wrapper {
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  position: absolute;

  z-index: 10;
}
.editor {
  margin:10% auto;
  transition-duration: 0.4s;
}
</style>