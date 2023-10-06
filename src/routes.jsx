import { Routes, Route, BrowserRouter } from "react-router-dom";
import Main from "./pages/Main";
import Repositorio from "./pages/Repositorio";

export default function RoutesApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" Component={Main} />
        <Route exact path="/repositorio/:name" Component={Repositorio} />
      </Routes>
    </BrowserRouter>
  );
}
