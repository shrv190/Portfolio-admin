"use client";
import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("projects");
  const [status, setStatus] = useState("");

  // Profile State
  const [studentName, setStudentName] = useState("");

  // Projects State
  const [projects, setProjects] = useState<any[]>([]);
  const [projId, setProjId] = useState<string | null>(null);
  const [projTitle, setProjTitle] = useState("");
  const [projDesc, setProjDesc] = useState("");
  const [projCat, setProjCat] = useState("Software");
  const [projImg, setProjImg] = useState("");
  const [projShowImg, setProjShowImg] = useState(true);

  // Experiences State
  const [experiences, setExperiences] = useState<any[]>([]);
  const [expId, setExpId] = useState<string | null>(null);
  const [expTitle, setExpTitle] = useState("");
  const [expCompany, setExpCompany] = useState("");
  const [expType, setExpType] = useState("Internship");
  const [expDesc, setExpDesc] = useState("");
  const [expImg, setExpImg] = useState("");
  const [expShowImg, setExpShowImg] = useState(true);

  const fetchData = async () => {
    try {
      // Profile
      const profSnap = await getDoc(doc(db, "settings", "profile"));
      if (profSnap.exists()) setStudentName(profSnap.data().name || "");

      // Projects
      const projSnap = await getDocs(collection(db, "projects"));
      setProjects(projSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      // Experiences
      const expSnap = await getDocs(collection(db, "experiences"));
      setExperiences(expSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const showStatus = (msg: string) => {
    setStatus(msg);
    setTimeout(() => setStatus(""), 3000);
  };

  // --- Handlers ---
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, "settings", "profile"), { name: studentName }, { merge: true });
      showStatus("Profile saved!");
    } catch (e) { showStatus("Error saving profile"); }
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { title: projTitle, description: projDesc, category: projCat, imageUrl: projImg, showImagePreview: projShowImg };
    try {
      if (projId) await updateDoc(doc(db, "projects", projId), { ...data, updatedAt: new Date().toISOString() });
      else await addDoc(collection(db, "projects"), { ...data, createdAt: new Date().toISOString() });
      setProjId(null); setProjTitle(""); setProjDesc(""); setProjImg(""); setProjShowImg(true);
      fetchData(); showStatus("Project saved!");
    } catch (e) { showStatus("Error saving project"); }
  };

  const handleSaveExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { title: expTitle, company: expCompany, type: expType, description: expDesc, imageUrl: expImg, showImagePreview: expShowImg };
    try {
      if (expId) await updateDoc(doc(db, "experiences", expId), { ...data, updatedAt: new Date().toISOString() });
      else await addDoc(collection(db, "experiences"), { ...data, createdAt: new Date().toISOString() });
      setExpId(null); setExpTitle(""); setExpCompany(""); setExpDesc(""); setExpImg(""); setExpShowImg(true);
      fetchData(); showStatus("Experience saved!");
    } catch (e) { showStatus("Error saving experience"); }
  };

  const deleteDocItem = async (col: string, id: string) => {
    if (confirm("Are you sure?")) {
      await deleteDoc(doc(db, col, id));
      fetchData();
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="flex justify-between items-end border-b pb-4">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-slate-600">Manage all content</p>
          </div>
          <div className="space-x-2">
            <button onClick={() => setActiveTab("profile")} className={`px-4 py-2 rounded ${activeTab === "profile" ? "bg-blue-600 text-white" : "bg-slate-200"}`}>Profile</button>
            <button onClick={() => setActiveTab("projects")} className={`px-4 py-2 rounded ${activeTab === "projects" ? "bg-blue-600 text-white" : "bg-slate-200"}`}>Projects</button>
            <button onClick={() => setActiveTab("experiences")} className={`px-4 py-2 rounded ${activeTab === "experiences" ? "bg-blue-600 text-white" : "bg-slate-200"}`}>Experiences & Internships</button>
          </div>
        </header>
        
        {status && <div className="bg-green-100 text-green-800 p-3 rounded text-center">{status}</div>}

        {/* PROFILE TAB */}
        {activeTab === "profile" && (
          <section className="bg-white p-6 rounded shadow border">
            <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
            <form onSubmit={handleSaveProfile} className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium mb-1">Student Name</label>
                <input type="text" value={studentName} onChange={e => setStudentName(e.target.value)} className="w-full p-2 border rounded" required />
              </div>
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save Name</button>
            </form>
          </section>
        )}

        {/* PROJECTS TAB */}
        {activeTab === "projects" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="bg-white p-6 rounded shadow border">
              <h2 className="text-xl font-semibold mb-4">{projId ? "Edit Project" : "Add Project"}</h2>
              <form onSubmit={handleSaveProject} className="space-y-4">
                <input type="text" placeholder="Title" value={projTitle} onChange={e => setProjTitle(e.target.value)} className="w-full p-2 border rounded" required />
                <textarea placeholder="Description" value={projDesc} onChange={e => setProjDesc(e.target.value)} className="w-full p-2 border rounded h-24" required />
                <select value={projCat} onChange={e => setProjCat(e.target.value)} className="w-full p-2 border rounded">
                  <option>Software</option><option>Hardware</option><option>Extracurricular</option>
                </select>
                <input type="text" placeholder="Image URL (optional)" value={projImg} onChange={e => setProjImg(e.target.value)} className="w-full p-2 border rounded" />
                <label className="flex items-center space-x-2">
                  <input type="checkbox" checked={projShowImg} onChange={e => setProjShowImg(e.target.checked)} />
                  <span>Show Image Preview</span>
                </label>
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 bg-blue-600 text-white px-4 py-2 rounded">Save</button>
                  {projId && <button type="button" onClick={() => setProjId(null)} className="flex-1 bg-slate-200 px-4 py-2 rounded">Cancel</button>}
                </div>
              </form>
            </section>
            <section className="bg-white p-6 rounded shadow border overflow-y-auto max-h-[600px]">
              <h2 className="text-xl font-semibold mb-4">Existing Projects</h2>
              {projects.map(p => (
                <div key={p.id} className="border p-3 mb-3 rounded flex justify-between items-center">
                  <div><p className="font-bold">{p.title}</p><p className="text-sm text-slate-500">{p.category}</p></div>
                  <div className="space-x-2">
                    <button onClick={() => { setProjId(p.id); setProjTitle(p.title); setProjDesc(p.description); setProjCat(p.category); setProjImg(p.imageUrl||""); setProjShowImg(p.showImagePreview??true); }} className="text-blue-600 text-sm">Edit</button>
                    <button onClick={() => deleteDocItem("projects", p.id)} className="text-red-600 text-sm">Del</button>
                  </div>
                </div>
              ))}
            </section>
          </div>
        )}

        {/* EXPERIENCES TAB */}
        {activeTab === "experiences" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="bg-white p-6 rounded shadow border">
              <h2 className="text-xl font-semibold mb-4">{expId ? "Edit Experience" : "Add Experience"}</h2>
              <form onSubmit={handleSaveExperience} className="space-y-4">
                <input type="text" placeholder="Role/Title" value={expTitle} onChange={e => setExpTitle(e.target.value)} className="w-full p-2 border rounded" required />
                <input type="text" placeholder="Company/Organization" value={expCompany} onChange={e => setExpCompany(e.target.value)} className="w-full p-2 border rounded" required />
                <select value={expType} onChange={e => setExpType(e.target.value)} className="w-full p-2 border rounded">
                  <option>Internship</option><option>Full-Time</option><option>Club/Society</option>
                </select>
                <textarea placeholder="Description" value={expDesc} onChange={e => setExpDesc(e.target.value)} className="w-full p-2 border rounded h-24" required />
                <input type="text" placeholder="Image URL (optional)" value={expImg} onChange={e => setExpImg(e.target.value)} className="w-full p-2 border rounded" />
                <label className="flex items-center space-x-2">
                  <input type="checkbox" checked={expShowImg} onChange={e => setExpShowImg(e.target.checked)} />
                  <span>Show Image Preview</span>
                </label>
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 bg-blue-600 text-white px-4 py-2 rounded">Save</button>
                  {expId && <button type="button" onClick={() => setExpId(null)} className="flex-1 bg-slate-200 px-4 py-2 rounded">Cancel</button>}
                </div>
              </form>
            </section>
            <section className="bg-white p-6 rounded shadow border overflow-y-auto max-h-[600px]">
              <h2 className="text-xl font-semibold mb-4">Existing Experiences</h2>
              {experiences.map(e => (
                <div key={e.id} className="border p-3 mb-3 rounded flex justify-between items-center">
                  <div><p className="font-bold">{e.title}</p><p className="text-sm text-slate-500">{e.company} ({e.type})</p></div>
                  <div className="space-x-2">
                    <button onClick={() => { setExpId(e.id); setExpTitle(e.title); setExpCompany(e.company); setExpType(e.type); setExpDesc(e.description); setExpImg(e.imageUrl||""); setExpShowImg(e.showImagePreview??true); }} className="text-blue-600 text-sm">Edit</button>
                    <button onClick={() => deleteDocItem("experiences", e.id)} className="text-red-600 text-sm">Del</button>
                  </div>
                </div>
              ))}
            </section>
          </div>
        )}

      </div>
    </main>
  );
}
