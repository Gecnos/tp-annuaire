import { useNavigate, useParams } from "react-router-dom";
import { useContacts } from "../hooks/useContact";
import { ArrowLeft, Mail, Phone, Tag } from "lucide-react";

export default function ContactDetail() {
  const { id } = useParams<{ id: string }>();
  const { getContact } = useContacts();
  const navigate = useNavigate();

  const contact = getContact(id!);

  // Si le contact n'existe pas (mauvais id), on affiche un message
  if (!contact) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-4">
        <p className="text-lg italic">Contact introuvable.</p>
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
        >
          <ArrowLeft size={16} />
          Retour à la liste
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-4">
      {/* Bouton retour */}
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors mb-6 group"
      >
        <ArrowLeft
          size={16}
          className="group-hover:-translate-x-1 transition-transform"
        />
        Retour aux contacts
      </button>

      {/* Carte principale */}
      <div className="bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 overflow-hidden">
        {/* En-tête avec avatar */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-10 flex items-center gap-6 border-b border-gray-100">
          <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-blue-700 font-bold text-2xl shadow-md border border-blue-100 shrink-0 overflow-hidden">
            {contact.avatarUrl ? (
              <img
                src={contact.avatarUrl}
                alt={contact.name}
                className="w-full h-full object-cover"
              />
            ) : (
              contact.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .substring(0, 2)
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{contact.name}</h1>
            {contact.role && (
              <p className="text-sm text-gray-500 mt-1">{contact.role}</p>
            )}
            {/* Badges de groupe */}
            <div className="flex flex-wrap gap-2 mt-3">
              {contact.groups?.map((group) => {
                const colors: Record<string, string> = {
                  Work: "bg-blue-100 text-blue-700",
                  Family: "bg-green-100 text-green-700",
                  Friends: "bg-purple-100 text-purple-700",
                };
                const colorClass = colors[group] || "bg-gray-100 text-gray-700";
                return (
                  <span
                    key={group}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${colorClass}`}
                  >
                    <Tag size={10} />
                    {group}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Informations de contact */}
        <div className="p-8 space-y-5">
          <h2 className="text-xs uppercase tracking-widest font-bold text-gray-400 mb-4">
            Coordonnées
          </h2>

          {/* Email */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
              <Mail size={18} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Email</p>
              <a
                href={`mailto:${contact.email}`}
                className="text-sm font-semibold text-gray-800 hover:text-blue-600 transition-colors"
              >
                {contact.email || "—"}
              </a>
            </div>
          </div>

          {/* Téléphone */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600 shrink-0">
              <Phone size={18} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Téléphone</p>
              <a
                href={`tel:${contact.phone}`}
                className="text-sm font-semibold text-gray-800 hover:text-green-600 transition-colors"
              >
                {contact.phone || "—"}
              </a>
            </div>
          </div>

          {/* Notes */}
          {contact.notes && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h2 className="text-xs uppercase tracking-widest font-bold text-gray-400 mb-3">
                Notes
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed bg-slate-50 rounded-xl p-4 border border-gray-100">
                {contact.notes}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
