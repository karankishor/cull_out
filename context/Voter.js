import React, { useState, useEffect } from 'react';
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";
import axios from "axios";
import { useRouter } from "next/router";

// Internal import

import { VotingAddress, VotingAddressABI } from "./constants";


const projectId = '2PizfJHh6a8khExDdTLbSQxkjlA';
const projectSecret = 'dd1b7cd8d7f51afd9931bc1f1364184f';
const auth = 'Basic ' + Buffer.from(projectId + ":" + projectSecret).toString('base64')

const client = ipfsHttpClient({
   host: 'ipfs.infura.io',
   port: 5001,
   protocol: "https",
   headers: {
      authorization: auth,
   },
});


const fetchContract = (signerOrProvider) =>
   new ethers.Contract(VotingAddress, VotingAddressABI, signerOrProvider);

export const VotingContext = React.createContext();

export const VotingProvider = ({ children }) => {
   const votingTitle = 'My first smart contract app';
   const router = useRouter();
   const [currentAccount, setCurrentAccount] = useState('');
   const [candidateLength, setCandidateLength] = useState('');
   const pushCandidate = [];
   const candidateIndex = [];
   const [candidateArray, setCandidateArray] = useState(pushCandidate)

   // ..........END OF CANDIDATE DATA......... 

   const [error, setError] = useState('');
   const higestVote = [];


   //>>>>>>>>Voter Section

   const pushVoter = [];
   const [voterArray, setVoterArray] = useState(pushVoter);
   const [voterLength, setVoterLength] = useState('');
   const [voterAddress, setVoterAddress] = useState([]);

  

   ///=======Connecting to Metamask.......

   const checkIfWalletIsConnected = async () => {
      if (!window.ethereum) return setError("Please Install MetaMask");

      const account = await window.ethereum.request({ method: "eth_accounts" });

      if (account.length) {
         setCurrentAccount(account[0]);
      } else {
         setError("Please Install MetaMask & Connect, Reload");
      }
   };

   //---- CONNECT WALLET
   const connectWallet = async () => {
      if (!window.ethereum) return setError("Please Install MetaMask ");

      const account = await window.ethereum.request({
         method: "eth_requestAccounts",
      });

      setCurrentAccount(account[0])
   };

   //  /--- UPLOAD TO IPFS VOTER IMAGE;

   const uploadToIPFS = async (file) => {
      try {
         const added = await client.add({ content: file });
         // const added = await client.add(file);

         const url = `https://cullout.infura-ipfs.io/ipfs/${added.cid.toString()}`;

         return url;
      } catch (error) {
         setError("Error Uploading file to IPFS")
      }
   };

     //  /--- UPLOAD TO IPFS candidate IMAGE;

     const uploadToIPFSCandidate = async (file) => {
      try {
         const added = await client.add({ content: file });
         // const added = await client.add(file);

         const url = `https://cullout.infura-ipfs.io/ipfs/${added.cid.toString()}`;

         return url;
      } catch (error) {
         setError("Error Uploading file to IPFS")
      }
   };






   /// -----------Create Voter

   const createVoter = async (formInput, fileUrl, router) => {
      try {
         const { name, address, position } = formInput;

         if (!name || !address || !position)
            return setError("Input data is missing");

         // Connecting smart Contract..........
         const web3Modal = new Web3Modal();
         const connection = await web3Modal.connect();
         const provider = new ethers.providers.Web3Provider(connection);
         const signer = provider.getSigner();
         const contract = fetchContract(signer);


         const data = JSON.stringify({ name, address, position, image: fileUrl });
         const added = await client.add(data);

         const url = `https://cullout.infura-ipfs.io/ipfs/${added.cid.toString()}`;

         const voter = await contract.voterRight(address, name, url, fileUrl);
         voter.wait()

         router.push("/voterList");
      } catch (error) {
         setError("Something wrong  creating voter");
      }
   };


   /// -----------  GET Voter Data

   const getAllVoterData = async () => {

      try {

         // Connecting smart Contract..........
         const web3Modal = new Web3Modal();
         const connection = await web3Modal.connect();
         const provider = new ethers.providers.Web3Provider(connection);
         const signer = provider.getSigner();
         const contract = fetchContract(signer);

         /// VOTER LIST
         const voterListData = await contract.getVoterList();
         setVoterAddress(voterListData);

         voterListData.map(async (el) => {
            const singleVoterData = await contract.getVoterdata(el);
            pushVoter.push(singleVoterData);

         });

         // VOTER LENGTH

         const voterList = await contract.getVoterLength();
         setVoterLength(voterList.toNumber());

      } catch (error) {
         setError("Something went wrong fetching data");
      }

   };

   useEffect(() => {
      getAllVoterData();
   }, []);

   /// ======= GIVE VOTE
   const giveVote = async(id) => {
      try {
         const voterAddress = id.address;
         const voterId= id.id;
         // Connecting smart Contract..........
         const web3Modal = new Web3Modal();
         const connection = await web3Modal.connect();
         const provider = new ethers.providers.Web3Provider(connection);
         const signer = provider.getSigner();
         const contract = fetchContract(signer);
         const voteredList = await contract.vote();
         console.log(voteredList);
         
      }catch(error){
         console.log(error);
      }
   }

   //-------- CANDIDATE SECTION------------------

   const setCandidate = async (candidateForm, fileUrl, router) => {
      try {
         const { name, address, age } = candidateForm;

         if (!name || !address || !age) return setError("Input data is missing");

         console.log(name, address, age, fileUrl);

         // Connecting smart Contract..........
         const web3Modal = new Web3Modal();
         const connection = await web3Modal.connect();
         const provider = new ethers.providers.Web3Provider(connection);
         const signer = provider.getSigner();
         const contract = fetchContract(signer);


         const data = JSON.stringify({ name, address, image: fileUrl, age });
         const added = await client.add(data);

         const ipfs = `https://cullout.infura-ipfs.io/ipfs/${added.cid.toString()}`;

         const candidate = await contract.setCandidate(
            address,
            age,
            name,
            fileUrl,
            ipfs
            );
         candidate.wait()
         console.log(candidate);

         // router.push("/voterList");
      } catch (error) {
         setError("Something wrong  creating voter");
      }
   };

   /// ------ GET Candidate Data

   const getNewCandidate = async() => {
      try{
          // Connecting smart Contract..........
          const web3Modal = new Web3Modal();
          const connection = await web3Modal.connect();
          const provider = new ethers.providers.Web3Provider(connection);
          const signer = provider.getSigner();
          const contract = fetchContract(signer);

          ////// --------ALL Candidate 

          const allCandidate = await contract.getCandidate();
           
          allCandidate.map(async(el)=>{
            const singleCandidateData = await contract.getCandidatedata(el);
            pushCandidate.push(singleCandidateData);
            candidateIndex.push(singleCandidateData[2].toNumber());
         });
             

          /// --------- Candidate Length

          const allCandidateLength = await contract.getCandidateLength();
          setCandidateLength(allCandidateLength.toNumber());
      } catch(error){
         console.log(error);
      }
   }

   useEffect(()=> {
      getNewCandidate()
   }, []);

   return (
      <VotingContext.Provider
         value={{
            votingTitle,
            checkIfWalletIsConnected,
            connectWallet,
            uploadToIPFS,
            createVoter,
            getAllVoterData,
            giveVote,
            setCandidate,
            getNewCandidate,
            error,
            voterArray,
            voterLength,
            voterAddress,
            currentAccount,
            candidateLength,
            candidateArray,
            uploadToIPFSCandidate,
         }}>
         {children}
      </VotingContext.Provider>
   );
};


