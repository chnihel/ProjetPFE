/*import React, { Component } from 'react';
import {Navigate } from 'react-router-dom';
import { Form, Button, Card, Message } from 'semantic-ui-react';
import { getContractInstance } from '../../../contractServices';
import web3 from 'web3'

class CheckActeur extends Component {
    state = {
        address: '',
        password: '',
        alertMessage: '',
        status: '',
        loggedIn: false
    }
    constructor(props){
      super(props);
      this.state={
        password:"",
        address:""
      };
      this.handleLoginClick = this.handleLoginClick.bind(this);
      this.checkAuthorization = this.checkAuthorization.bind(this);

    }
     checkAuthorization = async(e)=> {
      e.preventDefault(); 

     //appele de la focntion getContractInstancde d'aprés contractServices.js qui faire qui faire l'automatisation de l'adresse ethereum de deploiement
     const storageContract= await getContractInstance();   
     if (!storageContract || !storageContract.instance) {
      console.error("Erreur lors de la récupération de l'instance du contrat");
      return;}   
      // Appeler la fonction "checkAuthorization" dans le smart contract
      const isAuthorized = await storageContract.instance.methods.checkAuthorization(this.state.password).call();
      
      //type d'adresse 
      const instituteAddress = this.state.address;
      const password=this.state.password
      if (!web3.utils.isAddress(instituteAddress)) {
        console.error("Adresse invalide");
        return;
      } 
      //appeler la fonction "authorizedInstitute" dans la smart contract
      const Authorized= await storageContract.instance.methods.authorizedInstitute(instituteAddress,password).call();
      // Si l'acteur est autorisé, naviguer vers une autre interface
      if (isAuthorized){
        this.handleLoginClick("admin");
      } else if (Authorized){
        this.handleLoginClick("institute");
      }else{
        this.setState({
          alertMessage: "Unauthorized access. Please check your credentials and try again.",
          status:"failed"
        });
      }
     }
    handleLoginClick(interfaceName) {
      this.setState({loggedIn: true,interfaceName:interfaceName});
    }
    render() {
      const loggedIn=this.state.loggedIn;
      if(loggedIn){
        if(this.state.interfaceName==="admin"){
        return<Navigate to ='/admin'/>;
      }else if (this.state.interfaceName==="institute"){
        return<Navigate to= '/institute'/>;
      }else{
        return <div>Invalid interface name.</div>;
      }
      }else{
        return (
            <div className="sign-up">
                Sign in to your account
                
                <div className='signup-form'>
                    <Card fluid centered>
                        <Card.Content>
                            <Form size='large' onSubmit={this.checkAuthorization}>
                                {
                                    this.state.alertMessage !== '' && this.state.status === 'failed' ?
                                        <Message negative>
                                            {this.state.alertMessage}
                                        </Message> :
                                        this.state.alertMessage !== '' && this.state.status === 'success' ?
                                            <Message positive>
                                                {this.state.alertMessage}
                                            </Message> :
                                            console.log('')
                                }
                                <Form.Field required>
                                    <input
                                        type='text'
                                        placeholder='address'
                                        value={this.state.address}
                                        autoComplete="address"
                                        onChange={e => this.setState({ address: e.target.value })}
                                    />
                                </Form.Field>
                                <Form.Field required>
                                    <input
                                        type='password'
                                        placeholder='password'
                                        value={this.state.password}
                                        autoComplete="current-password"
                                        onChange={e => this.setState({ password: e.target.value })}
                                    />
                                </Form.Field>
                                
                                <Form.Field>
                                    <Button type='submit' primary fluid size='large' >
                                        Sign in
                                    </Button>
                                </Form.Field>

                            </Form>
                        </Card.Content>
                    </Card>
                    
                </div>
            </div>
        );
    }
}
}

export default CheckActeur*/