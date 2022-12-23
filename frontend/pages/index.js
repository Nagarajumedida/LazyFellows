import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'
import VideoPlayer from './components/VideoPlayer'
import Options from './components/Options'
import Notifications from './components/Notification'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <VideoPlayer/>
      <Options>
        <Notifications/>
      </Options>
    </>
  )
}
