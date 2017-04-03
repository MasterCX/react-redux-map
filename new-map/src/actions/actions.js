import fetch from 'isomorphic-fetch';

export function requestQueryData(queryParams) {
    return {
        type: 'QUERY_REQUEST',
        queryParams: queryParams
    }
}

export function receiveQueryData(queryParams, data) {
    return {
        type: 'QUERY_SUCCESS',
        queryParams: queryParams,
        data: data
    }
}

export function queryFail() {
    return {
        type: 'QUERY_FAIL'
    }
}

export function queryData(queryParams) {
    return dispatch => {
        dispatch(emptyData());
        dispatch(requestQueryData(queryParams))
        return fetch('http://127.0.0.1:4000/queryData?boroughSelected='
                + queryParams.boroughSelected
                + '&startDate='
                + queryParams.startDate
                + '&dueDate='
                + queryParams.dueDate)
            .then(response => response.json())
            .then(json => dispatch(receiveQueryData(queryParams, json)))
            .catch(err => dispatch(queryFail()))
    }
}

export function emptyData() {
    return {
        type: 'EMPTY_DATA',
    }
}

export function setQueryParams(queryParams){
    return {
        type: 'SET_QUERY_PARAMS',
        queryParams: queryParams
    }
}

export function setFilterRadius(radius) {
    return {
        type: 'SET_FILTER_RADIUS',
        distanceFilterRadius: radius,
    }
}

export function filterData() {
    return {
        type: 'FILTER_DATA',
    }
}

export function filterSuccess() {
    return {
        type: 'FILTER_SUCCESS'
    }
}

export function cancelFilter() {
    return {
        type: 'CANCEL_FILTER'
    }
}