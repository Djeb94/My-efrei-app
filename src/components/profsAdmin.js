import { useState, useEffect } from "react";
import "./form.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const ProfAdmin = () => {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    matiere: ""
  });

  const [profs, setProfs] = useState([]);
  const [cours, setCours] = useState([]); 

  const fetchProfs = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/profs");
      if (!response.ok) throw new Error("Erreur lors de la récupération des profs");
      const data = await response.json();
      setProfs(data);
    } catch (error) {
      console.error("Erreur :", error);
    }
  };

  const fetchCours = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/cours");
      if (!response.ok) throw new Error("Erreur lors de la récupération des cours");
      const data = await response.json();
      setCours(data);
    } catch (error) {
      console.error("Erreur :", error);
    }
  };

  useEffect(() => {
    fetchProfs();
    fetchCours(); 
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/profs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await response.json();
        setFormData({ nom: "", prenom: "", matiere: "" });
        fetchProfs();
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/profs/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchProfs();
      }
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  return (
    <div className="eleveAdminTable">
      <h2>Liste des professeurs</h2>

      <form onSubmit={handleSubmit} className="form-container">
        <label>
          <input
            placeholder="Nom"
            type="text"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          <input
            placeholder="Prénom"
            type="text"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          <select
            name="matiere"
            value={formData.matiere}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Matière</option>
            {[...new Set(cours.map((c) => c.matiere))].map((matiere, index) => (
              <option key={index} value={matiere}>
                {matiere}
              </option>
            ))}
          </select>
        </label>

        <button type="submit">Ajouter</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Email</th>
            <th>Matière</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {profs.map((prof) => (
            <tr key={prof.id}>
              <td>{prof.nom.toUpperCase()}</td>
              <td>{prof.prenom}</td>
              <td>{prof.email}</td>
              <td>{prof.matiere}</td>
              <td className="actions">
                <FontAwesomeIcon
                  icon={faTrash}
                  style={{ color: "red", cursor: "pointer" }}
                  onClick={() => handleDelete(prof.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProfAdmin;
