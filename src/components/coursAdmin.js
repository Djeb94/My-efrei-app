import { useState, useEffect } from "react";
import "./form.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const CoursAdmin = () => {
  const [formData, setFormData] = useState({
    matiere: "",
    heures: ""
  });

  const [cours, setCours] = useState([]);

  const fetchCours = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/cours");
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des cours");
      }
      const data = await response.json();
      setCours(data);
    } catch (error) {
      console.error("Erreur :", error);
    }
  };

  useEffect(() => {
    fetchCours();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/cours", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          heures: parseInt(formData.heures, 10),
        }),
      });
  
      if (response.ok) {
        setFormData({ matiere: "", heures: "" });
        fetchCours();
      } else {
        const err = await response.json();
        console.error("Erreur de soumission :", err);
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
    }
  };
  

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/cours/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchCours();
      }
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  return (
    <div className="eleveAdminTable">
    <h2>Liste des cours</h2>

    <form onSubmit={handleSubmit} className="form-container">
      <label>
        <input placeholder="Nom de la matière" type="text" name="matiere" value={formData.matiere} onChange={handleChange} required />
      </label>

      <label>
        <input placeholder="nombre heures" type="number" name="heures" value={formData.heures} onChange={handleChange} required />
      </label>

      <button type="submit">Ajouter</button>
    </form>

    <table>
      <thead>
        <tr>
          <th>Nom de la matière</th>
          <th>Nombre d'heures</th>
          <th></th>

        </tr>
      </thead>
      <tbody>
        {cours.map((coursItem) => (
          <tr key={coursItem.id}>
            <td>{coursItem.matiere.toUpperCase()}</td>
            <td>{coursItem.heures}</td>
            <td className="actions" ><FontAwesomeIcon icon={faTrash} style={{ color: "red", cursor: "pointer" }} 
            onClick={() => handleDelete(coursItem.id)}
            /></td>

          </tr>
        ))}
      </tbody>
    </table>
  </div>
  );
};

export default CoursAdmin;


