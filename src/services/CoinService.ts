import axios from './Axios';
import { Coin } from '../interfaces/Coins';

export const getCryptocurrencies = async (): Promise<Coin[]> => {
    const response = await axios.get("/v2/coins");
    return response.data.data.coins;
};
