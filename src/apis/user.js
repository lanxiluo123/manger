import request from '@views/utils/request/index.js'

export function list(data) {
    return request.get('/roles', data)
}