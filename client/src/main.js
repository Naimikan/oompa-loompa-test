var Home = {
  template: '<home></home>'
}

var OompaLoompa = {
  template: '<oompa-loompa></oompa-loompa>'
}

var router = new VueRouter({
  routes: [
    {
      path: '/',
      component: Home
    }, {
      path: '/:id',
      component: OompaLoompa
    }
  ]
})

var app = new Vue({
  el: '#app',
  router: router
})
