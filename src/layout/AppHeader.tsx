import { useSidebar } from "../context/SidebarContext";
import { useTheme } from "../context/ThemeContext";
import { MenuIcon, MoonIcon, SunIcon } from "../icons";

const AppHeader = () => {
  const { toggleSidebar, toggleMobileSidebar } = useSidebar();
  const { theme, toggleTheme } = useTheme();

  const handleToggle = () => {
    if (window.innerWidth >= 1280) toggleSidebar();
    else toggleMobileSidebar();
  };

  return (
    <header className="sticky top-0 flex w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-40">
      <div className="flex items-center justify-between w-full px-4 py-3 xl:px-6">
        <button
          onClick={handleToggle}
          className="flex items-center justify-center w-10 h-10 text-gray-500 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5"
        >
          <MenuIcon />
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-10 h-10 text-gray-500 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5"
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-white text-sm font-medium">
              A
            </div>
            {<span className="hidden xl:block text-sm font-medium text-gray-700 dark:text-gray-300">Admin</span>}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
