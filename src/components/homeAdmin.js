import { NavLink } from "react-router-dom";
import './homeAdmin.css';

const HomeAdmin = () => {
    return (
      <div className="homeAdmin">
      <div>
        <h1>MyEfrei Admin</h1>
        </div>
        <ul className="nav-bar">
          <li><NavLink to="/eleves">Gérer les élèves</NavLink></li>
          <li><NavLink to="/cours">Gérer les cours</NavLink></li>
          <li><NavLink to="/profs">Gérer les profs</NavLink></li>
        </ul>
        <hr></hr>
      </div>
    );
  };
  
  export default HomeAdmin;
  