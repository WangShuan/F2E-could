<template>
  <div :key="dataKey">
    <div class="navbar">
      <div class="d-flex flex-wrap align-items-center">
        <div class="navbar-title" @click.stop="$parent.leaveFolder()">
          我的雲端硬碟
        </div>
        <div class="navbar-title-arrow"></div>
        <template>
          <div
            v-for="item in folderLink"
            class="navbar-title-folderName"
            @click.self="returnFolder(item)"
            :key="item.fullPath"
            role="button"
          >
            {{ item }}/
          </div>
        </template>
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
    <div class="w-100 title" v-if="folder[0]">資料夾</div>
    <transition name="fade">
      <div v-if="folder[0] && !filterRet" class="row gutter-10">
        <div
          v-for="item in folder"
          class="col-xl-3 col-lg-4 col-md-6 col-sm-12"
          :key="item.fullPath"
          :class="{ 'd-none': item.isTrash }"
        >
          <div
            class="folder"
            @click.self="
              $router.push(folderName.replace(/\//g, '~') + '~' + item.name)
            "
          >
            <div class="folder-btnGroup">
              <div class="folder-btn" @click.stop="toggleStarFolder(item)">
                <img
                  v-if="item.isStar"
                  src="/images/icon-star-fill.svg"
                  alt="標記星號"
                />
                <img v-else src="/images/icon-star.svg" alt="標記星號" />
              </div>
              <div class="dropdown">
                <div
                  class="folder-btn"
                  type="button"
                  id="dropdownMenuButton"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <img src="/images/icon-more.svg" alt="選單" />
                </div>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  <a class="dropdown-item" href="#">共享</a>
                  <a
                    class="dropdown-item"
                    @click.prevent="$parent.clickDownloadFolder(item)"
                    href="#"
                    >下載</a
                  >
                  <a
                    class="dropdown-item"
                    href="#"
                    @click.prevent="openReNameModal(item)"
                    >重新命名</a
                  >
                  <a
                    class="dropdown-item border-0"
                    @click.prevent="clickTrashFolder(item)"
                    href="#"
                    >移至垃圾桶</a
                  >
                </div>
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
          :class="{ 'd-none': item.isTrash }"
        >
          <div
            class="folder"
            @click.self="
              $router.push(folderName.replace(/\//g, '~') + '~' + item.name)
            "
          >
            <div class="folder-btnGroup">
              <div class="folder-btn" @click.stop="toggleStarFolder(item)">
                <img
                  v-if="item.isStar"
                  src="/images/icon-star-fill.svg"
                  alt="標記星號"
                />
                <img v-else src="/images/icon-star.svg" alt="標記星號" />
              </div>
              <div class="dropdown">
                <div
                  class="folder-btn"
                  type="button"
                  id="dropdownMenuButton"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <img src="/images/icon-more.svg" alt="選單" />
                </div>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  <a class="dropdown-item" href="#">共享</a>
                  <a
                    class="dropdown-item"
                    @click.prevent="$parent.clickDownloadFolder(item)"
                    href="#"
                    >下載</a
                  >
                  <a
                    class="dropdown-item"
                    href="#"
                    @click.prevent="openReNameModal(item)"
                    >重新命名</a
                  >
                  <a
                    class="dropdown-item border-0"
                    @click.prevent="clickTrashFolder(item)"
                    href="#"
                    >移至垃圾桶</a
                  >
                </div>
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
          :class="{ 'd-none': item.isTrash }"
        >
          <div class="file">
            <div class="file-btnGroup">
              <div class="file-btn" @click.stop="toggleStarFile(item)">
                <img
                  v-if="item.isStar"
                  src="/images/icon-star-fill.svg"
                  alt="標記星號"
                />
                <img v-else src="/images/icon-star.svg" alt="標記星號" />
              </div>
              <div class="dropdown">
                <div
                  class="file-btn"
                  type="button"
                  id="dropdownMenuButton"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <img src="/images/icon-more.svg" alt="選單" />
                </div>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  <a class="dropdown-item" href="#">共享</a>
                  <a
                    class="dropdown-item"
                    @click.prevent="$parent.clickDownload(item.name)"
                    href="#"
                  >
                    下載
                  </a>
                  <a
                    class="dropdown-item"
                    href="#"
                    @click.prevent="openReNameModal(item)"
                    >重新命名</a
                  >
                  <a
                    class="dropdown-item border-0"
                    @click.prevent="clickTrash(item)"
                    href="#"
                  >
                    移至垃圾桶
                  </a>
                </div>
              </div>
            </div>
            <img :src="item.imgUrl" class="file-img" alt="" />
            {{ item.fakeName }}
          </div>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div v-if="filterRet.files" class="row gutter-10">
        <div
          v-for="item in filterRet.files"
          class="col-xl-3 col-lg-4 col-md-6 col-sm-12"
          :key="item.fullPath"
          :class="{ 'd-none': item.isTrash }"
        >
          <div class="file">
            <div class="file-btnGroup">
              <div class="file-btn" @click.stop="toggleStarFile(item)">
                <img
                  v-if="item.isStar"
                  src="/images/icon-star-fill.svg"
                  alt="標記星號"
                />
                <img v-else src="/images/icon-star.svg" alt="標記星號" />
              </div>
              <div class="dropdown">
                <div
                  class="file-btn"
                  type="button"
                  id="dropdownMenuButton"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <img src="/images/icon-more.svg" alt="選單" />
                </div>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  <a class="dropdown-item" href="#">共享</a>
                  <a
                    class="dropdown-item"
                    @click.prevent="$parent.clickDownload(item.name)"
                    href="#"
                  >
                    下載
                  </a>
                  <a
                    class="dropdown-item"
                    href="#"
                    @click.prevent="openReNameModal(item)"
                    >重新命名</a
                  >
                  <a
                    class="dropdown-item border-0"
                    @click.prevent="clickTrash(item)"
                    href="#"
                  >
                    移至垃圾桶
                  </a>
                </div>
              </div>
            </div>
            <img :src="item.imgUrl" class="file-img" alt="" />
            {{ item.fakeName }}
          </div>
        </div>
      </div>
    </transition>
    <ReName :item="item" :oldName="oldName"></ReName>
  </div>
</template>

<script>
import firebase from "firebase/app";
import "firebase/storage";
import $ from "jquery";
import ReName from "../components/ReName.vue";
export default {
  data() {
    return {
      folderName: "",
      folder: [],
      file: [],
      search: "",
      item: {},
      oldName: "",
      dataKey: 0,
    };
  },
  components: { ReName },
  computed: {
    folderLink: function () {
      return this.folderName.split("/");
    },
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
    getData() {
      const vm = this;
      vm.folderName = vm.$route.params.folderName;
      if (vm.folderName.indexOf("~") !== -1) {
        vm.folderName = vm.folderName.replace(/~/g, "/");
      }
      const storageReference = firebase.storage().ref(vm.folderName);
      vm.file = [];
      vm.folder = [];
      storageReference.listAll().then((res) => {
        res.prefixes.forEach((item) => {
          vm.folder.push({
            name: item.name,
            fullPath: item.fullPath,
            isStar: false,
            fakeName: item.name,
            isTrash: false,
          });
        });
        vm.folder.forEach((item) => {
          vm.$parent.starFolder.forEach((stared) => {
            if (stared.fullPath == item.fullPath) {
              item.isStar = true;
              item.fakeName = stared.fakeName;
            }
          });
          vm.$parent.trashFolder.forEach((folder) => {
            if (folder.fullPath == item.fullPath) {
              item.isTrash = true;
            }
          });
        });
        res.items.forEach((item) => {
          const fileRef = firebase.storage().ref(item.fullPath);
          fileRef.getDownloadURL().then(function (url) {
            if (item.name.match(/\.(jpeg|jpg|gif|png|ico|svg)$/)) {
              vm.file.push({
                name: item.name,
                fakeName: item.name,
                imgUrl: url,
                isStar: false,
                fullPath: item.fullPath,
                isTrash: false,
              });
            } else {
              const type = item.name.split(".");
              vm.file.push({
                name: item.name,
                fakeName: item.name,
                isStar: false,
                imgUrl: `https://fakeimg.pl/260x180/?text=${
                  type[type.length - 1]
                }`,
                fullPath: item.fullPath,
                isTrash: false,
              });
            }
            vm.file.forEach((item) => {
              vm.$parent.starFile.forEach((stared) => {
                if (stared.fullPath == item.fullPath) {
                  item.isStar = true;
                  item.fakeName = stared.fakeName;
                }
              });
              vm.$parent.trashFile.forEach((file) => {
                if (file.fullPath == item.fullPath) {
                  item.isTrash = true;
                }
              });
            });
          });
        });
      });
    },
    returnFolder(folder) {
      const vm = this;
      const i = vm.folderLink.findIndex((item) => {
        return item == folder;
      });
      if (i == vm.folderLink.length - 1) {
        return;
      }
      let arr = Array.from(vm.folderLink);
      arr.splice(i + 1, vm.folderLink.length - 1);
      arr = arr.toString().replace(/,/g, "/");
      vm.$parent.enterFolder(arr);
    },
    openReNameModal(item) {
      $("#rename-modal").modal("show");
      this.item = item;
      this.oldName = item.fakeName;
    },
    toggleStarFolder(item) {
      item.isStar = !item.isStar;
      this.dataKey += 1;
      const oldValue = item.name;
      item.name = item.fullPath;
      if (item.isStar) {
        this.$parent.starFolder.push(item);
        item.name = oldValue;
      } else {
        const i = this.$parent.starFolder.findIndex((folder) => {
          return folder == item;
        });
        this.$parent.starFolder.splice(i, 1);
        item.name = oldValue;
      }
    },
    toggleStarFile(item) {
      item.isStar = !item.isStar;
      this.dataKey += 1;
      item.name = item.fullPath;
      if (item.isStar) {
        this.$parent.starFile.push(item);
      } else {
        const i = this.$parent.starFile.findIndex((file) => {
          return file == item;
        });
        this.$parent.starFile.splice(i, 1);
      }
    },
    clickTrash(file) {
      if (confirm("是否要將 " + file.name + " 移至垃圾桶？")) {
        file.isTrash = true;
        this.$parent.trashFile.push(file);
        this.$parent.starFile.forEach((item) => {
          if (item.fullPath == file.fullPath) {
            item.isTrash = true;
          }
        });
        this.dataKey += 1;
      }
    },
    clickTrashFolder(folder) {
      if (confirm("是否要將 " + folder.name + " 移至垃圾桶？")) {
        folder.isTrash = true;
        this.$parent.trashFolder.push(folder);
        this.$parent.starFolder.forEach((item) => {
          if (item.fullPath == folder.fullPath) {
            item.isTrash = true;
          }
        });
        this.dataKey += 1;
      }
    },
  },
  created() {
    this.getData();
  },
};
</script>

<style></style>
