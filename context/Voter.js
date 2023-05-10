import React, {useState ,useEffect} from 'react';
import Web3Modal from "web3modal";
import {ethers} from "ethers";
import {create as ipfsHttpClient } from "ipfs-http-client";
import axios from "axios";
import {useRouter} from "next/router";

// Internal import

import { VotingAddress, VotingAddressABI } from "./constants";

const client  = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

const fetchContract = (signerOrProvider) => 
new ethers.Contract(VotingAddress, VotingAddressABI, signerOrProvider);

 export const VotingContext = React.createContext();

 export const VotingProvider = ({children}) => {
   const votingTitle = 'My first smart contract app';
 const router = useRouter();
 const [currentAccount, setCurrentAccount] = useState('');
 const [candidateLength, setCandidateLength] = useState('');
 const pushCandidate = [];
 const cadidateIndex = [];
 const [candiateArray, setCandidateArray] = useState(pushCandidate)

 // ..........END OF CANDIDATE DATA......... 

 const [error, setError] = useState(''); 
 const higestVote = [];


 //>>>>>>>>Voter Section

 const pushVoter = [];
 const [voterArray, setVoterArray] = useState(pushVoter);
 const [voterLength, setVoterLength] = useState('');
 const [voterAddress, setVoterAddress] = useState([]);

 ///=======Connecting to Metamask.......

 const checkIfWalletIsConnected = async ()=>{
   if(!window.ethereum) return setError("Please Install MetaMask");

   const account = await window.ethereum.request({method:"eth_accounts"});

   if(account.length){
      setCurrentAccount(account[0]);
   }else{
      setError("Please Install MetaMask & Connect, Reload");
   }
 };

 //---- CONNECT WALLET
 const connectWallet = async() => {
   if(!window.ethereum) return setError("Please Install MetaMask ");

   const account = await window.ethereum.request({method: "eth_requestAccounts",
});
   
   setCurrentAccount(account[0])
 };

 ///--- UPLOAD TO IPFS VOTER IMAGE

 const uploadToIPFS = async(file)=>{
   try{
      const added = await client.add({content: file});

      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      return url;
   }catch(error){
      setError("Error Uploading file to IPFS")
   }
 };


   
    return( 
    <VotingContext.Provider 
    value={{
      votingTitle,
     checkIfWalletIsConnected, 
     connectWallet,
     uploadToIPFS
     }}>
      {children} 
      </VotingContext.Provider>
    );   
 };
 

