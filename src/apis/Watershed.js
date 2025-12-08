import request from '@views/utils/request/index.js'

export function list() {
    return request.get('/watershed/tree')
}

export function add(data){
    return request.post('/watershed',data)
}

export function edit(id,data){
    return request.put(`/watershed/${id}`,data)
}
///watershed/{id}
export function deatils(id){
    return request.get(`/watershed/${id}`)
}

export function deletes(id){
    return request.delete(`/watershed/${id}`)
}
