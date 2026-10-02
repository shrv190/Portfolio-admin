import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAWQLXJNZhnPeLymSrZDwpqmVmQiaWfmpU",
  authDomain: "portifolio-shdiv190.firebaseapp.com",
  projectId: "portifolio-shdiv190",
  storageBucket: "portifolio-shdiv190.firebasestorage.app",
  messagingSenderId: "379007402466",
  appId: "1:379007402466:web:406e7e9121349659d3f9bb",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seed() {
  console.log("Seeding profile...");
  await setDoc(doc(db, "settings", "profile"), {
    name: "Arjun Sable",
    subtitle: "Cyber Security Enthusiast",
    institution: "IIT Bombay",
    about: "Software developer with 3+ years experience and specialization in Android and Backend Development. Currently working in IIT Bombay as a 'Software Engineer'.",
    address: "Mumbai, Maharashtra 400068",
    phone: "+91 8655618204",
    email: "sablearjun@iitb.ac.in"
  });

  console.log("Seeding projects...");
  const projects = [
    { title: "Vajra EDR", category: "Cybersecurity", description: "EDR", imageUrl: "", showImagePreview: false },
    { title: "Temples of India", category: "App Development", description: "Android and React", imageUrl: "", showImagePreview: false },
    { title: "Corontine", category: "App Development", description: "Android app for tracking", imageUrl: "", showImagePreview: false },
    { title: "CoVaccinator", category: "App Development", description: "Android vaccination app", imageUrl: "", showImagePreview: false }
  ];
  for (const p of projects) {
    await addDoc(collection(db, "projects"), p);
  }

  console.log("Seeding experiences...");
  const experiences = [
    { title: "Cybersecurity Researcher", company: "IIT Bombay", type: "Full-Time", description: "August 2019 - Till now (3+ years)\nLinux Security, Malware research, Endpoint Detection Tool, Android Security", imageUrl: "", showImagePreview: false },
    { title: "Trainer & Full Stack Developer", company: "CMS IT Services", type: "Full-Time", description: "June 2018 - August 2019 (1 year)\nAndroid Developer, Trainer for Angular, Web development and Android.", imageUrl: "", showImagePreview: false }
  ];
  for (const e of experiences) {
    await addDoc(collection(db, "experiences"), e);
  }
  
  console.log("Seeding education...");
  const educations = [
    { title: "MTech", institution: "IIT Bombay", year: "Persuing" },
    { title: "BE (Computer Engineering)", institution: "University of Mumbai", year: "2018" },
    { title: "Diploma (Computer Engineering)", institution: "Government Polytechnic Mumbai", year: "2015" },
    { title: "SSC", institution: "Vidya Mandir, Dahisar", year: "2011" }
  ];
  for (const ed of educations) {
    await addDoc(collection(db, "education"), ed);
  }
  
  console.log("Seeding skills...");
  const skills = [
    { category: "Cybersecurity", items: "Endpoint Detection and Response, MITRE ATT&CK, GTFOBINS" },
    { category: "App development", items: "Android" },
    { category: "Web Technologies", items: "HTML, CSS, Framework & Libraries : Angular, Bootstrap" }
  ];
  for (const s of skills) {
    await addDoc(collection(db, "skills"), s);
  }

  console.log("Done seeding!");
}

seed().catch(console.error);
