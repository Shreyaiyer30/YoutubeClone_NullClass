const watchLaterReducer = (state = { data: [] }, action) => {
    switch (action.type) {
        case 'POST_WATCHLATER':
            return { ...state, data: [...state.data, action?.data] };
        case 'FETCH_ALL_WATCHLATER_VIDEOS':
            return { ...state, data: action.payload };
        default:
            return state;
    }
}
export default watchLaterReducer;