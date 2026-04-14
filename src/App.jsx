import { Routes, Route } from 'react-router-dom';
import Invitation from './pages/Invitation';
import JoinersPage from './pages/JoinersPage';
import ListIdPage from './pages/ListIdPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Invitation />} />
      <Route path="/joiners" element={<JoinersPage />} />
      <Route path="/birthday/listid" element={<ListIdPage />} />
    </Routes>
  );
}
