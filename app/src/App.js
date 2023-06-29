import { Typography, TextField, Button } from "@mui/material/";
import { useState, useEffect } from "react";
import ABI from "./Asserts/ABI.json";
import { ethers } from "ethers";
function App() {
  const [amount, setAmount] = useState(0);
  const contractAddress = "0x524ACa1080e9D29d73ddB21c7cAE66f0dBff73DF";
  const [provider, setProvider] = useState(null);
  const [nUSD,setNUSD] = useState(null)
  const [eth,setETH] = useState(null)
  const handleDeposit = async () => {
    console.log(amount);
    try {
      const signer = await provider.getSigner();
      console.log(signer);
      const writeFunction = new ethers.Contract(contractAddress, ABI, signer);
      var s = parseInt(amount)/2
      toString(s)
      setAmount(s)
      const result = await writeFunction.deposit({ value: ethers.utils.parseEther(amount) });
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };
  const handleRedeem = async () => {
    console.log(amount);
    //console.log(signer);
    try {
      const signer = await provider.getSigner();
      const writeFunction = new ethers.Contract(contractAddress, ABI, signer);
      const result = await writeFunction.redeem(amount);
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };
  const connectToMetaMask = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", [0]);
      setProvider(provider);
      const signer = await provider.getSigner();
      const writeFunction = new ethers.Contract(contractAddress, ABI, signer);
      const result = await writeFunction.balanceOf(signer.getAddress());
      const balance = await provider.getBalance(signer.getAddress());
      console.log(parseInt(result))
      console.log(parseInt(balance))
      setETH(parseInt(ethers.utils.formatEther(balance)))
      setNUSD(parseInt(result))
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if(nUSD==null && eth==null){
      connectToMetaMask();
    }
    
  },[nUSD,eth]);
  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <div>
          <Typography variant="h4" gutterBottom>
            nUSD Stable Coin
          </Typography>
        </div>
        <div>
          <Button size={"large"} onClick={connectToMetaMask}>
            connect to metamask
          </Button>
        </div>
      </div>
      <div>
      <Typography variant="h6" gutterBottom>
        Balance of nUSD :{nUSD}
      </Typography>
      <Typography variant="h6" gutterBottom>
        Balance of ETH :{eth} ETH
      </Typography>
      </div>
      <div style={{ margin: "10px" }}>
        <div>
          <TextField
            type="Number"
            onChange={(e) => setAmount(e.target.value)}
            id="filled-basic"
            label="Amount of ETH to deposit/Amount nUSD to redeem ETH"
            variant="filled"
            fullWidth
          />
          <div>
            <Button
              onClick={handleDeposit}
              style={{ margin: "10px" }}
              variant="contained"
            >
              deposit
            </Button>
            <Button
              onClick={handleRedeem}
              style={{ margin: "10px" }}
              variant="contained"
            >
              redeem
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
