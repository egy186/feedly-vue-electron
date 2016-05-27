import Vue from 'vue';
import auth from './auth.vue';
import feed from './feed.vue';
import windowControl from './window-control.vue';

// eslint-disable-next-line no-new
new Vue({
  el: '#body',
  components: {
    auth,
    feed,
    windowControl
  }
});
