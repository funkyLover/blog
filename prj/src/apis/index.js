
import Vue from 'vue'

export const get = async (url, data, feedback = false) => {
  try {
    let res = await new Promise((resolve, reject) => {
      Vue.http.get(url, data).then((res) => {
        resolve(res)
      }, (err) => {
        reject(err)
      })
    })
    if (feedback) {
      return res.data
    }
    if (res.status === 200) {
      if (res.data.flag === 0) {
        return res.data
      } else {
        alert(res.data.msg)
      }
    } else {
      alert('Oops, 出错了请稍后再试')
    }
  } catch (e) {
    alert('Oops, 出错了请稍后再试')
    console.log(e)
  }
}

const BASE_URL = 'https://api.github.com'

export const GET_USER_URL = BASE_URL + '/users'
