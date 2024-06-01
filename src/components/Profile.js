import Navbar from "./Navbar";
import { useLocation, useParams } from "react-router-dom";
import MarketplaceJSON from "../Marketplace.json";
import axios from "axios";
import { useEffect, useState } from "react";
import NFTTile from "./NFTTile";

require("dotenv").config();

export default function Profile() {
  const [data, updateData] = useState([]);
  const [dataFetched, updateFetched] = useState(false);
  const [address, updateAddress] = useState("0x");
  const [totalPrice, updateTotalPrice] = useState("0");

  async function getNFTData() {
    const ethers = require("ethers");
    let sumPrice = 0;
    //After adding your Hardhat network to your metamask, this code will get providers and signers
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const addr = await signer.getAddress();
    updateAddress(addr);
    // console.log("From Profile : ", addr);

    //Pull the deployed contract instance
    let contract = new ethers.Contract(
      MarketplaceJSON.address,
      MarketplaceJSON.abi,
      signer
    );
    // console.log("From profile:", contract);

    //create an NFT Token
    let transaction = await contract.getMyNFTs();
    console.log("Transaction", transaction);
    let items = [];

    // for (let i = 0; i < transaction.length; i++) {
    //   let tokenURI = await contract.tokenURI(transaction[i].tokenId);
    //   console.log("Hello ", tokenURI);

    //   let meta;

    //   try {
    //     fetch(tokenURI).then(async (response) => {
    //       meta = await response.json();
    //       console.log("Dance:", meta); // Log data after it is assigned
    //     });
    //   } catch (e) {
    //     console.log("Something went wrong: ", e);
    //   }

    //   let price = ethers.utils.formatUnits(
    //     transaction[i].price.toString(),
    //     "ether"
    //   );
    //   let item = {
    //     price,
    //     tokenId: transaction[i].tokenId.toNumber(),
    //     seller: transaction[i].seller,
    //     owner: transaction[i].owner,
    //     image: meta.image,
    //     name: meta.name,
    //     description: meta.description,
    //   };
    //   sumPrice += Number(price);
    //   items.push(item);
    // }

    for (let i = 0; i < transaction.length; i++) {
      let tokenURI = await contract.tokenURI(transaction[i].tokenId);
      console.log("Hello ", tokenURI);

      let meta;

      try {
        let response = await fetch(tokenURI);
        meta = await response.json();
        console.log("Dance:", meta); // Log data after it is assigned
      } catch (e) {
        console.log("Something went wrong: ", e);
        // You might want to handle the error by assigning default values to meta
        meta = { image: "", name: "", description: "" };
      }

      let price = ethers.utils.formatUnits(
        transaction[i].price.toString(),
        "ether"
      );
      let item = {
        price,
        tokenId: transaction[i].tokenId.toNumber(),
        seller: transaction[i].seller,
        owner: transaction[i].owner,
        image: meta.image,
        name: meta.name,
        description: meta.description,
      };
      console.log("Item:", item);
      sumPrice += Number(price);
      items.push(item);
    }

    /*
     * Below function takes the metadata from tokenURI and the data returned by getMyNFTs() contract function
     * and creates an object of information that is to be displayed
     */

    // const items = await Promise.all(
    //   transaction.map(async (i) => {
    //     const tokenURI = await contract.tokenURI(i.tokenId);
    //     console.log("TokenURI", tokenURI);
    //     // const options = {
    //     //   method: "GET",
    //     //   headers: { Authorization: process.env.JWT },
    //     // };
    //     // let meta = await axios.get(tokenURI);
    //     // let response = await fetch(tokenURI);
    //     // let meta = await response.json();
    //     let meta;
    //     try {
    //       fetch(tokenURI).then(async (response) => {
    //         meta = await response.json();
    //         console.log(meta); // Log data after it is assigned
    //       });
    //     } catch (e) {
    //       console.log("Something went wrong: ", e);
    //     }

    //     // console.log(meta);
    //     // meta = meta.data;

    //     let price = ethers.utils.formatUnits(i.price.toString(), "ether");
    //     let item = {
    //       price,
    //       tokenId: i.tokenId.toNumber(),
    //       seller: i.seller,
    //       owner: i.owner,
    //       image: meta.image,
    //       name: meta.name,
    //       description: meta.description,
    //     };
    //     sumPrice += Number(price);
    //     return item;
    //   })
    // );

    updateData(items);
    updateFetched(true);
    updateAddress(addr);
    updateTotalPrice(sumPrice.toPrecision(3));
  }

  useEffect(() => {
    getNFTData();
  }, []);

  // const params = useParams();
  // const tokenId = params.tokenId;
  // if (!dataFetched) getNFTData(tokenId);
  // useEffect(() => {
  //   getNFTData(tokenId);
  // });

  return (
    <div className="profileClass" style={{ "min-height": "100vh" }}>
      {/* <Navbar></Navbar> */}
      <div className="profileClass">
        <div className="flex text-center flex-col mt-11 md:text-2xl text-white">
          <div className="mb-5">
            <h2 className="font-bold">Wallet Address</h2>
            {address}
          </div>
        </div>
        <div className="flex flex-row text-center justify-center mt-10 md:text-2xl text-white">
          <div>
            <h2 className="font-bold">No. of NFTs</h2>
            {data.length}
          </div>
          <div className="ml-20">
            <h2 className="font-bold">Total Value</h2>
            {totalPrice} ETH
          </div>
        </div>
        <div className="flex flex-col text-center items-center mt-11 text-white">
          <h2 className="font-bold">Your NFTs</h2>
          <div className="flex justify-center flex-wrap max-w-screen-xl">
            {data.map((value, index) => {
              return <NFTTile data={value} key={index}></NFTTile>;
            })}
          </div>
          <div className="mt-10 text-xl">
            {data.length == 0 ? "No Property data to display " : ""}
          </div>
        </div>
      </div>
    </div>
  );
}
