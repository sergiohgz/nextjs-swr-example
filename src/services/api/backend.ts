import { User, UserId, Users } from '@/models/users';
import axios, { AxiosRequestConfig } from 'axios';

const backendClient = axios.create({
    baseURL: 'https://reqres.in/api',
});

const DEFAULT_PER_PAGE = 2;

export const getUsers = (page: number): Promise<Users> => {
    const config: AxiosRequestConfig = {
        url: '/users',
        method: 'GET',
        params: {
            per_page: DEFAULT_PER_PAGE,
            page,
        },
    };
    return backendClient(config).then((response) => response.data);
};

export const getUser = (id: UserId): Promise<User> => {
    const config: AxiosRequestConfig = {
        url: `/users/${id}`,
        method: 'GET',
    };
    return backendClient(config).then((response) => response.data.data);
};
