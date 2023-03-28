import axios from './Axios';
import { Data } from '../interfaces/Data';

export const getCoinsCurrencies = async (offset: number = 0): Promise<Data> => {
    const response = await axios.get("/v2/coins?offset=" + offset);
    return response.data.data;
};

export const getSearchCoinsCurrencies = async (coin?: string): Promise<Data> => {
    const response = await axios.get("/v2/coins?search=" + coin);
    return response.data.data;
};

export const getFavoritesCoinsCurrencies = async (): Promise<Data> => {
    const response = await axios.get("/v2/coins?" + localStorage.getItem('uuid'));
    return response.data.data;
};