import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MoreHorizontal, Eye, Edit2, Trash2 } from "lucide-react";
import { useContacts } from "../hooks/useContact";
import { Contact } from "../types";
import NewContactModal from "../components/NewContactModal";

// Couleurs et libellés par groupe
const GROUP_CONFIG: Record<
  string,
  { color: string; dot: string; label: string }
> = {
  Work: {
    color: "bg-blue-100 text-blue-700",
    dot: "bg-blue-500",
    label: "Travail",
  },
  Family: {
    color: "bg-green-100 text-green-700",
    dot: "bg-green-500",
    label: "Famille",
  },
  Friends: {
    color: "bg-purple-100 text-purple-700",
    dot: "bg-purple-500",
    label: "Amis",
  },
};

const PAGE_SIZE = 5;

export default function LabelPage() {
  const { group } = useParams<{ group: string }>();
  const { contacts, deleteContact, updateContact } = useContacts();
  const navigate = useNavigate();

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [contactToEdit, setContactToEdit] = useState<Contact | null>(null);
  const tableRef = useRef<HTMLTableElement>(null);

  const config = GROUP_CONFIG[group ?? ""] ?? {
    color: "bg-gray-100 text-gray-700",
    dot: "bg-gray-400",
    label: group ?? "Label",
  };

  // Filtrer les contacts par groupe
  const filtered = contacts.filter((c) => c.groups?.includes(group ?? ""));

  // Remettre à la page 1 quand le groupe change
  useEffect(() => {
    setCurrentPage(1);
  }, [group]);

  // Fermer le menu si clic en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tableRef.current &&
        !tableRef.current.contains(event.target as Node)
      ) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, filtered.length);
  const pageContacts = filtered.slice(startIndex, endIndex);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="w-full max-w-6xl mx-auto mt-4">
      {/* Modale d'édition */}
      <NewContactModal
        isOpen={contactToEdit !== null}
        onClose={() => setContactToEdit(null)}
        onAddContact={() => {}}
        onUpdateContact={(id, data) => {
          updateContact(id, data);
          setContactToEdit(null);
        }}
        contactToEdit={contactToEdit}
      />

      {/* En-tête */}
      <div className="flex items-center gap-4 mb-6">
        <div
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold ${config.color}`}
        >
          <div className={`w-2.5 h-2.5 rounded-full ${config.dot}`} />
          {config.label}
        </div>
        <span className="text-sm text-gray-400 font-medium">
          {filtered.length} contact{filtered.length > 1 ? "s" : ""}
        </span>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto min-h-[200px]">
          <table ref={tableRef} className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-bold bg-slate-50/50">
                <th className="px-6 py-5">Nom</th>
                <th className="px-6 py-5">Email</th>
                <th className="px-6 py-5">Téléphone</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {pageContacts.map((contact) => (
                <tr
                  key={contact.id}
                  className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                  onClick={() => navigate(`/contact/${contact.id}`)}
                >
                  {/* Avatar + Nom */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold overflow-hidden shrink-0 border border-gray-200">
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
                        <div className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {contact.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {contact.role || "Contact"}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                    {contact.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {contact.phone}
                  </td>

                  {/* Actions dropdown */}
                  <td
                    className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() =>
                        setOpenMenuId(
                          openMenuId === contact.id ? null : contact.id,
                        )
                      }
                      className="text-gray-400 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-blue-50 focus:outline-none"
                    >
                      <MoreHorizontal size={20} />
                    </button>

                    {/* Menu dropdown principal */}
                    {openMenuId === contact.id &&
                      confirmDeleteId !== contact.id && (
                        <div className="absolute right-10 top-12 w-44 bg-white rounded-lg shadow-lg border border-gray-100 z-50 py-1 flex flex-col items-start overflow-hidden">
                          <button
                            onClick={() => navigate(`/contact/${contact.id}`)}
                            className="w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                          >
                            <Eye size={16} className="text-gray-400" /> Profil
                          </button>
                          <button
                            onClick={() => {
                              setContactToEdit(contact);
                              setOpenMenuId(null);
                            }}
                            className="w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                          >
                            <Edit2 size={16} className="text-gray-400" />{" "}
                            Modifier
                          </button>
                          <div className="w-full border-t border-gray-100 my-1" />
                          {/* Retirer du label sans supprimer le contact */}
                          <button
                            onClick={() => {
                              const newGroups = (contact.groups ?? []).filter(
                                (g) => g !== group,
                              );
                              updateContact(contact.id, { groups: newGroups });
                              setOpenMenuId(null);
                            }}
                            className="w-full px-4 py-2.5 text-sm text-orange-600 hover:bg-orange-50 flex items-center gap-2 transition-colors"
                          >
                            <Trash2 size={16} className="text-orange-400" />{" "}
                            Retirer du label
                          </button>
                          {/* Supprimer le contact entier → confirmation inline */}
                          <button
                            onClick={() => setConfirmDeleteId(contact.id)}
                            className="w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                          >
                            <Trash2 size={16} className="text-red-400" />{" "}
                            Supprimer
                          </button>
                        </div>
                      )}

                    {/* Confirmation inline de suppression définitive */}
                    {confirmDeleteId === contact.id && (
                      <div className="absolute right-10 top-12 w-52 bg-white rounded-lg shadow-lg border border-red-100 z-50 p-3">
                        <p className="text-xs text-gray-700 font-semibold mb-3">
                          Supprimer ce contact définitivement ?
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              deleteContact(contact.id);
                              if (
                                pageContacts.length === 1 &&
                                currentPage > 1
                              ) {
                                setCurrentPage((p) => p - 1);
                              }
                              setConfirmDeleteId(null);
                              setOpenMenuId(null);
                            }}
                            className="flex-1 px-3 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                          >
                            Supprimer
                          </button>
                          <button
                            onClick={() => {
                              setConfirmDeleteId(null);
                              setOpenMenuId(null);
                            }}
                            className="flex-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                          >
                            Annuler
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-16 text-center text-gray-400 italic text-sm"
                  >
                    Aucun contact dans ce groupe.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-white">
          <span className="text-sm text-gray-500 font-medium">
            {filtered.length === 0
              ? "Aucun contact"
              : `Affichage de ${startIndex + 1} à ${endIndex} sur ${filtered.length} contacts`}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {"<"}
            </button>
            {pageNumbers.map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold transition-colors ${
                  page === currentPage
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                    : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {">"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
