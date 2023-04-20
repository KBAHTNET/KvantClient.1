<template>
  <div class="files-page">
    <Preview
      :text2="$store.state.currentUser.nickname"
      :imgSrc="$store.state.currentUser.avatar"
      @click="showMenuModal"
    />
    <div class="loading-form" v-if="isLoadedUserData">
      <RingLoader class="loader" />
    </div>
    <div class="page-container">
      <div class="files-controller">
        <Finder v-model:value="findText" />
        <div class="buttons-wrapper">
          <div @click="uploadFile" class="btn upload">
            <img src="/icons/upload.svg" alt="Загрузить" />
          </div>
          <div @click="createFolder" class="btn newfolder">
            <img src="/icons/add-folder.svg" alt="Создать папку" />
          </div>
        </div>
      </div>
      <div class="path-wrapper">
        <img @click="backPath" src="/icons/back.svg" alt="" />
        <div class="path">путь:</div>
        <div class="current-path">{{ currentPath }}</div>
      </div>
      <div class="files-wrapper">
        <div
          class="object"
          @contextmenu.prevent="showMenu = true"
          @click="getObject(index)"
          v-for="(object, index) in findindFiles"
          :key="index"
        >
          <div class="overlay-panel">{{ object.name }}</div>
          <div class="overlay-size">{{ getSizeString(object.size) }}</div>
          <img src="/icons/folder.svg" alt="" v-if="object.type == 'folder'" />
          <img
            src="/icons/file-color.svg"
            alt=""
            v-else-if="object.type == 'file'"
          />
        </div>
        <div @click="showMenu2 = true" class="mobile-controls">
          <img src="/icons/add.svg" alt="" />
        </div>
        <div ref="progress-bar" class="upload-progress">
          <div class="progress"></div>
          <div class="progress-text">{{ progressText }}</div>
        </div>
      </div>
    </div>
    <MenuModal
      v-if="showMainMenu"
      @close="showMainMenu = false"
      :buttons="[
        { text: 'Моя страница', link: '/' },
        { text: 'Контакты', link: '/contacts' + this.nickname },
        { text: 'Диалоги', link: '/messages/' + this.nickname },
        { text: 'Музыка', link: '/music/' + this.nickname },
        { text: 'Файлы', link: '/files/' + this.nickname },
        { text: 'Настройки', link: '/settings' },
        {
          text: 'Выход',
          click: () => {
            this.quit();
          },
        },
      ]"
    />
    <MenuModal
      v-if="showMenu"
      @close="showMenu = false"
      :buttons="[
        { text: 'Скачать', click: () => this.downloadFile },
        { text: 'Переименовать', click: () => this.renameFile },
        { text: 'Переместить', click: () => this.replaceFile },
        { text: 'Удалить', click: () => this.deleteFile },
      ]"
    />
    <MenuModal
      v-if="showMenu2"
      @close="showMenu2 = false"
      :buttons="[
        { text: 'Загрузить файл', click: this.uploadFile },
        { text: 'Создать папку', click: this.createFolder },
      ]"
    />
  </div>
</template>

<script>
import Preview from "@/components/Preview";
import Finder from "@/components/UI/Finder";
import MenuModal from "@/components/MenuModal";
import RingLoader from "@/components/UI/RingLoader";
export default {
  data: () => {
    return {
      isLoadedUserData: false,
      progressText: "",
      showMainMenu: false,
      showMenu: false,
      showMenu2: false,
      findText: "",
      mainDirInfo: [
        {
          type: "file",
          name: "12vchvjvhhmcxxbhchnchnx gftdsyufgsdhj -ghjgsd3.jpg",
          mime: "image/jpeg",
          size: "123213",
          date: "132312312",
          status: "private",
          link: "",
        },
        {
          type: "file",
          name: "drsfdhdf.jpg",
          mime: "image/jpeg",
          size: "123213",
          date: "132312312",
          status: "private",
          link: "",
        },
        {
          type: "file",
          name: "412gfdhgf.jpg",
          mime: "image/jpeg",
          size: "45452342",
          date: "132312312",
          status: "private",
          link: "",
        },
        {
          type: "file",
          name: "hhgfj.jpg",
          mime: "image/jpeg",
          size: "12312114",
          date: "132312312",
          status: "private",
          link: "",
        },
        {
          type: "file",
          name: "fgasq4.jpg",
          mime: "image/jpeg",
          size: "23432",
          date: "132312312",
          status: "private",
          link: "",
        },
        {
          type: "file",
          name: "dfdhgsd.zip",
          mime: "application/zip",
          size: "656546434",
          date: "132312312",
          status: "private",
          link: "",
        },
        {
          type: "folder",
          name: "dfdhgsd",
          size: "656546434",
          date: "132312312",
          status: "private",
          files: [
            {
              type: "file",
              name: "123.jpg",
              mime: "image/jpeg",
              size: "123213",
              date: "132312312",
              status: "private",
              link: "",
            },
            {
              type: "file",
              name: "412.jpg",
              mime: "image/jpeg",
              size: "123213",
              date: "132312312",
              status: "private",
              link: "",
            },
            {
              type: "file",
              name: "5fdgfd.jpg",
              mime: "image/jpeg",
              size: "123213",
              date: "132312312",
              status: "private",
              link: "",
            },
          ],
        },
        {
          type: "folder",
          name: "dfdhgsd2",
          size: "656546434",
          date: "132312312",
          status: "private",
          files: [
            {
              type: "file",
              name: "123.jpg",
              mime: "image/jpeg",
              size: "123213",
              date: "132312312",
              status: "private",
              link: "",
            },
            {
              type: "file",
              name: "412.jpg",
              mime: "image/jpeg",
              size: "123213",
              date: "132312312",
              status: "private",
              link: "",
            },
            {
              type: "folder",
              name: "412.rjvghjkfsdvghjkfdvghjdgvjdfgdgfdhgbvksjdvgdkhjgbvsdffjpg",
              size: "123213",
              date: "132312312",
              status: "private",
              files: [
                {
                  type: "file",
                  name: "123.jpg",
                  mime: "image/jpeg",
                  size: "123213",
                  date: "132312312",
                  status: "private",
                  link: "",
                },
                {
                  type: "file",
                  name: "412.jpg",
                  mime: "image/jpeg",
                  size: "123213",
                  date: "132312312",
                  status: "private",
                  link: "",
                },
                {
                  type: "file",
                  name: "5fdgfd.jpg",
                  mime: "image/jpeg",
                  size: "123213",
                  date: "132312312",
                  status: "private",
                  link: "",
                },
              ],
            },
            {
              type: "file",
              name: "5fdgfd.jpg",
              mime: "image/jpeg",
              size: "123213",
              date: "132312312",
              status: "private",
              link: "",
            },
          ],
        },
      ],
      allObject: {},
      currentObject: {},
      currentPath: "/",
    };
  },
  methods: {
    calculateFoldersSize(filesObject) {
      let currentSize = 0;
      for (const i in filesObject) {
        if (filesObject[i].type == "folder") {
          if (filesObject[i].files) {
            const res = this.calculateFoldersSize(filesObject[i].files);
            currentSize += res.currentSize;
            filesObject[i].size = res.currentSize;
          }
        } else if (filesObject[i].type == "file" && filesObject[i].size) {
          currentSize += parseInt(filesObject[i].size);
        }
      }
      return { filesObject, currentSize };
    },
    async tryFetch() {
      if (document.cookie.split("authorized=") === undefined) {
        this.quit();
      } else if (document.cookie.split("authorized=").length === 0) {
        this.quit();
      } else if (document.cookie.split("authorized=")[1] == "false") {
        this.quit();
      }
      this.isLoadedUserData = true;
      await fetch("/", { method: "POST" })
        .then((res) => res.json())
        .then(async (json) => {
          if (
            json &&
            typeof json === "object" &&
            (json.avatar || json.nickname)
          ) {
            this.$store.commit("SetCurrentUser", json);
            this.mainDirInfo = await fetch("/getuserfiles")
              .then((res) => res.json())
              .then((json) => json.files)
              .catch((e) => console.log("filespage:296", e));
            console.log(this.mainDirInfo);
            this.mainDirInfo = this.calculateFoldersSize(
              this.mainDirInfo
            ).filesObject;
            console.log(this.mainDirInfo);
            this.allObject = this.getObjects("/", this.mainDirInfo);
            console.log(this.allObject);
            this.isLoadedUserData = false;
          } else {
            this.quit();
          }
        })
        .catch((e) => {
          console.log(e);
          if (window.location.pathname === "/files") {
            setTimeout(() => {
              this.tryFetch();
            }, 1000);
          }
        });
    },
    quit() {
      fetch("/logout");
      this.$router.push("/login");
    },
    showMenuModal() {
      this.showMainMenu = !this.showMainMenu;
    },
    backPath() {
      this.currentPath =
        "/" +
        this.currentPath
          .split("/")
          .slice(1, this.currentPath.split("/").length - 2)
          .join("/") +
        "/";
      this.currentPath = this.currentPath.replace("//", "/");
    },
    createFolder() {
      const folderName = prompt("Введите имя папки", "Новая папка");
      if (folderName) {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/createfolder", true);
        xhr.setRequestHeader(
          encodeURIComponent("Foldername"),
          encodeURIComponent(folderName)
        );
        xhr.setRequestHeader(
          encodeURIComponent("Folderpath"),
          encodeURIComponent(this.currentPath)
        );

        xhr.onload = (e) => {
          alert(xhr.responseText);
        };
        xhr.send();

        this.tryFetch();
      }
    },
    uploadFile() {
      const input = document.createElement("input");
      input.type = "file";
      input.multiple = "true";

      input.onchange = (e) => {
        const files = e.target.files;
        let fileNumber = 0;
        const reader = new FileReader();
        reader.onload = (e) => {
          const xhr = new XMLHttpRequest();

          xhr.upload.addEventListener(
            "progress",
            (evt) => {
              const percent = (evt.loaded / evt.total) * 100;
              this.$refs["progress-bar"].style.gridTemplateColumns =
                percent + "% 1fr";
              console.log(percent);
              // console.log(evt);
              // if (evt.lengthComputable) {

              // }
            },
            false
          );

          xhr.onload = (e) => {
            if (fileNumber + 1 < files.length) {
              fileNumber += 1;
              reader.readAsArrayBuffer(files[fileNumber]);
              this.progressText = fileNumber + " из " + files.length;
            } else {
              this.$refs["progress-bar"].style.display = "none";
              this.tryFetch();
            }
          };
          // xhr.upload.onprogress = (e) => {
          //   if (e.lengthComputable) {
          //     const percent = (e.loaded / e.total) * 100;
          //     this.$refs["progress-bar"].style.gridTemplateColumns =
          //       percent + "% 1fr";
          //       console.log(percent);
          //   }
          // };
          xhr.open("POST", "/uploadfile", true);
          xhr.setRequestHeader(
            "filepath",
            encodeURIComponent(this.currentPath)
          );
          xhr.setRequestHeader(
            "filename",
            encodeURIComponent(files[fileNumber].name)
          );
          xhr.send(e.target.result);
        };
        reader.readAsArrayBuffer(files[fileNumber]);
        this.progressText = fileNumber + " из " + files.length;
        this.$refs["progress-bar"].style.display = "grid";
      };
      input.click();
    },
    getSizeString(size) {
      size = parseInt(size);
      if (size / 1024 < 1) {
        return size + " байт";
      } else if (size / 1024 >= 1 && size / (1024 * 1024) < 1) {
        return parseFloat(size / 1024).toFixed(2) + " Кбайт";
      } else if (size / (1024 * 1024) >= 1 && size / (1024 * 1024 * 1024) < 1) {
        return parseFloat(size / (1024 * 1024)).toFixed(2) + " Мбайт";
      } else if (
        size / (1024 * 1024 * 1024) >= 1 &&
        size / (1024 * 1024 * 1024 * 1024) < 1
      ) {
        return parseFloat(size / (1024 * 1024 * 1024)).toFixed(2) + " Гбайт";
      } else if (
        size / (1024 * 1024 * 1024) >= 1 &&
        size / (1024 * 1024 * 1024 * 1024) < 1
      ) {
        return (
          parseFloat(size / (1024 * 1024 * 1024 * 1024)).toFixed(2) + " Тбайт"
        );
      } else {
        return parseFloat(size / 8).toFixed(2) + " байт";
      }
    },
    getObject(i) {
      console.log(this.findindFiles[i]);
      if (this.findindFiles[i].type === "folder") {
        this.currentPath += this.findindFiles[i].name + "/";
      } else {
        const link = document.createElement("a");
        link.href =
          "/download?file=/" +
          this.$store.state.currentUser.nickname +
          this.findindFiles[i].link;
        link.download = this.findindFiles[i].name;
        link.click();
      }
    },
    getObjects(path, object) {
      const objetcOfThisPath = {};
      objetcOfThisPath[path] = [];
      for (const obj of object) {
        if (obj.type == "file") {
          objetcOfThisPath[path].push(obj);
        } else if (obj.type == "folder") {
          if (obj.files) {
            const newObj = this.getObjects(path + obj.name + "/", obj.files);
            for (const objPath in newObj) {
              objetcOfThisPath[objPath] = newObj[objPath];
            }
            let objWithoutFiles = JSON.parse(JSON.stringify(obj));
            delete newObj.files;
            objetcOfThisPath[path].push(objWithoutFiles);
          } else {
            objetcOfThisPath[path].push(obj);
          }
        }
      }
      return objetcOfThisPath;
    },
  },
  mounted() {
    this.tryFetch();
  },
  computed: {
    findindFiles() {
      return this.findText.length > 0
        ? this.allObject[this.currentPath].filter((it) =>
            it.name
              ? it.name.toLowerCase().includes(this.findText.toLowerCase())
              : false || it.mime
              ? it.mime === this.findText
              : false || it.date
              ? it.date < new Date(this.findText)
              : false
          )
        : this.allObject[this.currentPath];
    },
  },
  components: {
    Preview,
    Finder,
    MenuModal,
    RingLoader,
  },
};
</script>

<style scoped>
.loading-form {
  position: absolute;
}

.loader {
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
}
.files-page {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 18vh 1fr;
  justify-content: stretch;
  align-content: stretch;
  background-color: var(--back-color);
  width: 100%;
  height: 100%;
}
@media screen and (orientation: portrait) {
  .files-page {
    grid-template-rows: 12vh 1fr;
  }
}
.page-container {
  margin-top: 18vh;
  background-color: var(--back-color);
  width: 100vw;
  height: 82vh;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 100px 40px 1fr;
}
@media screen and (orientation: portrait) {
  .page-container {
    margin-top: 12vh;
    height: 88vh;
  }
}

.files-controller {
  background-color: var(--theme-color);
  display: grid;
  grid-template-columns: 3fr 2fr;
  color: var(--font-color);
  user-select: none;
  border-radius: 3px;
  margin: 5px;
}

.mobile-controls {
  display: none;
  position: absolute;
  bottom: 10px;
  right: 10px;
  border-radius: 100%;
  background-color: var(--primary-color);
  width: 50px;
  height: 50px;
  padding: 10px;
}
@media screen and (orientation: portrait) {
  .mobile-controls {
    display: grid;
  }
}
.mobile-controls img {
  width: 100%;
  height: 100%;
}
.buttons-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(40px, 1fr));
  grid-gap: 10px;
  grid-template-rows: 1fr;
  overflow-x: auto;
  align-content: stretch;
  align-items: center;
  justify-content: stretch;
}
@media screen and (orientation: portrait) {
  .buttons-wrapper {
    display: none;
  }
}

.btn {
  width: 50px;
  height: 50px;
  margin: 10px;

  box-shadow: 0 0 4px 1px var(--primary-color);

  display: grid;
}
.btn:hover {
  background-color: var(--primary-color);
}
.btn img {
  height: 100%;
  width: 100%;
  padding: 5px;
  align-self: center;
  justify-self: center;
}
.path-wrapper {
  background-color: var(--theme-color);
  margin: 0 5px;
  border-radius: 5px;
  font-size: 20px;
  color: var(--font-color);
  display: grid;
  grid-template-columns: 40px 55px 1fr;
  align-content: center;
  padding: 2px;
}
.path {
  align-self: center;
}
.current-path {
  margin-left: 4px;
  align-self: center;
  overflow-x: auto;
}
.path-wrapper img {
  margin: 5px;
  width: 25px;
  height: 25px;
  border-radius: 5px;
}
.path-wrapper img:hover {
  background-color: var(--primary-color);
}
.files-wrapper {
  background-color: var(--theme-color);
  margin: 5px;
  border-radius: 4px;

  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  overflow-y: auto;
}
.files-wrapper .object {
  width: 100px;
  height: 100px;
  box-shadow: 0 0 4px 1px var(--primary-color);
  margin-left: 10px;
  margin-top: 10px;
  display: grid;
  position: relative;
}
.upload-progress {
  position: fixed;
  bottom: 0;
  left: 0;
  height: 40px;
  width: 100%;
  background-color: gray;
  grid-template-columns: 0 1fr;
  align-content: stretch;
  align-items: center;
  text-align: center;
  display: none;
}
.upload-progress .progress {
  height: 100%;
  background-color: rgb(21, 255, 0);
}
.progress-text {
  position: absolute;
  width: 100%;
  text-align: center;
}
.overlay-panel {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 15px;
  word-break: break-all;
  user-select: none;
  transition-duration: 0.3s;
  overflow-y: hidden;
}
.overlay-size {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  top: 0;
  left: 0;
  width: 100%;
  height: 0px;
  word-break: break-all;
  user-select: none;
  transition-duration: 0.3s;
  font-size: 0px;
}
.object img {
  width: 80%;
  height: 80%;
  justify-self: center;
  align-self: center;
}
.object:hover {
  background-color: var(--secondary-color);
  box-shadow: 0 0 5px 2px var(--secondary-color);
}
.object:hover .overlay-panel {
  height: 45px;
  transition-duration: 0.3s;
  overflow-y: auto;
}
.object:hover .overlay-size {
  height: 15px;
  transition-duration: 0.3s;
  font-size: 14px;
}
</style>