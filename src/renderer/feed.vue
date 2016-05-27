<template lang="pug">
  button(v-on:click='sync') Sync
  p {{unreadCount}}
  article(v-for='item in contents.items', id='{{item.id}}')
    header
      h1
        a(href='{{item.originId}}', target='_blank') {{item.title}}
      button(v-on:click='markAsRead(item.id)') Mark As Read
      p
        img(v-bind:src='item.visual.edgeCacheUrl')
      div {{{item.content.content}}}
</template>

<script>
import Feedly from './feedly';
import bus from './bus';

let feedly = null;
let streamId = null;
const setVar = () => {
  const token = JSON.parse(localStorage.getItem('token'));
  feedly = new Feedly(token);
  streamId = `user/${token.id}/category/global.all`;
};
if (localStorage.getItem('token')) {
  setVar();
}
bus.$on('login', setVar);

const postMarkAsRead = entryIds => feedly.request('markers', {
  action: 'markAsRead',
  type: 'entries',
  entryIds
});
const getUnreadCounts = () => feedly.request('markers/counts', {
  streamId
}).then(result => result.unreadcounts.find(el => el.id === streamId).count);
const getUnreadContents = (count, olderFirst) => feedly.request('streams/contents', {
  count,
  ranked: olderFirst ? 'oldest' : 'newest',
  unreadOnly: true,
  streamId
});

export default {
  data () {
    return {
      unreadCount: 0,
      contents: {},
      readEntryIds: [],
      olderFirst: true
    };
  },
  methods: {
    markAsRead (id) {
      this.contents.items.splice(this.contents.items.findIndex(el => el.id === id), 1);
      this.readEntryIds.push(id);
    },
    sync () {
      let promise = Promise.resolve();
      if (this.readEntryIds.length !== 0) {
        promise = promise
          .then(() => postMarkAsRead(this.readEntryIds))
          .then(() => {
            this.readEntryIds = [];
          });
      }
      return promise
        .then(getUnreadCounts)
        .then(count => {
          this.unreadCount = count;
        })
        .then(() => getUnreadContents(this.unreadCount, this.olderFirst))
        .then(result => {
          this.contents = result;
        });
    }
  }
};
</script>
