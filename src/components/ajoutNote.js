import { useState, useEffect } from "react";
import "./form.css";


const AjouterNote = () => {
  const [formData, setFormData] = useState({
    eleve: "",
    matiere: "",
    note: "",
    coefficient: "",
  });

  const [eleves, setEleves] = useState([]);
  const [cours, setCours] = useState([]);

  const fetchEleves = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/eleves");
      const data = await response.json();
      setEleves(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des élèves :", error);
    }
  };

  const fetchCours = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/cours");
      const data = await response.json();
      setCours(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des cours :", error);
    }
  };

  useEffect(() => {
    fetchEleves();
    fetchCours();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const [nom, prenom] = formData.eleve.split(" ");

    const notePayload = {
      nom,
      prenom,
      matiere: formData.matiere,
      note: parseFloat(formData.note),
      coef: parseFloat(formData.coefficient),
    };

    try {
      const response = await fetch("http://localhost:5000/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(notePayload),
      });

      if (response.ok) {
        setFormData({ eleve: "", matiere: "", note: "", coefficient: "" }); 
      } else {
        const error = await response.json();
        console.error("Erreur côté serveur :", error.error);
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
    }
  };


  return (
    <div className="eleveAdminTable">
      <h2>Attribuer une note à un élève</h2>

      <form onSubmit={handleSubmit} className="form-container">
        <label>
          <select
            name="eleve"
            value={formData.eleve}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Choisir un élève</option>
            {eleves.map((eleve) => (
              <option key={eleve.id} value={`${eleve.nom} ${eleve.prenom}`}>
                {eleve.nom.toUpperCase()} {eleve.prenom}
              </option>
            ))}
          </select>
        </label>

        <label>
          <select
            name="matiere"
            value={formData.matiere}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Choisir une matière</option>
            {[...new Set(cours.map((c) => c.matiere))].map((matiere, index) => (
              <option key={index} value={matiere}>{matiere}</option>
            ))}
          </select>
        </label>

        <label>
          <input
            type="number"
            name="note"
            min="0"
            max="20"
            step="1"
            value={formData.note}
            placeholder="Note"
            onChange={handleChange}
            required
          />
        </label>

        <label>
          <input
            type="number"
            name="coefficient"
            min="0.5"
            max="3"
            step="0.5"
            value={formData.coefficient}
            placeholder="Coefficient"
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit">Ajouter</button>
      </form>

      
    </div>
  );
};

export default AjouterNote;
