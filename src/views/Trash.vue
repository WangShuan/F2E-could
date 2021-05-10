<template>
  <div :key="dataKey">
    <div class="navbar">
      <div class="d-flex flex-wrap align-items-center">
        <div class="navbar-title" @click.stop="$parent.leaveFolder()">
          我的雲端硬碟
        </div>
        <div class="navbar-title-arrow"></div>
        <div class="navbar-title-folderName">垃圾桶</div>
        <template v-if="search">
          <div class="navbar-title-arrow"></div>
          <div class="navbar-title-folderName">"{{ search }}" 搜尋結果</div>
        </template>
      </div>
      <div class="navbar-search">
        <input
          type="text"
          placeholder="搜尋您的檔案"
          class="navbar-search-input"
          v-model="search"
        />
      </div>
    </div>
    <div class="w-100 title">資料夾</div>
    <transition name="fade">
      <div v-if="folder[0] && !filterRet" class="row gutter-10">
        <div
          v-for="item in folder"
          class="col-xl-3 col-lg-4 col-md-6 col-sm-12"
          :key="item.fullPath"
        >
          <div class="folder">
            <div class="folder-btnGroup">
              <div class="folder-btn" @click.prevent="clickRecoverFolder(item)">
                <img src="../assets/images/return.svg" alt="" />
              </div>
              <div class="folder-btn" @click.prevent="confirmDelFolder(item)">
                <img src="../assets/images/icon-trash.svg" alt="" />
              </div>
            </div>
            {{ item.fakeName }}
          </div>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div v-if="filterRet" class="row gutter-10">
        <div
          v-for="item in filterRet.folders"
          class="col-xl-3 col-lg-4 col-md-6 col-sm-12"
          :key="item.fullPath"
        >
          <div class="folder">
            <div class="folder-btnGroup">
              <div class="folder-btn" @click.prevent="clickRecoverFolder(item)">
                <img src="../assets/images/return.svg" alt="" />
              </div>
              <div class="folder-btn" @click.prevent="confirmDelFolder(item)">
                <img src="../assets/images/icon-trash.svg" alt="" />
              </div>
            </div>
            {{ item.fakeName }}
          </div>
        </div>
      </div>
    </transition>
    <div class="w-100 title">檔案</div>
    <transition name="fade">
      <div v-if="file[0] && !filterRet" class="row gutter-10">
        <div
          v-for="item in file"
          class="col-xl-3 col-lg-4 col-md-6 col-sm-12"
          :key="item.fullPath"
        >
          <div class="file">
            <div class="file-btnGroup">
              <div class="file-btn" @click.prevent="clickRecover(item)">
                <img src="../assets/images/return.svg" alt="" />
              </div>
              <div class="file-btn" @click.prevent="clickDelete(item)">
                <img src="../assets/images/icon-trash.svg" alt="" />
              </div>
            </div>
            <img :src="item.imgUrl" class="file-img" alt="" />
            {{ item.fakeName }}
          </div>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div v-if="filterRet" class="row gutter-10">
        <div
          v-for="item in filterRet.files"
          class="col-xl-3 col-lg-4 col-md-6 col-sm-12"
          :key="item.fullPath"
        >
          <div class="file">
            <div class="file-btnGroup">
              <div class="file-btn" @click.prevent="clickRecover(item)">
                <img src="../assets/images/return.svg" alt="" />
              </div>
              <div class="file-btn" @click.prevent="clickDelete(item)">
                <img src="../assets/images/icon-trash.svg" alt="" />
              </div>
            </div>
            <img :src="item.imgUrl" class="file-img" alt="" />
            {{ item.fakeName }}
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import firebase from "firebase/app";
import "firebase/storage";
export default {
  data() {
    return {
      folder: this.$parent.trashFolder,
      file: this.$parent.trashFile,
      search: "",
      dataKey: 0,
    };
  },
  computed: {
    filterRet: function () {
      if (this.search || this.$parent.search) {
        let obj = {
          files: [],
          folders: [],
        };
        this.folder.forEach((item) => {
          if (item.name.indexOf(this.search || this.$parent.search) !== -1) {
            obj.folders.push(item);
          }
        });
        this.file.forEach((item) => {
          if (item.name.indexOf(this.search || this.$parent.search) !== -1) {
            obj.files.push(item);
          }
        });
        return obj;
      } else {
        return false;
      }
    },
  },
  methods: {
    clickDelete(file, isFolder = false) {
      if (isFolder == false) {
        if (confirm("是否確定永久刪除該檔案？")) {
          const vm = this;
          const obj = firebase.storage().ref(file.fullPath);
          obj
            .delete()
            .then(() => {
              vm.dataKey += 1;
              vm.$parent.getData();
              const i = vm.$parent.trashFile.findIndex((item) => {
                return item.fullPath == file.fullPath;
              });
              vm.$parent.trashFile.splice(i, 1);
              const j = vm.$parent.starFile.findIndex((item) => {
                return item.fullPath == file.fullPath;
              });
              vm.$parent.starFile.splice(j, 1);
            })
            .catch(function (error) {
              console.log(error);
            });
        }
      } else {
        const vm = this;
        const obj = firebase.storage().ref(file.fullPath);
        obj
          .delete()
          .then(() => {
            vm.dataKey += 1;
            vm.$parent.getData();
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    },
    confirmDelFolder(folder) {
      const vm = this;
      if (confirm("是否確定永久刪除" + folder.fullPath + "資料夾？")) {
        vm.clickDeleteFolder(folder);
      }
    },
    clickDeleteFolder(folder) {
      const vm = this;
      const storageRef = firebase.storage().ref(folder.fullPath);
      storageRef
        .listAll()
        .then((dir) => {
          dir.items.forEach((fileRef) => {
            vm.clickDelete(fileRef, true);
          });
          if (dir.prefixes.length) {
            dir.prefixes.forEach((folderRef) => {
              vm.clickDeleteFolder(folderRef);
            });
          }
          const i = vm.$parent.trashFolder.findIndex((item) => {
            return item.fullPath == folder.fullPath;
          });
          vm.$parent.trashFolder.splice(i, 1);
          const j = vm.$parent.starFolder.findIndex((item) => {
            return item.fullPath == folder.fullPath;
          });
          vm.$parent.starFolder.splice(j, 1);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    clickRecover(file) {
      file.isTrash = false;
      const i = this.$parent.trashFile.findIndex((item) => {
        return item.fullPath == file.fullPath;
      });
      this.$parent.trashFile.splice(i, 1);
      this.$parent.starFile.forEach((item) => {
        if (item.fullPath == file.fullPath) {
          item.isTrash = false;
        }
      });
      this.dataKey += 1;
    },
    clickRecoverFolder(folder) {
      folder.isTrash = false;
      const i = this.$parent.trashFolder.findIndex((item) => {
        return item.fullPath == folder.fullPath;
      });
      this.$parent.trashFolder.splice(i, 1);
      this.$parent.starFolder.forEach((item) => {
        if (item.fullPath == folder.fullPath) {
          item.isTrash = false;
        }
      });
      this.dataKey += 1;
    },
  },
  created() {},
};
</script>

<style></style>
