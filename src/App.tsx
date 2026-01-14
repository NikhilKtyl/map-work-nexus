import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { PortalAuthProvider } from "@/contexts/PortalAuthContext";
import { SubsAuthProvider } from "@/contexts/SubsAuthContext";
import AppLayout from "@/components/layout/AppLayout";
import PortalLayout from "@/components/portal/PortalLayout";
import SubsLayout from "@/components/subs/SubsLayout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Customers from "./pages/Customers";
import CustomerDetail from "./pages/CustomerDetail";
import Units from "./pages/Units";
import Admin from "./pages/Admin";
import Map from "./pages/Map";
import Crews from "./pages/Crews";
import CrewDetail from "./pages/CrewDetail";
import Field from "./pages/Field";
import Verification from "./pages/Verification";
import ChangeOrders from "./pages/ChangeOrders";
import Completion from "./pages/Completion";
import Profile from "./pages/Profile";
import PlaceholderPage from "./pages/PlaceholderPage";
import NotFound from "./pages/NotFound";
import EmergencyJobs from "./pages/EmergencyJobs";

// Portal Pages
import PortalLogin from "./pages/portal/PortalLogin";
import PortalProjects from "./pages/portal/PortalProjects";
import PortalProjectDetail from "./pages/portal/PortalProjectDetail";

// Subcontractor Portal Pages
import SubsLogin from "./pages/subs/SubsLogin";
import SubsDashboard from "./pages/subs/SubsDashboard";
import SubsProjectUnits from "./pages/subs/SubsProjectUnits";
import SubsProjectDocs from "./pages/subs/SubsProjectDocs";
import SubsProjectSummary from "./pages/subs/SubsProjectSummary";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <PortalAuthProvider>
        <SubsAuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Main App Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route element={<AppLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/projects/:id" element={<ProjectDetail />} />
                  <Route path="/customers" element={<Customers />} />
                  <Route path="/customers/:id" element={<CustomerDetail />} />
                  <Route path="/map" element={<Map />} />
                  <Route path="/units" element={<Units />} />
                  <Route path="/crews" element={<Crews />} />
                  <Route path="/crews/:id" element={<CrewDetail />} />
                  <Route path="/field" element={<Field />} />
                  <Route path="/verification" element={<Verification />} />
                  <Route path="/change-orders" element={<ChangeOrders />} />
                  <Route path="/emergency-jobs" element={<EmergencyJobs />} />
                  <Route path="/reports" element={<Completion />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/admin" element={<Admin />} />
                </Route>

                {/* Customer Portal Routes */}
                <Route path="/portal/login" element={<PortalLogin />} />
                <Route element={<PortalLayout />}>
                  <Route path="/portal/projects" element={<PortalProjects />} />
                  <Route path="/portal/projects/:id" element={<PortalProjectDetail />} />
                </Route>

                {/* Subcontractor Portal Routes */}
                <Route path="/subs/login" element={<SubsLogin />} />
                <Route element={<SubsLayout />}>
                  <Route path="/subs/dashboard" element={<SubsDashboard />} />
                  <Route path="/subs/projects/:id/units" element={<SubsProjectUnits />} />
                  <Route path="/subs/projects/:id/docs" element={<SubsProjectDocs />} />
                  <Route path="/subs/projects/:id/summary" element={<SubsProjectSummary />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </SubsAuthProvider>
      </PortalAuthProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
