"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Child = { id: string; name: string };
type Parent = { id: string; name: string; children: Child[] };

function EditableName({
  id,
  name,
  onSaved,
}: {
  id: string;
  name: string;
  onSaved: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(name);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    await fetch(`/api/admin/categories/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: value }),
    });
    setSaving(false);
    setEditing(false);
    onSaved();
  }

  if (editing) {
    return (
      <div className="flex items-center gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="bg-black border border-white/15 px-2 py-1 text-sm text-cream"
          autoFocus
        />
        <button onClick={save} disabled={saving} className="text-xs text-gold hover:text-goldBright">
          {saving ? "..." : "Save"}
        </button>
        <button onClick={() => { setEditing(false); setValue(name); }} className="text-xs text-creamDim">
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button onClick={() => setEditing(true)} className="text-left hover:text-gold transition-colors">
      {name}
    </button>
  );
}

export default function AdminCategoryManager({ categories }: { categories: Parent[] }) {
  const router = useRouter();
  const [newParentName, setNewParentName] = useState("");
  const [newChildName, setNewChildName] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  function refresh() {
    router.refresh();
  }

  async function addParent() {
    if (!newParentName.trim()) return;
    await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newParentName }),
    });
    setNewParentName("");
    refresh();
  }

  async function addChild(parentId: string) {
    const name = newChildName[parentId]?.trim();
    if (!name) return;
    await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, parentId }),
    });
    setNewChildName((prev) => ({ ...prev, [parentId]: "" }));
    refresh();
  }

  async function deleteCategory(id: string) {
    if (!confirm("Delete this category?")) return;
    setError(null);
    const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error);
      return;
    }
    refresh();
  }

  return (
    <div className="max-w-2xl">
      {error && <p className="text-red text-sm mb-4">{error}</p>}

      <div className="flex gap-2 mb-6">
        <input
          value={newParentName}
          onChange={(e) => setNewParentName(e.target.value)}
          placeholder="New main category (e.g. Cycling Gear)"
          className="flex-1 bg-black border border-white/15 px-3 py-2 text-sm text-cream"
        />
        <button onClick={addParent} className="bg-gold text-black px-4 py-2 text-xs font-bold uppercase hover:bg-goldBright">
          Add Category
        </button>
      </div>

      <div className="space-y-4">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-carbon border border-white/10 p-5">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-display font-bold uppercase text-base">
                <EditableName id={cat.id} name={cat.name} onSaved={refresh} />
              </h4>
              <button onClick={() => deleteCategory(cat.id)} className="text-xs text-red hover:underline">
                Delete
              </button>
            </div>

            {cat.children.length > 0 && (
              <ul className="space-y-2 mb-3 pl-4 border-l border-white/10">
                {cat.children.map((child) => (
                  <li key={child.id} className="flex justify-between items-center text-sm">
                    <span className="text-creamDim">
                      <EditableName id={child.id} name={child.name} onSaved={refresh} />
                    </span>
                    <button onClick={() => deleteCategory(child.id)} className="text-xs text-red/70 hover:text-red hover:underline">
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="flex gap-2">
              <input
                value={newChildName[cat.id] || ""}
                onChange={(e) => setNewChildName((prev) => ({ ...prev, [cat.id]: e.target.value }))}
                placeholder="New sub-category"
                className="flex-1 bg-black border border-white/15 px-3 py-1.5 text-xs text-cream"
              />
              <button
                onClick={() => addChild(cat.id)}
                className="border border-white/20 px-3 py-1.5 text-xs uppercase text-creamDim hover:border-gold hover:text-gold"
              >
                + Add
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
