import { ethers } from "ethers";
import { useEffect, useState } from "react";
import deploy from "./deploy";
import axios from "axios";
import Escrowhead from "./artifacts/contracts/Escrow.sol/Escrow";

const provider = new ethers.providers.Web3Provider(window.ethereum);

export async function approve(escrowContract, signer) {
  const approveTxn = await escrowContract.connect(signer).approve();
  await approveTxn.wait();
}

function App() {
  const [escrows, setEscrows] = useState([]);
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState();
  const [isApproved, setIsApproved] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:8080/")
      .then((response) => {
        setEscrows(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  });

  useEffect(() => {
    async function getAccounts() {
      const accounts = await provider.send("eth_requestAccounts", []);

      setAccount(accounts[0]);
      setSigner(provider.getSigner());
    }

    getAccounts();
  }, [account]);

  async function approveContract(index) {
    const escrowContract = await new ethers.Contract(
      escrows[index].contractAddress,
      Escrowhead.abi,
      signer
    );
    console.log(escrowContract.address);
    try {
      const approvedContract = await escrowContract.approve();
      await approvedContract.wait(1);
      setIsApproved(true);

      axios
        .put("http://localhost:8080/", {
          contractAddress: escrowContract.address,
        })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
    } catch (e) {
      console.log(e);
      console.log(signer);
    }
  }

  async function newContract() {
    const beneficiary = document.getElementById("beneficiary").value;
    const arbiter = document.getElementById("arbiter").value;
    const value = ethers.utils.parseEther(
      document.getElementById("ether").value
    );
    const escrowContract = await deploy(signer, arbiter, beneficiary, value);
    await escrowContract.deployed();
    console.log("contract address : ", escrowContract.address);

    axios
      .post("http://localhost:8080/", {
        arbiter: arbiter,
        contractAddress: escrowContract.address,
        beneficiary: beneficiary,
        value: Number(value),
        isApproved: false,
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  return (
    <div className="escrow">
      <div className="container">
        <div className="contract">
          <h1> New Contract </h1>
          <label>
            Arbiter Address
            <input type="text" id="arbiter" />
          </label>

          <label>
            Beneficiary Address
            <input type="text" id="beneficiary" />
          </label>

          <label>
            Deposit Amount (in Ether)
            <input type="text" id="ether" />
          </label>

          <div
            className="button"
            id="deploy"
            onClick={(e) => {
              e.preventDefault();

              newContract();
            }}
          >
            Deploy
          </div>
        </div>

        <div className="existing-contracts">
          <h1> Database Contracts</h1>
          {escrows.map((contract, i) => {
            return (
              <div key={i} className="existing-contract">
                <p>
                  {" "}
                  <span className="contract-info">Address: </span>{" "}
                  {contract.contractAddress}
                </p>
                <p>
                  {" "}
                  <span className="contract-info">Arbiter:</span>{" "}
                  {contract.arbiter}
                </p>
                <p>
                  <span className="contract-info">Benficiary: </span>
                  {contract.beneficiary}
                </p>
                <p>
                  {" "}
                  <span className="contract-info">Value: </span>
                  {contract.value / 1e18} ETH
                </p>
                <button
                  disabled={contract.isApproved}
                  onClick={() => approveContract(i)}
                  className="button"
                >
                  {contract.isApproved ? "✓ It's been approved!" : "Approve"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
