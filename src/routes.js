import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/home";
import Planning from "./pages/planning";
import Cours from "./pages/cours";
import Eleves from "./pages/eleves";
import Profs from "./pages/profs";
import Noter from "./pages/noter";
import PlanningProfs from "./pages/planningProf";
import EleveInfo from "./components/notesEleve";
import Header from "./components/header";
import ProtectedRoute from './components/protectedRoutes';
import {Fragment} from 'react';



const RoutesWithHomeAdmin = () => {
  const location = useLocation();

  return (
    <>
      {location.pathname !== "/" && <Header />}
    <Routes>
    <Fragment>
    <Route path="/" element={<Home />} />

      <Route element={<ProtectedRoute/>}>
        <Route exact path="/planning" element={<Planning />} />
        <Route exact path="/cours" element={<Cours />} />
        <Route exact path="/eleves" element={<Eleves />} />
        <Route exact path="/profs" element={<Profs />} />
        <Route exact path="/noter" element={<Noter />} />
        <Route exact path="/planningProf" element={<PlanningProfs />} />
        <Route exact path="/notes" element={<EleveInfo />} />
      </Route>
      </Fragment>
      </Routes>
    </>
  );
};

const AppRoutes = () => {
  return (
    <Router>
      <RoutesWithHomeAdmin />
    </Router>
  );
};

export default AppRoutes;
