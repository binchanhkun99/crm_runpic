<script setup>
import ThongKeUser from "@/pages/components/thongke.vue";
import request from "@/utils/request";
import { UploadOutlined } from "@ant-design/icons-vue";

import { requiredValidator } from "@validators";
import { onMounted, watch } from "vue";
const searchQuery = ref("");
const selectedRole = ref();
const selectedPlan = ref();
const selectedStatus = ref();
const rowPerPage = ref(10);
const currentPage = ref(1);
const totalPage = ref(10);
const totalUsers = ref(0);
const gptData = ref([]);
const loading = ref(false);
const apiKey = ref();
const page = ref(1);
const show1 = ref(false);
const hardLink = ref(`${import.meta.env.VITE_API_URL}`)
const isDialogVisible = ref(false);

const userListMeta = [
  {
    icon: "bx-user",
    color: "primary",
    title: "Session",
    stats: "21,459",
    percentage: +29,
    subtitle: "Total Users",
  },
  {
    icon: "bx-user-plus",
    color: "error",
    title: "Paid Users",
    stats: "4,567",
    percentage: +18,
    subtitle: "Last week analytics",
  },
  {
    icon: "bx-user-check",
    color: "success",
    title: "Active Users",
    stats: "19,860",
    percentage: -14,
    subtitle: "Last week analytics",
  },
  {
    icon: "bx-user-voice",
    color: "warning",
    title: "Pending Users",
    stats: "237",
    percentage: +42,
    subtitle: "Last week analytics",
  },
];
const pageSize = ref(0);

page.value = currentPage.value;
// 👉 Fetching gptData
const fetchEvents = async () => {
  loading.value = true;
  var data = JSON.parse(localStorage.getItem("user")) || {};
  apiKey.value = data.key;
  await request
    .get(
      `events/?page=${page.value}&limit=${rowPerPage.value}&search=${searchQuery.value}`
    )
    .then((rss) => {
      if (rss.status === 200) {
        gptData.value = rss.data.events;
        totalPage.value = rss.data.count;
        pageSize.value = Math.ceil(totalPage.value / rowPerPage.value);
        loading.value = false;
      }
      loading.value = false;
    })
    .catch((error) => {
      loading.value = false;
      // console.log(error);
    });
  selectedRole.value = "all";
  selectedPlan.value = "all";
};
// 👉 Fetching gptData
const fetchEventsPag = async (page) => {
  loading.value = true;
  var data = JSON.parse(localStorage.getItem("user")) || {};
  apiKey.value = data.key;
  await request
    .get(
      `events/?page=${page}&limit=${rowPerPage.value}&search=${searchQuery.value}`
    )
    .then((rss) => {
      if (rss.data.success) {
        gptData.value = rss.data.events;

        totalPage.value = rss.data.count;
        pageSize.value = Math.ceil(totalPage.value / rowPerPage.value);
        loading.value = false;
      }
      loading.value = false;
    })
    .catch((error) => {
      loading.value = false;
      // console.log(error);
    });
  selectedRole.value = "all";
  selectedPlan.value = "all";
};

// 👉 watching current page
watchEffect(() => {
  if (currentPage.value > totalPage.value) currentPage.value = totalPage.value;
});
watch(currentPage, (newVal, oldVal) => {
  fetchEventsPag(newVal);
});

const isAddNewUserDrawerVisible = ref(false);

// 👉 watching current page
watchEffect(() => {
  if (currentPage.value > totalPage.value) currentPage.value = totalPage.value;
});

// 👉 Computing pagination data
const paginationData = computed(() => {
  const firstIndex = gptData.value.length
    ? currentPage.value * rowPerPage.value
    : 0;
  const lastIndex = gptData.value.length + currentPage.value * rowPerPage.value;

  return `${firstIndex}-${lastIndex} of ${totalUsers.value}`;
});

// SECTION Checkbox toggle
const selectedRows = ref([]);
const selectAllUser = ref(false);

// 👉 watch if checkbox array is empty all select should be uncheck
watch(
  selectedRows,
  () => {
    if (!selectedRows.value.length) selectAllUser.value = false;
  },
  { deep: true }
);

// 👉 Delete GPT
const open = ref(false);
const idDelete = ref();
const showModal = (id) => {
  idDelete.value = id;
  open.value = true;
};

const handleOk = (e) => {
  deleteUser();
};
const deleteUser = async () => {
  try {
    const deleteUsr = await request.post(`delete_event/${idDelete.value}`);

    if (deleteUsr.status == 200) {
      fetchEvents();
      open.value = false;
      pushNotiSuccess();
    } else {
      pushNotiError();
      open.value = false;
    }
  } catch (error) {
    open.value = false;
    pushNotiError();
    console.log(error);
  }
};

// 👉 Search User
const SearchUser = async () => {
  currentPage.value = 0;
  fetchEvents();
};

// 👉 Add GPT
const title = ref();
const gptKey = ref();
const loadingAddUser = ref(false);
const name_event = ref();
const address = ref();
const folder = ref();
const banner = ref();
const start_date = ref();
const number_date = ref();
const ImageNameAdd = ref();
const showImgAdd = ref();
const base64StringAdd = ref();
function onFileChangeAdd(event) {
  const ctx = document.getElementById("real-file");
  ctx.click();
  if (event.target.files && event.target.files.length > 0) {
    const file = event.target.files[0];
    showImgAdd.value = URL.createObjectURL(file);
    ImageNameAdd.value = file.name;
    fileType.value = file.name.split(".").pop();
    const reader = new FileReader();

    reader.onload = function (event) {
      base64StringAdd.value = event.target.result
        .replace("data:", "")
        .replace(/^.+,/, "");
      // console.log(base64String.value);

      // Check if base64String is not empty before calling searchImage()
      if (base64StringAdd.value) {
        banner.value = base64StringAdd.value;
      } else {
        console.error("No base64 string found.");
      }
    };

    reader.readAsDataURL(file);
  }
}


const addUser = async () => {
  try {
    loadingAddUser.value = true;
    const response = await request.post(`create_event/`, {
      name_event: name_event.value,
      address: address.value,
      folder: folder.value,
      image_base64: banner.value,
      typeFile: fileType.value,
      start_date: start_date.value,
      number_date: number_date.value,
    });
    if (response.status === 200) {
      loadingAddUser.value = false;
      isDialogVisible.value = false;
      fetchEvents();
      pushNotiSuccess();
    } else {
      isDialogVisible.value = false;
      loadingAddUser.value = false;
      pushNotiError();
    }
  } catch (error) {
    pushNotiError();
    loadingAddUser.value = false;
    isDialogVisible.value = false;
    console.log(error);
  }
};
const base64String = ref("");
const fileType = ref("");
const ImageName = ref("");
const showImg = ref();
function onFileChangeEdit(event) {
  const ctx = document.getElementById("real-file");
  ctx.click();
  if (event.target.files && event.target.files.length > 0) {
    const file = event.target.files[0];
    showImg.value = URL.createObjectURL(file);
    ImageName.value = file.name;
    fileType.value = file.name.split(".").pop();
    const reader = new FileReader();

    reader.onload = function (event) {
      base64String.value = event.target.result
        .replace("data:", "")
        .replace(/^.+,/, "");
      // console.log(base64String.value);

      // Check if base64String is not empty before calling searchImage()
      if (base64String.value) {
        Edit.value.banner = base64String.value;
      } else {
        console.error("No base64 string found.");
      }
    };

    reader.readAsDataURL(file);
  }
}

// 👉 Edit User
const loadingEdit = ref(false);
const isDialogEdit = ref(false);
const Edit = ref({
  name_event: "",
  address: "",
  folder: "",
  banner: "",
  start_date: "",
  number_date: "",
});
function resetEditValues() {
  Edit.value.name_event = "";
  Edit.value.address = "";
  Edit.value.folder = "";
  Edit.value.banner = "";
  Edit.value.start_date = "";
  Edit.value.number_date = "";
}
const idGptEdit = ref();
const showEdit = async (id) => {

  resetEditValues();
  idGptEdit.value = id;
  loadingEdit.value = true;
  try {
    const res = await request.get(`events_by_id?event_id=${idGptEdit.value}`);
    // console.log("HIHIHII", res);
    if (res.status === 200) {
      const data = res.data;
      Edit.value.name_event = data.name_event;
      Edit.value.address = data.address;
      Edit.value.folder = data.folder;
      Edit.value.banner = data.banner;
      Edit.value.start_date = data.start_date;
      Edit.value.number_date = data.number_date;
      loadingEdit.value = false;
      isDialogEdit.value = true;
    }
    loadingEdit.value = false;
  } catch (error) {
    console.log(error);
    loadingEdit.value = false;
  }
};

// watch(selectedItem, (newVal, oldVal)=>{
//   console.log(newVal);
// })
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
const SaveEdit = async () => {
  try {
    loadingAddUser.value = true;
    const res = await request.post(
      `edit_event/${idGptEdit.value}`,
      {
        // event_id: idGptEdit.value,
        name_event: Edit.value.name_event,
        address: Edit.value.address,
        folder: Edit.value.folder,
        image_base64: Edit.value.banner,
        start_date: Edit.value.start_date,
        number_date: Edit.value.number_date,
        typeFile: fileType.value
      },
      {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/x-www-form-urlencoded",
      }
    );
    if (res.status == 200) {
      loadingAddUser.value = false;
      pushNotiSuccess();
      fetchEvents();
    } else {
      loadingAddUser.value = false;
      isDialogEdit.value = false;
      pushNotiError();
    }
  } catch (error) {
    pushNotiError();
    loadingAddUser.value = false;
    console.log(error);
    isDialogEdit.value = false;
  }
};
const role = ref(0);
// 👉 OnMounted
onMounted(() => {
  fetchEvents();
});
</script>

<template>
  <section>
    <div>
      <a-modal v-model:open="open" title="Delete Event" @ok="handleOk">
        <p>Bạn có chắc muốn xoá Event này?</p>
      </a-modal>
    </div>
    <VRow>
      <ThongKeUser />
      <VCol cols="12">
        <VCard title="Quản lý Events">
          <VCardText> </VCardText>

          <VDivider />

          <VCardText class="d-flex flex-wrap gap-4">
            <!-- 👉 Export button -->

            <VSpacer />

            <div class="d-flex align-center">
              <!-- 👉 Add user button -->
              <VBtn @click="isDialogVisible = !isDialogVisible">
                Add Events
              </VBtn>
            </div>
          </VCardText>
          <VDivider />
          <VProgressLinear v-if="loading" indeterminate color="primary" />
          <VTable class="text-no-wrap">
            <!-- 👉 table head -->
            <thead>
              <tr>
                <!-- <th scope="col" style="width: 48px">
                  <VCheckbox
                    :model-value="selectAllUser"
                    :indeterminate="
                      gptData.length !== selectedRows.length &&
                      !!selectedRows.length
                    "
                    class="mx-1"
                    @click="selectUnselectAll"
                  />
                </th> -->
                <th scope="col">STT</th>
                <th scope="col">Tên Event</th>
                <th scope="col">Ngày bắt đầu</th>
                <th scope="col">Banner</th>
                <th scope="col">Địa điểm</th>
                <th scope="col">Số ngày</th>
                <th scope="col">ACTIONS</th>
              </tr>
            </thead>

            <!-- 👉 table body -->
            <tbody>
              <tr v-for="(user, index) in gptData" :key="index">
                <!-- 👉 Checkbox -->
                <!-- <td>
                  <VCheckbox
                    :id="`check${user.id}`"
                    :model-value="selectedRows.includes(`check${user.id}`)"
                    class="mx-1"
                    @click="addRemoveIndividualCheckbox(`check${user.id}`)"
                  />
                </td> -->

                <!-- 👉 User -->
                <td>
                  <div class="d-flex align-center">
                    {{ index + 1 }}
                  </div>
                </td>
                <td>
                  <div class="d-flex align-center">
                    <!-- <VAvatar
                      variant="tonal"
                      :color="resolveUserRoleVariant(user.role).color"
                      class="me-3"
                      size="34"
                    >
                      <VImg v-if="user.avatar" :src="user.avatar" />
                      <span v-else class="text-sm">{{
                        avatarText(user.user)
                      }}</span>
                    </VAvatar> -->

                    <div class="d-flex flex-column">
                      <h6 class="text-sm">
                        <!-- <RouterLink
                          :to="{
                            name: 'apps-user-view-id',
                            params: { id: user.id },
                          }"
                          class="font-weight-medium user-list-name"
                        > -->
                        {{ user.name_event }}
                        <!-- </RouterLink> -->
                      </h6>
                    </div>
                  </div>
                </td>

                <!-- 👉 Country -->
                <td>
                  <span class="text-capitalize text-base">{{
                    user.start_date
                  }}</span>
                </td>

                <!-- 👉 Ngày Đăng Ký -->
                <td>
                  <!-- <span class="text-base text-high-emphasis">{{
                   
                  }}</span> -->
                  <a-image
                    :width="400"
                    :height="200"
                    :src="
                      user.banner.replace(
                        'banner/',
                      `${hardLink}banner/`
                      )
                    "
                  />
                </td>

                <!-- 👉 Địa điểm -->
                <td>
                  <span class="text-base text-high-emphasis">{{
                    user.address
                  }}</span>
                </td>

                <!-- 👉 Số ngày -->
                <td>
                  {{ user.number_date }}
                </td>

                <!-- 👉 Actions -->
                <td class="text-center" style="width: 80px">
                  <VBtn color="warning" style="margin-right: 8px"  @click="showEdit(user.id)">
                    <VIcon icon="bxs-edit" />
                  </VBtn>
                  <VBtn color="error" @click="showModal(user.id)">
                    <VIcon icon="bx-trash" />
                  </VBtn>
                  <!-- <MoreBtn :menu-list="computedMoreList(user.id)" item-props /> -->
                </td>
              </tr>
            </tbody>

            <!-- 👉 table footer  -->
            <tfoot v-show="!gptData.length">
              <tr>
                <td colspan="7" class="text-center text-body-1">
                  No data available
                </td>
              </tr>
            </tfoot>
          </VTable>

          <VDivider />

          <!-- SECTION Pagination -->
          <VCardText class="d-flex flex-wrap justify-end gap-4 pa-2">
            <!-- 👉 Rows per page -->
            <div class="d-flex align-center" style="width: 171px">
              <span class="text-no-wrap text-sm me-3">Rows per page:</span>
              <VSelect
                v-model="rowPerPage"
                density="compact"
                class="per-page-select"
                variant="plain"
                :items="[10, 20, 30, 50]"
              />
            </div>

            <!-- 👉 Pagination and pagination meta -->
            <div class="d-flex align-center">
              <h6 class="text-sm font-weight-regular">
                {{ paginationData }}
              </h6>
            </div>
            <VPagination
              v-model="currentPage"
              size="small"
              :total-visible="7"
              :length="pageSize"
              @next="selectedRows = []"
              @prev="selectedRows = []"
            />
          </VCardText>
          <!-- !SECTION -->
        </VCard>
      </VCol>
    </VRow>

    <!-- 👉 Add New User -->
    <VDialog v-model="isDialogVisible" persistent max-width="600">
      <!-- Dialog Content -->
      <VCard title="Add New GPT">
        <DialogCloseBtn
          variant="text"
          size="small"
          @click="isDialogVisible = false"
        />

        <VCardText>
          <VRow>
            <VCol cols="12">
              <VTextField
                v-model="name_event"
                :rules="[requiredValidator]"
                label="Tên sự kiện"
              />
            </VCol>
            <VCol cols="12">
              <VTextarea
                v-model="address"
                :rules="[requiredValidator]"
                label="Địa điểm"
              />
            </VCol>
            <VCol cols="12">
              <VTextField
                v-model="folder"
                :rules="[requiredValidator]"
                label="Folder chứa ảnh"
              />
            </VCol>
            <VCol cols="12">
              <AppDateTimePicker
                v-model="start_date"
                label="Thời gian bắt đầu"
                :config="{ enableTime: false, dateFormat: 'Y-m-d' }"
            /></VCol>
            <VCol cols="12">
              <a-input-group compact>
                <a-input
                  disabled
                  v-model:value="value19"
                  placeholder="Ảnh Banner"
                  style="width: calc(100% - 200px)"
                >
                </a-input>
                <a-button
                  for="real-file"
                  @click="onFileChangeAdd"
                  id="custom-button"
                  type="primary"
                >
                  <template #icon><UploadOutlined /></template>
                </a-button>
              </a-input-group>
              <input
                id="real-file"
                type="file"
                style="display: none"
                @change="onFileChangeAdd"
                ref="file"
              />
            </VCol>
            <VCol cols="12" v-if="ImageNameAdd">
              <i>{{ ImageNameAdd }}</i>
              <img
                style="margin-left: 12px; width: 120px; object-fit: cover"
                :src="showImg"
                alt=""
              />
            </VCol>

            <VCol cols="12">
              <VTextField
                v-model="number_date"
                :rules="[requiredValidator]"
                label="Số ngày"
              />
            </VCol>
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
          <VBtn @click="addUser"> Save </VBtn>
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
          Waiting for loading data gpt.....

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

    <!-- 👉 Edit New User -->
    <VDialog persistent v-model="isDialogEdit" max-width="600">
      <!-- Edit Dialog -->
      <VCard title="Edit Events">
        <DialogCloseBtn
          variant="text"
          size="small"
          @click="isDialogEdit = false"
        />

        <VCardText>
          <VRow>
            <VCol cols="12">
              <VTextField
                v-model="Edit.name_event"
                :rules="[requiredValidator]"
                label="Tên sự kiện"
              />
            </VCol>
            <VCol cols="12">
              <VTextarea
                v-model="Edit.address"
                :rules="[requiredValidator]"
                label="Địa điểm"
              />
            </VCol>
            <VCol cols="12">
              <VTextField
                v-model="Edit.folder"
                :rules="[requiredValidator]"
                label="Folder chứa ảnh"
              />
            </VCol>
            <VCol cols="12">
              <AppDateTimePicker
                v-model="Edit.start_date"
                label="Thời gian bắt đầu"
                :config="{ enableTime: false, dateFormat: 'Y-m-d' }"
            /></VCol>
            <VCol cols="12">
              <a-input-group compact>
                <a-input
                  disabled
                  v-model:value="value19"
                  placeholder="Ảnh Banner"
                  style="width: calc(100% - 200px)"
                >
                </a-input>
                <a-button
                  for="real-file"
                  @click="onFileChangeEdit"
                  id="custom-button"
                  type="primary"
                >
                  <template #icon><UploadOutlined /></template>
                </a-button>
              </a-input-group>
              <input
                id="real-file"
                type="file"
                style="display: none"
                @change="onFileChangeEdit"
                ref="file"
              />
            </VCol>
            <VCol cols="12" v-if="ImageName">
              <i>{{ ImageName }}</i>
              <img
                style="margin-left: 12px; width: 120px; object-fit: cover"
                :src="showImg"
                alt=""
              />
            </VCol>

            <VCol cols="12">
              <VTextField
                v-model="Edit.number_date"
                :rules="[requiredValidator]"
                label="Số ngày"
              />
            </VCol>
          </VRow>
        </VCardText>
        <VCardText class="d-flex justify-end gap-2">
          <VBtn color="secondary" variant="tonal" @click="isDialogEdit = false">
            Close
          </VBtn>
          <VBtn @click="SaveEdit"> Save</VBtn>
        </VCardText>
      </VCard>
    </VDialog>
  </section>
</template>

<style lang="scss">
.app-user-search-filter {
  inline-size: 385px;
}

.text-capitalize {
  text-transform: capitalize;
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
