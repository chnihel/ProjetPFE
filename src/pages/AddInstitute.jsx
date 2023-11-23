import React, { Component } from "react";
import SidebarAdmin from "../components/Sidebar";
import { Form, Button, Card} from 'semantic-ui-react';
import { getContractInstance } from "../contractServices";
import '../Sidebar.css';
import * as emailjs from "emailjs-com";
import '../styles.css';
import Web3 from "web3";


class AddInstitute extends Component{
    constructor(props) {
        super(props);
    
      this.state={
        address:'',
        name:'',
        email:'',
        WebSite:'',
        departements:[""],
        acronym:'',
        status: '',
        addresses: [],
      };
    this.handleSubmit=this.handleSubmit.bind(this);
    this.handleAddDepartement=this.handleAddDepartement.bind(this);
    this.sendEmail=this.sendEmail.bind(this);
    this.handleChange=this.handleChange.bind(this);
    this.sendNotification=this.sendNotification.bind(this);
    }
    //cycle de vie d'un composant dans React qui est appelé automatiquement une fois que le composant a été monté
    componentDidMount() {
      //utiliser fetch pour recupérer les données de address.json
      fetch('/address.json')
        .then(response => response.json())
        .then(data => this.setState({ addresses: data.addresses }));
    }
    //peut changer l'adresse
    handleChange(event) {
      this.setState({ address: event.target.value });
    }

    //fonction asyncrone  peut contenir des opérations asynchrones telles que des appels à des API externes ou des fonctions qui retournent des promesses.(await,catch, then..)
    handleSubmit = async(e) => {
        e.preventDefault();

        //l'automatisation de l'adresse ethereum 
        const storageContract= await getContractInstance();   
        if (!storageContract || !storageContract.instance) {
        console.error("Erreur lors de la récupération de l'instance du contrat");
        return;
        } 

        // Vérifiez que les champs obligatoires sont remplis
        if (!this.state.address || !this.state.name || !this.state.email || !this.state.WebSite || !this.state.departements || !this.state.acronym) {
        console.error("Tous les champs doivent être remplis");
        return;
     }

        const {address, name,email,WebSite,departements,acronym}=this.state;
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        const accountAddress = accounts[0];
        try{
            const ajout=await storageContract.instance.methods.addInstitute(address,name,email,WebSite,departements,acronym).send({
              from: accountAddress,
              gas:500000
                
            });
            //verification dans le console
            if (ajout.status === true) {
                console.log("Institute added successfully!");
                const index = await storageContract.instance.methods.findInstitute(address).call();
                console.log("Index of added institute:", index);
            
                const institute = await storageContract.instance.methods.getInstitute(index).call();
                console.log("Information of added institute:", institute);
                //send email à l'institut
                this.sendEmail();
                //send email à l'administrateur
                this.sendNotification();
              } else {
                alert("La transaction a échoué");
              }
            } 
            catch (error) {
                alert("Adresse déjà existante");
            }/*} catch (error) {
              if (error.message === "adresse deja existé") {
               alert("Adresse déjà existante");
               } else {
              alert("Erreur lors de l'ajout de l'institut");
                   }
}*/
    } 
    //send email à l'etudiant avec son id
    sendEmail = async () => {
    // Ajouter le code pour envoyer les données du formulaire à la base de données ici
    const templateParams = {
    address: this.state.address,
    departements: this.state.departements.join(", "),
    to_email: this.state.email ,// Utilisez l'adresse de destination récupérée à partir du champ "email" du formulaire
    message: `Here are your login details for your account:\nEthereum Address: ${this.state.address}\nPassword: "institute"\nYou can now log in to your account and change your password and Ethereum address if necessary.`
  };
  //parametres de api emailjs
  emailjs.send('service_6crr5no','template_r9vmkyd', templateParams, 'grBhMY8QTyNgecZ34')
      .then((result) => {
      console.log(result.text);
    }, (error) => {
      console.log(error.text);
    });
    
    
  };
  //envoyer un email d'information
  sendNotification= async () => {
    const templateParams1 = {
      to_email: 'admin@example.com',
      subject: 'Notification : Nouvelle institut ajouté',
      message:'A new institute has been successfully added.'
    };
    emailjs.send('service_6crr5no','template_r9vmkyd', templateParams1, 'grBhMY8QTyNgecZ34')
    .then((result) =>{
      console.log(result.text);
    }, (error) => {
      console.log(error.text);
    });
  };

  handleAddDepartement = () => {
    const departements = [...this.state.departements, ""];
    this.setState({ departements });
  };
  
  
    render(){
        const style = {
            backgroundImage: `url('/images/photo.jpeg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '100vh',
            paddingRight: '200px'

        };
    return(
        <div style={style}>
     <div className="container">
       <SidebarAdmin />
       <div className="hash">
                <h2>AddInstitute</h2>
                    <div  className='signup'>
                    <Card fluid centered>
                        <Card.Content>
                            <Form size='large' onSubmit={this.handleSubmit}>
                               
                                <Form.Field required>
                                  
                                  <select id="address" value={this.state.address} onChange={this.handleChange}>
                                     <option value="">-- Select an address --</option>
                                     {this.state.addresses.map(address => (
                                        <option key={address.id} value={address.adresse}>{address.adresse}</option>
                                     ))}
                                  </select>
                                </Form.Field>
                                <Form.Field required>
                                    <input
                                        type='text'
                                        placeholder='name'
                                        value={this.state.name}
                                        autoComplete="name"
                                        onChange={e => this.setState({ name: e.target.value })}
                                    />
                                <Form.Field required>
                                    <input
                                        type='text'
                                        placeholder='email'
                                        value={this.state.email}
                                        autoComplete="name"
                                        onChange={e => this.setState({ email: e.target.value })}
                                    />
                                </Form.Field>
                                </Form.Field>
                                <Form.Field required>
                                    <input
                                        type='text'
                                        placeholder='acronym'
                                        value={this.state.acronym}
                                        autoComplete="name"
                                        onChange={e => this.setState({ acronym: e.target.value })}
                                    />
                                </Form.Field>
                                <Form.Field required>
                                    <input
                                        type='text'
                                        placeholder='WebSite'
                                        value={this.state.WebSite}
                                        autoComplete="WebSite"
                                        onChange={e => this.setState({ WebSite: e.target.value })}
                                    />
                                </Form.Field>
                                <Form.Field required>
                  
                                   {this.state.departements.map((departement, index) => (
                                      <div key={index}>
                                          <input
                                            type='text'
                                            placeholder={`departement ${index + 1}`}
                                            value={departement}
                                            onChange={e =>  {const departements = [...this.state.departements];
                                              departements[index] = e.target.value;
                                              this.setState({ departements });
                                            }}
                                          />
                                         
                                      </div>
                                    ))}

                                    <button type="button" onClick={this.handleAddDepartement}>
                                           +
                                    </button>
                                </Form.Field>
                                
                               
                                
                                <Form.Field>
                                    <Button type='submit' class="btn"  primary fluid size='large' >
                                        Add
                                    </Button>
                                </Form.Field>

                            </Form>
                        </Card.Content>
                      </Card>
                      </div>
      </div>
    </div>
            </div>
        
    );
}
}
export default AddInstitute;