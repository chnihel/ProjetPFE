
import Web3 from 'web3';
import checkActeur from './contracts/checkActeur.json'

const web3=new Web3(Web3.givenProvider);

export const getContractInstance=async() =>{
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = checkActeur.networks[networkId];
    if (!deployedNetwork){
        throw new Error (`Le smart contract n'est pas déployé sur le réseau avec l'ID ${networkId}`);
        
    }

    const contractAddress=deployedNetwork.address;
    const contractInstance = new web3.eth.Contract(checkActeur.abi,contractAddress);

    return{
        instance: contractInstance,
        
    };
};