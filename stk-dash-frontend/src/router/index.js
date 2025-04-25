import { createRouter, createWebHistory } from 'vue-router'
import StockListView from '../views/StockListView.vue'
import StockDetailView from '../views/StockDetailView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'StockListView',
      component: StockListView,
    },
    {
      path: '/stockdetail/:id',
      name: 'StockDetailView',
      component: StockDetailView,
    },
    //additional routes here
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

export default router
