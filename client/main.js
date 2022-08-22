import { Web3Storage } from "web3.storage";
//import { token } from "./secret.json";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDA3OTVBQzczQjNBNjc0NTNjYjYyY2NhNjM0RDI0MzQ2MzZCYmJBOGMiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjExOTc4MTYwMjMsIm5hbWUiOiJBbGJlcnQifQ.m7fR9AvDpVUaCWzNS55GBSvym-v_URDpH7kfgoh1Ucg"
const web3Storage = new Web3Storage({ token });
import { abi, networks } from "../build/contracts/Test.json"
// import Web3 from "web3";
import Web3 from "web3/dist/web3.min";

var contract = "";
var userName = "";
var account = 0x0;
initWeb3();
async function upload(e) {
  userName = prompt("Enter your Name or Press Enter to Remain Anonymous");
  if (userName == "") {
    userName = "Anonymous";
  }
  console.log(contract);
  e.preventDefault();

  console.log(e.target.files);
  const file = e.target.files;
  console.log(file[0].name, account, userName);
  const result = await web3Storage.put(file);
  const link = "https://" + result + ".ipfs.dweb.link/";
  console.log(link);
  contract.methods
    .addFile(link, file[0].name, account, userName)
    .send({ from: account }, (error, result) => {
      console.log(error, result);
      window.location.reload();
    });
}

async function initWeb3() {
  if (window.ethereum) {
    await window.ethereum.enable();
    const web3 = new Web3(window.ethereum);
    var accounts = await web3.eth.getAccounts();
    var networkId = await web3.eth.net.getId();
    console.log("id = ", networkId, accounts);

    account = accounts[0];
    contract = new web3.eth.Contract(abi, networks[networkId].address);
    document.getElementById("userHash").innerText =
      account.substring(0, 6) +
      "...." +
      account.substring(account.length - 6, account.length);
    const input = document.getElementById("file");
    input.addEventListener("change", upload);

    const count = parseInt(await contract.methods.getCount().call());
    console.log(count);
    var tableHTML = "";
    for (var x = count; x >= 1; x--) {
      const DataFromBlock = await contract.methods
        .getData(parseInt(x - 1))
        .call();
      var owner = DataFromBlock.fileOwner;
      owner =
        owner.substring(0, 6) +
        "...." +
        owner.substring(owner.length - 6, owner.length);
      tableHTML +=
        "<tr><th scope='row'>" +
        x +
        "</th><td>" +
        DataFromBlock.fileName +
        "</td><td>" +
        DataFromBlock.ownerName +
        "</td><td>" +
        owner +
        "</td><td><a href=" +
        DataFromBlock.fileURL +
        " target='_blank'>View</td></tr>";
    }
    document.getElementById("tablecontent").innerHTML = tableHTML;
  } else {
    alert("No Ethereum Window Detected!!");
  }
}