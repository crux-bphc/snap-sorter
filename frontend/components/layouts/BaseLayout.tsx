import { ReactNode } from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";

type Props = {
  children: ReactNode;
};

export default function BaseLayout({ children }: Props) {
  return (
    <>
      <div className="flex flex-col min-h-screen justify-between">
        <Navbar />
        {children}
        <Footer />
      </div>
    </>
  );
}
