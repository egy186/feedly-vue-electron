import queryString from 'querystring';
import { remote } from 'electron';

const clientId = 'CLIENT_ID';
const clientSecret = 'CLIENT_SECRET';
const redirectUri = 'REDIRECT_URI';
const scope = 'SCOPE';

const tokenUrl = 'https://cloud.feedly.com/v3/auth/token';
const requestToken = option => fetch(tokenUrl, {
  method: 'post',
  body: JSON.stringify(Object.assign({
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri
  }, option))
}).then(res => res.json());

const authUrl = `https://cloud.feedly.com/v3/auth/auth?${queryString.stringify({
  client_id: clientId,
  redirect_uri: redirectUri,
  scope,
  response_type: 'code'
})}`;
export const auth = () => {
  let authWindow = new remote.BrowserWindow({
    width: 400,
    height: 650,
    show: true,
    frame: false,
    webPreferences: {
      nodeIntegration: false
    }
  });
  authWindow.loadURL(authUrl);
  authWindow.on('closed', () => {
    authWindow = null;
  });
  return new Promise((resolve, reject) => {
    authWindow.webContents.on('did-get-redirect-request', (evt, oldUrl, newUrl) => {
      if (newUrl.startsWith(redirectUri)) {
        const q = queryString.parse(newUrl.slice(newUrl.indexOf('?') + 1));
        authWindow.destroy();
        remote.session.defaultSession.clearStorageData({
          storages: ['cookies']
        }, () => {
          if (q.code) {
            resolve(requestToken({
              grant_type: 'authorization_code',
              code: q.code
            }));
          } else if (q.error) {
            reject(new Error(q.error));
          }
        });
      }
    });
  });
};

export const refresh = refreshToken => requestToken({
  grant_type: 'refresh_token',
  refresh_token: refreshToken
});

export default {
  auth,
  refresh
};
