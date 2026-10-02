"use client";
import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AdminDashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Software");
  const [status, setStatus] = useState("");
  
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "projects"));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Saving...");
    try {
      if (editingId) {
        await updateDoc(doc(db, "projects", editingId), {
          title,
          description,
          category,
          updatedAt: new Date().toISOString()
        });
        setStatus("Project updated successfully!");
        setEditingId(null);
      } else {
        await addDoc(collection(db, "projects"), {
          title,
          description,
          category,
          createdAt: new Date().toISOString()
        });
        setStatus("Project added successfully!");
      }
      
      setTitle("");
      setDescription("");
      setCategory("Software");
      fetchProjects(); // Refresh the list
      
      setTimeout(() => setStatus(""), 3000);
    } catch (error) {
      console.error(error);
      setStatus("Error saving project.");
    }
  };

  const handleEdit = (project: any) => {
    setEditingId(project.id);
    setTitle(project.title);
    setDescription(project.description);
    setCategory(project.category || "Software");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteDoc(doc(db, "projects", id));
        fetchProjects(); // Refresh the list after deletion
      } catch (error) {
        console.error("Error deleting project:", error);
        alert("Failed to delete project");
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setCategory("Software");
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="border-b pb-4">
          <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
          <p className="text-slate-600">Manage your portfolio content</p>
        </header>

        <section className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h2 className="text-xl font-semibold mb-4">{editingId ? "Edit Project" : "Add New Project"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Project Title</label>
              <input 
                type="text" 
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea 
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
                className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none h-24"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <select 
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="Software">Software/Coding</option>
                <option value="Hardware">Hardware/Electronics</option>
                <option value="Extracurricular">Extracurricular</option>
              </select>
            </div>
            <div className="flex gap-4">
              <button 
                type="submit" 
                className="flex-1 bg-blue-600 text-white font-medium py-2 px-4 rounded hover:bg-blue-700 transition-colors"
              >
                {editingId ? "Update Project" : "Add Project"}
              </button>
              {editingId && (
                <button 
                  type="button" 
                  onClick={handleCancelEdit}
                  className="flex-1 bg-slate-200 text-slate-800 font-medium py-2 px-4 rounded hover:bg-slate-300 transition-colors"
                >
                  Cancel Edit
                </button>
              )}
            </div>
            {status && <p className="text-center mt-4 text-sm font-medium text-blue-600">{status}</p>}
          </form>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h2 className="text-xl font-semibold mb-4">Manage Existing Projects</h2>
          {projects.length === 0 ? (
            <p className="text-slate-500">No projects found. Add one above.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700">
                    <th className="p-3 border-b">Title</th>
                    <th className="p-3 border-b">Category</th>
                    <th className="p-3 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map(project => (
                    <tr key={project.id} className="border-b hover:bg-slate-50">
                      <td className="p-3 font-medium">{project.title}</td>
                      <td className="p-3 text-slate-600">{project.category || "General"}</td>
                      <td className="p-3 flex gap-2">
                        <button 
                          onClick={() => handleEdit(project)}
                          className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 text-sm font-medium transition-colors"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(project.id)}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm font-medium transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
