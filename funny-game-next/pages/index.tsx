import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import s from "./index.module.scss"
const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>funny game</title>
        <meta name="description" content="funny game" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${s.main} ${inter.className}`}>
      </main>
    </>
  )
}
