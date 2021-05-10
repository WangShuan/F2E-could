<template>
  <div :key="dataKey">
    <div class="navbar">
      <div class="d-flex flex-wrap align-items-center">
        <div class="navbar-title" @click.stop="$parent.leaveFolder()">
          我的雲端硬碟
        </div>
        <div class="navbar-title-arrow"></div>
        <div class="navbar-title-folderName">已標記星號</div>
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
          :class="{ 'd-none': item.isTrash }"
        >
          <div class="folder" @click.self="$parent.enterFolder(item.fullPath)">
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
          <div class="folder" @click.self="$parent.enterFolder(item.fullPath)">
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
import $ from "jquery";
import ReName from "../components/ReName.vue";
export default {
  data() {
    return {
      folder: this.$parent.starFolder,
      file: this.$parent.starFile,
      search: "",
      dataKey: 0,
      item: {},
      oldName: "",
    };
  },
  components: { ReName },
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
    openReNameModal(item) {
      $("#rename-modal").modal("show");
      this.item = item;
      this.oldName = item.fakeName;
    },
    toggleStarFolder(item) {
      item.isStar = !item.isStar;
      this.dataKey += 1;
      item.name = item.fullPath;
      if (item.isStar) {
        this.folder.push(item);
      } else {
        const i = this.folder.findIndex((folder) => {
          return folder == item;
        });
        this.folder.splice(i, 1);
      }
    },
    toggleStarFile(item) {
      item.isStar = !item.isStar;
      this.dataKey += 1;
      item.name = item.fullPath;
      if (item.isStar) {
        this.file.push(item);
      } else {
        const i = this.file.findIndex((file) => {
          return file == item;
        });
        this.file.splice(i, 1);
      }
    },
    clickTrash(file) {
      if (confirm("是否要將 " + file.name + " 移至垃圾桶？")) {
        file.isTrash = true;
        this.$parent.trashFile.push(file);
        this.dataKey += 1;
      }
    },
    clickTrashFolder(folder) {
      if (confirm("是否要將 " + folder.name + " 移至垃圾桶？")) {
        folder.isTrash = true;
        this.$parent.trashFolder.push(folder);
        this.dataKey += 1;
      }
    },
  },
  created() {},
};
</script>

<style></style>
