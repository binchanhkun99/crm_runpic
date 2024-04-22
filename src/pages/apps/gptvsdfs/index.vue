<script setup>
import request from "@/utils/request";
import { onMounted } from "vue";

import dfs from "@images/logos/Stable_Diffusion_logo_2b68efd6c7.png";

const selectAI = ref();
const Resolution = ref();
const searchQuery = ref("");
const selectedRole = ref();
const selectedPlan = ref();
const selectedStatus = ref();
const rowPerPage = ref(10);
const currentPage = ref(1);
const totalPage = ref(10);
const totalUsers = ref(0);

const page = ref(1);
const show1 = ref(false);

// watch()
const apiKey = ref();
const fetchConfig = async () => {
  var data = JSON.parse(localStorage.getItem("user")) || {};
  apiKey.value = data.key;
  const res = await request.get(
    `api/admin/index.php?key=${apiKey.value}&action=sd_get_settings`
  );
  if (res.data.status) {
    selectAI.value = res.data.data.redirect;
    Resolution.value = res.data.data.image_size;
  }
};
const loading = ref(false);
const items = ref([
]);
const gptData = ref([])
const race_limit = ref(null);

const selectedItemId = ref(null);

const fetchEvents = async () => {
  loading.value = true;
 
  await request
    .get(
      `events?page=${page.value}&limit=${rowPerPage.value}&search=${searchQuery.value}`
    )
    .then((rss) => {
      
      if (rss.status === 200) {
        gptData.value = rss.data.events;
       
        loading.value = false;

        // Chuyển đổi dữ liệu từ gptData thành mảng items
        const newItems = gptData.value.map(event => ({ label: event.name_event, value: event.id }));
        items.value = newItems;

        // Tìm giá trị limit_race tương ứng với item được chọn ban đầu
        race_limit.value = findRaceLimit(selectAI.value);
       
      }
      loading.value = false;
    })
    .catch((error) => {
      loading.value = false;
      console.log(error);
    });
};
// Hàm tìm giá trị limit_race tương ứng
const findRaceLimit = (id) => {
  try {
    const event = gptData.value.find(item =>{
      if(item.id == id){
        race_limit.value = item.limit_race
       return
      }     
    } );   
  } catch (error) {s
    console.log(error);
  }
};

// Theo dõi sự thay đổi trong mảng items
watch(selectAI, (newVal) => {
  findRaceLimit(newVal)
});
const itemsSol = ref([
  { label: "512*512", value: "512*512" },
]);
const saveConfigImage = async ()=>{
    loading.value = true
    try {
        const res = await request.post(`update_event_limit_race`,{
            event_id: selectAI.value,
            limit_race: race_limit.value
        },
        {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/x-www-form-urlencoded",
      })
      if(res.status===200){
        fetchEvents()
        loading.value = false
      }
      else{
        loading.value = false
        pushNotiError()
      }
        

        
    } catch (error) {
        loading.value = false
        pushNotiError()
    }
}
const role = ref(0);
onMounted(() => {
  const dataRole = JSON.parse(localStorage.getItem("user")) || {};

role.value = dataRole.level;
fetchEvents()
});
</script>

<template>

  <section >
    <VCol cols="12">
      <VCard title="Chỉnh sửa chặng">
        <VProgressLinear v-if="loading" indeterminate color="primary" />
        <VCardText>
          <VRow>
            <VCol cols="12">
              <VSelect
                :items="items"
                label="Select Event"
                v-model="selectAI"
                item-title="label"
                chips
                item-value="value"
              >
                <template #chip="{ props, item }">
                  <VChip
                    v-bind="props"
                    :prepend-avatar="dfs"
                    :text="items.label"
                  />
                </template>
              </VSelect>
            </VCol>
          </VRow>
          <VRow>
            <VCol cols="12">
              <VTextField
                v-model="race_limit"
                :rules="[requiredValidator]"
                label="Số lượng ảnh mỗi chặng"
              />
            </VCol>
            <div class="btn">
              <VBtn @click="saveConfigImage" color="primary"> Save </VBtn>
            </div>
          </VRow>
        </VCardText>
      </VCard>
    </VCol>
    
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
  </section>
</template>

<style lang="scss" scoped>
.btn{
    width: 100%;
    display: flex;
    justify-content: flex-end;
}
</style>
