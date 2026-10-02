"use client";
import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ImageUpload from "@/components/ImageUpload";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("profile");
  const [status, setStatus] = useState("");

  const [profile, setProfile] = useState<any>({ name: "", profession: "", heroImage: "", about: "", resumeLink: "", githubLink: "", linkedinLink: "" });
  
  // Projects
  const [projects, setProjects] = useState<any[]>([]);
  const [projImages, setProjImages] = useState<string[]>([]);
  const [projData, setProjData] = useState({ title: "", description: "", category: "Software" });
  
  // Contact
  const [contact, setContact] = useState<any[]>([]);
  const [contactData, setContactData] = useState({ type: "Email", description: "", link: "", linkText: "", iconUrl: "" });

  const fetchData = async () => {
    try {
      const p = await getDoc(doc(db, "settings", "profile"));
      if (p.exists()) setProfile(p.data());

      const prj = await getDocs(collection(db, "projects"));
      setProjects(prj.docs.map(d => ({ id: d.id, ...d.data() })));
      
      const con = await getDocs(collection(db, "contact"));
      setContact(con.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (error) { console.error(error); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await setDoc(doc(db, "settings", "profile"), profile, { merge: true });
    setStatus("Profile saved!");
    setTimeout(() => setStatus(""), 3000);
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, "projects"), { ...projData, images: projImages });
    setProjData({ title: "", description: "", category: "Software" });
    setProjImages([]);
    fetchData();
  };

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, "contact"), contactData);
    setContactData({ type: "Email", description: "", link: "", linkText: "", iconUrl: "" });
    fetchData();
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-6 flex gap-4 overflow-x-auto pb-4 border-b">
          {["profile", "projects", "contact"].map(t => (
            <button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-2 capitalize font-medium rounded ${activeTab === t ? "bg-teal-600 text-white" : "bg-slate-200"}`}>{t}</button>
          ))}
        </header>

        {status && <div className="p-3 bg-green-100 text-green-800 mb-4 rounded">{status}</div>}

        {activeTab === "profile" && (
          <section className="bg-white p-6 shadow border rounded">
            <h2 className="text-xl font-bold mb-4">Edit Profile & About</h2>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Name" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="border p-2 rounded w-full" />
                <input type="text" placeholder="Profession" value={profile.profession} onChange={e => setProfile({...profile, profession: e.target.value})} className="border p-2 rounded w-full" />
              </div>
              <textarea placeholder="About Me Text" value={profile.about} onChange={e => setProfile({...profile, about: e.target.value})} className="border p-2 rounded w-full h-24" />
              <div className="grid grid-cols-3 gap-4">
                <input type="text" placeholder="Resume Link" value={profile.resumeLink} onChange={e => setProfile({...profile, resumeLink: e.target.value})} className="border p-2 rounded w-full" />
                <input type="text" placeholder="GitHub Link" value={profile.githubLink} onChange={e => setProfile({...profile, githubLink: e.target.value})} className="border p-2 rounded w-full" />
                <input type="text" placeholder="LinkedIn Link" value={profile.linkedinLink} onChange={e => setProfile({...profile, linkedinLink: e.target.value})} className="border p-2 rounded w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Hero Profile Image</label>
                <ImageUpload onUpload={(url) => setProfile({...profile, heroImage: url})} />
                {profile.heroImage && <img src={profile.heroImage} className="w-24 h-24 object-cover rounded-full border shadow" />}
              </div>
              <button type="submit" className="bg-teal-600 text-white px-6 py-2 rounded">Save All</button>
            </form>
          </section>
        )}

        {activeTab === "projects" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="bg-white p-6 shadow border rounded">
              <h2 className="text-xl font-bold mb-4">Add Project</h2>
              <form onSubmit={handleAddProject} className="space-y-4">
                <input type="text" placeholder="Title" value={projData.title} onChange={e => setProjData({...projData, title: e.target.value})} className="border p-2 rounded w-full" required/>
                <textarea placeholder="Description" value={projData.description} onChange={e => setProjData({...projData, description: e.target.value})} className="border p-2 rounded w-full" required/>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Project Images (Upload Multiple for Carousel)</label>
                  <ImageUpload onUpload={(url) => setProjImages([...projImages, url])} />
                  <div className="flex gap-2 flex-wrap mt-2">
                    {projImages.map((img, i) => (
                      <div key={i} className="relative group">
                        <img src={img} className="w-20 h-20 object-cover rounded shadow" />
                        <button type="button" onClick={() => setProjImages(projImages.filter((_, idx) => idx !== i))} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs">x</button>
                      </div>
                    ))}
                  </div>
                </div>
                <button type="submit" className="bg-teal-600 text-white px-6 py-2 rounded w-full">Save Project</button>
              </form>
            </section>
            
            <section className="bg-white p-6 shadow border rounded h-[600px] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">Existing Projects</h2>
              {projects.map(p => (
                <div key={p.id} className="border p-4 rounded mb-4 flex justify-between">
                  <div>
                    <h3 className="font-bold">{p.title}</h3>
                    <p className="text-sm text-slate-500">{p.images?.length || 0} images</p>
                  </div>
                  <button onClick={() => {deleteDoc(doc(db, "projects", p.id)); fetchData();}} className="text-red-500 text-sm">Delete</button>
                </div>
              ))}
            </section>
          </div>
        )}

        {activeTab === "contact" && (
          <section className="bg-white p-6 shadow border rounded max-w-lg">
            <h2 className="text-xl font-bold mb-4">Add Contact Method</h2>
            <form onSubmit={handleAddContact} className="space-y-4">
              <input type="text" placeholder="Type (e.g., Email, Phone)" value={contactData.type} onChange={e => setContactData({...contactData, type: e.target.value})} className="border p-2 rounded w-full" required/>
              <input type="text" placeholder="Description (e.g., example@email.com)" value={contactData.description} onChange={e => setContactData({...contactData, description: e.target.value})} className="border p-2 rounded w-full" required/>
              <input type="text" placeholder="Link (e.g., mailto:example@email.com)" value={contactData.link} onChange={e => setContactData({...contactData, link: e.target.value})} className="border p-2 rounded w-full" />
              <div>
                <label className="block text-sm font-medium mb-2">Custom Icon (Optional)</label>
                <ImageUpload onUpload={(url) => setContactData({...contactData, iconUrl: url})} />
                {contactData.iconUrl && <img src={contactData.iconUrl} className="w-10 h-10 object-contain bg-slate-100 p-1 rounded" />}
              </div>
              <button type="submit" className="bg-teal-600 text-white px-6 py-2 rounded w-full">Save Contact</button>
            </form>
          </section>
        )}
      </div>
    </main>
  );
}
