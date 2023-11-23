import React ,{Component} from 'react';
import "../Header.css";
import { getContractInstance } from '../contractServices';
import {Navigate} from 'react-router-dom';
import { Card ,Message} from 'semantic-ui-react';
import sha256 from 'crypto-js/sha256'
import Web3 from 'web3';
import * as emailjs from "emailjs-com";


class CheckActeur extends Component{

  state = {
    address: '',
    password: '', 
    email:"",
    newPassword:'',
    newPassword1:"",
    alertMessage: '',
    status: '',
    id:"",
    passwordHash:"",
    code: "",
    enteredCode:"",
    
}
constructor(props){
  super(props);
  this.state={
  loggedIn: false,
  showLoginForm: false,
  showRegisterForm:false,
  showCodeForm: false,
  showResetPasswordForm:false,
  };
  this.checkAuthorization = this.checkAuthorization.bind(this);
  this.handleSignClick=this.handleSignClick.bind(this);
  this.handleEmailClick = this.handleEmailClick.bind(this);
  this.handleLoginClick = this.handleLoginClick.bind(this);
  this.handleRegisterClick=this.handleRegisterClick.bind(this);
  this.navigateToCode=this.navigateToCode.bind(this);
  this.handleCodeSubmit=this.handleCodeSubmit.bind(this);
  this.handleVerifyDiploma=this.handleVerifyDiploma.bind(this);
  this.handleUpdateCredentials = this.handleUpdateCredentials.bind(this);
  this.VerifyDiploma=this.VerifyDiploma.bind(this);
  this.handleRestPassword=this.handleRestPassword.bind(this);

}
/*hashPassword = (password) => {
  return sha256(password).toString();
}*/
/*hashNewPassword =(newPassword)=>{
  return sha256(newPassword).toString();
}
*/
checkAuthorization = async(e)=> {
  e.preventDefault(); 
 //appele de la focntion getContractInstancde d'aprés contractServices.js qui fait l'automatisation de l'adresse ethereum de deploiement
 const storageContract= await getContractInstance();   
 if (!storageContract || !storageContract.instance) {
  console.error("Erreur lors de la récupération de l'instance du contrat");
  return;} 
  //hacher le mot de passe avec sha256, sha256 retourne un binaire donc ce pourquoi on utlise toString pour le transforme en chaine de caractère
  const passwordHash = sha256(this.state.password).toString();
  console.log("Password hash:", passwordHash);
  //vérifier la prémire adresse de compte connectée
  const web3 = new Web3(window.ethereum);
  const accounts = await web3.eth.getAccounts();
  const accountAddress = accounts[0];   
 
  const isAuthorized = await storageContract.instance.methods.checkAuthorization(this.state.email,passwordHash).call({from:accountAddress});
  
      //type d'adresse
      /*if (!web3.utils.isAddress(instituteAddress)) {
        console.error("Adresse invalide");
        return;
      } */
  
  //appeler la fonction "authorizedInstitute" dans la smart contract
  const Authorized= await storageContract.instance.methods.authorizedInstitute(this.state.email,passwordHash).call({from:accountAddress});
  // Si l'acteur est autorisé, naviguer vers une autre interface
  if (isAuthorized){
    this.handleSignClick("admin");
  } else if (Authorized){
    this.handleSignClick("institute");
  }else{
    this.setState({
      alertMessage: "Unauthorized access. Please check your credentials and try again.",
      status:"failed"
    });
  }
 }
 //fonction pour update le mot de passe à la prémière fois
 async handleUpdateCredentials(e) {
  e.preventDefault();
  const { email, password, newPassword } = this.state;
  const hashNewPassword=sha256(newPassword).toString();
  const contract = await getContractInstance();

  try {
    // Call the updateInstituteCredentials function on the contract
    console.log("Old credentials:", email, password);
    console.log("New credentials:", hashNewPassword);
    
    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();
    const accountAddress = accounts[0];
    const newpasswordHash = sha256(this.state.newPassword).toString();

    await contract.instance.methods.updateInstituteCredentials(email,password,  newpasswordHash).send({ from: accountAddress ,
    gas:600000});
    console.log("Credentials updated successfully.");
    this.setState({
      
      password: newPassword
    });

    this.setState({ alertMessage: "Credentials updated successfully.", status: "success" });
  } catch (err) {
    console.error(err);
    this.setState({ alertMessage: "Failed to update credentials. Please try again later.", status: "failed" });
  }
}
//fonction pour verifier l'existance de diplome
async VerifyDiploma(e){
  e.preventDefault();

  const {id}=this.state;
  const contract= await getContractInstance();
  //appel de la fonction getDiplomaById de smart contract pour return le struct de stuedent
  const get=await contract.instance.methods.getDiplomaById(id).call();
  if (get.id !== "") {    
    console.log("Diploma existe", get);
    // Naviguer vers l'URL du fichier dans une nouvelle fenêtre 
    this.handleSignClick("verifier", id);
    } else {
    // Le diplôme n'existe pas, afficher un message d'erreur
    console.log("Diploma n'existe pas");
    alert("Diploma not registered");
    }
}

 handleSignClick(interfaceName, id=null) {
  this.setState({loggedIn: true,interfaceName:interfaceName,diplomaId: id});
  
}
 
handleEmailClick() {
    window.location.href = 'mailto:mahdi.ayadi@usf.tn';
}

handleLoginClick() {
   this.setState({showLoginForm:true,showRegisterForm: false,showCodeForm:false,showResetPasswordForm:false,showVerifyForm:false}) ;
}

handleRegisterClick(){
  this.setState({showRegisterForm:true});
}
//fonction pour envoyer un code à l'email
async navigateToCode(e) {
  e.preventDefault();

  const storageContract = await getContractInstance();

  if (!storageContract || !storageContract.instance) {
    console.error("Erreur lors de la récupération de l'instance du contrat");
    return;
  }

  const web3 = new Web3(window.ethereum);
  const accounts = await web3.eth.getAccounts();
  const accountAddress = accounts[0];
  const email = await storageContract.instance.methods.getEmailFromAddress().call({ from: accountAddress });

  if (!this.state.email) {
    alert("Please enter your email");
    return;
  }

  if (email === this.state.email) {
    const CODE = Math.floor(Math.random() * 9000 + 1000);
    console.log(CODE);
    //ou on peut saisie le code
    this.setState({ showCodeForm: true, code: CODE });

    const templateParams = {
      email: this.state.email,
      to_email: this.state.email ,// Utilisez l'adresse de destination récupérée à partir du champ "email" du formulaire
      message: `Your verification code is ${CODE}`
    };
      
     emailjs.send('service_6crr5no','template_r9vmkyd', templateParams, 'grBhMY8QTyNgecZ34')
        .then((result) => {
        console.log(result.text);
      }, (error) => {
        console.log(error.text);
      });
  

} else {
  alert("Please check your information.");
}
}
//fonction pour verifier le code et saisie un nouveau mot de passe
handleCodeSubmit = (event) => {
  event.preventDefault();

  const enteredCode = parseInt(this.state.enteredCode);

  if (enteredCode === this.state.code) {
      this.setState({ showCodeForm: false,showResetPasswordForm: true });
      } else {
      alert("Verification code is incorrect");
      }
}
//appel de la fonction de smart contract pour reinitialiser le mot de passe
async handleRestPassword(e){
  e.preventDefault();
  const { email, newPassword1 } = this.state;
  const hashNewPassword1=sha256(newPassword1).toString();
  const contract = await getContractInstance();

  try {
    // Call the updateInstituteCredentials function on the contract
    console.log("New credentials:", hashNewPassword1);
    
    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();
    const accountAddress = accounts[0];
    //const newPasswordString = await contract.instance.methods.getPassword(newPasswordHash).call();
    const newpasswordHash = sha256(this.state.newPassword1).toString();
    await contract.instance.methods.resetInstitutePassword(email,  newpasswordHash).send({ from: accountAddress ,
    gas:500000});
    console.log("Credentials updated successfully.");
    this.setState({
      
      password: newPassword1
    });

    this.setState({ alertMessage: "Credentials updated successfully.", status: "success" });
  } catch (err) {
    console.error(err);
    this.setState({ alertMessage: "Failed to update credentials. Please try again later.", status: "failed" });
  }
}

handleVerifyDiploma(){
  this.setState({showVerifyForm:true});
}

render() {
  const style = {
      backgroundImage: `url('/images/crns1.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: '100vh',
     
  };
  function Link({ uri, text }) {
      return <a href={uri} target="_blank" rel="noreferrer">{text}</a>;
  }
  const loggedIn=this.state.loggedIn;
  const diplomaId = this.state.diplomaId;
    if(loggedIn){
      //naviguer à l'interface admin 
      if(this.state.interfaceName==="admin"){
        return<Navigate to ='/admin'/>;
        //naviguer à l'interface institute
      }else if (this.state.interfaceName==="institute"){
        return<Navigate to= '/institute'/>;
        //naviguer à l'interface verifier/id
      }else if (this.state.interfaceName==="verifier" && diplomaId !== null){
        return <Navigate to= {`/verifier/${diplomaId}`}/>;
      }else{
        return <div>Invalid interface name.</div>;
      }
     }else{

  return (
    <div style={style}>
    <header className='header'>
      <div className="logo">
        <img src="./images/logo3.png" alt="Logo de l'entreprise" />
      </div>

      <div class="contact">

        <div class="phone">
          <i class="fa fa-phone"></i>
          <img src="./images/phone1.png" alt="Phone Icon" />
          <span>(+216) 74 863 041</span>
        </div>

        <div class="email" onClick={this.handleEmailClick}>
          <i class="fa fa-envelope"></i>
          <img src="./images/mail1.png" alt="Mail Icon" />
          <span>mahdi.ayadi@usf.tn</span>
        </div>

        <div class="phone">
          <i class="fa fa-phone"></i>
          <Link classNames="home" uri={"https://www.crns.rnrt.tn"} text={"home"}  />
        </div>

        <div class="phone">
          <button class="btnLogin-pop" onClick={this.handleLoginClick} >Login</button>
        </div>
        <div class="phone">
          <button class="btnLogin-pop" onClick={this.handleVerifyDiploma}>Verify</button>
        </div>
        
      </div>
    </header>
    {this.state.showLoginForm && (
    <div>
      <div className="wrapper">
        
        <h2>Sign in to your account</h2>
        <Card fluid centered>
          <Card.Content>
            <form size='large' onSubmit={this.checkAuthorization}>
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

              <div class="input-box">
            
            
              <input
                 type='text'
                 value={this.state.email}
                 autoComplete="email"
                 onChange={e => this.setState({ email: e.target.value })}
                 required/>
              <label>Address Email</label>
          </div>

          <div class="input-box">
            
            <input
              type='password'
               
               value={this.state.password}
               autoComplete="current-password"
               onChange={e => this.setState({ password: e.target.value })}
                                    required/>
            <label>Password</label>
          </div>
          <div class="login-register">
                  <input 
                      type="checkbox"
                      id="exampleCheck2"
                  />
                  <label
                     htmlFor="exampleCheck2"
                  >
                     Remember me
                  </label> 
                  <a
                     href='#'
                     class="register-link" onClick={this.navigateToCode}>Forget password</a>
          
          </div>
          <button type="submit" class="btn" >Sign IN</button>
          <div class="login-register">
            <p>Secure your authentication? <a
            href='#'
            class="register-link" onClick={this.handleRegisterClick}>Register</a>

            </p>
          </div>
        </form>
      </Card.Content>
      </Card>
      </div>
      
    </div>
    )}
    {this.state.showVerifyForm && (
       <div>
       <div className="wrapper">
         
         <h2>Verify Diploma</h2>
         <Card fluid centered>
           <Card.Content>
             <form size='large' onSubmit={this.VerifyDiploma}>
             
 
               <div class="input-box">
             
             
               <input
                  type='text'
                  value={this.state.id}
                  autoComplete="IdDiploma"
                  onChange={e => this.setState({ id: e.target.value })}
                  required/>
               <label>IdDiploma</label>
             </div>
           
           <button type="submit" class="btn" >CheckDiploma</button>
         </form>
       </Card.Content>
       </Card>
       </div>
       
     </div>
    )}

    {this.state.showRegisterForm && (
      <div>
      <div className="wrapper">
        
        <h2>Register your account</h2>
        <Card fluid centered>
          <Card.Content>
            <form size='large' onSubmit={this.handleUpdateCredentials}>
            

              <div class="input-box">
            
            
              <input
                 type='text'
                 value={this.state.email}
                 autoComplete="address"
                 onChange={e => this.setState({ email: e.target.value })}
                 required/>
              <label>Address Email</label>
            </div>

          <div class="input-box">
            
            <input
              type='password'
               
               value={this.state.password}
               autoComplete="current-password"
               onChange={e => this.setState({ password: e.target.value })}
                                    required/>
            <label>Password</label>
          </div>
          
          <div class="input-box">
            
            <input
              type='password'
               
               value={this.state.newPassword}
               autoComplete="current-password"
               onChange={e => this.setState({ newPassword: e.target.value })}
                                    required/>
            <label>NewPassword</label>
          </div>
          
          <button type="submit" class="btn" >Register</button>
          <div class="login-register">
            <p>Already have an account? <a
            href='#'
            class="login-link" onClick={this.handleLoginClick}>Login</a>

            </p>
          </div>
        </form>
      </Card.Content>
      </Card>
      </div>
      
    </div>
    )}
    {this.state.showCodeForm && (
  <div>
  <div className="wrapper">
    <h2>Enter the code sent to your email</h2>
    <Card fluid centered>
      <Card.Content>
        <form size='large' >
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

          <div class="input-box">
            <input
              type='text'
              autoComplete="off"
              onChange={e => this.setState({ enteredCode: e.target.value })}
              required />
            <label>Enter code</label>
          </div>

          <button type="submit" class="btn" onClick={this.handleCodeSubmit}>Submit</button>
          <div class="login-register">
            <a
              href='#'
              class="register-link" onClick={() => this.setState({ showCodeForm: false })}>Cancel</a>
          </div>
        </form>
      </Card.Content>
    </Card>
  </div>
  </div>
)}
{this.state.showResetPasswordForm && (
        <div>
        <div className="wrapper">
          <h2>Enter your newpassword</h2>
          <Card fluid centered>
            <Card.Content>
              <form size='large' onSubmit={this.handleRestPassword}>
              <div class="input-box">
            
            
            <input
               type='text'
               value={this.state.email}
               autoComplete="address"
               onChange={e => this.setState({ email: e.target.value })}
               required/>
            <label>Email</label>
          </div>

        <div class="input-box">
          
          <input
            type='password'
             
             value={this.state.newPassword1}
             autoComplete="current-password"
             onChange={e => this.setState({ newPassword1: e.target.value })}
                                  required/>
          <label>Password</label>
        </div>
        
        <div class="input-box">
        </div>
            <button type="submit">Reset password</button><div class="login-register">
            <p>Password update <a
            href='#'
            class="login-link" onClick={this.handleLoginClick}>Login</a>

            </p>
          </div>
          </form>
          </Card.Content>
          </Card>
          </div>
        </div>
      )}
    </div>

  );
}
}
}
export default CheckActeur;