import Head from "next/head";
import Image from "next/image";
import data from "../constants/mock-nft.json";
import mockartist from "../constants/mock-artist.json";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Footer, Header } from "../components";

export default function Home() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const [addr, setAddr] = useState("");

  const router = useRouter();

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Please Install MetaMask");
        return;
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setIsWalletConnected(true);
      localStorage.setItem("walletAddress", accounts[0]);
      // router.push("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    connectWallet();
    const addr = localStorage.getItem("walletAddress");
    setAddr(addr);
  }, []);

  return (
    <div className="">
      <Head>
        <title>Blocr</title>
        {/* <link rel="shortcut icon" href="logo.png" /> */}
      </Head>

      {/* <div className="font-Oxygen bg-[rgb(18, 66, 239)] absolute left-[-250px] top-[-210px] h-[352px] w-[652px] blur-[350px] rounded-full "></div> */}

      {isWalletConnected || addr ? <Header /> : null}

      <div className="relative overflow-hidden bg-white text-black">
        {/* HeroSection */}
        <section className="max-w-[1240px] my-20 mt-5 mx-auto grid grid-cols-2  gap-2 font-body h-[540px] overflow-hidden top-7 md:gap-12 medium md:px-5 sm:grid-cols-1 sm:h-full relative ">
          <div className="flex flex-col items-start justify-start h-full sm:items-center">
            <h1 className="w-full text-8xl sm:text-center font-extrabold">
              Welcome to <span className="text-primary" >Blocr</span>
            </h1>
            <p className="text-black text-xl sm:text-center">
              Blocr is the best availabel decentralized freelance and project
              marketplace. An optimal place for boht freelancers and
              Organizations
            </p>
          </div>
          <div className="w-full flex items-center justify-center p-4 pb-8">
            <div className="w-[400px] h-[500px] shadow-2xl hover:-translate-y-3 transistion-all ease-in duration-200 rounded-2xl flex flex-col p-6 sm:h-max">
              <Image
                src="/images/mock.png"
                alt="mock"
                height={352}
                width={352}
                layout="intrinsic"
              ></Image>
              <div className="">
                <h1>Ecommerce web app</h1>
                <div className="h-[56px] flex justify-between">
                  <div className="flex flex-row gap-2">
                    <img
                      src="images/mockcreator.jpg"
                      alt="creator-image"
                      className="h-[56px] w-[56px] rounded-xl"
                    />
                    <div>
                      <p className="my-1 text-base text-[#8F9CA9]">Owner </p>
                      <h4 className="my-0">0x000...0000</h4>
                    </div>
                  </div>
                  <div>
                    <p className="my-1 text-[#8F9CA9]">Budget</p>
                    <h4 className="my-0 ">4.99 ETH</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
