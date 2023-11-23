import React, { Component } from 'react';
import SidebarAdmin from "../components/Sidebar";
import { getContractInstance } from "../contractServices";
import { getFileUrlFromIPFS } from '../ipfs';
import '../Search.css';


class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      studentCIN: '',
      searchResults: [],
      imageUrl: null,
    };
    this.handleSearch=this.handleSearch.bind(this);
  }

  handleSearch = async (e) => {
    e.preventDefault();
    const {studentCIN}=this.state;
    const contract= await getContractInstance();
    const filtre= await contract.instance.methods.getDiplomaByCin(studentCIN).call();
    const diplomaUrl = await getFileUrlFromIPFS(filtre.ipfsHash);
    if(filtre.studentCIN !==""){
    console.log("les informations",filtre);
    this.setState({ searchResults: [filtre] ,imageUrl: diplomaUrl});
    }else{
        this.setState({ searchResults: [],imageUrl: null  });
        alert("Diploma not registered");
    }
  };

  render() {
    const style={
      paddingRight: '200px'
    }
    return (
      <div style={style}>
      <div className="container">
        <SidebarAdmin />
        <div className="affiche">
        <label className="search-label"></label>
            <div className="google-search">
            
            <div className="search-field">
              <input
                type="text"
                placeholder='StudentCIN'
                value={this.state.studentCIN}
                autoComplete='StudentCIN'
                onChange={(e) => this.setState({ studentCIN: e.target.value })}
              />
            </div>
            <button className="search-button" onClick={this.handleSearch}>Rechercher</button>
          </div>
          
          {this.state.searchResults.length > 0 && (
      <div className="table-container">
        <table>
              <thead>
                <tr>
                  <th>Field Name</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
              <tr>
                  <td>Institute:</td>
                  <td>{this.state.searchResults[0].institutename}</td>
                </tr>
                <tr>
                  <td>Name:</td>
                  <td>{this.state.searchResults[0].name}</td>
                </tr>
                <tr>
                  <td>Department:</td>
                  <td>{this.state.searchResults[0].department}</td>
                </tr>
                <tr>
                  <td>Email:</td>
                  <td>{this.state.searchResults[0].email}</td>
                </tr>
                <tr>
                  <td>Date of Birth:</td>
                  <td>{this.state.searchResults[0].dateOfBirth}</td>
                </tr>
                <tr>
                  <td>Mention:</td>
                  <td>{this.state.searchResults[0].mention}</td>
                </tr>
                <tr>
                  <td>Date Remise Diplome:</td>
                  <td>{this.state.searchResults[0].dateRemiseDiplome}</td>
                </tr>
                <tr>
                  <td>CIN:</td>
                  <td>{this.state.searchResults[0].numCIN}</td>
                </tr>
              </tbody>
            </table>
      </div>
    )}
    {this.state.imageUrl && (
      <div className="image-container">
        <img src={this.state.imageUrl} alt="Diploma" />
      </div>
    )}
          </div>
          
        </div>
      </div>
      
    );
  }
}

export default Search;