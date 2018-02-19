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
      oompa: {}
    }
  },
  created: function () {
    var self = this

    axios.get('https://2q2woep105.execute-api.eu-west-1.amazonaws.com/napptilus/oompa-loompas/' + self.$route.params.id).then(function (response) {
      if (response.data.gender === 'M') response.data.gender = 'Man'
      else response.data.gender = 'Woman'

      self.oompa = response.data
    }).catch(function (error) {
      console.error(error)
    })
  }
})
