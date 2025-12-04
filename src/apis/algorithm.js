import request from '@views/utils/request/index.js'

export function add(data) {
    return request.post('/algorithms', data)
}

export function deletes(data) {
    return request.delete('/algorithms', data)
}

export function getParmsType(){
    return request.get('/algorithms/param-types')
}

export function getAlgorith(){
    return request.get('/algorithms/categories')
}

export function getExecutionType(){
    return request.get('/algorithms/execution-types')
}