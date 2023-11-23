import React, { useState, useEffect } from 'react';
import { useParams ,Link} from 'react-router-dom';
import { getFileUrlFromIPFS } from '../ipfs';
import { getContractInstance } from '../contractServices';
import "../VerifyDiploma.css";

function VerifyDiploma() {
  const [get, setGet] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  //récupérer l'id depuis la requete
  const { id } = useParams();

  useEffect(() => {
    async function fetchData() {
      const contract = await getContractInstance();
      //appel de la fonction getDiplomaBuId qui recupère les informations des etudiants depuis l'id de l'url
      const response = await contract.instance.methods.getDiplomaById(id).call();
      const defaultAccount = response.from;
      console.log("Default Account:", defaultAccount);
      //récupérer le hash de diplome 
      const imageUrl = await getFileUrlFromIPFS(response.ipfsHash);
      setGet(response);
      setImageUrl(imageUrl);
    }

    if (id !== '') {
      fetchData();
    } else {
      console.log('Diploma not registered');
    }
  }, [id]);

  if (!get) {
    return <div>Loading...</div>;
  }

  return (
    <div className="verify-diploma-container">
      <h1>Diploma Verification</h1>
      <div className="content-container">
        <div className="table-container">
      <table>
        <tbody>
        <tr>
            <td><strong>Institute</strong></td>
            <td>{get.institutename}</td>
          </tr>
          <tr>
            <td><strong>Name</strong></td>
            <td>{get.name}</td>
          </tr>
          <tr>
            <td><strong>Department</strong></td>
            <td>{get.department}</td>
          </tr>
          <tr>
            <td><strong>Email</strong></td>
            <td>{get.email}</td>
          </tr>
          <tr>
            <td><strong>dateOfBirth</strong></td>
            <td>{get.dateOfBirth}</td>
          </tr>
          <tr>
            <td><strong>mention</strong></td>
            <td>{get.mention}</td>
          </tr>
          <tr>
            <td><strong>dateRemiseDiplome</strong></td>
            <td>{get.dateRemiseDiplome}</td>
          </tr>
          <tr>
            <td><strong>CIN</strong></td>
            <td>{get.numCIN}</td>
          </tr>
        </tbody>
      </table>
      </div>
      <div className="image-container">
      {imageUrl && <img src={imageUrl} alt="Diploma" />}
      </div>
      <div className="home-button-container">
          <Link to="/" className="home-button">Home</Link>
      </div>
    </div>
    </div>
  );
}

export default VerifyDiploma;