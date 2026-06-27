import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const cn = (...inputs: Parameters<typeof clsx>) => twMerge(clsx(inputs));

// Button
type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ButtonSize = "sm" | "md";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

const variants: Record<ButtonVariant, string> = {
  primary: "bg-brand-500 text-white hover:bg-brand-600 dark:bg-brand-500 dark:hover:bg-brand-600",
  secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700",
  danger: "bg-error-500 text-white hover:bg-error-600",
  ghost: "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2.5 text-sm",
};

export const Button = ({ variant = "primary", size = "md", className, children, ...props }: ButtonProps) => (
  <button className={cn("inline-flex items-center gap-2 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed", variants[variant], sizes[size], className)} {...props}>
    {children}
  </button>
);

// Badge
type BadgeColor = "success" | "error" | "warning" | "brand" | "gray";

const badgeColors: Record<BadgeColor, string> = {
  success: "bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400",
  error: "bg-error-50 text-error-700 dark:bg-error-500/10 dark:text-error-400",
  warning: "bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-400",
  brand: "bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400",
  gray: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
};

export const Badge = ({ color = "gray", children }: { color?: BadgeColor; children: React.ReactNode }) => (
  <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", badgeColors[color])}>
    {children}
  </span>
);

// Table
export const Table = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className="overflow-x-auto">
    <table className={cn("min-w-full", className)}>{children}</table>
  </div>
);
export const TableHeader = ({ children }: { children: React.ReactNode }) => (
  <thead className="border-b border-gray-200 dark:border-gray-800">{children}</thead>
);
export const TableBody = ({ children }: { children: React.ReactNode }) => (
  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">{children}</tbody>
);
export const TableRow = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <tr className={cn("hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors", className)}>{children}</tr>
);
export const TableCell = ({ children, isHeader, className }: { children: React.ReactNode; isHeader?: boolean; className?: string }) => {
  const Tag = isHeader ? "th" : "td";
  return <Tag className={cn(isHeader ? "px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider" : "px-4 py-3 text-sm text-gray-700 dark:text-gray-300", className)}>{children}</Tag>;
};

// Card
export const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-theme-xs", className)}>
    {children}
  </div>
);

// Alert
type AlertType = "success" | "error" | "warning" | "info";
const alertStyles: Record<AlertType, string> = {
  success: "bg-success-50 border-success-200 text-success-700 dark:bg-success-500/10 dark:border-success-500/20 dark:text-success-400",
  error: "bg-error-50 border-error-200 text-error-700 dark:bg-error-500/10 dark:border-error-500/20 dark:text-error-400",
  warning: "bg-warning-50 border-warning-200 text-warning-700 dark:bg-warning-500/10 dark:border-warning-500/20 dark:text-warning-400",
  info: "bg-brand-50 border-brand-200 text-brand-700 dark:bg-brand-500/10 dark:border-brand-500/20 dark:text-brand-400",
};

export const Alert = ({ type = "info", children }: { type?: AlertType; children: React.ReactNode }) => (
  <div className={cn("flex items-start gap-3 px-4 py-3 rounded-lg border text-sm", alertStyles[type])}>
    {children}
  </div>
);

// Modal
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children, footer }: ModalProps) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-gray-900/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-900 rounded-xl shadow-theme-xl border border-gray-200 dark:border-gray-800 w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <div className="px-6 py-4">{children}</div>
        {footer && <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-3">{footer}</div>}
      </div>
    </div>
  );
};
