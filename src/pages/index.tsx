import useSWR from 'swr';

const key = 'HELLO_KEY';

const fetchHello = () => {
    if (typeof window === 'undefined') {
        return fetch('http://localhost:3000/api/hello').then((response) =>
            response.json()
        );
    }
    return fetch('http://localhost:3000/api/hello?client=1').then((response) =>
        response.json()
    );
};

const keyMessage = 'MESSAGE';
const serverMessage = 'Enable JS to see a different name and message';
const clientMessage = 'Disable JS to see a different name';

const getMessage =
    typeof window !== 'undefined' ? clientMessage : serverMessage;

export default function Home() {
    const { data } = useSWR(key, () => fetchHello(), {
        revalidateOnMount: true,
    });

    const { data: message } = useSWR(keyMessage, () => getMessage, {
        revalidateOnMount: true,
    });

    return (
        <>
            <h1>Hello {data.name}</h1>
            <section>
                <p>{message}</p>
                <p>
                    <i>
                        As data comes from SWR and initial rendered data comes
                        from fallback, it doesn&apos;t produce an error
                    </i>
                </p>
            </section>
        </>
    );
}

export const getServerSideProps = async () => {
    const value = await fetchHello();
    const message = getMessage;
    return {
        props: {
            fallback: {
                [key]: value,
                [keyMessage]: message,
            },
        },
    };
};
