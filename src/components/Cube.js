import React, { memo } from 'react';
import { useBox } from 'use-cannon';
import { useState } from 'react';
import * as textures from '../textures';
import Web3 from "web3";
import GodToken from "./GodToken.json";



const Cube = ({ position, texture, addCube, removeCube }) => {

  const [account,setAccount]=useState("");
  const [contract,setContract]=useState();
  const [hover, setHover] = useState(null);

  const connect = async() => {
    if (window.ethereum) {
      let web3 = new Web3(window.ethereum);
      try {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          const cntr = new web3.eth.Contract(
            GodToken,
            "0x079f567B7f1596d51e8f4D2Bc362ee0FE3bB1a0f"
            // "0x4927777Af08108e62620B052f4a8577507DB0441"
          );
          console.log(accounts)
          setAccount(account[0])
          setContract(cntr)
          console.log(cntr)
  
          // Add listeners start
          window.ethereum.on("accountsChanged", (accounts) => {
            // dispatch(updateAccount(accounts[0]));
          });
          window.ethereum.on("chainChanged", () => {
            window.location.reload();
          });
      } catch (err) {
        // dispatch(connectFailed("Something went wrong."));
      }
    } else {
      // dispatch(connectFailed("Install Metamask."));
    }
  };

  const get=async()=>{
    let web3 = new Web3(window.ethereum);
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const cntr = new web3.eth.Contract(
      GodToken,
      "0x079f567B7f1596d51e8f4D2Bc362ee0FE3bB1a0f"
    );
    console.log(contract)
    console.log(account)
    let allGods = cntr.methods.getGods().call();

    console.log(allGods); 
  }

  const change=async()=>{
    let web3 = new Web3(window.ethereum);
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const cntr = new web3.eth.Contract(
      GodToken,
      "0x079f567B7f1596d51e8f4D2Bc362ee0FE3bB1a0f"
      // "0x4927777Af08108e62620B052f4a8577507DB0441"
    );
    console.log(" abc");
    const t = await cntr.methods.levelUp(0).send({
      from: accounts[0]
    });
    console.log(t);
  }




  const [ref] = useBox(() => ({
    type: 'Static',
    position,
  }));

  const color = texture === 'glass' ? 'skyblue' : 'white';
  return (
    <mesh
      castShadow
      ref={ref}
      onPointerMove={(e) => {
        e.stopPropagation();
        setHover(Math.floor(e.faceIndex / 2));
      }}
      onPointerOut={() => {
        setHover(null);
      }}
      onClick={(e) => {
        e.stopPropagation();
        const clickedFace = Math.floor(e.faceIndex / 2);
        const { x, y, z } = ref.current.position;
        if(e.shiftKey)
        connect();

        if(e.ctrlKey)
        {
          get();
        }

        

        if (clickedFace === 0) {
          e.altKey ? removeCube(x, y, z) : addCube(x + 1, y, z);
          return;
        }
        if (clickedFace === 1) {
          e.altKey ? removeCube(x, y, z) : addCube(x - 1, y, z);
          return;
        }
        if (clickedFace === 2) {
          e.altKey ? removeCube(x, y, z) : addCube(x, y + 1, z);
          return;
        }
        if (clickedFace === 3) {
          e.altKey ? removeCube(x, y, z) : addCube(x, y - 1, z);
          return;
        }
        if (clickedFace === 4) {
          e.altKey ? removeCube(x, y, z) : addCube(x, y, z + 1);
          return;
        }
        if (clickedFace === 5) {
          e.altKey ? removeCube(x, y, z) : addCube(x, y, z - 1);
          return;
        }

        if(e.altKey){
          change();
        }
      }}
    >
        <boxBufferGeometry attach="geometry" /> <meshStandardMaterial attach="material" map={textures[texture]} color={hover!=null ? 'gray' : color} opacity={texture === 'glass' ? 0.7 : 1} transparent={true} />
    </mesh>
  );
};

function equalProps(prevProps, nextProps) {
  const equalPosition =
    prevProps.position.x === nextProps.position.x &&
    prevProps.position.y === nextProps.position.y &&
    prevProps.position.z === nextProps.position.z;

  return equalPosition && prevProps.texture === nextProps.texture;
}

export default memo(Cube, equalProps);
