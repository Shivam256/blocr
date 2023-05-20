import React from "react";
import { useBundler } from "../context/bundlrContext";

const FundWallet = () => {
  const { fundWallet, balance } = useBundler();
  const [value, setValue] = React.useState("0.02");

  return (
    <div className="font-body flex flex-col items-center gap-5">
      <h2>Current balance : {balance || 0} $BNDLR</h2>
      <div className="w-full" >
        <input
          className="bg-transparent font-body mt-1 py-1 px-2 focus:ring-0 outline-0  text-2xl outline-none border text-black rounded-md"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <p>Minimum balance required: 0.03</p>
      </div>

      <button
        className="w-fit h-fit px-8 py-2 rounded-md bg-primary text-xl hover:shadow-lg cursor-pointer border-none outline-none "
        onClick={() => fundWallet(+value)}
      >
        Add Funds 💱
      </button>
    </div>
  );
};

export default FundWallet;
