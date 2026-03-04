import { useState, useEffect } from "react";
import {
  UserPlus,
  Pencil,
  User,
  Mail,
  Phone,
  Check,
  Plus,
  Camera,
} from "lucide-react";
import { GroupType, Contact } from "../types";

interface NewContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddContact: (contact: Omit<Contact, "id" | "activities">) => void;
  onUpdateContact?: (id: string, data: Partial<Contact>) => void;
  contactToEdit?: Contact | null;
}

export default function NewContactModal({
  isOpen,
  onClose,
  onAddContact,
  onUpdateContact,
  contactToEdit,
}: NewContactModalProps) {
  const isEditMode = !!contactToEdit;

  //state du formulaire
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedGroups, setSelectedGroups] = useState<GroupType[]>([
    "Friends",
  ]);
  const [notes, setNotes] = useState("");
  const [newGroupInput, setNewGroupInput] = useState("");
  const [showGroupInput, setShowGroupInput] = useState(false);

  // Pré-remplir les champs quand on ouvre en mode édition
  useEffect(() => {
    if (isOpen && contactToEdit) {
      setName(contactToEdit.name);
      setEmail(contactToEdit.email);
      setPhone(contactToEdit.phone);
      setSelectedGroups(contactToEdit.groups ?? []);
      setNotes(contactToEdit.notes ?? "");
    } else if (isOpen && !contactToEdit) {
      setName("");
      setEmail("");
      setPhone("");
      setSelectedGroups(["Friends"]);
      setNotes("");
    }
  }, [isOpen, contactToEdit]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!name.trim()) return;

    if (isEditMode && contactToEdit && onUpdateContact) {
      // Mode édition : on met à jour le contact existant
      onUpdateContact(contactToEdit.id, {
        name,
        email,
        phone,
        groups: selectedGroups,
        notes,
      });
    } else {
      // Mode création : on ajoute un nouveau contact
      onAddContact({
        name,
        email,
        phone,
        groups: selectedGroups,
        notes,
        avatarUrl: null,
      });
    }
    onClose();
  };

  const toggleGroup = (group: GroupType) => {
    if (selectedGroups.includes(group)) {
      setSelectedGroups(selectedGroups.filter((e) => e !== group));
    } else {
      setSelectedGroups([...selectedGroups, group]);
    }
  };

  const handleAddCustomGroup = () => {
    const trimmed = newGroupInput.trim();
    if (trimmed && !selectedGroups.includes(trimmed)) {
      setSelectedGroups([...selectedGroups, trimmed]);
    }
    setNewGroupInput("");
    setShowGroupInput(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-[480px] rounded-2xl shadow-xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 text-blue-600 p-2 rounded-lg">
              <UserPlus size={20} strokeWidth={2.5} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              {isEditMode ? "Modifier le contact" : "Nouveau contact"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Save
          </button>
        </div>

        <div className="p-6 pb-6 overflow-y-auto custom-scrollbar space-y-5">
          {/* Avatar */}
          <div className="flex flex-col items-start">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 bg-gray-50">
                <Camera size={14} />
              </div>
              <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full border-2 border-white hover:bg-blue-700 transition-colors">
                <Pencil size={14} />
              </button>
            </div>
            <h3 className="mt-3 font-semibold text-gray-900">Ajout de photo</h3>
          </div>

          {/* Formulaire */}
          <div className="space-y-5">
            {/* Nom */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Nom Complet
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <User size={18} />
                </div>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder=" ex : John Doe"
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm text-gray-700 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Adresse Mail
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder=" ex : johndoe@example.com"
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm text-gray-700 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Téléphone
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Phone size={18} />
                </div>
                <input
                  type="number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder=" ex : 22901771234567"
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm text-gray-700 placeholder-gray-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>

            {/* Groupes */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Labels
              </label>
              <div className="flex flex-wrap gap-2">
                {/* Badge Work */}
                <button
                  type="button"
                  onClick={() => toggleGroup("Work")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedGroups.includes("Work")
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <div className="w-2 h-2 rounded-full bg-blue-400" />
                  Travail
                  {selectedGroups.includes("Work") && (
                    <Check size={13} className="ml-0.5" />
                  )}
                </button>

                {/* Badge Family */}
                <button
                  type="button"
                  onClick={() => toggleGroup("Family")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedGroups.includes("Family")
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  Famille
                  {selectedGroups.includes("Family") && (
                    <Check size={13} className="ml-0.5" />
                  )}
                </button>

                {/* Badge Friends */}
                <button
                  type="button"
                  onClick={() => toggleGroup("Friends")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedGroups.includes("Friends")
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <div className="w-2 h-2 rounded-full bg-purple-400" />
                  Amis
                  {selectedGroups.includes("Friends") && (
                    <Check size={13} className="ml-0.5" />
                  )}
                </button>

                {/* Labels custom ajoutés */}
                {selectedGroups
                  .filter(
                    (g) => g !== "Work" && g !== "Family" && g !== "Friends",
                  )
                  .map((g) => (
                    <span
                      key={g}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-700 text-white"
                    >
                      <div className="w-2 h-2 rounded-full bg-gray-400" />
                      {g}
                      <button
                        type="button"
                        onClick={() => toggleGroup(g)}
                        className="ml-1 hover:text-red-300 transition-colors"
                      >
                        ✕
                      </button>
                    </span>
                  ))}

                {/* Bouton / Input ajouter un groupe custom */}
                {showGroupInput ? (
                  <div className="flex items-center gap-1">
                    <input
                      autoFocus
                      type="text"
                      value={newGroupInput}
                      onChange={(e) => setNewGroupInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAddCustomGroup();
                        if (e.key === "Escape") {
                          setShowGroupInput(false);
                          setNewGroupInput("");
                        }
                      }}
                      placeholder="Nouveau label..."
                      className="w-32 px-2 py-1 text-sm border border-blue-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomGroup}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    >
                      <Check size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowGroupInput(false);
                        setNewGroupInput("");
                      }}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowGroupInput(true)}
                    className="w-8 h-8 flex items-center justify-center rounded-full border border-dashed border-gray-300 text-gray-400 hover:text-blue-600 hover:border-blue-400 transition-colors"
                    title="Ajouter un label"
                  >
                    <Plus size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ajouter des notes..."
                rows={3}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm text-gray-700 placeholder-gray-400 resize-none"
              />
            </div>
          </div>
        </div>
        {/* Pied de la modale */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl text-center">
          <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">
            Secure Contact Management
          </p>
        </div>
      </div>
    </div>
  );
}
