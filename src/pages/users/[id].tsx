import { Page } from '@/models/page';
import { User, UserId } from '@/models/users';
import { getUser } from '@/services/api/backend';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import useSWR, { SWRConfig, unstable_serialize } from 'swr';

const userCacheKeyBuilder = (id: UserId) => ['api', 'user', id];

interface UserProps {
    id: UserId;
}

const User = ({ id }: UserProps) => {
    const { data: response } = useSWR(userCacheKeyBuilder(id), () =>
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

type UserPageProps = Page<User>;

export default function UserPage({ fallback }: UserPageProps) {
    const {
        query: { id },
    } = useRouter();
    return (
        <SWRConfig value={{ fallback }}>{id && <User id={+id} />}</SWRConfig>
    );
}

export const getServerSideProps: GetServerSideProps<
    UserPageProps,
    { id: string }
> = async (ctx) => {
    if (!ctx.params) {
        return { redirect: { destination: '/500', permanent: false } };
    }
    const id: UserId = +ctx.params.id;
    const data = await getUser(id);
    return {
        props: {
            fallback: {
                [unstable_serialize(userCacheKeyBuilder(id))]: data,
            },
        },
    };
};
