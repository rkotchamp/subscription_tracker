export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard-layout">
      <nav>{/* Dashboard navigation */}</nav>
      <main>{children}</main>
    </div>
  );
}
