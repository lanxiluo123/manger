import request  from '@views/utils/request/index.js'

export function login(parms) {
    return request.post('/auth/login', parms)
}

export function getYanzhengma (){
    console.log('3333333333333')
    return request.get('/auth/captcha')
}