import Footer from "./footer/footer";
import Navbar from "./navbar/navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
        rel="stylesheet"
      ></link>
      {children}
    </>
  );
}
