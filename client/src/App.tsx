import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

import Clients from "./pages/Clients";
import Memberships from "./pages/Memberships";
import Plans from "./pages/Plans";
import Payments from "./pages/Payments";
import Invoices from "./pages/Invoices";
import Attendance from "./pages/Attendance";
import AccessControl from "./pages/AccessControl";
import Reports from "./pages/Reports";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Rutas protegidas con Layout */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/memberships" element={<Memberships />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/invoices" element={<Invoices />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/access-control" element={<AccessControl />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;
