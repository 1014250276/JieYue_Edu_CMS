import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * 不需要动态判断权限的路由
 * 所有用户可见
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  // {
  //   path: '/',
  //   component: Layout,
  //   redirect: '/dashboard',
  //   children: [{
  //     path: 'dashboard',
  //     name: 'Dashboard',
  //     component: () => import('@/views/dashboard/index'),
  //     meta: { title: 'Dashboard', icon: 'dashboard' }
  //   }]
  // },

  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [{
      path: 'home',
      name: 'Home',
      component: () => import('@/views/home/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },

  // {
  //   path: '/home',
  //   component: Layout,
  //   redirect: '/home',
  //   name: 'Home',
  //   meta: { title: '主页', icon: 'dashboard' },
  //   children: [{
  //     path: 'console',
  //     name: 'Console',
  //     component: () => import('@/views/home/console/index'),
  //     meta: { title: '控制台', icon: 'dashboard' }
  //   }]
  // },

  // 404 page must be placed at the end !!!
  // { path: '*', redirect: '/404', hidden: true }
]

/**
 * asyncRoutes
 */
export const asyncRoutes = [

  /**
   * 人员管理
   * **/
  {
    path: '/usermanage',
    component: Layout,
    redirect: '/usermanage',
    children: [{
      path: 'usermanage',
      name: 'Usermanage',
      component: () => import('@/views/usermanage/index'),
      meta: { title: '人员管理', icon: 'dashboard' }
    }]
  },
  /**
   * 图片管理
   * **/
  {
    path: '/picturemanage',
    component: Layout,
    redirect: '/picturemanage/picturelist',
    name: 'Picturemanage',
    meta: { title: '图片管理', icon: 'example' ,roles: ['admin', 'editor']},
    children: [
      {
        path: 'picturelist',
        name: 'Picturelist',
        component: () => import('@/views/picturemanage/picturelist/index'),
        meta: { title: '图片列表' ,roles: ['admin', 'editor']}
      },
      {
        path: 'rotationmaplist',
        name: 'Rotationmaplist',
        component: () => import('@/views/picturemanage/rotationmaplist/index'),
        meta: { title: '轮播图列表' ,roles: ['admin', 'editor']}
      }
    ]
  },
   /**
   * 内容管理
   * **/
    {
      path: '/contentmanage',
      component: Layout,
      redirect: '/contentmanage/milepostlist',
      name: 'Contentmanage',
      meta: { title: '内容管理', icon: 'example' ,roles: ['admin', 'editor']},
      children: [
        {
          path: 'milepostlist',
          name: 'Milepostlist',
          component: () => import('@/views/contentmanage/milepostlist/index'),
          meta: { title: '里程碑' ,roles: ['admin', 'editor']}
        },
        {
          path: 'articleslist',
          name: 'Articleslist',
          component: () => import('@/views/contentmanage/articleslist/index'),
          meta: { title: '发布文章' ,roles: ['admin', 'editor']}
        }
      ]
    },
 /**
   * 语言包管理
   * **/
  {
    path: '/langpackmanage',
    component: Layout,
    redirect: '/langpackmanage',
    children: [{
      path: 'langpackmanage',
      name: 'Langpackmanage',
      component: () => import('@/views/langpackmanage/index'),
      meta: { title: '语言包管理', icon: 'dashboard' }
    }]
  },

]


const createRouter = () => new Router({
  // mode: 'history', // mode默认为hash模式
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

//重置路由
//详细见链接: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
