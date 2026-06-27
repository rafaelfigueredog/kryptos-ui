import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "./context/SidebarContext";
import { ThemeProvider } from "./context/ThemeContext";
import AppLayout from "./layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import ClientList from "./pages/ClientList";
import ClientForm from "./pages/ClientForm";
import Settings from "./pages/Settings";

const App = () => (
  <BrowserRouter>
    <ThemeProvider>
      <SidebarProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clients" element={<ClientList />} />
            <Route path="/clients/new" element={<ClientForm />} />
            <Route path="/clients/:id/edit" element={<ClientForm />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </SidebarProvider>
    </ThemeProvider>
  </BrowserRouter>
);

export default App;
