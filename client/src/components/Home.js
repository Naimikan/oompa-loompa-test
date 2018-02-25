var templateString = '<div class="text-center">' +
  '<div class="text-right">' +
    '<input class="search-input" type="text" placeholder="Search" v-on:keyup="magicSearch" v-model="searchQuery" >' +
    '<img class="search-input-icon" width="20" src="https://s3.eu-central-1.amazonaws.com/napptilus/level-test/imgs/ic_search.png">' +
  '</div>' +
  '<div class="text-container">' +
    '<h1>Find your Oompa Loompa</h1>' +
    '<h2>There are more than 100k</h2>' +
  '</div>' +
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
      searchQuery: '',
      firstLoad: false
    }
  },
  methods: {
    checkExpiration: function () {
      var localStorageInfo = window.localStorage.getItem('oompas')

      if (localStorageInfo) {
        localStorageInfo = JSON.parse(localStorageInfo)

        var infoTime = localStorageInfo.timestamp
        var nowTime = new Date().getTime()

        return nowTime - infoTime > 1 * 24 * 60 * 60 * 1000
      } else {
        return false
      }
    },
    checkSavedPage: function () {
      var localStorageInfo = window.localStorage.getItem('oompas')

      if (localStorageInfo) {
        localStorageInfo = JSON.parse(localStorageInfo)

        var infoPage = localStorageInfo.page

        return infoPage !== this.currentPage
      } else {
        return false
      }
    },
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
        if (self.checkExpiration() || !window.localStorage.getItem('oompas') || self.checkSavedPage()) {
          axios.get('https://2q2woep105.execute-api.eu-west-1.amazonaws.com/napptilus/oompa-loompas?page=' + page).then(function (response) {
            response.data.results = response.data.results.map(function (each) {
              if (each.gender === 'M') each.gender = 'Man'
              else each.gender = 'Woman'

              return each
            })

            if (!self.firstLoad) {
              var storageObject = {
                timestamp: new Date().getTime(),
                page: page,
                values: JSON.stringify(response.data.results)
              }

              window.localStorage.setItem('oompas', JSON.stringify(storageObject))

              self.firstLoad = true
            }

            resolve(response.data.results)
          }).catch(function (error) {
            reject(error)
          })
        } else {
          var object = JSON.parse(window.localStorage.getItem('oompas'))

          resolve(JSON.parse(object.values))
        }
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
