import Image from "next/image";
import { Inter } from "next/font/google";
import { CircularProgress } from "@nextui-org/react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div className='flex flex-col gap-2 bg-gray-200 items-center justify-center pl-20 pr-10 py-3 min-h-screen'>
      <CircularProgress label="Loading........" size="lg" />
    </div>
  );
}
