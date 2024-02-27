import dynamic from "next/dynamic";
import { Inter } from "next/font/google";

const TestBlockSuite = dynamic(() => import('@/components/TestBlockSuite'), { ssr: false })

const inter = Inter({ subsets: ["latin"] });



export default function Home() {
  return (
    <TestBlockSuite />
  );
}
