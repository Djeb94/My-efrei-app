import { useState, useEffect } from "react";
import "./form.css";

const EleveInfo = () => {
  const [eleve, setEleve] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userUuid = localStorage.getItem("userUuid");

    const fetchEleve = async () => {
      try {
        if (!userUuid) {
          setError("Aucun utilisateur connecté.");
          setLoading(false);
          return;
        }

        const response = await fetch(`http://localhost:5000/api/eleve/${userUuid}`);
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération de l'élève");
        }

        const data = await response.json();
        setEleve(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchEleve();
  }, []);

  const calculerMoyenne = () => {
    if (!eleve?.note || eleve.note.length === 0) return 0;

    let sommeNotes = 0;
    let sommeCoefficients = 0;

    eleve.note.forEach((n) => {
      sommeNotes += n.note * n.coef;
      sommeCoefficients += n.coef;
    });

    return sommeNotes / sommeCoefficients;
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;
  if (!eleve) return null;

  const moyenne = calculerMoyenne();

  return (
    <div className="eleveAdminTable">
      <h2>Mes notes</h2>
      <div>
        <h3>Moyenne : {moyenne.toFixed(2)}</h3>
      </div>

      {eleve.note && eleve.note.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Matière</th>
              <th>Note</th>
              <th>Coefficient</th>
            </tr>
          </thead>
          <tbody>
            {eleve.note.map((n, index) => (
              <tr key={index}>
                <td>{n.matiere}</td>
                <td>{n.note}</td>
                <td>{n.coef}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Aucune note enregistrée.</p>
      )}
    </div>
  );
};

export default EleveInfo;
