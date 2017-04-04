const initialState = {
    isFetching: false,
    error: false,
    queryParams:{
        startDate: new Date().toLocaleDateString(),
        boroughSelected: [],
        dueDate: new Date().toLocaleDateString(),
    },
    fetchingBoroughList: false,
    willEmpty: false,
    showFilterResults: false,
    showStatistics: false,
    distanceFilterRadius: 0,
    data: [],
    filteredData: []
}


function mapAppReducer(state=initialState, action) {
    let newState;
    switch (action.type) {
        case 'QUERY_REQUEST':
            return Object.assign({}, state, {
                isFetching: true,
                queryParams: action.queryParams,
                error: false
            });
        case 'QUERY_SUCCESS':
            return Object.assign({}, state, {
                isFetching: false,
                data: action.data,
                willEmpty: false
            });
        case 'QUERY_FAIL':
            return Object.assign({}, state, {
                isFetching: false,
                error: true
            });
        case 'EMPTY_DATA':
            newState = Object.assign({}, state, {
                willEmpty: true
            });
            newState.data = [];
            return newState;
        case 'SET_QUERY_PARAMS':
            newState = Object.assign({}, state);
            newState.queryParams = action.queryParams;
            return newState
        case 'SET_FILTER_RADIUS':
            return Object.assign({}, state, {
                distanceFilterRadius: action.distanceFilterRadius,
                willEmpty: true
            });
        case 'FILTER_DATA':
            return Object.assign({}, state, {
                showFilterResults: true 
            });
        case 'FILTER_SUCCESS':
            newState = Object.assign({}, state, {
                willEmpty: false,
            });
            newState.filteredData = action.filteredData;
            return newState;
        case 'FILTER_FAIL':
            newState = Object.assign({}, state, {
                showFilterResults: true
            })
            newState.filteredData = [];
            return newState;
        case 'CANCEL_FILTER':
            newState = Object.assign({}, state, {
                showFilterResults: false,
                willEmpty: true
            });
            newState.filteredData = [];
            return newState;
        default:
            return state
    }
}

export default mapAppReducer;