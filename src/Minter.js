import { useEffect, useState, useRef } from "react";
import {
  connectWallet,
  getCurrentWalletConnected,
  mintNFT,
} from "./util/interact.js";

const Minter = (props) => {
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");

  const [file, setFile] = useState("");

  const [nftToMint, setNftToMint] = useState({
    name: "",
    description: "",
    image: "",
    level: 1,
    speed: 1,
    strenght: 1,
    life: 1,
  });

  const fileInput = useRef(null);

  useEffect(() => {
    async function fetchWalletData() {
      const { address, status } = await getCurrentWalletConnected();

      setWallet(address);
      setStatus(status);

      addWalletListener();
    }
    fetchWalletData();
  }, []);

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus("👆🏽 Write a message in the text-field above.");
        } else {
          setWallet("");
          setStatus("🦊 Connect to Metamask using the top right button.");
        }
      });
    } else {
      setStatus(
        <p>
          {" "}
          🦊{" "}
          <a target="_blank" href={`https://metamask.io/download.html`} rel="noreferrer">
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.
          </a>
        </p>
      );
    }
  }

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };

  const onMintPressed = async () => {
    console.log("Mint: ", nftToMint);
    const { success, status } = await mintNFT(nftToMint);
    setStatus(status);
    if (success) {
      setFile("");
      setNftToMint({
        name: "",
        description: "",
        image: "",
        level: 1,
        speed: 1,
        strenght: 1,
        life: 1,
      });
    }
  };

  const stringToInt = (statToFind) => {
    let newStat = parseInt(statToFind);
    if (newStat < 1 || isNaN(newStat))
      newStat = 1; // 1 by default
    return newStat;
  }

  const readFile = async (e) => {
    e.preventDefault();
    const reader = new FileReader();
    reader.onload = async (e) => { 
      setNftToMint({...nftToMint, image: e.target.result});
    };
    reader.readAsText(e.target.files[0]);
  }

  return (
    <div className="Minter">
      <button id="walletButton" onClick={connectWalletPressed}>
        {walletAddress.length > 0 ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>

      <br></br>
      <h1 id="title">🧙‍♂️ GearFight NFT Minter</h1>
      <p>
        Add your svg asset, name, description and stats, then press "Mint."
      </p>
      <div>
        <h2>Name: </h2>
        <input
          type="text"
          placeholder="e.g. My first NFT!"
          value={nftToMint.name}
          onChange={(event) => setNftToMint({...nftToMint, name: event.target.value})}
        />
        <h2>Description: </h2>
        <input
          type="text"
          placeholder="e.g. Even cooler than cryptokitties ;)"
          value={nftToMint.description}
          onChange={(event) => setNftToMint({...nftToMint, description: event.target.value})}
        />
        <input
          type="file"
          ref={fileInput}
          style={{ display: 'none' }}
          onChange={(e) => {setFile(e.target.files[0].name); readFile(e);}}
        />
        <h2>Image: </h2>
        <button onClick={() => fileInput.current.click()}>
          {file.length > 0 ? file : "Choose File"}
        </button>
        <h2>Stats: </h2>
        <div style={{flexDirection: "row", display: "flex"}}>
          <div style={{flexDirection: "row", display: "flex", marginRight: 30}}>
            <p>Level: </p>
            <input
              style={{maxWidth: 80}}
              type="text"
              placeholder="number"
              value={nftToMint.level}
              onChange={(event) => setNftToMint({...nftToMint, level: stringToInt(event.target.value)})}
            />
          </div>
          <div style={{flexDirection: "row", display: "flex", marginRight: 30}}>
            <p>Speed: </p>
            <input
              style={{maxWidth: 80}}
              type="text"
              placeholder="number"
              value={nftToMint.speed}
              onChange={(event) => setNftToMint({...nftToMint, speed: stringToInt(event.target.value)})}
            />
          </div>
          <div style={{flexDirection: "row", display: "flex", marginRight: 30}}>
            <p>Strenght: </p>
            <input
              style={{maxWidth: 80}}
              type="text"
              placeholder="number"
              value={nftToMint.strenght}
              onChange={(event) => setNftToMint({...nftToMint, strenght: stringToInt(event.target.value)})}
            />
          </div>
          <div style={{flexDirection: "row", display: "flex", marginRight: 30}}>
            <p>Life: </p>
            <input
              style={{maxWidth: 80}}
              type="text"
              placeholder="number"
              value={nftToMint.life}
              onChange={(event) => setNftToMint({...nftToMint, life: stringToInt(event.target.value)})}
            />
          </div>
        </div>
      </div>
      <button id="mintButton" onClick={onMintPressed}>
        Mint NFT
      </button>
      <p id="status" style={{ color: "red" }}>
        {status}
      </p>
    </div>
  );
};

export default Minter;
