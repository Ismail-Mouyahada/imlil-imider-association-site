import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import ProtectedRoute from "@/components/ProtectedRoute";
import ThemeProvider from "@/components/ThemeProvider";
import SessionWarning from "@/components/SessionWarning";
import RTLProvider from "@/components/RTLProvider";
import Layout from "@/components/Layout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ActivitiesList from "./pages/ActivitiesList";
import Events from "./pages/Events";
import Gallery from "./pages/Gallery";
import ImiderGallery from "./pages/ImiderGallery";
import News from "./pages/News";
import Contact from "./pages/Contact";
import Donations from "./pages/Donations";
import Wheelchairs from "./pages/Wheelchairs";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import Statistics from "./pages/Statistics";
import Settings from "./pages/Settings";
import Admin from "./pages/Admin";
import UserManagement from "./pages/UserManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Router avec future flags pour éliminer les warnings
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Index />,
      },
      {
        path: "activities",
        element: <ActivitiesList />,
      },
      {
        path: "events",
        element: <Events />,
      },
      {
        path: "gallery",
        element: <Gallery />,
      },
      {
        path: "imider-gallery",
        element: <ImiderGallery />,
      },
      {
        path: "news",
        element: <News />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "donations",
        element: <Donations />,
      },
      {
        path: "wheelchairs",
        element: <Wheelchairs />,
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "statistics",
        element: (
          <ProtectedRoute
            requiredPermission="admin.access"
            showAccessDenied={true}
          >
            <Statistics />
          </ProtectedRoute>
        ),
      },
      {
        path: "settings",
        element: (
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin",
        element: (
          <ProtectedRoute
            requiredPermission="admin.access"
            showAccessDenied={true}
          >
            <Admin />
          </ProtectedRoute>
        ),
      },
      {
        path: "users",
        element: (
          <ProtectedRoute
            requiredPermission="admin.access"
            showAccessDenied={true}
          >
            <UserManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppProvider>
          <ThemeProvider>
            <RTLProvider>
              <TooltipProvider>
                    <Toaster />
                    <Sonner />
                    <SessionWarning />
          <RouterProvider router={router} />
              </TooltipProvider>
            </RTLProvider>
          </ThemeProvider>
        </AppProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
