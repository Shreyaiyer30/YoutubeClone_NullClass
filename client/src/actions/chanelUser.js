import * as api from "../api";


export const fetchAllChanel = () => async (dispatch) => {
    try {
        const { data } = await api.fetchAllChanel();
        dispatch({ type: 'FETCH_CHANELS', payload: data })
    } catch (error) {
        console.log(error)
    }
}
export const updateChanelDate = (id, updateData) => async (dispatch) => {
    try {
        const { data } = await api.updateChanelData(id, updateData);

        // Update localStorage to persist changes
        const currentProfile = JSON.parse(localStorage.getItem('Profile'));
        if (currentProfile) {
            const newProfile = { ...currentProfile, result: data };
            localStorage.setItem('Profile', JSON.stringify(newProfile));
        }

        dispatch({ type: 'UPDATE_DATA', payload: data })
    } catch (error) {
        console.log(error)
    }
}