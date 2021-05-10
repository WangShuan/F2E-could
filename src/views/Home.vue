<template>
  <div class="content row">
    <div class="header-mobile">
      <div class="header-mobile-btn" @click.stop="toggleSidebar()">
        <img src="../assets/images/menu.svg" alt="" />
      </div>
      <div class="header-mobile-title" @click.stop="leaveFolder()">
        我的雲端硬碟
      </div>

      <div
        class="header-mobile-search-icon"
        @click.prevent="toggleSearch()"
      ></div>
      <input
        type="text"
        placeholder="搜尋您的檔案"
        class="header-mobile-search-input"
        v-model="search"
      />
      <button
        type="button"
        @click.stop="search = ''"
        class="close header-mobile-search-close"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="sidebar">
      <button
        type="button"
        class="close text-white d-md-none"
        @click.stop="toggleSidebar()"
      >
        <span aria-hidden="true">&times;</span>
      </button>
      <router-link to="/"><h1 class="logo">could</h1></router-link>
      <div class="sidebar-btnGroup">
        <div
          class="sidebar-btnGroup-item sidebar-btnGroup-item-active"
          onclick="uploadFile.click()"
        >
          <img
            src="https://raw.githubusercontent.com/WangShuan/F2E-could/7e851ebb89cbe053223420b533bd55097a79a31b/images/icon-file-upload.svg"
            alt=""
          />
          上傳檔案
        </div>
        <input
          type="file"
          name=""
          class="d-none"
          id="uploadFile"
          @click="clickUpload()"
        />
        <div class="sidebar-btnGroup-item" onclick="uploadFolder.click()">
          <img
            src="https://raw.githubusercontent.com/WangShuan/F2E-could/7e851ebb89cbe053223420b533bd55097a79a31b/images/icon-folder-upload.svg"
            alt=""
          />
          上傳資料夾
        </div>
        <input
          type="file"
          class="d-none"
          id="uploadFolder"
          webkitdirectory
          @click="clickUploadFolder()"
        />
        <div
          class="sidebar-btnGroup-item"
          data-toggle="modal"
          data-target="#addFolder-modal"
        >
          <img
            src="https://raw.githubusercontent.com/WangShuan/F2E-could/7e851ebb89cbe053223420b533bd55097a79a31b/images/icon-folder-add.svg"
            alt=""
          />
          新資料夾
        </div>
        <div
          class="modal fade"
          id="addFolder-modal"
          tabindex="-1"
          role="dialog"
          aria-labelledby="addFolder-modal"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
              <div class="modal-content-title">建立新資料夾</div>
              <input
                type="text"
                name=""
                class="modal-content-input"
                v-model="addFolderName"
                placeholder="資料夾名稱"
              />
              <div class="modal-content-btnGroup">
                <button class="modal-content-btn" data-dismiss="modal">
                  取消</button
                ><button
                  class="modal-content-btn modal-content-btn-secondary"
                  @click="addFolder()"
                >
                  建立
                </button>
              </div>
            </div>
          </div>
        </div>
        <a href="#" class="sidebar-btnGroup-item">
          <img
            src="https://raw.githubusercontent.com/WangShuan/F2E-could/7e851ebb89cbe053223420b533bd55097a79a31b/images/icon-folder-share.svg"
            alt=""
          />
          共享資料夾
        </a>
        <router-link
          to="/favorite"
          class="sidebar-btnGroup-item"
          @click.stop="isShowStar = true"
        >
          <img
            src="https://raw.githubusercontent.com/WangShuan/F2E-could/7e851ebb89cbe053223420b533bd55097a79a31b/images/icon-star.svg"
            alt=""
          />
          已標記星號
        </router-link>
        <router-link to="/trash" class="sidebar-btnGroup-item">
          <img
            src="https://raw.githubusercontent.com/WangShuan/F2E-could/7e851ebb89cbe053223420b533bd55097a79a31b/images/icon-trash.svg"
            alt=""
          />
          垃圾桶
        </router-link>
      </div>
      <div class="monster">
        <img
          src="https://raw.githubusercontent.com/WangShuan/F2E-could/7e851ebb89cbe053223420b533bd55097a79a31b/images/Cloud-monster.svg"
          alt=""
          class="monster-bgImg"
          :class="{ 'monster-bgImg-active': isUploading || showStorage }"
          @click="changeShow()"
        />
        <transition name="fade">
          <div class="monster-pop" v-if="isUploading">
            <div class="monster-pop-title">檔案上傳</div>
            <div class="monster-pop-desc" v-if="!isFolder">
              剩餘{{ 100 - parseInt(runningValue) }}%
            </div>
            <div class="monster-pop-desc" v-else>剩餘 {{ rest }} 個檔案</div>
            <div class="progress-box">
              <div class="progress-running">{{ running | niceBytes }}</div>
              <div class="progress-total">{{ fileSize | niceBytes }}</div>
              <div class="progress">
                <progress
                  class="progress-bar"
                  :value="parseInt(runningValue)"
                  max="100"
                ></progress>
              </div>
            </div>
            <div class="monster-pop-arrow"></div>
          </div>
        </transition>
        <transition name="fade">
          <div class="monster-pop" v-if="showStorage">
            <div class="monster-pop-title">儲存空間</div>
            <div class="monster-pop-desc">
              剩餘{{ storage - (nowStorage / 1073741824).toFixed(2) }}GB
            </div>
            <div class="progress-box">
              <div>{{ nowStorage | niceBytes }}</div>
              <div>{{ storage }}GB</div>
              <div class="progress">
                <progress
                  class="progress-bar"
                  :value="nowStorageValue"
                  max="100"
                ></progress>
              </div>
            </div>
            <div class="monster-pop-arrow"></div>
          </div>
        </transition>
      </div>
    </div>
    <main class="col main" :key="dataKey">
      <div
        class="d-flex d-md-none text-muted align-items-center flex-wrap mt-4 justify-content-center"
        v-if="folderLink || search"
      >
        <template v-if="folderLink">
          當前目錄:
          <div
            v-for="item in folderLink"
            class="text-light ml-1"
            @click.self="returnFolder(item)"
            :key="item.fullPath"
            role="button"
          >
            {{ item }}/
          </div>
        </template>
        <div
          v-if="search && folderLink"
          class="header-mobile-title-arrow"
        ></div>

        <template v-if="search">
          <div class="header-mobile-title-folderName">
            "{{ search }}" 搜尋結果
          </div>
        </template>
      </div>
      <div class="navbar" v-if="$route.path == '/'">
        <div class="d-flex flex-wrap align-items-center">
          <div class="navbar-title" @click.stop="leaveFolder()">
            我的雲端硬碟
          </div>
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

      <router-view v-else :key="$route.path"></router-view>

      <template v-if="$route.path == '/'">
        <div class="w-100 title" v-if="folder[0]">資料夾</div>
        <transition name="fade">
          <div v-if="folder[0] && !filterRet" class="row gutter-10">
            <div
              v-for="item in folder"
              class="col-xl-3 col-lg-4 col-md-6 col-sm-12"
              :key="item.fullPath"
              :class="{ 'd-none': item.isTrash }"
            >
              <div class="folder" @click.self="enterFolder(item.name)">
                <div class="folder-btnGroup">
                  <div class="folder-btn" @click.stop="toggleStarFolder(item)">
                    <img
                      v-if="item.isStar"
                      src="https://raw.githubusercontent.com/WangShuan/F2E-could/7e851ebb89cbe053223420b533bd55097a79a31b/images/icon-star-fill.svg"
                      alt="標記星號"
                    />
                    <img
                      v-else
                      src="https://raw.githubusercontent.com/WangShuan/F2E-could/7e851ebb89cbe053223420b533bd55097a79a31b/images/icon-star.svg"
                      alt="標記星號"
                    />
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
                      <img
                        src="https://raw.githubusercontent.com/WangShuan/F2E-could/7e851ebb89cbe053223420b533bd55097a79a31b/images/icon-more.svg"
                        alt="選單"
                      />
                    </div>
                    <div
                      class="dropdown-menu"
                      aria-labelledby="dropdownMenuButton"
                    >
                      <a class="dropdown-item" href="#">共享</a>
                      <a
                        class="dropdown-item"
                        @click.prevent="clickDownloadFolder(item)"
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
              :class="{ 'd-none': item.isTrash }"
              :key="item.fullPath"
            >
              <div class="folder" @click.self="enterFolder(item.name)">
                <div class="folder-btnGroup">
                  <div class="folder-btn" @click.stop="toggleStarFolder(item)">
                    <img
                      v-if="item.isStar"
                      src="https://raw.githubusercontent.com/WangShuan/F2E-could/7e851ebb89cbe053223420b533bd55097a79a31b/images/icon-star-fill.svg"
                      alt="標記星號"
                    />
                    <img
                      v-else
                      src="https://raw.githubusercontent.com/WangShuan/F2E-could/7e851ebb89cbe053223420b533bd55097a79a31b/images/icon-star.svg"
                      alt="標記星號"
                    />
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
                      <img
                        src="https://raw.githubusercontent.com/WangShuan/F2E-could/7e851ebb89cbe053223420b533bd55097a79a31b/images/icon-more.svg"
                        alt="選單"
                      />
                    </div>
                    <div
                      class="dropdown-menu"
                      aria-labelledby="dropdownMenuButton"
                    >
                      <a class="dropdown-item" href="#">共享</a>
                      <a
                        class="dropdown-item"
                        @click.prevent="clickDownloadFolder(item)"
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
        <div class="w-100 title" v-if="file[0]">檔案</div>
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
                      src="https://raw.githubusercontent.com/WangShuan/F2E-could/7e851ebb89cbe053223420b533bd55097a79a31b/images/icon-star-fill.svg"
                      alt="標記星號"
                    />
                    <img
                      v-else
                      src="https://raw.githubusercontent.com/WangShuan/F2E-could/7e851ebb89cbe053223420b533bd55097a79a31b/images/icon-star.svg"
                      alt="標記星號"
                    />
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
                      <img
                        src="https://raw.githubusercontent.com/WangShuan/F2E-could/7e851ebb89cbe053223420b533bd55097a79a31b/images/icon-more.svg"
                        alt="選單"
                      />
                    </div>
                    <div
                      class="dropdown-menu"
                      aria-labelledby="dropdownMenuButton"
                    >
                      <a class="dropdown-item" href="#">共享</a>
                      <a
                        class="dropdown-item"
                        @click.prevent="clickDownload(item.name)"
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
          <div v-if="filterRet" class="row gutter-10">
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
                      src="https://raw.githubusercontent.com/WangShuan/F2E-could/7e851ebb89cbe053223420b533bd55097a79a31b/images/icon-star-fill.svg"
                      alt="標記星號"
                    />
                    <img
                      v-else
                      src="https://raw.githubusercontent.com/WangShuan/F2E-could/7e851ebb89cbe053223420b533bd55097a79a31b/images/icon-star.svg"
                      alt="標記星號"
                    />
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
                      <img
                        src="https://raw.githubusercontent.com/WangShuan/F2E-could/7e851ebb89cbe053223420b533bd55097a79a31b/images/icon-more.svg"
                        alt="選單"
                      />
                    </div>
                    <div
                      class="dropdown-menu"
                      aria-labelledby="dropdownMenuButton"
                    >
                      <a class="dropdown-item" href="#">共享</a>
                      <a
                        class="dropdown-item"
                        @click.prevent="clickDownload(item.name)"
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
      </template>
    </main>
    <ReName :item="item" :oldName="oldName"></ReName>
  </div>
</template>

<script>
import $ from "jquery";
import firebase from "firebase/app";
import "firebase/storage";
import ReName from "../components/ReName.vue";
export default {
  data() {
    return {
      item: {},
      oldName: "",
      storage: 5,
      nowStorage: 0,
      showStorage: false,
      isUploading: false,
      isFolder: false,
      runningValue: 0,
      running: 0,
      fileSize: 0,
      rest: 0,
      uploadingDesc: "",
      search: "",
      folder: [],
      file: [],
      starFolder: [],
      starFile: [],
      trashFolder: [],
      trashFile: [],
      isEnterFolder: false,
      nowFolder: {
        file: [],
        folder: [],
        name: "",
      },
      addFolderName: "",
      dataKey: 0,
      isShowStar: false,
    };
  },
  components: { ReName },
  computed: {
    nowStorageValue: function () {
      return ((this.nowStorage / 1073741824).toFixed(2) / this.storage) * 100;
    },
    filterRet: function () {
      if (this.search) {
        let obj = {
          files: [],
          folders: [],
        };
        this.folder.forEach((item) => {
          if (item.name.indexOf(this.search) !== -1) {
            obj.folders.push(item);
          }
        });
        this.file.forEach((item) => {
          if (item.name.indexOf(this.search) !== -1) {
            obj.files.push(item);
          }
        });
        return obj;
      } else {
        return false;
      }
    },
    folderLink: function () {
      if (this.$route.params.folderName) {
        return this.$route.params.folderName.split("~");
      } else {
        return false;
      }
    },
  },
  watch: {
    isUploading: function () {
      if (this.isUploading) {
        this.showStorage = false;
      }
    },
    isShowStar: function () {
      if (this.isShowStar) {
        this.leaveFolder();
      }
    },
    $route: function () {
      this.getData();
      this.search = "";
    },
    search: function () {
      if (this.search.length) {
        $(".header-mobile-search-close").fadeIn();
      } else {
        $(".header-mobile-search-close").fadeOut();
      }
    },
  },
  methods: {
    toggleSearch() {
      $(".header-mobile-search-input").fadeToggle();
    },
    getNowStorage(fullPath) {
      const vm = this;
      firebase
        .storage()
        .ref(fullPath)
        .listAll()
        .then((ret) => {
          ret.items.forEach((item) => {
            const fileRef = firebase.storage().ref(item.fullPath);
            fileRef.getMetadata().then((metadata) => {
              vm.nowStorage += Number(metadata.size);
            });
          });
          if (ret.prefixes.length) {
            ret.prefixes.forEach((folder) => {
              vm.getNowStorage(folder.fullPath);
            });
          }
        });
    },
    getData() {
      const vm = this;
      let arr = [];
      let folders = [];
      vm.nowStorage = 0;
      const storageReference = firebase.storage().ref();
      storageReference.listAll().then((res) => {
        res.prefixes.forEach((item) => {
          folders.push({
            name: item.name,
            fullPath: item.fullPath,
            isStar: false,
            fakeName: item.name,
            isTrash: false,
          });
          vm.getNowStorage(item.fullPath);
        });

        res.items.forEach((item) => {
          const fileRef = firebase.storage().ref(item.fullPath);
          fileRef.getMetadata().then((metadata) => {
            vm.nowStorage += Number(metadata.size);
          });
          fileRef.getDownloadURL().then(function (url) {
            if (item.name.match(/\.(jpeg|jpg|gif|png|ico|svg)$/)) {
              arr.push({
                name: item.name,
                fakeName: item.name,
                isStar: false,
                imgUrl: url,
                fullPath: item.fullPath,
                isTrash: false,
              });
            } else {
              const type = item.name.split(".");
              arr.push({
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
            arr.forEach((item) => {
              vm.starFile.forEach((stared) => {
                if (stared.fullPath == item.fullPath) {
                  item.isStar = true;
                  item.fakeName = stared.fakeName;
                }
              });
              vm.trashFile.forEach((file) => {
                if (file.fullPath == item.fullPath) {
                  item.isTrash = true;
                }
              });
            });
          });
        });
        folders.forEach((item) => {
          vm.starFolder.forEach((stared) => {
            if (stared.fullPath == item.fullPath) {
              item.isStar = true;
              item.fakeName = stared.fakeName;
            }
          });

          vm.trashFolder.forEach((folder) => {
            if (folder.fullPath == item.fullPath) {
              item.isTrash = true;
            }
          });
        });
        vm.folder = folders;
        vm.file = arr;
      });
    },
    addFolder() {
      const vm = this;
      if (vm.$route.name == "Favorite") {
        vm.folder.push({
          name: vm.addFolderName,
          isStar: true,
          fakeName: vm.addFolderName,
          fullPath: vm.addFolderName,
          isTrash: false,
        });
        vm.starFolder.push({
          name: vm.addFolderName,
          isStar: true,
          fakeName: vm.addFolderName,
          fullPath: vm.addFolderName,
          isTrash: false,
        });
      } else {
        vm.folder.push({
          name: vm.addFolderName,
          isStar: false,
          fakeName: vm.addFolderName,
          fullPath: vm.addFolderName,
          isTrash: false,
        });
      }
      if (vm.$route.params.folderName) {
        vm.nowFolder.name = vm.$route.params.folderName.replace(/~/g, "/");
      }
      if (vm.nowFolder.name) {
        vm.nowFolder.folder.push({
          name: vm.addFolderName,
          isStar: false,
          fakeName: vm.addFolderName,
          fullPath: vm.addFolderName,
          isTrash: false,
        });
      }

      $("#addFolder-modal").modal("hide");
      vm.addFolderName = "";
    },
    toggleStarFolder(item) {
      item.isStar = !item.isStar;
      this.dataKey += 1;

      if (item.isStar) {
        this.starFolder.push(item);
      } else {
        const i = this.starFolder.findIndex((folder) => {
          return folder == item;
        });
        this.starFolder.splice(i, 1);
      }
    },
    toggleStarFile(item) {
      item.isStar = !item.isStar;
      this.dataKey += 1;

      if (item.isStar) {
        this.starFile.push(item);
      } else {
        const i = this.starFile.findIndex((file) => {
          return file == item;
        });
        this.starFile.splice(i, 1);
      }
    },
    clickUpload() {
      const vm = this;
      vm.isFolder = false;

      if (vm.$route.name == "Favorite") {
        vm.$router.push("/");
      }

      $("#uploadFile")
        .unbind()
        .on("change", function (e) {
          const file = e.target.files[0];
          let dbname;
          if (file) {
            let path;
            if (vm.$route.params.folderName) {
              vm.nowFolder.name = vm.$route.params.folderName.replace(
                /~/g,
                "/"
              );
              const storageReference = firebase
                .storage()
                .ref(vm.nowFolder.name);
              storageReference.listAll().then((res) => {
                dbname = res.items.find((item) => {
                  return item.name == file.name;
                });
                if (dbname) {
                  if (confirm(file.name + " 已存在，是否覆蓋？")) {
                    path = vm.nowFolder.name + "/" + file.name;
                  } else {
                    return;
                  }
                } else {
                  path = vm.nowFolder.name + "/" + file.name;
                }
                if (path) {
                  const storageReference = firebase.storage().ref(path);
                  const task = storageReference.put(file);
                  task.on(
                    "state_changed",
                    function progress(snapshot) {
                      vm.isUploading = true;
                      vm.runningValue =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                      vm.running = snapshot.bytesTransferred;
                      vm.fileSize = snapshot.totalBytes;
                    },
                    function error() {},
                    function complete() {
                      vm.enterFolder(vm.nowFolder.name);
                    }
                  );
                }
              });
            } else {
              dbname = vm.file.find((item) => {
                return item.name == file.name;
              });
              if (dbname) {
                if (confirm(file.name + " 已存在，是否覆蓋？")) {
                  path = file.name;
                } else {
                  return;
                }
              } else {
                path = file.name;
              }
              if (path) {
                const storageReference = firebase.storage().ref(path);
                const task = storageReference.put(file);
                task.on(
                  "state_changed",
                  function progress(snapshot) {
                    vm.isUploading = true;
                    vm.runningValue =
                      (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    vm.running = snapshot.bytesTransferred;
                    vm.fileSize = snapshot.totalBytes;
                  },
                  function error() {},
                  function complete() {
                    vm.getData();
                  }
                );
              }
            }
          } else {
            return;
          }
        });
    },
    clickUploadFolder() {
      const vm = this;
      if (vm.$route.name == "Favorite") {
        vm.$router.push("/");
      }
      $("#uploadFolder")
        .unbind()
        .on("change", function (e) {
          vm.isFolder = true;
          const folder = e.target.files[0].webkitRelativePath;
          let storageReference = firebase.storage().ref();
          if (vm.$route.params.folderName) {
            vm.nowFolder.name = vm.$route.params.folderName.replace(/~/g, "/");
            storageReference = firebase.storage().ref(vm.nowFolder.name);
          }
          storageReference.listAll().then((res) => {
            const ret = res.prefixes.find((item) => {
              return item.name == folder.split("/")[0];
            });
            if (ret) {
              if (
                confirm(
                  "資料夾已存在，是否繼續執行？\n\n提醒您：\n相同名稱的文件將會被取代。"
                )
              ) {
                const l = e.target.files.length;
                vm.rest = l;
                for (let i = 0; i < l; i++) {
                  const folder = e.target.files[i].webkitRelativePath;

                  const file = e.target.files[i];
                  let path = `/${folder}`;
                  if (vm.$route.params.folderName) {
                    vm.nowFolder.name = vm.$route.params.folderName.replace(
                      /~/g,
                      "/"
                    );
                    path = vm.nowFolder.name + `/${folder}`;
                  }
                  const storageReference = firebase.storage().ref(path);
                  const task = storageReference.put(file);
                  task.on(
                    "state_changed",
                    function progress(snapshot) {
                      vm.isUploading = true;
                      vm.runningValue =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                      vm.running = snapshot.bytesTransferred;
                      vm.fileSize = snapshot.totalBytes;
                    },
                    function error(err) {
                      alert(err);
                    },
                    function complete() {
                      vm.rest -= 1;
                      if (vm.rest == 0) {
                        if (vm.$route.params.folderName) {
                          vm.nowFolder.name = vm.$route.params.folderName.replace(
                            /~/g,
                            "/"
                          );
                          vm.enterFolder(vm.nowFolder.name);
                        } else {
                          vm.getData();
                        }
                      }
                    }
                  );
                }
              } else {
                return;
              }
            } else {
              const l = e.target.files.length;
              vm.rest = l;
              for (let i = 0; i < l; i++) {
                const folder = e.target.files[i].webkitRelativePath;

                const file = e.target.files[i];
                let path = `/${folder}`;
                if (vm.$route.params.folderName) {
                  vm.nowFolder.name = vm.$route.params.folderName.replace(
                    /~/g,
                    "/"
                  );
                  path = vm.nowFolder.name + `/${folder}`;
                }
                const storageReference = firebase.storage().ref(path);
                const task = storageReference.put(file);
                task.on(
                  "state_changed",
                  function progress(snapshot) {
                    vm.isUploading = true;
                    vm.runningValue =
                      (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    vm.running = snapshot.bytesTransferred;
                    vm.fileSize = snapshot.totalBytes;
                  },
                  function error(err) {
                    alert(err);
                  },
                  function complete() {
                    vm.rest -= 1;
                    if (vm.rest == 0) {
                      if (vm.$route.params.folderName) {
                        vm.nowFolder.name = vm.$route.params.folderName.replace(
                          /~/g,
                          "/"
                        );
                        vm.enterFolder(vm.nowFolder.name);
                      } else {
                        vm.getData();
                      }
                    }
                  }
                );
              }
            }
          });
        });
    },
    changeShow() {
      const vm = this;
      if (vm.isUploading) {
        vm.isUploading = false;
        vm.showStorage = false;
      }
      vm.showStorage = !vm.showStorage;
    },
    enterFolder(folder) {
      const vm = this;
      folder = folder.replace(/\//g, "~");
      vm.$router.push("/folder/" + folder).catch((err) => {
        console.log(err);
      });
      vm.dataKey += 1;
    },
    leaveFolder() {
      this.nowFolder = { name: "", file: [], folder: [] };
      this.isEnterFolder = false;
      this.$router.push("/").catch((err) => {
        console.log(err);
      });
    },
    clickDownload(file) {
      if (this.$route.params.folderName) {
        this.nowFolder.name = this.$route.params.folderName.replace(/~/g, "/");
      }
      const fileRef = firebase.storage().ref(this.nowFolder.name + "/" + file);
      fileRef.getDownloadURL().then(function (url) {
        fetch(url)
          .then((response) => response.blob())
          .then((blob) => {
            let a = document.createElement("a");
            let url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = fileRef.fullPath;
            a.target = "_blank";
            // Firefox 需要將 JS 建立出的 element appendChild 到 DOM 上才可以 work
            a.style.display = "none";
            document.body.appendChild(a);
            a.click();
            // 刪除多餘的 DOM 與 釋放記憶體
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
          });
      });
    },
    clickDownloadFolder(folder) {
      const vm = this;
      const storageRef = firebase.storage().ref(folder.fullPath);
      storageRef
        .listAll()
        .then((res) => {
          res.items.forEach((itemRef) => {
            const fileRef = firebase.storage().ref(itemRef.fullPath);
            fileRef.getDownloadURL().then(function (url) {
              fetch(url)
                .then((res) => res.blob())
                .then((blob) => {
                  let a = document.createElement("a");
                  let url = window.URL.createObjectURL(blob);
                  a.href = url;
                  a.download = itemRef.fullPath;

                  // Firefox 需要將 JS 建立出的 element appendChild 到 DOM 上才可以 work
                  a.style.display = "none";
                  document.body.appendChild(a);

                  a.click();

                  // 刪除多餘的 DOM 與 釋放記憶體
                  document.body.removeChild(a);
                  window.URL.revokeObjectURL(url);
                });
            });
          });
          if (res.prefixes.length) {
            vm.readDir(res.prefixes);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    clickTrash(file) {
      if (confirm("是否要將 " + file.name + " 移至垃圾桶？")) {
        file.isTrash = true;
        this.trashFile.push(file);
        this.starFile.forEach((item) => {
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
        this.trashFolder.push(folder);
        this.starFolder.forEach((item) => {
          if (item.fullPath == folder.fullPath) {
            item.isTrash = true;
          }
        });
        this.dataKey += 1;
      }
    },
    readDir(folders) {
      const vm = this;
      folders.forEach((prefixe) => {
        const folderRef = firebase.storage().ref(prefixe.fullPath);
        folderRef.listAll().then((res) => {
          res.items.forEach((itemRef) => {
            const filRef = firebase.storage().ref(itemRef.fullPath);
            filRef.getDownloadURL().then(function (url) {
              fetch(url)
                .then((response) => response.blob())
                .then((blob) => {
                  let a = document.createElement("a");
                  let url = window.URL.createObjectURL(blob);
                  a.href = url;
                  a.download = itemRef.fullPath;

                  // Firefox 需要將 JS 建立出的 element appendChild 到 DOM 上才可以 work
                  a.style.display = "none";
                  document.body.appendChild(a);

                  a.click();

                  // 刪除多餘的 DOM 與 釋放記憶體
                  document.body.removeChild(a);
                  window.URL.revokeObjectURL(url);
                });
            });
          });
          if (res.prefixes.length) {
            vm.readDir(res.prefixes);
          }
        });
      });
    },
    openReNameModal(item) {
      $("#rename-modal").modal("show");
      this.item = item;
      this.oldName = item.fakeName;
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
      vm.enterFolder(arr);
    },
    toggleSidebar() {
      $(".sidebar").fadeToggle();
    },
  },
  created() {
    this.getData();
  },
};
</script>
