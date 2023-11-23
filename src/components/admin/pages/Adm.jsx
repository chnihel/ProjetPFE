/*import React, { Component } from "react";
import { Form, Button, Card } from 'semantic-ui-react';
import { getContractInstance } from '../../../contractServices';

 class AddUniversity extends Component{
       state={
        address:'',
        name:'',
        WebSite:'',
        departement:'',
        acronym:'',
        status: '',
        
        
       }
       
        handleSubmit = async(e) => {
            e.preventDefault();

            //l'automatisation de l'adresse ethereum 
            const storageContract= await getContractInstance();   
            if (!storageContract || !storageContract.instance) {
            console.error("Erreur lors de la récupération de l'instance du contrat");
            return;
            } 

            // Vérifiez que les champs obligatoires sont remplis
            if (!this.state.address || !this.state.name || !this.state.WebSite || !this.state.departement || !this.state.acronym) {
            console.error("Tous les champs doivent être remplis");
            return;
         }

            const {address, name,WebSite,departement,acronym}=this.state;
            
            

            try{
                const ajout=await storageContract.instance.methods.addInstitute(address,name,WebSite,departement,acronym).send({
                    from:"0x94cEd1A5E8bd3367432fBAEA2f1a25691F675287",
                    gas:500000
                    
                });

                if (ajout.status === true) {
                    console.log("Institute added successfully!");
                    const index = await storageContract.instance.methods.findInstitute(address).call();
                    console.log("Index of added institute:", index);
                
                    const institute = await storageContract.instance.methods.getInstitute(index).call();
                    console.log("Information of added institute:", institute);
                
                  } else {
                    console.error("la transaction a échoué");
                  }
                } 
                catch (error) {
                  console.error("Error occurred while adding institute", error);
                }
        }  
    render(){
    return(
    <div className="sign-up">
                Add university
                <div className='signup-form'>
                    <Card fluid centered>
                        <Card.Content>
                            <Form size='large' onSubmit={this.handleSubmit}>
                               
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
                                        type='text'
                                        placeholder='name'
                                        value={this.state.name}
                                        autoComplete="name"
                                        onChange={e => this.setState({ name: e.target.value })}
                                    />
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
                                    <input
                                        type='text'
                                        placeholder='departement'
                                        value={this.state.departement}
                                        autoComplete="departement"
                                        onChange={e => this.setState({ departement: e.target.value })}
                                    />
                                </Form.Field>
                                
                               
                                
                                <Form.Field>
                                    <Button type='submit' primary fluid size='large' >
                                        Add
                                    </Button>
                                </Form.Field>

                            </Form>
                        </Card.Content>
                    </Card>
                    
                </div>
            </div>
        );
}
} export default AddUniversity*/