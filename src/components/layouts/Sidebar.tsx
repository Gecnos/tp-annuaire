import { NavLink } from "react-router-dom";
import { User, Plus, Home, X } from "lucide-react";
import { useContacts } from "../../hooks/useContact";

interface SidebarProps {
  onOpenNewContact: () => void;
  onClose?: () => void;
}

// Labels prédéfinis avec leur couleur
const BUILT_IN_LABELS = [
  { key: "Work", label: "Travail", dot: "bg-blue-500" },
  { key: "Family", label: "Famille", dot: "bg-green-500" },
  { key: "Friends", label: "Amis", dot: "bg-purple-500" },
];

export default function Sidebar({ onOpenNewContact, onClose }: SidebarProps) {
  const { contacts } = useContacts();

  // Tous les groupes uniques présents dans les contacts
  const allGroups = Array.from(
    new Set(contacts.flatMap((c) => c.groups ?? [])),
  );

  // Labels custom = groupes qui ne font pas partie des built-in
  const builtInKeys = BUILT_IN_LABELS.map((l) => l.key);
  const customLabels = allGroups.filter((g) => !builtInKeys.includes(g));

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
      isActive ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"
    }`;

  const labelLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
      isActive ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"
    }`;

  return (
    <div className="h-full flex flex-col bg-slate-50 border-r border-gray-200 w-64">
      {/* Logo + bouton fermer (mobile uniquement) */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white p-2 rounded-lg">
            <User size={20} strokeWidth={2.5} />
          </div>
          <h1 className="font-bold text-gray-900 text-lg leading-tight">
            ContactManager
          </h1>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-200 transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
        {/* Accueil */}
        <NavLink to="/" end className={navLinkClass} onClick={onClose}>
          <Home size={18} />
          Tous les contacts
        </NavLink>

        {/* Section Labels */}
        <div className="mt-8 mb-2 px-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
          Labels
        </div>

        {/* Labels prédéfinis */}
        {BUILT_IN_LABELS.map(({ key, label, dot }) => (
          <NavLink key={key} to={`/label/${key}`} className={labelLinkClass} onClick={onClose}>
            <div className={`w-2.5 h-2.5 rounded-full ${dot} shrink-0`} />
            {label}
          </NavLink>
        ))}

        {/* Labels custom (ajoutés via la modale) */}
        {customLabels.map((group) => (
          <NavLink
            key={group}
            to={`/label/${encodeURIComponent(group)}`}
            className={labelLinkClass}
            onClick={onClose}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-gray-400 shrink-0" />
            {group}
          </NavLink>
        ))}
      </nav>

      {/* Bouton Ajouter */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onOpenNewContact}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors"
        >
          <Plus size={20} />
          Ajouter un contact
        </button>
      </div>
    </div>
  );
}
