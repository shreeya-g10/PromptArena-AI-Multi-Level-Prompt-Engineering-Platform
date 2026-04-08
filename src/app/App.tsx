import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { Level1Page } from './pages/Level1Page';
import { Level2Page } from './pages/Level2Page';
import { Level3Page } from './pages/Level3Page';
import { ProtectedRoute } from './components/ProtectedRoute';
import { generateCode } from "./services/aiService";

generateCode("Write Python function to check prime number")
  .then(res => console.log(res))
  .catch(err => console.error(err));

export default function App() {
  return (
    <BrowserRouter>
      <div className="dark min-h-screen">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/level-1"
            element={
              <ProtectedRoute>
                <Level1Page />
              </ProtectedRoute>
            }
          />
          <Route
            path="/level-2"
            element={
              <ProtectedRoute>
                <Level2Page />
              </ProtectedRoute>
            }
          />
          <Route
            path="/level-3"
            element={
              <ProtectedRoute>
                <Level3Page />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}