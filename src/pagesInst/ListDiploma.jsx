import React, { Component } from 'react';
import SidebarInstitute from '../components/SidebarInst';
import Web3 from 'web3';
import '../ListEtudiant.css';
import '../getEtudiant.css';
import { getContractInstance } from '../contractServices';
import { getFileUrlFromIPFS } from '../ipfs';
import { Form, Card, Button, Grid, Modal } from "semantic-ui-react";


class StudentInformation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      studentList: [],
      selectedStudent: null,
      errorMessage: null,
      imageUrl: null,
      instituteInfo: {},
      showDetailsModal: false,
      showDiplomaModal: false,
      searchDepartment: ""
    };
  }
  //cycle de vie d'un composant dans React qui est appelé automatiquement une fois que le composant a été monté
  async componentDidMount() {
    const storageContract = await getContractInstance();
    if (!storageContract || !storageContract.instance) {
      console.error("Erreur lors de la récupération de l'instance du contrat");
      this.setState({ errorMessage: "Erreur lors de la récupération de l'instance du contrat" });
      return;
    }

    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();
    const accountAddress = accounts[0];

    const students = await storageContract.instance.methods
      .getStudentsForInstitute(accountAddress)
      .call({ from: accountAddress });
    

    if (!students || students.length === 0) {
      this.setState({ errorMessage: "Aucun étudiant enregistré pour cet institut" });
      return;
    }

    this.setState({
      studentList: students,
      
    });
  }
  //fonction pour afficher les details de student
  handleStudentClick = async(event, student) => {
    event.preventDefault();
  if (this.state.selectedStudent) {
    // hide the form if it's already displayed for the clicked student
    this.setState({ selectedStudent: null, imageUrl: null, showDetailsModal: false });
  } else {
    // display the form for the clicked student
    this.setState({ selectedStudent: student ,imageUrl: null, showDetailsModal: true });
  }
};
  //fonction pour affiche le diplome
  viewDiploma = async (ipfsHash) => {
    const diplomaUrl = await getFileUrlFromIPFS(ipfsHash);
    this.setState({imageUrl: diplomaUrl, showDiplomaModal: true});
  };
  handleSearchDepartmentChange = (e) => {
    this.setState({ searchDepartment: e.target.value });
  };

  render() {
    const { studentList, selectedStudent, imageUrl, showDetailsModal, showDiplomaModal ,searchDepartment} = this.state;
    const style={
      paddingRight: '200px'
    }
    const filteredStudents = searchDepartment
  ? studentList.filter((student) => student.department.toLowerCase().includes(searchDepartment.toLowerCase()))
  : studentList;
    return (
      <div style={style}>
      <div className="sign-up">
        <SidebarInstitute />
        
        <div className="getinst">
        <input
  type="text"
  value={this.state.searchDepartment}
  onChange={this.handleSearchDepartmentChange}
  placeholder="Search by department"
  className="search-input"
/>
        <div className="table-wrapper">
        
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Department</th>
          <th>Details</th>
          <th>Diploma</th>
        </tr>
      </thead>
      <tbody>
        {filteredStudents.map((student) => (
          <tr key={student.numCIN}>
            <td>{student.name}</td>
            <td>{student.department}</td>
            <td>
              <button onClick={(e) => this.handleStudentClick(e, student)}>View Details</button>
            </td>
            <td>
              <button onClick={() => this.viewDiploma(student.ipfsHash)}>View Diploma</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
          {selectedStudent && (
            <Modal open={showDetailsModal} onClose={() => this.setState({ showDetailsModal: false })}>
              <Modal.Header>Student Details</Modal.Header>
              <Modal.Content>
                <Card fluid centered>
                  <Card.Content>
                    <Form size="large" className="list-diploma-form">
                    <div>
                        <label><strong>Name</strong></label>
                        <input type="text" value={selectedStudent.name} readOnly />
                      </div>
                      <div>
                        <label><strong>Email</strong></label>
                        <input type="text" value={selectedStudent.email} readOnly />
                      </div>
                      <div>
                        <label><strong>Department</strong></label>
                        <input type="text" value={selectedStudent.department} readOnly />
                      </div>
                      
                      <div>
                        <label><strong>Date of birth</strong></label>
                        <input type="text" value={selectedStudent.dateOfBirth} readOnly />
                      </div>
                      <div>
                        <label><strong>Mention</strong></label>
                        <input type="text" value={selectedStudent.mention} readOnly />
                      </div>
                      <div>
                        <label><strong>Graduation date</strong></label>
                        <input type="text" value={selectedStudent.dateRemiseDiplome} readOnly />
                      </div>
                      <div>
                        <label><strong>CIN</strong></label>
                        <input type="text" value={selectedStudent.numCIN} readOnly />
                      </div>
                      <div>
                        <label><strong>Id</strong></label>
                        <input type="text" value={selectedStudent.id} readOnly />
                      </div>
                      <div>
                        <label><strong>IPFS</strong></label>
                        <input type="text" value={selectedStudent.ipfsHash} readOnly />
                      </div>
                    </Form>
                  </Card.Content>
                </Card>
              </Modal.Content>
              <Modal.Actions>
                <Button onClick={() => this.setState({ showDetailsModal: false })}>Close</Button>
              </Modal.Actions>
            </Modal>
          )}
          {imageUrl && (
            <Modal open={showDiplomaModal} onClose={() => this.setState({ showDiplomaModal: false })}
            style={{ width: "60%", height: "70%" }}>
              <Modal.Header>Diploma</Modal.Header>
              <Modal.Content>
                <Form size="large" className="list-image-form">
                <Grid container justify="center">
                  <img src={imageUrl} alt="Diploma" className="diploma-image" />
                </Grid>
                </Form>
              </Modal.Content>
              <Modal.Actions>
                <Button onClick={() => this.setState({ showDiplomaModal: false })}>Close</Button>
              </Modal.Actions>
            </Modal>
          )}
        </div>
      </div>
      
      </div>
    );
  }
}

export default StudentInformation;