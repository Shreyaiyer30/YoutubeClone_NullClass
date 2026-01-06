const initialState = {
    subscriptions: [],
    subscriptionStatus: {}, // { channelId: true/false }
    loading: false,
    error: null
};

const subscriptionReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SUBSCRIBE':
            return {
                ...state,
                subscriptions: [...state.subscriptions, action.payload],
                error: null
            };

        case 'UNSUBSCRIBE':
            return {
                ...state,
                subscriptions: state.subscriptions.filter(
                    sub => sub.channelId !== action.payload.channelId
                ),
                error: null
            };

        case 'UPDATE_SUBSCRIPTION_STATUS':
            return {
                ...state,
                subscriptionStatus: {
                    ...state.subscriptionStatus,
                    [action.payload.channelId]: action.payload.isSubscribed
                }
            };

        case 'FETCH_SUBSCRIPTIONS':
            return {
                ...state,
                subscriptions: action.payload,
                loading: false,
                error: null
            };

        case 'FETCH_SUBSCRIPTIONS_REQUEST':
            return {
                ...state,
                loading: true,
                error: null
            };

        case 'FETCH_SUBSCRIPTIONS_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        default:
            return state;
    }
};

export default subscriptionReducer;