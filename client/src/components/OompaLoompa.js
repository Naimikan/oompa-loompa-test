var templateString = '<div>' +
  '<div class="row">' +
    '<div class="col-lg-8 col-md-8 col-sm-8 col-xs-8">' +
      '<img width="100%" :src="oompa.image">' +
    '</div>' +
    '<div class="col-lg-4 col-md-4 col-sm-4 col-xs-4">' +
      '<h4><b>{{ oompa.first_name + " " + oompa.last_name }}</b></h4>' +
      '<h5>{{ oompa.gender }}</h5>' +
      '<em>{{ oompa.profession }}</em>' +
      '<p>' +
        '<h5 v-html="oompa.description"></h5>' +
      '</p>' +
    '</div>' +
  '</div>' +
'</div>'

Vue.component('oompa-loompa', {
  template: templateString,
  data: function () {
    return {
      oompa: {},
      firstLoad: false
    }
  },
  methods: {
    checkExpiration: function () {
      var localStorageInfo = window.localStorage.getItem('oompa')

      if (localStorageInfo) {
        localStorageInfo = JSON.parse(localStorageInfo)

        var infoTime = localStorageInfo.timestamp
        var nowTime = new Date().getTime()

        return nowTime - infoTime > 1 * 24 * 60 * 60 * 1000
      } else {
        return false
      }
    },
    checkSavedOompa: function () {
      var localStorageInfo = window.localStorage.getItem('oompa')

      if (localStorageInfo) {
        localStorageInfo = JSON.parse(localStorageInfo)

        var oompaId = localStorageInfo.id

        return oompaId !== this.$route.params.id
      } else {
        return false
      }
    }
  },
  created: function () {
    var self = this

    if (self.checkExpiration() || !window.localStorage.getItem('oompa') || self.checkSavedOompa()) {
      axios.get('https://2q2woep105.execute-api.eu-west-1.amazonaws.com/napptilus/oompa-loompas/' + self.$route.params.id).then(function (response) {
        if (response.data.gender === 'M') response.data.gender = 'Man'
        else response.data.gender = 'Woman'

        if (!self.firstLoad) {
          var storageObject = {
            timestamp: new Date().getTime(),
            id: self.$route.params.id,
            value: JSON.stringify(response.data)
          }

          window.localStorage.setItem('oompa', JSON.stringify(storageObject))

          self.firstLoad = true
        }

        self.oompa = response.data
      }).catch(function (error) {
        console.error(error)
      })
    } else {
      var object = JSON.parse(window.localStorage.getItem('oompa'))

      self.oompa = JSON.parse(object.value)
    }
  }
})
