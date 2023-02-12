import { PageSSR } from '@/models/page';
import { UserId } from '@/models/users';
import { getUser } from '@/services/api/backend';
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

const userCacheKeyBuilder = (id: UserId) => ['api', 'user', id];

interface UserProps {
    id: UserId;
}

const User = ({ id }: UserProps) => {
    const { data: response } = useQuery(userCacheKeyBuilder(id), () =>
        getUser(id)
    );

    return (
        <div>
            <p>{response?.email}</p>
            <p>
                {response?.first_name} {response?.last_name}
            </p>
            <div>
                <Link href={`/users/${id - 1}`} shallow>
                    &lt; Back
                </Link>
                --
                <Link href={`/users`}>List</Link>
                --
                <Link href={`/users/${id + 1}`} shallow>
                    Next &gt;
                </Link>
            </div>
        </div>
    );
};

export default function UserPage({ dehydratedState }: PageSSR) {
    const {
        query: { id },
    } = useRouter();
    if (!id) {
        return null;
    }

    return (
        <Hydrate state={dehydratedState}>
            <User id={+id} />
        </Hydrate>
    );
}

export const getServerSideProps: GetServerSideProps<
    PageSSR,
    { id: string }
> = async (ctx) => {
    if (!ctx.params) {
        return { redirect: { destination: '/500', permanent: false } };
    }
    const id: UserId = +ctx.params.id;
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery(userCacheKeyBuilder(id), () => getUser(id));
    return {
        props: {
            dehydratedState: dehydrate(queryClient),
        },
    };
};
