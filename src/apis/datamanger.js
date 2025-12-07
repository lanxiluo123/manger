import request from '@views/utils/request/index.js'

export function dataMangerLists(data) {
    return request.get('/data-types', data)
}

export function add(data) {
    return request.post('/data-types', data)
}

export function dataType() {
    return request.get('/data-types/codes')
}

export function fileUpdata(data) {
    return request.upload('/file/anyone/upload', data)
}


export function handlerDelete(id) {
    return request.delete(`/data-types/${id}`)
}

export function handlerEdit(id, data) {
    return request.put(`/data/manage/${id}`, data)
}