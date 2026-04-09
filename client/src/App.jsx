import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import StudentHome from "./pages/student/StudentHome";
import CounsellingChat from "./pages/student/CounsellingChat";
import StudentReport from "./pages/student/StudentReport";
import AdminDashboard from "./pages/admin/AdminDashboard";
import LeadDetails from "./pages/admin/LeadDetails";
import ScheduleMeeting from "./pages/admin/ScheduleMeeting";
import ProtectedRoute from "./components/ProtectedRoute";
import LiveCalls from "./pages/admin/LiveCalls";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/student/home"
          element={
            <ProtectedRoute role="student">
              <StudentHome />
            </ProtectedRoute>
          }
        />

        <Route
  path="/admin/live-calls"
  element={
    <ProtectedRoute role="admin">
      <LiveCalls />
    </ProtectedRoute>
  }
/>
        <Route
          path="/student/chat"
          element={
            <ProtectedRoute role="student">
              <CounsellingChat />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/report/:id"
          element={
            <ProtectedRoute role="student">
              <StudentReport />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/leads/:id"
          element={
            <ProtectedRoute role="admin">
              <LeadDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/schedule/:id"
          element={
            <ProtectedRoute role="admin">
              <ScheduleMeeting />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;