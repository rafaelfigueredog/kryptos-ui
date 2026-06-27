import { useSidebar } from "../context/SidebarContext";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { MenuIcon, MoonIcon, SunIcon } from "../icons";
import { useNavigate } from "react-router-dom";

const LogoutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

const AppHeader = () => {
  const { toggleSidebar, toggleMobileSidebar } = useSidebar();
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleToggle = () => {
    if (window.innerWidth >= 1280) toggleSidebar();
    else toggleMobileSidebar();
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 flex w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-40">
      <div className="flex items-center justify-between w-full px-4 py-3 xl:px-6">
        <button onClick={handleToggle}
          className="flex items-center justify-center w-10 h-10 text-gray-500 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5">
          <MenuIcon />
        </button>

        <div className="flex items-center gap-2">
          <button onClick={toggleTheme}
            className="flex items-center justify-center w-10 h-10 text-gray-500 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5">
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>

          <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1" />

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
              style={{ background: "linear-gradient(135deg, #0077b6, #00b4d8)" }}>
              A
            </div>
            <span className="hidden xl:block text-sm font-medium text-gray-700 dark:text-gray-300">Admin</span>
          </div>

          <button onClick={handleLogout} title="Sair"
            className="flex items-center justify-center w-10 h-10 text-gray-500 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 hover:text-error-500 transition-colors">
            <LogoutIcon />
          </button>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
