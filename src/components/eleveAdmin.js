import { useState, useEffect } from "react";
import "./eleveAdmin.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const EleveAdmin = () => {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    classe: "",
  });

  const [eleves, setEleves] = useState([]);

  // Fonction pour récupérer les élèves
  const fetchEleves = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/eleves");
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des élèves");
      }
      const data = await response.json();
      setEleves(data);
    } catch (error) {
      console.error("Erreur :", error);
    }
  };

  // Appel de fetchEleves au chargement du composant
  useEffect(() => {
    fetchEleves();
  }, []);

  // Gestion des changements dans les inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/eleves", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        fetchEleves();
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
    }
  };
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/eleves/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchEleves(); // Recharger la liste après suppression
      }
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  return (
    <div className="eleveAdminTable">
      <h2>Liste des élèves</h2>

      <form onSubmit={handleSubmit} className="form-container">
        <label>
          <input placeholder="Nom" type="text" name="nom" value={formData.nom} onChange={handleChange} required />
        </label>

        <label>
          <input placeholder="Prénom" type="text" name="prenom" value={formData.prenom} onChange={handleChange} required />
        </label>

        <label>
          <input placeholder="Classe" type="text" name="classe" value={formData.classe} onChange={handleChange} required />
        </label>

        <button type="submit">Ajouter</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Email</th>
            <th>Classe</th>
            <th></th>

          </tr>
        </thead>
        <tbody>
          {eleves.map((eleve) => (
            <tr key={eleve.id}>
              <td>{eleve.nom.toUpperCase()}</td>
              <td>{eleve.prenom}</td>
              <td>{eleve.email}</td>
              <td>{eleve.classe}</td>
              <td className="actions" ><FontAwesomeIcon icon={faTrash} style={{ color: "red", cursor: "pointer" }} 
              onClick={() => handleDelete(eleve.id)}
              /></td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EleveAdmin;
