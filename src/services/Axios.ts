import axios, { AxiosInstance } from 'axios';

const token = import.meta.env.VITE_TOKEN_ENV

const cryptocurrencies: AxiosInstance = axios.create({
    baseURL: 'https://api.coinranking.com',
    headers: {
        'Content-Type': 'application/json',
        'x-access-token': `${token}`
    }
})

export default cryptocurrencies;