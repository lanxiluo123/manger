import request  from '@views/utils/request/index.js'

export function login(parms) {
    return request.post('/auth/login', parms)
}

export function getYanzhengma (){
    return request.get('/auth/captcha')
}

export function getUserInfor(){
    return request.get('/auth/me')
}