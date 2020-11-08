import '../styles/tailwind.css'
import Head from "next/head"
import { Provider as AuthProvider } from "next-auth/client";
import { SWRConfig } from "swr"
import Nav from "../components/Nav/Nav"

function MyApp({ Component, pageProps }) {
  return(
    <>
      <Head>
        <title>Megaminer AI</title>
      </Head>
      <AuthProvider
        session={pageProps.session}
        options={{
          clientMaxAge: 604800 * 2, // Re-fetch session if cache is older than 7 days
        }}
      >
        <SWRConfig
          value={{
            refreshInterval: 0,
            fetcher: (...args) => fetch(...args).then((res) => res.json()),
          }}
        >
          <Nav />
          <Component {...pageProps} />
        </SWRConfig>
      </AuthProvider>
    </>
  ) 
}

export default MyApp
