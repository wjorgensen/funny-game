// old
import Link from 'next/link';
import styles from './Home.module.css';

export default function Home() {
  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Jockey+One&display=swap');
        body {
          background-color: #011134;
          font-family: 'Jockey One', sans-serif;
        }
      `}</style>

      <nav className={styles.navbar}>
        <ul>
          <li><Link href="/" className={styles.navLink}>Home</Link></li>
          <li><Link href="/how-to-play" className={styles.navLink}>How to Play</Link></li>
          <li><Link href="/gallery" className={styles.navLink}>Gallery</Link></li>
          <li><Link href="/faqs" className={styles.navLink}>FAQs</Link></li>
          <li><Link href="/about-us" className={styles.navLink}>About Us</Link></li>
          <li><Link href="/privacy-terms" className={styles.navLink}>Privacy Terms</Link></li>
          <li><Link href="/blog" className={styles.navLink}>Blog</Link></li>
        </ul>
      </nav>

      <header className={styles.header}>
        <img src="/funny-game.png" alt="Funny Game Logo" className={styles.logo} />
        <button className={styles.playButton}>Play Me!</button>
        <p className={styles.tagline}>Unleash Your Imagination with AI-generated Art!</p>
      </header>
      
      <section className={styles.photoContainerGrid}>
        {Array.from({ length: 7 }).map((_, index) => (
          <div key={index} className="photo-container">{/* content */}</div>
        ))}
      </section>
    </>
  )
}