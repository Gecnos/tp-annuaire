import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MoreHorizontal, Eye, Edit2, Trash2 } from "lucide-react";
import { useContacts } from "../hooks/useContact";
import { Contact } from "../types";
import NewContactModal from "../components/NewContactModal";

interface GroupBadgeProps {
  group: string;
}

const GroupBadge = ({ group }: GroupBadgeProps) => {
  const colors: Record<string, string> = {
    Work: "bg-blue-100 text-blue-700",
    Family: "bg-green-100 text-green-700",
    Friends: "bg-purple-100 text-purple-700",
    default: "bg-gray-100 text-gray-700",
  };

  const colorClass = colors[group] || colors.default;

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${colorClass}`}
    >
      {group}
    </span>
  );
};

const PAGE_SIZE = 5;

export default function Dashboard() {
  const { contacts, deleteContact, updateContact, searchContacts } =
    useContacts();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";

  // Contacts filtrés selon la recherche
  const filteredContacts = searchContacts(query);

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [contactToEdit, setContactToEdit] = useState<Contact | null>(null);
  const tableRef = useRef<HTMLTableElement>(null);

  // Remettre à la page 1 si la recherche change
  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  // Fermer le menu si on clique en dehors
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

  // Pagination sur les contacts filtrés
  const totalPages = Math.max(
    1,
    Math.ceil(filteredContacts.length / PAGE_SIZE),
  );
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, filteredContacts.length);
  const pageContacts = filteredContacts.slice(startIndex, endIndex);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="w-full max-w-6xl mx-auto mt-2 sm:mt-4">
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
      {/* Onglets */}
      <div className="flex items-center gap-8 border-b border-gray-200 mb-4 sm:mb-6 px-2">
        <button className="text-blue-600 font-bold border-b-2 border-blue-600 pb-3 sm:pb-4 px-1 text-sm sm:text-base">
          {query
            ? `Résultats pour "${query}" (${filteredContacts.length})`
            : `Tous les contacts (${contacts.length})`}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto min-h-75">
          <table ref={tableRef} className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-bold bg-slate-50/50">
                <th className="px-4 sm:px-6 py-4 sm:py-5">Nom</th>
                <th className="hidden sm:table-cell px-6 py-5">Email</th>
                <th className="hidden md:table-cell px-6 py-5">Téléphone</th>
                <th className="hidden lg:table-cell px-6 py-5">Groupes</th>
                <th className="px-4 sm:px-6 py-4 sm:py-5 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {pageContacts.map((contact) => (
                <tr
                  key={contact.id}
                  className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                  onClick={() => navigate(`/contact/${contact.id}`)}
                >
                  {/* Nom & Avatar */}
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold overflow-hidden shrink-0 border border-gray-200">
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
                        <div className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors text-sm sm:text-base">
                          {contact.name}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500">
                          {contact.role || "Contact"}
                        </div>
                        {/* Infos compactes sur mobile */}
                        <div className="sm:hidden text-xs text-gray-400 mt-0.5">
                          {contact.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                    {contact.email}
                  </td>
                  <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {contact.phone}
                  </td>
                  <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2 flex-wrap">
                      {contact.groups?.map((group) => (
                        <GroupBadge key={group} group={group} />
                      ))}
                    </div>
                  </td>

                  {/* Actions avec dropdown */}
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

                    {/* Menu dropdown */}
                    {openMenuId === contact.id &&
                      confirmDeleteId !== contact.id && (
                        <div className="absolute right-10 top-12 w-40 bg-white rounded-lg shadow-lg border border-gray-100 z-50 py-1 flex flex-col items-start overflow-hidden">
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

                          <div className="w-full border-t border-gray-100 my-1"></div>

                          <button
                            onClick={() => setConfirmDeleteId(contact.id)}
                            className="w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                          >
                            <Trash2 size={16} className="text-red-400" />{" "}
                            Supprimer
                          </button>
                        </div>
                      )}

                    {/* Confirmation inline */}
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

              {filteredContacts.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-gray-400 italic text-sm"
                  >
                    {query ? `Aucun résultat pour "${query}".` : "Aucun contact pour le moment."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 sm:px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-white flex-wrap gap-3">
          <span className="text-xs sm:text-sm text-gray-500 font-medium">
            {filteredContacts.length === 0
              ? "Aucun contact"
              : `${startIndex + 1}–${endIndex} sur ${filteredContacts.length}`}
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
