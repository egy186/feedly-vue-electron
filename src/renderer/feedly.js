import queryString from 'querystring';

const endpoint = 'https://cloud.feedly.com/v3/';
const apis = {
  'markers/counts': 'get',
  markers: 'post',
  'streams/contents': 'get'
};

const feedly = class {
  constructor (option) {
    this.authorization = `${option.token_type} ${option.access_token}`;
  }
  request (path, query) {
    if (apis[path] === 'get') {
      let url = `${endpoint}${path}`;
      if (query) {
        url += `?${queryString.stringify(query)}`;
      }
      return fetch(url, {
        headers: new Headers({
          Authorization: this.authorization
        })
      }).then(res => res.json());
    } else if (apis[path] === 'post') {
      return fetch(`${endpoint}${path}`, {
        method: 'post',
        headers: new Headers({
          Authorization: this.authorization,
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify(query)
      }).then(res => res.status);
    }
    return Promise.reject(new Error(`Unknown API: ${endpoint}${path}`));
  }
};

export default feedly;
