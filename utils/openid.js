const STORAGE_KEYS = { OPENID: 'my_openid' }
const { get, set } = require('./storage')

function getOpenid() {
  let openid = get(STORAGE_KEYS.OPENID)
  if (!openid) {
    openid = 'dev_' + Date.now() + '_' + Math.random().toString(36).slice(2, 10)
    set(STORAGE_KEYS.OPENID, openid)
  }
  return openid
}

module.exports = { getOpenid }
