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
  const { addContact } = useContacts();

  return (
    <Router>
      {/* On ajoute la modale ici. Elle se gère toute seule si isOpen est faux */}
      <NewContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddContact={addContact}
      />

      <div className="flex h-screen bg-gray-50 text-slate-800 font-sans overflow-hidden">
        {/* On passe la fonction pour ouvrir la modale à la Sidebar */}
        <Sidebar onOpenNewContact={() => setIsModalOpen(true)} />

        <main className="flex-1 flex flex-col min-w-0">
          <Topbar />

          <div className="flex-1 overflow-auto bg-slate-50/50 p-8">
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
