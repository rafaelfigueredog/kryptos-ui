import { Outlet } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import AppHeader from "./AppHeader";
import { useSidebar } from "../context/SidebarContext";

const AppLayout = () => {
  const { isExpanded, isMobileOpen, toggleMobileSidebar } = useSidebar();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AppSidebar />

      {/* Backdrop mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 z-40 xl:hidden"
          onClick={toggleMobileSidebar}
        />
      )}

      <div className={`flex flex-col transition-all duration-300 ease-in-out ${isExpanded ? "xl:pl-[290px]" : "xl:pl-[90px]"}`}>
        <AppHeader />
        <main className="p-4 xl:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
