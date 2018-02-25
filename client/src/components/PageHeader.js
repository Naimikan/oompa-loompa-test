var templateString = '<header class="header">' +
  '<div class="header-container">' +
    '<router-link class="logo-oompa-loompa" tag="img" :to="\'/\'" width="40" src="https://s3.eu-central-1.amazonaws.com/napptilus/level-test/imgs/logo-umpa-loompa.png"></router-link> <span class="h4 title"><b>Oompa Loompa\'s Crew</b></span>' +
  '</div>'+
'</header>'

Vue.component('page-header', {
  template: templateString
})
