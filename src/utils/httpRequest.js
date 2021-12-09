import axios from 'axios'
import qs from 'qs'
import merge from 'lodash/merge'

const http = axios.create({
    timeout: 1000 * 30,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json; charset=utf-8'
    }
})


http.interceptors.request.use(config => {
    config.headers['token'] = localStorage.getItem('token')
    return config
}, error => {
    return Promise.reject(error)
})

http.interceptors.response.use(response => {
    if (response.data && response.data.code === 401) {
        console.log('need login....')
    }
    return response
}, error => {
    return Promise.reject(error)
})


http.adornUrl = (actionName) => {
    return   "http://localhost:8181/"+ actionName
}

http.adornParams = (params = {}, openDefultParams = true) => {
    var defaults = {
        't': new Date().getTime()
    }
    return openDefultParams ? merge(defaults, params) : params
}


http.adornData = (data = {}, openDefultdata = true, contentType = 'json') => {
    var defaults = {
        't': new Date().getTime()
    }
    data = openDefultdata ? merge(defaults, data) : data
    return contentType === 'json' ? JSON.stringify(data) : qs.stringify(data)
}
export default http
