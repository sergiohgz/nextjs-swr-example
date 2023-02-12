import { PageSSR } from '@/models/page';
import { getUsers } from '@/services/api/backend';
import {
    dehydrate,
    Hydrate,
    QueryClient,
    useQuery,
} from '@tanstack/react-query';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

const usersCacheKeyBuilder = (page: number) => ['users', page];
const INITIAL_PAGE = 1;

const Users = () => {
    const { query } = useRouter();

    const page = Number(query?.page || INITIAL_PAGE);

    const { data: response } = useQuery(usersCacheKeyBuilder(page), () =>
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

type UsersPageProps = PageSSR;

export default function UsersPage({ dehydratedState }: UsersPageProps) {
    return (
        <Hydrate state={dehydratedState}>
            <Users />
        </Hydrate>
    );
}

export const getServerSideProps: GetServerSideProps<
    PageSSR,
    { page: string }
> = async (ctx) => {
    const page = Number(ctx.query.page || INITIAL_PAGE);
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery(usersCacheKeyBuilder(page), () =>
        getUsers(page)
    );
    return {
        props: {
            dehydratedState: dehydrate(queryClient),
        },
    };
};
