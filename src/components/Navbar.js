import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
} from "react-router-dom";
import { useEffect, useState, memo } from "react";
import { useLocation } from "react-router";

function Navbar() {
  const [connected, toggleConnectFunction] = useState(false);
  const location = useLocation();
  const [currAddress, updateAddress] = useState("0x");

  async function getAddress() {
    const ethers = require("ethers");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const addr = await signer.getAddress();
    updateAddress(addr);
  }

  function updateButton() {
    toggleConnectFunction(true);
  }

  async function connectWebsite() {
    try {
      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      if (chainId !== "0xaa36a7") {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0xaa36a7" }],
        });
      }
      await window.ethereum.request({ method: "eth_requestAccounts" });
      updateButton();
      await getAddress();
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (typeof window.ethereum === "undefined") {
      alert("Install Metamask");
    } else {
      const val = window.ethereum.isConnected();
      if (val) {
        getAddress();
        toggleConnectFunction(val);
      }
      window.ethereum.on("accountsChanged", function (accounts) {
        getAddress();
      });
    }
  }, []);

  return (
    <div className="">
      <nav className="w-screen">
        <ul className="flex items-end justify-between py-3 bg-transparent text-white pr-5">
          <li className="flex items-end ml-5 pb-2">
            <Link to="/">
              {/* <img
                src={fullLogo}
                alt=""
                width={120}
                height={120}
                className="inline-block -mt-2"
              /> */}
              <div className="inline-block font-bold text-xl ml-2">
                RealEstate Marketplace
              </div>
            </Link>
          </li>
          <li className="w-2/6">
            <ul className="lg:flex justify-between font-bold mr-10 text-lg">
              <li
                className={`hover:pb-0 p-2 ${
                  location.pathname === "/" ? "border-b-2" : ""
                }`}
              >
                <Link to="/">Marketplace</Link>
              </li>
              <li
                className={`hover:pb-0 p-2 ${
                  location.pathname === "/sellNFT" ? "border-b-2" : ""
                }`}
              >
                <Link to="/sellNFT">List My NFT</Link>
              </li>
              <li
                className={`hover:pb-0 p-2 ${
                  location.pathname === "/profile" ? "border-b-2" : ""
                }`}
              >
                <Link to="/profile">Profile</Link>
              </li>
              <li>
                <button
                  className={`enableEthereumButton ${
                    connected
                      ? "bg-green-500 hover:bg-green-700"
                      : "bg-blue-500 hover:bg-blue-700"
                  } text-white font-bold py-2 px-4 rounded text-sm`}
                  onClick={connectWebsite}
                >
                  {connected ? "Connected" : "Connect Wallet"}
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
      <div className="text-white text-bold text-right mr-10 text-sm">
        {currAddress !== "0x"
          ? "Connected to"
          : "Not Connected. Please login to view Properties"}{" "}
        {currAddress !== "0x" ? currAddress.substring(0, 15) + "..." : ""}
      </div>
    </div>
  );
}

export default memo(Navbar);
