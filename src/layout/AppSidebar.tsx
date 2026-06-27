import { useRef, useState, useEffect, useCallback } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";
import {
  GridIcon, KeyIcon, ChevronDownIcon, HorizontalDotsIcon,
} from "../icons";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string }[];
};

const navItems: NavItem[] = [
  { icon: <GridIcon />, name: "Dashboard", path: "/" },
  {
    icon: <KeyIcon />, name: "Clientes OAuth2",
    subItems: [
      { name: "Listar Clientes", path: "/clients" },
      { name: "Novo Cliente", path: "/clients/new" },
    ],
  },
];

const AppSidebar = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const isActive = useCallback((path: string) => path === location.pathname, [location.pathname]);

  const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<number, number>>({});
  const subMenuRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const showLabel = isExpanded || isHovered || isMobileOpen;

  useEffect(() => {
    navItems.forEach((nav, i) => {
      if (nav.subItems?.some(s => isActive(s.path))) setOpenSubmenu(i);
    });
  }, [location.pathname, isActive]);

  useEffect(() => {
    if (openSubmenu !== null && subMenuRefs.current[openSubmenu]) {
      setSubMenuHeight(h => ({ ...h, [openSubmenu]: subMenuRefs.current[openSubmenu]?.scrollHeight || 0 }));
    }
  }, [openSubmenu]);

  return (
    <aside
      className={`fixed flex flex-col top-0 px-5 left-0 bg-white dark:bg-gray-900 text-gray-900 h-full transition-all duration-300 ease-in-out z-50 border-r border-gray-200 dark:border-gray-800 xl:translate-x-0 ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      style={{
        width: isExpanded || isMobileOpen ? "290px" : isHovered ? "290px" : "90px",
        borderLeft: "3px solid #0077b6",
      }}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`py-8 flex ${!isExpanded && !isHovered ? "xl:justify-center" : "justify-start"}`}>
        <NavLink to="/">
          {showLabel ? (
            <span className="text-xl font-bold tracking-tight" style={{ background: "linear-gradient(135deg, #0077b6, #00b4d8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>KRYPTOS</span>
          ) : (
            <span className="text-xl font-bold" style={{ color: "#0077b6" }}>K</span>
          )}
        </NavLink>
      </div>

      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav>
          <h2 className={`mb-4 text-xs uppercase flex leading-5 text-gray-400 ${!isExpanded && !isHovered ? "xl:justify-center" : "justify-start"}`}>
            {showLabel ? "Menu" : <HorizontalDotsIcon />}
          </h2>
          <ul className="flex flex-col gap-1">
            {navItems.map((nav, i) => (
              <li key={nav.name}>
                {nav.subItems ? (
                  <>
                    <button
                      onClick={() => setOpenSubmenu(o => o === i ? null : i)}
                      className={`menu-item group w-full ${openSubmenu === i ? "menu-item-active" : "menu-item-inactive"} ${!showLabel ? "xl:justify-center" : ""}`}
                    >
                      <span className={openSubmenu === i ? "menu-item-icon-active" : "menu-item-icon-inactive"}>{nav.icon}</span>
                      {showLabel && <span className="menu-item-text">{nav.name}</span>}
                      {showLabel && <ChevronDownIcon className={`ml-auto w-5 h-5 transition-transform duration-200 ${openSubmenu === i ? "rotate-180 text-brand-500" : ""}`} />}
                    </button>
                    {showLabel && (
                      <div
                        ref={el => { subMenuRefs.current[i] = el; }}
                        className="overflow-hidden transition-all duration-300"
                        style={{ height: openSubmenu === i ? `${subMenuHeight[i] || 0}px` : "0px" }}
                      >
                        <ul className="mt-2 space-y-1 ml-9">
                          {nav.subItems.map(sub => (
                            <li key={sub.name}>
                              <NavLink
                                to={sub.path}
                                end
                                className={({ isActive }) => `menu-dropdown-item ${isActive ? "menu-dropdown-item-active" : "menu-dropdown-item-inactive"}`}
                              >
                                {sub.name}
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                ) : nav.path && (
                  <NavLink
                    to={nav.path}
                    end
                    className={({ isActive }) => `menu-item group ${isActive ? "menu-item-active" : "menu-item-inactive"}`}
                  >
                    <span className={isActive(nav.path) ? "menu-item-icon-active" : "menu-item-icon-inactive"}>{nav.icon}</span>
                    {showLabel && <span className="menu-item-text">{nav.name}</span>}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
