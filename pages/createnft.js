import Head from "next/head";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import { Footer, FundWallet, Header } from "../components";
import { useBundler } from "../context/bundlrContext";
import ContractABI from "../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";
import { toast } from "react-toastify";
import { ethers } from "ethers";

const mainURL = `https://arweave.net/`;

const Create = () => {
  const { initialiseBundlr, bundlrInstance, balance, uploadFile, uploadURI } =
    useBundler();

  const [nftDetails, setNftDetails] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
  });

  const [file, setFile] = useState("");

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const dataRef = useRef();

  function triggerOnChange() {
    dataRef.current.click();
  }

  async function handleFileChange(e) {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;
    setNftDetails({ ...nftDetails, image: uploadedFile });
    let reader = new FileReader();
    reader.onload = function () {
      if (reader.result) {
        setFile(Buffer.from(reader.result));
      }
    };
    reader.readAsArrayBuffer(uploadedFile);
  }

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

  const handleUpload = async () => {
    const { name, description, price, image } = nftDetails;
    if (name === "") {
      toast.error("Please provide name for Project");
    } else if (description === "") {
      toast.error("Please provide description for project");
    } else if (price === "") {
      toast.error("Please provide Price");
    } else if (image === "") {
      toast.error("Please Select Image");
    } else {
      setLoading(true);
      const url = await uploadFile(file);
      uploadToArweave(url.data.id);
    }
  };

  const uploadToArweave = async (url) => {
    const { name, description } = nftDetails;

    const data = JSON.stringify({
      name,
      description,
      image: url,
    });

    const tokenURI = await uploadURI(data);

    mintNFT(tokenURI.data.id);
  };

  const mintNFT = async (tokenURI) => {
    try {
      const contract = await getContract();

      const price = ethers.utils.parseUnits(nftDetails.price, "ether");

      let listingPrice = await contract.getListingPrice();
      listingPrice = listingPrice.toString();

      let transaction = await contract.createToken(tokenURI, price, {
        value: listingPrice,
      });
      await transaction.wait();

      setLoading(false);

      setNftDetails({
        name: "",
        description: "",
        price: "",
        image: "",
      });

      setFile("");

      toast.success("Minted Successfully");

      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong", error);
      setLoading(false);
    }
  };

  if (!bundlrInstance) {
    return (
      <div className="justify-center items-center bg-white h-screen flex font-body flex-col">
        <h3 className="text-4xl font-bold sm:text-xl text-black">
          Initialize Bundlr 💱
        </h3>
        <button
          className="w-fit h-fit px-8 py-2 rounded-md bg-primary text-xl hover:shadow-lg cursor-pointer border-none outline-none "
          onClick={initialiseBundlr}
        >
          Get Started
        </button>
      </div>
    );
  }

  if (
    !balance ||
    (Number(balance) <= 0 && !balance) ||
    Number(balance) <= 0.03
  ) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-black bg-white ">
        <div className="shadow-xl p-5 px-10 rounded-xl">
          <h3 className="text-4xl font-body text-center">
            Insufficient Funds !
          </h3>
          <FundWallet />
        </div>
      </div>
    );
  }

  return (
    <div className="font-body bg-white text-black">
      <Head>
        <title>Create Project</title>
      </Head>

      <Header />

      <h1 className="text-center">Blocr - Create New Project</h1>

      <div className="relative overflow-hidden">
        <section className="max-w-[1024px] my-20 mt-0 mx-auto flex flex-row-reverse  gap-10 font-body  overflow-hidden top-7 md:gap-10 medium md:px-5 sm:grid-cols-1 sm:h-full relative ">
          <div
            className="w-full bg-primary rounded-xl sm:h-[350px] border border-solid border-primary cursor-pointer"
            onClick={triggerOnChange}
          >
            <input
              id="selectImage"
              style={{ display: "none" }}
              type="file"
              onChange={handleFileChange}
              ref={dataRef}
            />
            {nftDetails.image ? (
              <div className="w-full h-full flex justify-center items-center">
                <img
                  src={window.URL.createObjectURL(nftDetails.image)}
                  alt="image"
                  ref={nftDetails.image}
                  className="w-full h-full object-cover  sm:h-[350px] rounded-3xl p-2"
                />
              </div>
            ) : (
              <div className="h-full flex justify-center items-center">
                <h2 className="text-center text-white">
                  Project Cover Image
                </h2>
              </div>
            )}
          </div>

          <div className="w-full flex flex-col font-body gap-5">
            <div className="flex flex-col">
              <label className="text-xl my-1 font-medium ">Project Title</label>
              <input
                placeholder="John Doe"
                className="px-5 py-3 rounded-md
               placeholder:text-gray-500 outline-none border-2 border-primary text-primary bg-white placeholder:font-body font-body"
                value={nftDetails.name}
                onChange={(e) =>
                  setNftDetails({ ...nftDetails, name: e.target.value })
                }
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xl my-1 font-medium">Description</label>
              <textarea
                placeholder="Give a description to this Project"
                className="px-5 py-3 rounded-md
               placeholder:text-gray-500 outline-none border-2 border-primary text-primary bg-white placeholder:font-body font-body"
                value={nftDetails.description}
                onChange={(e) =>
                  setNftDetails({ ...nftDetails, description: e.target.value })
                }
                rows="10"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xl my-1 font-medium">Budget</label>
              <input
                type="number"
                placeholder="Enter the amount of your Project (ETH)"
                className="px-5 py-3 rounded-md
               placeholder:text-gray-500 outline-none border-2 border-primary text-primary bg-white placeholder:font-body font-body"
                value={nftDetails.price}
                onChange={(e) =>
                  setNftDetails({ ...nftDetails, price: e.target.value })
                }
              />
            </div>

            <button
              type="button"
              className="bg-primary outline-none border-none py-3 px-5 rounded-md font-body cursor-pointer transition duration-250 ease-in-out  hover:drop-shadow-xl font-semibold text-lg w-auto focus:scale-90"
              onClick={handleUpload}
              disabled={loading}
            >
              {loading ? "Please Wait..." : "Create"}
            </button>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default Create;
