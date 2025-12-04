import request from '@views/utils/request/index.js'

export function dataMangerLists(data) {
    return request.get('/data-types', data)
}