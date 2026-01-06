import * as api from '../api';

export const subscribe = (channelId) => async (dispatch) => {
    try {
        const { data } = await api.subscribeToChannel(channelId);

        if (data.success) {
            dispatch({
                type: 'SUBSCRIBE',
                payload: { channelId }
            });

            dispatch({
                type: 'UPDATE_SUBSCRIPTION_STATUS',
                payload: { channelId, isSubscribed: true }
            });
        }

        return data;
    } catch (error) {
        console.error('Subscribe action error:', error);
        return { error: error.response?.data?.message || 'Failed to subscribe' };
    }
};

export const unsubscribe = (channelId) => async (dispatch) => {
    try {
        const { data } = await api.unsubscribeFromChannel(channelId);

        if (data.success) {
            dispatch({
                type: 'UNSUBSCRIBE',
                payload: { channelId }
            });

            dispatch({
                type: 'UPDATE_SUBSCRIPTION_STATUS',
                payload: { channelId, isSubscribed: false }
            });
        }

        return data;
    } catch (error) {
        console.error('Unsubscribe action error:', error);
        return { error: error.response?.data?.message || 'Failed to unsubscribe' };
    }
};

export const checkSubscriptionStatus = (channelId) => async (dispatch) => {
    try {
        const { data } = await api.checkSubscription(channelId);

        dispatch({
            type: 'UPDATE_SUBSCRIPTION_STATUS',
            payload: { channelId, isSubscribed: data.isSubscribed }
        });

        return data;
    } catch (error) {
        console.error('Check subscription error:', error);
        return { error: error.response?.data?.message || 'Failed to check subscription' };
    }
};

export const fetchSubscriptions = () => async (dispatch) => {
    try {
        const { data } = await api.getMySubscriptions();

        if (data.success) {
            dispatch({
                type: 'FETCH_SUBSCRIPTIONS',
                payload: data.subscriptions
            });
        }

        return data;
    } catch (error) {
        console.error('Fetch subscriptions error:', error);
        return { error: error.response?.data?.message || 'Failed to fetch subscriptions' };
    }
};