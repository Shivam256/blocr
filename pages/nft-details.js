import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Footer, Header } from "../components";
import { truncateEthAddress } from "../utils/truncAddress";
import ContractABI from "../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";
import { toast } from "react-toastify";
import { ethers } from "ethers";

const mainURL = `https://arweave.net/`;

const NFTDetails = () => {
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  const [addr, setAddr] = useState("");

  const [nft, setNft] = useState({
    price: "",
    tokenId: "",
    seller: "",
    owner: "",
    image: "",
    description: "",
    tokenURI: "",
  });

  useEffect(() => {
    if (!router.isReady) return;

    setNft(router?.query);

    setIsLoading(false);
  }, [router.isReady]);

  useEffect(() => {
    const addr = localStorage.getItem("walletAddress");
    setAddr(addr);
  }, []);

  const getContract = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const signer = provider.getSigner();

    let contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      ContractABI.abi,
      signer
    );
    return contract;
  };

  const buyNft = async (n) => {
    try {
      const contract = await getContract();
      const price = ethers.utils.parseUnits(n.price.toString(), "ether");
      let tx = await contract.createMarketSale(n.tokenId, { value: price });
      await tx.wait();
      toast.success(`Bought NFT🎉`);
      await router.push("/dashboard");
    } catch (error) {
      console.log(error);
      toast.error(`You Can't Buy This Look At the Price 😂 ${error}`);
    }
  };

  const reSellNFT = async (nft) => {
    // router.push(`sellnft?tokenId=${nft.tokenId}&tokenURI=${nft.tokenURI}`);
  };

  return (
    <div>
      <Head>
        <title>{nft.name} || Kittos</title>
        <link rel="shortcut icon" href="logo.png" />
      </Head>

      <Header />
      {/* <div className="bg-[#1242ef] absolute left-[-250px] top-[-210px] h-[352px] w-[652px] blur-[350px] rounded-full "></div> */}
      <div className="relative overflow-hidden bg-white text-black">
        <section className="grid grid-cols-2 max-w-[1240px] mx-auto my-2 gap-6 font-body sm:grid-cols-1 p-5 shadow-xl rounded-xl">
          <div className="p-0 sm:p-0">
            <div className="w-full h-[508px] border border-solid border-sky-500   rounded-xl ">
              <img
                src={mainURL + nft.image}
                alt={nft.name}
                className="w-full h-full rounded-xl "
              />
            </div>
          </div>
          <div className="flex flex-col justify-between">
            <div className="flex flex-col gap-1" >
              <h1>
                #{nft.tokenId} {nft.name}
              </h1>
              <p className="text-gray-500">{nft.description}</p>
              <div className="flex gap-4 items-center">
                <p>Budget:</p>
                <h2>{nft.price} ETH</h2>
              </div>
              <div>
                <p>Owner </p>
                <h2 className="my-0 ssm:text-sm text-transparent font-bold bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600">
                  {truncateEthAddress(nft.owner)}
                </h2>
              </div>

              {nft.seller.startsWith("0x0") ? null : (
                <div>
                  <p>Seller </p>
                  <h2 className="my-0 ssm:text-sm text-transparent font-bold bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600">
                    {truncateEthAddress(nft.seller)}
                  </h2>
                </div>
              )}

              <div>
                <p>Blockchain</p>
                <h2>Ethereum ⟠</h2>
              </div>
            </div>

            <button
              className="bg-primary outline-none border-none py-3 px-5 rounded-md text-xl font-semibold font-body cursor-pointer  duration-250 ease-in-out hover:transform-x-1 hover:drop-shadow-xl w-full mt-8 transition transform hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:transform-none "
              onClick={() => {
                addr === nft.owner.toLocaleLowerCase()
                  ? reSellNFT(nft)
                  : buyNft(nft);
              }}
            >
              {addr === nft.owner.toLocaleLowerCase() ? "Remove Bid" : "Bid"}
            </button>
          </div>
        </section>
        <Footer />
      </div>
    </div>
  );
};

export default NFTDetails;
