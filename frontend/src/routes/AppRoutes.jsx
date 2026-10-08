import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import UserLayout from "../layouts/UserLayout";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "../components/common/ProtectedRoute";

import Home from "../pages/public/Home";
import Jobs from "../pages/public/Jobs";
import JobDetails from "../pages/public/JobDetails";
import Companies from "../pages/public/Companies";
import CompanyDetails from "../pages/public/CompanyDetails";
import Subscriptions from "../pages/public/Subscriptions";
import About from "../pages/public/About";
import Contact from "../pages/public/Contact";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/user/Dashboard";
import MySubscription from "../pages/user/MySubscription";
import MyApplications from "../pages/user/MyApplications";
import MyProfile from "../pages/user/MyProfile";

import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageJobs from "../pages/admin/ManageJobs";
import AddJob from "../pages/admin/AddJob";
import EditJob from "../pages/admin/EditJob";
import ManageCompanies from "../pages/admin/ManageCompanies";
import ManagePlans from "../pages/admin/ManagePlans";
import ManageUsers from "../pages/admin/ManageUsers";
import ManagePayments from "../pages/admin/ManagePayments";
import Revenue from "../pages/admin/Revenue";
import AdminSettings from "../pages/admin/AdminSettings";
import ManageApplications from "../pages/admin/ManageApplications";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout/>}>
        <Route path="/" element={<Home/>}/>
        <Route path="/jobs" element={<Jobs/>}/>
        <Route path="/jobs/:id" element={<JobDetails/>}/>
        <Route path="/companies" element={<Companies/>}/>
        <Route path="/companies/:id" element={<CompanyDetails/>}/>
        <Route path="/subscriptions" element={<Subscriptions/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/contact" element={<Contact/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
      </Route>

      <Route path="/admin/login" element={<Login/>}/>

      <Route element={<ProtectedRoute/>}>
        <Route element={<UserLayout/>}>
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/dashboard/subscription" element={<MySubscription/>}/>
          <Route path="/dashboard/applications" element={<MyApplications/>}/>
          <Route path="/dashboard/profile" element={<MyProfile/>}/>
        </Route>
      </Route>

      <Route element={<ProtectedRoute admin/>}>
        <Route element={<AdminLayout/>}>
          <Route path="/admin" element={<AdminDashboard/>}/>
          <Route path="/admin/jobs" element={<ManageJobs/>}/>
          <Route path="/admin/jobs/add" element={<AddJob/>}/>
          <Route path="/admin/jobs/:id/edit" element={<EditJob/>}/>
          <Route path="/admin/companies" element={<ManageCompanies/>}/>
          <Route path="/admin/plans" element={<ManagePlans/>}/>
          <Route path="/admin/users" element={<ManageUsers/>}/>
          <Route path="/admin/payments" element={<ManagePayments/>}/>
          <Route path="/admin/revenue" element={<Revenue/>}/>
          <Route path="/admin/applications" element={<ManageApplications/>}/>
          <Route path="/admin/settings" element={<AdminSettings/>}/>
        </Route>
      </Route>
    </Routes>
  );
}
