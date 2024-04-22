export default [
  // { heading: 'Người dùng' },
  // {
  //   title: 'Người dùng',
  //   icon: { icon: 'bx-user' },
  //   children: [
  //     { title: 'Danh sách', to: 'apps-user-list' },
  //     // { title: 'View', to: { name: 'apps-user-view-id', params: { id: 21 } } },
  //   ],
  // },
  { heading: 'Hệ thống' },
  {
    title: 'Quản lý Events',
    icon: { icon: 'bx-file' },
    children: [
      { title: 'list', to: 'apps-events-list' },
      // { title: 'Banner', to: { name: 'apps-banner'} },
    ],
  },
  {
    title: 'Cấu hình',
    icon: { icon: 'bx-paint' },
    children: [
      { title: 'Event', to: 'apps-gptvsdfs' },
    ],
  },
  {
    title: 'Thông tin liên hệ',
    icon: { icon: 'bxs-component' },
    children: [
      { title: 'Chỉnh sửa', to: 'apps-prompt-list' },
    ],
  },

]
