import { List } from './list';

export type UserId = number;

export interface User {
    id: UserId;
    email: string;
    first_name: string;
    last_name: string;
    avatar: string;
}

export type Users = List<User>;
