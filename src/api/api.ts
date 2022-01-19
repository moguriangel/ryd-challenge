import axios from 'axios'
import { GasStationListParams } from './types'
const BASE_API_URL = 'https://creativecommons.tankerkoenig.de/json'

const createAPI = (params: any) => axios.create({
  baseURL: BASE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  params
})

// const handleResponse = ({ data }) => {
//   if (!data.error_message) return data;

//   const err = new Error('ApiClientError');
//   err.type = 'ApiClientError';
//   err.response = {
//     data,
//   };
//   throw err;
// };
// export const apiGet = (url, config) => createAPI({ url, method: 'GET', ...config });
export const getGasStations = (params: GasStationListParams) =>
  createAPI(params).get(`/list.php`)