import request from '@/utils/request'
// 左侧
export function getBankNumByStartTime(query) {
    return request({
        url: '/firstPageLeft/getBankNumByStartTime',
        method: 'get',
        params: query
    })
}
export function getAreaBankNumber(query) {
    return request({
        url: '/firstPageLeft/getAreaBankNumber',
        method: 'get',
        params: query
    })
}
export function getBankNumRate(query) {
    return request({
        url: '/firstPageLeft/getBankNumRate',
        method: 'get',
        params: query
    })
}

// 右侧
export function getCompanyOverview(query) {
    return request({
        url: '/firstPageRight/getCompanyOverview',
        method: 'get',
        params: query
    })
}
export function getCompanyAccountRate(query) {
    return request({
        url: '/firstPageRight/getCompanyAccountRate',
        method: 'get',
        params: query
    })
}
// export function updateArticle(data) {
//     return request({
//         url: '/vue-element-admin/article/update',
//         method: 'post',
//         data
//     })
// }


//获取银行网点坐标

export function getBankNetwork(query) {
    return request({
        url: '/getBankNetwork',
        method: 'get',
        params: query
    })
}
