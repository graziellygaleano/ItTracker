import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home/Home";
import { Auth } from "./pages/Auth/Auth";
import { Forum } from "./pages/Forum/Forum";
import { Team } from "./pages/Team/Team";
import { Profile } from "./pages/Profile/Profile";

export default function App(): React.JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/equipe" element={<Team />} />
        <Route path="/perfil" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}