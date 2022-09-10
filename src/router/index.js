import Vue from 'vue'
import VueRouter from 'vue-router'
import ChartView from '../views/ChartView.vue'
import DashboardView from '../views/DashboardView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import LogsView from '../views/LogsView.vue'
import SettingsVue from '../views/SettingsVue.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    beforeEnter : auth_check,
  },
  {
    path: '/signup',
    name: 'signup',
    component: RegisterView
  },
  {
    path: '/logs',
    name: 'logs',
    component: LogsView,
    beforeEnter : auth_check,
  },
  {
    path: '/charts',
    name: 'charts',
    component: ChartView,
    beforeEnter : auth_check,
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsVue,
    beforeEnter : auth_check,
  },

  {
    path: '/logout',
    beforeEnter(to, from, next) {
      console.log(to, from, next);
      localStorage.removeItem('token');
      window.location = "login";
    }
  },

  {
    path: '*',
    redirect: '/login'
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

function auth_check(to, from, next) {
  console.log(to, from)
  let token = localStorage.getItem("token");
  if (token == null || token == undefined) {
    window.location = "login";
  }
  else
  {
    next()
  }

}

export default router
