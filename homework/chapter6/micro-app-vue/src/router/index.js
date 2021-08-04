/*
 * @Desc: 
 * @Author: kexi
 * @Date: 2021-08-02 14:49:38
 * @LastEditors: kexi
 * @LastEditTime: 2021-08-02 15:14:46
 */
import Home from '../views/Home.vue'
import List from '../views/List.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/list',
    name: 'List',
    component: List
  }
]

export default routes
