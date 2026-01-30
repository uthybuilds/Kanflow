import { Navbar } from "../landing/Navbar";
import { Footer } from "../landing/Footer";

export const PageLayout = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-zinc-950 flex flex-col transition-colors duration-300">
      <Navbar />
      <main className="flex-grow pt-24">{children}</main>
      <Footer />
    </div>
  );
};
