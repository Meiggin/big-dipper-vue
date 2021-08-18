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
export function getBankAreaRate(query) {
    return request({
        url: '/companyOverview/getBankAreaRate',
        method: 'get',
        params: query
    })
}
export function getBankNumByType(query) {
    return request({
        url: '/firstPageLeft/getBankNumByType',
        method: 'get',
        params: query
    })
}
export function getBankNumByArea(query) {
    return request({
        url: '/firstPageLeft/getBankNumByArea',
        method: 'get',
        params: query
    })
}
export function getBankNumRateByArea(query) {
    return request({
        url: '/firstPageLeft/getBankNumRateByArea',
        method: 'get',
        params: query
    })
}

export function getBankNumByTypeAndArea(query) {
    return request({
        url: '/firstPageLeft/getBankNumByTypeAndArea',
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

export function getCompanyByRange(query) {
    return request({
        url: '/getCompanyByRange',
        method: 'get',
        params: query
    })
}
export function getBankInfo(query) {
    return request({
        url: '/getBankInfo',
        method: 'get',
        params: query
    })
}

export function getCompanyInfo(query) {
    return request({
        url: '/getCompanyInfo',
        method: 'get',
        params: query
    })
}

export function getBankData(query) {
    return request({
        url: '/getBankData',
        method: 'get',
        params: query
    })
}

export function getShareHolder(query) {
    return request({
        url: '/company/getShareHolder',
        method: 'get',
        params: query
    })
}

export function getCompanyInfoByRegNo(query) {
    return request({
        url: '/company/getCompanyInfoByRegNo',
        method: 'get',
        params: query
    })
}

export function getCompanyAnalysis(query) {
    return request({
        url: '/company/getCompanyAnalysis',
        method: 'get',
        params: query
    })
}
export function getRealTimeIndex(query) {
    return request({
        url: '/company/getRealTimeIndex',
        method: 'get',
        params: query
    })
}
export function getCompanyScore(query) {
    return request({
        url: '/company/getCompanyScore',
        method: 'get',
        params: query
    })
}
export function getCompanyItem(query) {
    return request({
        url: '/company/getCompanyItem',
        method: 'get',
        params: query
    })
}
export function getCompanyDetail(query) {
    return request({
        url: '/company/getCompanyDetail',
        method: 'get',
        params: query
    })
}
