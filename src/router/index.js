import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/achievement'
    },
    {
      path: '/achievement',
      component: () => import('@/views/index.vue'),
      children:[
          {
            path: ':firstClassId?/:secondClassId?',
            name: 'achievement',
            component: () => import('@/views/Achievement/index.vue'),
            beforeEnter: (to, from, next) => {
              let { firstClassId, secondClassId } = to.params;

              let changeFirstClassId = false;
              let changeSecondClassId = false;

              if(!firstClassId || !Number.isInteger(Number(firstClassId))){
                firstClassId = 0
                changeFirstClassId = true
              }
              if(!secondClassId || !Number.isInteger(Number(secondClassId))){
                secondClassId = 0
                changeSecondClassId = true
              }
              // 如果参数缺失，重定向到默认值
              if (changeFirstClassId || changeSecondClassId) {
                const defaultPath = `/achievement/${firstClassId}/${secondClassId}`;
                next(defaultPath);
              } else {
                next();
              }
            },
          }
      ],
      meta: {
        title: '黎愔成就'
      }
    },
    {
      path: '/character',
      component: () => import('@/views/index.vue'),
      children:[
          {
            path: '',
            name: 'character',
            component: () => import('@/views/Character/index.vue'),
          }
      ],
      meta: {
        title: '角色列表'
      }
    },
    {
      path: '/setting',
      component: () => import('@/views/index.vue'),
      children:[
          {
            path: '',
            name: 'setting',
            component: () => import('@/views/Setting/index.vue'),
          }
      ],
      meta: {
        title: '设置'
      }
    },
  ]
})

// 设置导航栏标签名称
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || '黎愔成就';
  next();
});

export default router
