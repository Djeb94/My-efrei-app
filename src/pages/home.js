import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/login.css";

function Home() {
  const [identifiant, setIdentifiant] = useState("");
  const [motdepasse, setMotDePasse] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifiant, motdepasse }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        navigate("/eleves");
      } else {
        setError(data.error || "Identifiant ou mot de passe incorrect");
      }
    } catch (err) {
      setError("Erreur de connexion au serveur");
    }
  };

  return (
    <div className="home">
      <form className="login" onSubmit={handleSubmit}>
        <img src="./images/efreiLogo.png" alt="Efrei Logo" />
        <h2>Connexion</h2>
        <h3>Utiliser votre compte Efrei</h3>

        <label>
          <input placeholder="Identifiant" type="text" name="identifiant" required value={identifiant} onChange={(e) => setIdentifiant(e.target.value)}/>
        </label>

        <label>
          <input placeholder="Mot de passe" type="password" name="motdepasse" required value={motdepasse} onChange={(e) => setMotDePasse(e.target.value)}/>
        </label>

        {error && <p className="error">{error}</p>}

        <p>Identifiant oublié ? Pas de chance...</p>

        <button type="submit">SE CONNECTER</button>
      </form>
    </div>
  );
}

export default Home;
