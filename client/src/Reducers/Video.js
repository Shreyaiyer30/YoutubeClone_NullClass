const initialState = {
    data: [], // Changed/Added to match Home.jsx expectation
    loading: false,
    error: null,
    lastUploadedVideo: null,
    uploadProgress: 0
};

const videoReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_ALL_VIDEOS':
            return {
                ...state,
                data: action.payload,
                loading: false
            };

        case 'ADD_VIDEO':
            return {
                ...state,
                data: [action.payload, ...state.data]
            };

        case 'UPLOAD_VIDEO_REQUEST':
            return {
                ...state,
                loading: true,
                error: null,
                uploadProgress: 0,
                lastUploadedVideo: null
            };

        case 'UPLOAD_VIDEO_SUCCESS':
            console.log("Reducer: Upload success with payload:", action.payload);
            return {
                ...state,
                loading: false,
                error: null,
                data: [action.payload, ...state.data], // Update data array
                lastUploadedVideo: action.payload,
                uploadProgress: 100
            };

        case 'UPLOAD_VIDEO_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload,
                lastUploadedVideo: null,
                uploadProgress: 0
            };

        case 'UPDATE_UPLOAD_PROGRESS':
            return {
                ...state,
                uploadProgress: action.payload
            };

        case 'CLEAR_UPLOAD_ERROR':
            return {
                ...state,
                error: null
            };

        default:
            return state;
    }
};

export default videoReducer;