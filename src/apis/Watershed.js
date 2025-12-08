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