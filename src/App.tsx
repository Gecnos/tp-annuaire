import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/layouts/sideBar";
import Topbar from "./components/layouts/topBar";
import Dashboard from "./pages/Dashboard";
import ContactDetail from "./pages/contactDetail";
import LabelPage from "./pages/LabelPage";
import NewContactModal from "./components/NewContactModal";
import { useContacts } from "./hooks/useContact";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { addContact } = useContacts();

  return (
    <Router>
      <NewContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddContact={addContact}
      />

      <div className="flex h-screen bg-gray-50 text-slate-800 font-sans overflow-hidden">
        {/* Overlay mobile pour fermer la sidebar */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-20 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar : drawer sur mobile, fixe sur desktop */}
        <div
          className={`fixed inset-y-0 left-0 z-30 transition-transform duration-300 lg:static lg:translate-x-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar
            onOpenNewContact={() => {
              setIsModalOpen(true);
              setIsSidebarOpen(false);
            }}
            onClose={() => setIsSidebarOpen(false)}
          />
        </div>

        <main className="flex-1 flex flex-col min-w-0">
          <Topbar onMenuOpen={() => setIsSidebarOpen(true)} />

          <div className="flex-1 overflow-auto bg-slate-50/50 p-4 sm:p-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/contact/:id" element={<ContactDetail />} />
              <Route path="/label/:group" element={<LabelPage />} />
              <Route
                path="*"
                element={
                  <div className="flex items-center justify-center h-full text-gray-400 italic">
                    Page en construction...
                  </div>
                }
              />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
