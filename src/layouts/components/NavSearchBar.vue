<script setup>
import { useThemeConfig } from '@core/composable/useThemeConfig'

const { appContentLayoutNav } = useThemeConfig()

defineOptions({ inheritAttrs: false })

// 👉 Is App Search Bar Visible
const isAppSearchBarVisible = ref(false)

// 👉 Default suggestions
const suggestionGroups = [
  {
    title: 'Popular Searches',
    content: [
      {
        icon: 'bx-bar-chart',
        title: 'Analytics',
        url: { name: 'dashboards-analytics' },
      },
      {
        icon: 'bx-doughnut-chart',
        title: 'CRM',
        url: { name: 'dashboards-crm' },
      },
      {
        icon: 'bx-file-blank',
        title: 'Invoice List',
        url: { name: 'apps-invoice-list' },
      },
      {
        icon: 'bx-group',
        title: 'User List',
        url: { name: 'apps-user-list' },
      },
    ],
  },
  {
    title: 'Apps & Pages',
    content: [
      {
        icon: 'bx-calendar',
        title: 'Calendar',
        url: { name: 'apps-calendar' },
      },
      {
        icon: 'bx-file-blank',
        title: 'Invoice Add',
        url: { name: 'apps-invoice-add' },
      },
      {
        icon: 'bx-dollar',
        title: 'Pricing',
        url: { name: 'pages-pricing' },
      },
      {
        icon: 'bx-cog',
        title: 'Account Settings',
        url: {
          name: 'pages-account-settings-tab',
          params: { tab: 'account' },
        },
      },
    ],
  },
  {
    title: 'User Interface',
    content: [
      {
        icon: 'bx-text',
        title: 'Typography',
        url: { name: 'pages-typography' },
      },
      {
        icon: 'bx-square-rounded',
        title: 'Tabs',
        url: { name: 'components-tabs' },
      },
      {
        icon: 'bxs-hand-up',
        title: 'Buttons',
        url: { name: 'components-button' },
      },
      {
        icon: 'bxs-keyboard',
        title: 'Statistics',
        url: { name: 'pages-cards-card-statistics' },
      },
    ],
  },
  {
    title: 'Popular Searches',
    content: [
      {
        icon: 'bx-list-ul',
        title: 'Select',
        url: { name: 'forms-select' },
      },
      {
        icon: 'bx-check-square',
        title: 'Combobox',
        url: { name: 'forms-combobox' },
      },
      {
        icon: 'bx-calendar',
        title: 'Date & Time Picker',
        url: { name: 'forms-date-time-picker' },
      },
      {
        icon: 'bx-star',
        title: 'Rating',
        url: { name: 'forms-rating' },
      },
    ],
  },
]

// 👉 No Data suggestion
const noDataSuggestions = [
  {
    title: 'Analytics Dashboard',
    icon: 'bx-cart',
    url: { name: 'dashboards-analytics' },
  },
  {
    title: 'Account Settings',
    icon: 'bx-user',
    url: {
      name: 'pages-account-settings-tab',
      params: { tab: 'account' },
    },
  },
  {
    title: 'Pricing Page',
    icon: 'bx-dollar',
    url: { name: 'pages-pricing' },
  },
]

const searchQuery = ref('')
const searchResult = ref([])
const router = useRouter()

// 👉 fetch search result API
watchEffect(() => {
  // axios.get('/app-bar/search', { params: { q: searchQuery.value } }).then(response => {
  //   searchResult.value = response.data
  // })
})

const redirectToSuggestedOrSearchedPage = selected => {
  router.push(selected.url)
  isAppSearchBarVisible.value = false
  searchQuery.value = ''
}

const LazyAppBarSearch = defineAsyncComponent(() => import('@core/components/AppBarSearch.vue'))
</script>

<template>
  

  <!-- 👉 App Bar Search -->

</template>

<style lang="scss" scoped>
@use "@styles/variables/_vuetify.scss";

.meta-key {
  border: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 6px;
  block-size: 1.5625rem;
  line-height: 1.3125rem;
  padding-block: 0.125rem;
  padding-inline: 0.25rem;
}
</style>
