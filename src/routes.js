import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Planning from "./pages/planning";
import Cours from "./pages/cours";
import Eleves from "./pages/eleves";
import Profs from "./pages/profs";
import HomeAdmin from "./components/homeAdmin";



const AppRoutes = () => {
  return (
    <Router>
        <HomeAdmin/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/planning" element={<Planning />} />
        <Route path="/cours" element={<Cours />} />
        <Route path="/eleves" element={<Eleves />} />
        <Route path="/profs" element={<Profs />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
