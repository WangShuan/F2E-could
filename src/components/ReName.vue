<template>
  <div
    class="modal fade"
    id="rename-modal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="rename-modal"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-content-title">重新命名</div>
        <input
          type="text"
          name=""
          class="modal-content-input"
          v-model.lazy="item.fakeName"
          placeholder="請輸入名稱"
          required
        />
        <div class="modal-content-btnGroup">
          <button class="modal-content-btn" @click="cancel(item)">取消</button
          ><button
            class="modal-content-btn modal-content-btn-secondary"
            @click="updateName()"
          >
            確定
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
export default {
  data() {
    return {};
  },
  props: ["item", "oldName"],
  methods: {
    cancel(item) {
      item.fakeName = this.oldName;
      $("#rename-modal").modal("hide");
    },
    updateName() {
      if (!this.item.fakeName.trim()) {
        alert("名稱不得為空");
        this.item.fakeName = this.oldName;

        return false;
      }
      $("#rename-modal").modal("hide");
    },
  },
};
</script>

<style></style>
