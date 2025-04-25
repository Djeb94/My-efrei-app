import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import './header.css';

const Header = () => {
  const navigate = useNavigate();
  const [alreadyRedirected, setAlreadyRedirected] = useState(false);
  
  const token = localStorage.getItem("token");
  let role = "";
  let id ="";

  if (token) {
    const decoded = JSON.parse(atob(token.split(".")[1]));
    role = decoded.role;
    id = decoded.uuid;
    localStorage.setItem("userUuid", id);

  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userUuid');
    navigate('/');
  };

  // 👉 Redirection une seule fois à la connexion
  useEffect(() => {
    if (!alreadyRedirected) {
      if (role === "admin") {
        navigate("/eleves");
      } else if (role === "etudiant") {
        navigate("/planning");
      } else if (role === "prof") {
        navigate("/noter");
      }
      setAlreadyRedirected(true);
    }
  }, [role, alreadyRedirected, navigate]);

  return (
    <div className="homeAdmin">
      <div>
        <div><img src="/images/logoEfrei2.png" alt="Logo" /> <mark>{role}</mark></div>
        <button onClick={handleLogout}>DECONNEXION</button>
      </div>

      <ul className="nav-bar">
        {role === "admin" && (
          <>
            <li><NavLink to="/eleves">Gérer les élèves</NavLink></li>
            <li><NavLink to="/cours">Gérer les cours</NavLink></li>
            <li><NavLink to="/profs">Gérer les profs</NavLink></li>
          </>
        )}

        {role === "prof" && (
          <>
            <li><NavLink to="/noter">Ajouter une note</NavLink></li>
            <li><NavLink to="/planningProf">consulter un planning</NavLink></li>
          </>
        )}

        {role === "etudiant" && (
          <>
            <li><NavLink to="/planning">Mon planning</NavLink></li>
            <li><NavLink to="/notes">Mes notes</NavLink></li>
          </>
        )}
      </ul>
      <hr />
    </div>
  );
};

export default Header;
