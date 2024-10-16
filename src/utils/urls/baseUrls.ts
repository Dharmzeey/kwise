export const BASE_URL = "http://localhost:8000/v1";

// users
export const FETCH_STATES = `${BASE_URL}/base/states/`;
export const FETCH_LGAS = (state_id: string)=> `${BASE_URL}/base/lgas/?state_id=${state_id}`;