import Head from 'next/head'
import { SWRConfig } from 'swr'
import { getData } from './api/getProducts'
import { Products } from '../components/products'

export default function Home({fallback}) {
  return (
    <SWRConfig value={{ fallback }}>
      <div>
        <Head>
          <title>Products app</title>
          <meta name="description" content="Just a test task" />
        </Head>
        <main>
          <Products/>
        </main>
      </div>
    </SWRConfig>
  )
}

export async function getServerSideProps(context) {
  // Fetch data from external API
  const serverData = await getData();
  // Pass data to the page via props. Used fallback to pass it as the default value for SWR. To not repeat same request 2 times.
  return {
    props: {
      fallback: {
        '/api/getProducts': serverData
      }
    }
  }
}