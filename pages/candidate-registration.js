import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useRouter } from 'next/router';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';

// Internal import

import { VotingContext } from "../context/Voter";
import Style from '../styles/allowedVoters.module.css';
import images from '../assets';
import Button from '../components/Button/Button';
import Input from "../components/Input/Input";

const candidateRegistration = () => {
  const [fileUrl, setFileUrl] = useState(null);
  const [candidateForm, setcandidateForm] = useState({
    name: "",
    address: "",
    age: "",

  });

  const router = useRouter();
  const { setCandidate, uploadToIPFSCandidate, candiateArray, getNewCandidate  } = useContext(VotingContext);

  ///.........Voters Image Drop

  const onDrop = useCallback(async (acceptedFil) => {
    const url = await uploadToIPFSCandidate(acceptedFil[0]);
    setFileUrl(url);
  });

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
    maxSize: 5000000,
  });

  useEffect(()=> { 
    getNewCandidate(); 
  }, []);

  // __ JSX Part
  return (<div className={Style.createVoter}>
    <div>
      {fileUrl && (
        <div className={Style.voterInfo}>
          <img src={fileUrl} alt="Voter Image" />
          <div className={Style.voterInfo_paragraph}>
            <p>
              Name: <span>&nbps; {candidateForm.name}</span>
            </p>
            <p>
              Add: &nbps; <span>{candidateForm.address.slice(0, 20)}</span>
            </p>
            <p>
              age: &nbps; <span>{candidateForm.age}</span>
            </p>
          </div>
        </div>
      )}
      {
        !fileUrl && (
          <div className={Style.sideInfo}>
            <div className={Style.sideInfo_box}>
              <h4>Create candidate For Voting</h4>
              <p>
                Blockchain voting organizatin, provide blockchain eco system
              </p>
              <p className={Style.sideInfo_para}>
                Contract Candidate List
              </p>
            </div>
            <div className={Style.card}>
              {candiateArray.map((el,i)=> (
                  <div key={i + 1} className={Style.card_box}>
                    <div className={Style.image}>
                      <img src={el[3]} alt="Profile Photo" />
                    </div>

                    <div className={Style.card_info}>
                      <p>{el[1]} #{el[2].toNumber()}</p>
                      <p>{el[0]}</p>
                      <p>Address: {el[6].slice(0,10)}..</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )
      }
    </div>

    <div className={Style.voter}>
      <div className={Style.voter__container}>
        <h1>Create New Candidate</h1>
        <div className={Style.voter__container__box}>
          <div className={Style.voter__container__box__div}>
            <div {...getRootProps()}>
              <input {...getInputProps()} />

              <div className={Style.voter__container__box__div__info}>
                <p>Upload File: JPG, PNG, GIF, WEBM Max 10MB</p>

                <div className={Style.voter__container__box__div__image}>
                  <Image src={images.upload} width={150} height={150} objectFit='contain' alt='File upload' />
                </div>
                <p>Drag & Drop File</p>
                <p>or Browse Media on your device</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={Style.input__container}>
        <Input inputType="text"
          title="Name"
          placeholder="Voter Name"
          handleClick={(e) =>
            setcandidateForm({ ...candidateForm, name: e.target.value })} />
        <Input
          inputType="text"
          title="Address"
          placeholder="Voter Address"
          handleClick={(e) =>
            setcandidateForm({ ...candidateForm, address: e.target.value })} />
        <Input inputType="text"
          title="Position"
          placeholder="Voter Position"
          handleClick={(e) =>
            setcandidateForm({ ...candidateForm, age: e.target.value })} />

        <div className={Style.Button}>
          <Button btnName="Authorized Candidate" handleClick={() => setCandidate(candidateForm, fileUrl, router)} />
        </div>
      </div>
    </div>

    {/* ////////////////////// */}
    <div className={Style.createdVoter}>
      <div className={Style.createdVoter__info}>
        < Image src={images.creator} alt="user Profile" />
        <p>Notice For User</p>
        <p>Organizer <span>0x9399399339</span></p>
        <p>
          Only organizer of the voting contract can create voter and candidate  for voting election
        </p>
      </div>
    </div>
  </div>
  )
};

export default candidateRegistration;
