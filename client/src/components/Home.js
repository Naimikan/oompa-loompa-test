var templateString = '<div class="text-center">' +
  '<div class="text-right"><input class="search-input" type="text" placeholder="Search" v-on:keyup="magicSearch" v-model="searchQuery" ></div>' +
  '<h1>Find your Oompa Loompa</h1>' +
  '<h3>There are more than 100k</h3>' +
  '<div class="row col-lg-12 col-md-12 col-sm-12 col-xs-12">' +
    '<div v-for="oompa of oompasFiltered" class="col-lg-4 text-left">' +
      '<router-link tag="div" class="oompa-container" :to="\'/\' + oompa.id">' +
        '<img width="100%" :src="oompa.image">' +
        '<div class="oompa-info">' +
          '<h4><b>{{ oompa.first_name + " " + oompa.last_name }}</b></h4>' +
          '<h5>{{ oompa.gender }}</h5>' +
          '<em>{{ oompa.profession }}</em>' +
        '</div>' +
      '</router-link>' +
    '</div>' +
  '</div>' +
  '<infinite-loading @infinite="infiniteHandler"></infinite-loading>' +
'</div>'

Vue.component('home', {
  template: templateString,
  data: function () {
    return {
      currentPage: 1,
      oompas: [],
      oompasFiltered: [],
      searchQuery: ''
    }
  },
  methods: {
    magicSearch: function (event) {
      var self = this

      if (self.searchQuery.length > 0) {
        var regexp = new RegExp(self.searchQuery)

        self.oompasFiltered = self.oompas.filter(function (each) {
          return each.profession.match(regexp) || each.first_name.match(regexp) || each.last_name.match(regexp)
        })
      } else {
        self.oompasFiltered = self.oompas
      }
    },
    getInfo: function (page) {
      var self = this

      return new Promise(function (resolve, reject) {
        axios.get('https://2q2woep105.execute-api.eu-west-1.amazonaws.com/napptilus/oompa-loompas?page=' + page).then(function (response) {
          response.data.results = response.data.results.map(function (each) {
            if (each.gender === 'M') each.gender = 'Man'
            else each.gender = 'Woman'

            return each
          })

          resolve(response.data.results)
        }).catch(function (error) {
          reject(error)
        })
      })
    },
    infiniteHandler: function ($state) {
      var self = this

      self.getInfo(self.currentPage).then(function (info) {
        self.oompasFiltered = self.oompasFiltered.concat(info)
        self.oompas = self.oompasFiltered

        self.currentPage += 1
        $state.loaded();
      }).catch(function (error) {
        console.error(error)
      })
    }
  }
})
