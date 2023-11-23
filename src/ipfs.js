//fonction ulise axios pour envoyer un fichier à un noeud IPFS via l'API Pinata cloud
//utilisée pour effectuer des requêtes HTTP.
import axios from 'axios';

export async function uploadFileToIPFS(file, pinatakey, pinatasecret) {
  const formData = new FormData(); //crée une instance de FormData qui permet de créer facilement des données à envoyer via une requete HTTP
  const url = "https://api.pinata.cloud/pinning/pinFileToIPFS"; // c'est l'API pinata cloud pour épingler le fichier sur IPFS

  formData.append("file", file); //le fichier est passé en tant que parametre "file" dans une instance de FromData
 //la reponse de la requete renvoyée sous forme de json.qui contient le hachage ipfs du fichier 
  const opts = JSON.stringify({
    cidVersion: 0,//clé:la version de la clé CID (content ID) qui est une clé unique pour chaque fichier stocké sur IPFS
    
  });
  formData.append('pinataOptions', opts);

  const options = {
    maxBodyLength: "Infinity",
    headers: {
      'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
      pinata_api_key: pinatakey,
      pinata_secret_api_key: pinatasecret,
      Accept: 'text/plain',
    }
  };
//envoi de la requete HTTP POST en utilusant Axios avec le fichier et les options definis
  const res = await axios.post(url, formData, options);
  //Récupérer le hachage IPFS 
  return res.data.IpfsHash;
};



export async function getFileUrlFromIPFS(hash) {
  const url = `https://gateway.ipfs.io/ipfs/${hash}`;
  return url;
}
