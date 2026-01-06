const currentUserReducer = (state = null, action) => {
    switch (action.type) {
        case 'FETCH_CURRENT_USER':
            return action.payload;
        case 'UPDATE_USER':
        case 'UPDATE_DATA':
            return { ...state, result: action.payload };
        case 'LOGOUT':
            return null;
        default: return state;
    }
}
export default currentUserReducer;