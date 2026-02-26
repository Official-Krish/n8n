import "@xyflow/react/dist/style.css";
import { Route, Routes } from "react-router-dom";
import { CreateWorkflow } from "./pages/CreateWorkflow";
import { Auth } from "./pages/Auth";
import { Landing } from "./pages/Landing";
import { Dashboard } from "./pages/Dashboard";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Profile from "./pages/Profile";
import { Executions } from "./pages/Executions";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/signin" element={<Auth mode="signin" />} />
      <Route path="/signup" element={<Auth mode="signup" />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create"
        element={
          <ProtectedRoute>
            <CreateWorkflow />
          </ProtectedRoute>
        }
      />
      <Route
        path="/workflow/:workflowId"
        element={
          <ProtectedRoute>
            <CreateWorkflow />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/workflow/:workflowId/executions"
        element={
          <ProtectedRoute>
            <Executions />
          </ProtectedRoute>
        }
      />
    </Routes>
    
  );
}

export default App;