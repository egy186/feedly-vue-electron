<template lang="pug">
  button(v-on:click='minimizeWindow') _
  button(v-on:click='maximizeWindow') o
  button(v-on:click='closeWindow') x
</template>

<script>
import { remote } from 'electron';

const closeWindow = () => remote.getCurrentWindow().close();
const maximizeWindow = () => {
  const window = remote.getCurrentWindow();
  if (window.isMaximized()) {
    window.unmaximize();
  } else {
    window.maximize();
  }
};
const minimizeWindow = () => remote.getCurrentWindow().minimize();

export default {
  methods: {
    closeWindow,
    maximizeWindow,
    minimizeWindow
  }
};
</script>
