import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { SWRConfig } from 'swr';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <SWRConfig
            value={{
                revalidateIfStale: true,
                revalidateOnFocus: false,
                revalidateOnMount: false,
                revalidateOnReconnect: false,
            }}
        >
            <SWRConfig value={{ fallback: pageProps.fallback }}>
                <Component {...pageProps} />
            </SWRConfig>
        </SWRConfig>
    );
}
