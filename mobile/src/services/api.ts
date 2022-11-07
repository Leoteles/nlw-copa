import axios from 'axios';

export const api = axios.create({
    //baseURL: 'http://usar o ip da maquina mesmo:3333'
    // baseURL: 'https://localhost:3333'
    baseURL: 'http://192.168.15.138:3333'
});