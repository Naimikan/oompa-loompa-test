var templateString = '<div>' +
  '<b-alert class="text-center" :show="dismissCountDown" variant="warning" @dismissed="dismissCountDown=0" @dismiss-count-down="countDownChanged">' +
    '<p>Something went wrong: <b>{{errorMessage}}</b>. Retrying in {{dismissCountDown}} seconds...</p>' +
    '<b-progress variant="warning" :max="dismissSecs" :value="dismissCountDown" height="4px"></b-progress>' +
  '</b-alert>' +
  '<div class="row">' +
    '<div class="col-lg-8 col-md-8 col-sm-8 col-xs-8">' +
      '<img width="100%" :src="oompa.image">' +
    '</div>' +
    '<div class="col-lg-4 col-md-4 col-sm-4 col-xs-4">' +
      '<h4><b><span v-bind="oompa.first_name + \' \' + oompa.last_name"</b></h4>' +
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
      firstLoad: false,
      errorMessage: '',

      dismissSecs: 5,
      dismissCountDown: 0
    }
  },
  watch: {
    dismissCountDown: {
      handler: function (newDismissCountDown) {
        if (newDismissCountDown === 0) {
          this.getInfo(this.$route.params.id)
        }
      }
    }
  },
  methods: {
    countDownChanged: function (dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
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
    },
    getInfo: function (oompaId) {
      var self = this

      if (self.checkExpiration() || !window.localStorage.getItem('oompa') || self.checkSavedOompa()) {
        axios.get('https://2q2woep105.execute-api.eu-west-1.amazonaws.com/napptilus/oompa-loompas/' + oompaId).then(function (response) {
          if (response.data.gender === 'M') response.data.gender = 'Man'
          else response.data.gender = 'Woman'

          if (!self.firstLoad) {
            var storageObject = {
              timestamp: new Date().getTime(),
              id: oompaId,
              value: JSON.stringify(response.data)
            }

            window.localStorage.setItem('oompa', JSON.stringify(storageObject))

            self.firstLoad = true
          }

          self.oompa = response.data
        }).catch(function (error) {
          console.error(error)

          self.errorMessage = error.message
          self.dismissCountDown = self.dismissSecs
        })
      } else {
        var object = JSON.parse(window.localStorage.getItem('oompa'))

        self.oompa = JSON.parse(object.value)
      }
    }
  },
  created: function () {
    this.getInfo(this.$route.params.id)
  }
})
