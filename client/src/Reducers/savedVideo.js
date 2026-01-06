const savedVideoReducer = (state = { data: [] }, action) => {
    switch (action.type) {
        case 'POST_SAVED_VIDEO':
            return { ...state, data: [...state.data, action?.payload] };
        case 'FETCH_ALL_SAVED_VIDEOS':
            return { ...state, data: action.payload };
        default:
            return state;
    }
}
export default savedVideoReducer;
