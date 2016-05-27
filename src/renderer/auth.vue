<template lang="pug">
  button(v-on:click='login', v-show='!loggedin') Login
  button(v-on:click='logout', v-show='loggedin') Logout
</template>

<script>
import { auth } from './auth';
import bus from './bus';

export default {
  data () {
    return {
      loggedin: typeof localStorage.getItem('token') === 'string'
    };
  },
  methods: {
    login () {
      auth()
        .then(token => {
          localStorage.setItem('token', JSON.stringify(token));
        })
        .then(() => {
          bus.$emit('login');
          this.loggedin = true;
        });
    },
    logout () {
      localStorage.removeItem('token');
      this.loggedin = false;
    }
  }
};
</script>
