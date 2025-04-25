import { useState, useEffect } from "react";
import "./form.css";

const formatDate = (date) => {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString(undefined, options);
};

const PlanningEleve = () => {
  const [matiere, setMatiere] = useState("");
  const [heures, setHeures] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [planning, setPlanning] = useState([]);

  const fetchPlanning = async () => {
    try {
      const userUuid = localStorage.getItem("userUuid");

      if (userUuid) {
        const eleveResponse = await fetch(`http://localhost:5000/api/eleve/${userUuid}`);
        if (!eleveResponse.ok) throw new Error("Erreur élève");

        const eleveData = await eleveResponse.json();
        setMatiere(eleveData.matiere); 

        const coursResponse = await fetch("http://localhost:5000/api/cours");
        if (!coursResponse.ok) throw new Error("Erreur cours");

        const coursData = await coursResponse.json();
        const cours = coursData.find(c => c.matiere === eleveData.matiere);

        if (cours) {
          setHeures(cours.heures); 
          generatePlanning(cours.heures); 
        }

        setLoading(false);
      } else {
        setError("Aucun utilisateur connecté.");
        setLoading(false);
      }
    } catch (error) {
      setError("Erreur lors de la récupération des données.");
      setLoading(false);
    }
  };

  const generatePlanning = (totalHeures) => {
    const dailyLimit = 5; 
    const pause = 1;
    let planning = [];

    let remaining = totalHeures;
    let currentDate = new Date();
    let currentStart = 8;

    if (isNaN(remaining) || remaining <= 0) {
      console.log("Aucune heure disponible pour générer le planning.");
      return;
    }

    while (remaining > 0) {
      let hoursToday = Math.min(remaining, dailyLimit);
      let start = currentStart;
      let end = start + hoursToday;

      if (end > 19) {
        currentDate.setDate(currentDate.getDate() + 1);
        planning.push({ isBreak: true, lines: 3 }); 
        currentStart = 8;
        continue;
      }

      planning.push({
        startTime: start,
        endTime: end,
        day: formatDate(currentDate),
        matiere, 
      });

      remaining -= hoursToday;

      if (remaining > 0) {
        const nextStart = end + pause;
        if (nextStart >= 19) {
          currentDate.setDate(currentDate.getDate() + 1);
          planning.push({ isBreak: true, lines: 3 });
          currentStart = 8;
        } else {
          planning.push({ isBreak: true, lines: 1 });
          currentStart = nextStart;
        }
      }
    }

    setPlanning(planning); 
  };

  useEffect(() => {
    fetchPlanning();
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="eleveAdminTable">
      <h2>Planning de l'élève</h2>
      <p>Matière suivie : {matiere}</p>

      <h3>Emploi du temps</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {planning.map((slot, index) => {
          if (slot.isBreak) {
            return (
              <li key={`break-${index}`} style={{ marginTop: `${slot.lines * 10}px` }}></li>
            );
          }
          return (
            <li key={index}>
              {slot.day} - {slot.startTime}h à {slot.endTime}h - {slot.matiere}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PlanningEleve;
