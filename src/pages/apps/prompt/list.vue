<script setup>
import request from "@/utils/request";
import { onMounted, ref } from "vue";

const company_name = ref();
const address_company = ref();
const check = ref(false);
const phone = ref();
const email = ref();
const items = ref([]);

const showEvent = async (id) => {
  try {
    const res = await request.get(`get_contact/1`);

    if (res.status === 200) {

      const data = res.data;
      company_name.value = data.company_name;
      address_company.value = data.address_company;
      phone.value = data.phone;
      email.value = data.email;

      // Cập nhật giá trị cho items
      items.value = [
        {
          title: company_name.value,
          value: 1,
          props: {
            prependIcon: " bx-buildings",
            rounded: "xl",
          },
        },
        {
          title: address_company.value,
          value: 2,
          props: {
            prependIcon: "bx-location-plus",
            rounded: "xl",
          },
        },
        {
          title: phone.value,
          value: 3,
          props: {
            prependIcon: "bx-phone-call",
            rounded: "xl",
          },
        },
        {
          title: email.value,
          value: 4,
          props: {
            prependIcon: "bx-envelope",
            rounded: "xl",
          },
        },
      ];
    }
  } catch (error) {
    console.log(error);
  }
};
const isDialogVisible = ref(false);
onMounted(async () => {
  showEvent();
});

const loading = ref(false)
const loadingEdit = ref(false)
const saveForm = async () => {
  loadingEdit.value = true;

  try {
    loading.value = true
    const res = await request.post(`update_contact`, {
    contact_id: 1,
    company_name: company_name.value,
    address_company: address_company.value,
    phone: phone.value,
    email: email.value,
  });

  if (res.status === 200) {
    isDialogVisible.value = false
    loadingEdit.value = false;
    pushNotiSuccess()
    showEvent();
  }else{
    loadingEdit.value = false;
    pushNotiError()
  }
  } catch (error) {
    loadingEdit.value = false;
    pushNotiError()
  }
  
};
const notiSuccess = ref(false);
const notiError = ref(false);
const pushNotiSuccess = () => {
  notiSuccess.value = true;
  setTimeout(() => {
    notiSuccess.value = false;
  }, 2000);
};
const pushNotiError = () => {
  notiError.value = true;
  setTimeout(() => {
    notiError.value = false;
  }, 2000);
};
</script>

<template>
  <section>
    <div>
      <a-modal v-model:open="open" title="Delete Prompt" @ok="handleOk">
        <p>Bạn có chắc muốn xoá Prompt này?</p>
      </a-modal>
    </div>
    <VRow>
      <VList style="width: 100%" :items="items" />
      <div
        style="
          width: 100%;
          display: flex;
          margin: 10px 0;
          /* float: right; */
          justify-content: right;
        "
      >
        <VBtn color="primary" @click="isDialogVisible = true">
          <VIcon start icon="bx-pencil" />Chỉnh sửa
        </VBtn>
      </div>
    </VRow>

    <!-- 👉 Add New Prompt -->
    <VDialog v-model="isDialogVisible" persistent max-width="600">
      <!-- Dialog Content -->
      <VCard title="Chỉnh sửa thông tin liên hệ">
        <DialogCloseBtn
          variant="text"
          size="small"
          @click="isDialogVisible = false"
        />

        <VCardText>
          <VRow>
            <VCol cols="12">
              <VTextField
                v-model="company_name"
                label="Tên công ty"
                :rules="[requiredValidator]"
              />
            </VCol>

            <VCol cols="12">
              <VTextField
                v-model="address_company"
                label="Địa chỉ"
                :rules="[requiredValidator]"
            /></VCol>

            <VCol cols="12">
              <VTextField
                v-model="phone"
                label="Số điện thoại"
                :rules="[requiredValidator]"
            /></VCol>
            <VCol cols="12">
              <VTextField
                v-model="email"
                label="Email"
                :rules="[requiredValidator]"
            /></VCol>
          </VRow>
        </VCardText>
        <VCardText class="d-flex justify-end gap-2">
          <VBtn
            color="secondary"
            variant="tonal"
            @click="isDialogVisible = false"
          >
            Close
          </VBtn>
          <VBtn @click="saveForm"> Save </VBtn>
        </VCardText>
      </VCard>
    </VDialog>

    <!-- Dialog loading -->
    <VDialog v-model="loadingAddUser" width="300">
      <VCard color="primary" width="300">
        <VCardText class="pt-3">
          Waiting for me.....
          <VProgressLinear indeterminate class="mb-0" />
        </VCardText>
      </VCard>
    </VDialog>

    <!-- Dialog loading data edit-->
    <VDialog v-model="loadingEdit" width="300">
      <VCard color="primary" width="300">
        <VCardText class="pt-3">
          Waiting for loading data.....
          <VProgressLinear indeterminate class="mb-0" />
        </VCardText>
      </VCard>
    </VDialog>

    <!-- Success-->
    <VDialog v-model="notiSuccess" width="300">
      <VCard color="primary" width="300">
        <VAlert type="success">
          <strong>Thành công</strong>
        </VAlert>
      </VCard>
    </VDialog>

    <!-- Error-->
    <VDialog v-model="notiError" width="300">
      <VCard color="primary" width="300">
        <VAlert type="error">
          <strong>Đã có lỗi xẩy ra vui lòng thử lại sau</strong>
        </VAlert>
      </VCard>
    </VDialog>

    <!-- 👉 Edit New Prompt -->
    <VDialog v-model="isDialogEdit" persistent max-width="600">
      <!-- Dialog Content -->
      <VCard title="Edit Prompt">
        <DialogCloseBtn
          variant="text"
          size="small"
          @click="isDialogEdit = false"
        />

        <VCardText>
          <VRow>
            <VCol cols="12">
              <VTextField
                v-model="Edit.linkAnh"
                label="Link Ảnh"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol cols="12">
              <VSelect :items="ListChuDe" v-model="Edit.ChuDe" label="Chủ đề" />
              <!-- Chủ đề -->
            </VCol>
            <VCol cols="12">
              <!-- Chủ đề con -->

              <VSelect
                :items="_subChuDeEdit"
                v-model="Edit.subChuDe"
                label="Chủ đề Con"
              />
            </VCol>
            <VCol cols="12">
              <VTextField
                v-model="Edit.promptName"
                label="Prompt Name"
                :rules="[requiredValidator]"
            /></VCol>
            <VCol cols="12">
              <VTextarea
                v-model="Edit.PromtText"
                label="Sửa Prompt"
                :rules="[requiredValidator]"
            /></VCol>
            <VCol cols="12">
              <VTextField
                v-model="Edit.moTa"
                label="Mô tả"
                :rules="[requiredValidator]"
            /></VCol>
            <VCol cols="12">
              <VTextField
                v-model="Edit.chat"
                label="CHAT"
                :rules="[requiredValidator]"
            /></VCol>
            <VCol cols="12">
              <VSelect
                :items="optionsTypeAI"
                label="Type AI"
                v-model="Edit.typeAI"
                item-title="label"
                item-value="value"
              />
            </VCol>
            <VCol cols="12">
              <VSelect
                :items="stt"
                label="Trạng Thái"
                v-model="Edit.trangThai"
              />
            </VCol>
            <VCol cols="12">
              <!-- Chủ đề con -->

              <VSelect
                :items="_inputType"
                v-model="Edit.inputType"
                label="Kiểu Input"
              />
            </VCol>
            <VCol cols="12">
              <div>
                <a-space
                  v-for="(user, index) in Edit.input"
                  :key="index"
                  style="display: flex; margin-bottom: 8px"
                  align="baseline"
                >
                  <div v-if="user.placeholder != null" style="display: flex">
                    <a-input
                      style="height: 60px; margin-right: 8px"
                      v-model:value="user.inputName"
                      placeholder="Input"
                    />

                    <a-input
                      style="height: 60px; margin-right: 8px"
                      v-model:value="user.placeholder"
                      placeholder="Value"
                    />
                  </div>
                  <div v-if="user.options != null" style="display: flex">
                    <a-input
                      style="height: 60px; margin-right: 8px"
                      v-model:value="user.inputName"
                      placeholder="Input"
                    />
                    <a-select
                      v-model:value="user.options"
                      mode="tags"
                      style="width: 120px"
                      placeholder="Tags Mode"
                    ></a-select>
                  </div>

                  <MinusOutlined @click="removeUserEdit(user)" />
                </a-space>
                <a-button type="dashed" block @click="addInputEdit">
                  <PlusOutlined />
                  Add Input
                </a-button>
              </div>
            </VCol>
          </VRow>
        </VCardText>
        <VCardText class="d-flex justify-end gap-2">
          <VBtn color="secondary" variant="tonal" @click="isDialogEdit = false">
            Close
          </VBtn>
          <VBtn @click="SaveEdit()"> Save </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
  </section>
</template>

<style lang="scss" scoped>
.app-user-search-filter {
  inline-size: 385px;
}
// .ant-form-item .css-dev-only-do-not-override-1hsjdkk:nth-child(2) {
//   width: 100%;
//   display: flex;
//   justify-content: end;
// }
.text-capitalize {
  text-transform: capitalize;
}
body
  > div:nth-child(5)
  > div
  > div
  > div
  > div.rc-virtual-list
  > div.rc-virtual-list-holder
  > div
  > div
  > div
  > div {
  z-index: 20000 !important;
}
.user-list-name:not(:hover) {
  color: rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity));
}
.css-dev-only-do-not-override-1hsjdkk .ant-btn .ant-btn-primary span {
  color: white !important;
}
.per-page-select {
  margin-block: auto;

  .v-field__input {
    align-items: center;
    padding: 2px;
    font-size: 14px;
  }

  .v-field__append-inner {
    align-items: center;
    padding: 0;
    margin-inline-start: -2.5rem;

    .v-icon {
      margin-inline-start: 0 !important;
    }
  }
}
</style>
