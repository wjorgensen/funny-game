import { Inter } from 'next/font/google'
import s from "./index.module.scss"
const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <main className={`${s.main} ${inter.className}`}>
      </main>
    </>
  )
}
