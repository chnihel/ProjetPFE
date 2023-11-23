import React ,{useEffect,useState}from "react";
import SidebarAdmin from "../components/Sidebar";
import { getContractInstance } from "../contractServices";
import '../styles.css';
const InstituteList=()=>{
  const [institutes, setInstitutes] = useState([]);
  const [selectedInstitute, setSelectedInstitute] = useState(null);
    
    useEffect(() => {
      const fetchInstitutes = async () => {
        const storageContract= await getContractInstance();   
        if (!storageContract || !storageContract.instance) {
          console.error("Erreur lors de la récupération de l'instance du contrat");
          return;
        } 
        const instituteList = [];
          let index = 0;
          let institute;
            try {
              institute = await storageContract.instance.methods.getInstitute(index).call();
            } catch (err) {
                console.error("Erreur lors de l'appel à getInstitute():", err);
                return;
              }            
            while (institute[0] !== "") {
              instituteList.push(institute);
              index++;
              try {
                institute = await storageContract.instance.methods.getInstitute(index).call();
              }catch (err) {
                console.error("Erreur lors de l'appel à getInstitute():", err);
                break;
              }            
            }
            console.log("Information of added institute:", institute);

            setInstitutes(instituteList);
      };

     fetchInstitutes();
    }, []);
    const handleDepartmentsClick = (institute) => {
      setSelectedInstitute(institute);
    };
    const Style = {
      paddingRight: "200px",
    };
  return(
    <div style={Style}>
    <div className="container">
    <SidebarAdmin />
    <div className="list">
    <h2>List of institutes</h2>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>email</th>
          <th>WebSite</th>
          <th>Departement</th>
          <th>Acronym</th>
        </tr>
      </thead>
      <tbody>
        {institutes.map((institute, index) => (
          <tr key={index}>
            <td>{institute[1]}</td>
            <td>{institute[2]}</td>
            <td>{institute[3]}</td>
            <td>
                  {selectedInstitute === institute ? (
                    <ul>
                      {institute[4].map((department, index) => (
                        <li key={index}>{department}</li>
                      ))}
                    </ul>
                  ) : (
                    <button onClick={() => handleDepartmentsClick(institute)}>
                      Show departments
                    </button>
                  )}
                </td>
            <td>{institute[5]}</td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
    </div>
    </div>
  );
};
export default InstituteList