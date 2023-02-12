import { Page } from '@/models/page';
import { Users } from '@/models/users';
import { getUsers } from '@/services/api/backend';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import useSWR, { unstable_serialize } from 'swr';

const usersCacheKeyBuilder = (page: number) => ['users', page];
const INITIAL_PAGE = 1;

const Users = () => {
    const { query } = useRouter();

    const page = Number(query?.page || INITIAL_PAGE);

    const { data: response } = useSWR(usersCacheKeyBuilder(page), () =>
        getUsers(page)
    );

    return (
        <div>
            <h1>User list</h1>
            {response && (
                <>
                    <ul>
                        {response.data.map((item) => (
                            <li key={item.id}>
                                {item.first_name} {item.last_name} -{' '}
                                {item.email}{' '}
                                <Link href={`/users/${item.id}`}> -&gt; </Link>
                            </li>
                        ))}
                    </ul>
                    <div>
                        {page > INITIAL_PAGE && (
                            <Link href={`/users?page=${page - 1}`} shallow>
                                Back page
                            </Link>
                        )}
                        {page < response?.total_pages && (
                            <Link href={`/users?page=${page + 1}`} shallow>
                                Next page
                            </Link>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

type UsersPageProps = Page<Users>;

export default function UsersPage() {
    return <Users />;
}

export const getServerSideProps: GetServerSideProps<
    UsersPageProps,
    { page: string }
> = async (ctx) => {
    const page = Number(ctx.query.page || INITIAL_PAGE);
    const data = await getUsers(page);
    return {
        props: {
            fallback: {
                [unstable_serialize(usersCacheKeyBuilder(page))]: data,
            },
        },
    };
};
