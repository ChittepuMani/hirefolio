import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema(
  {
    key: { type: String, default: "main", unique: true },
    profile: {
      fullName: { type: String, default: "Your Name" },
      headline: { type: String, default: "Your professional headline" },
      location: { type: String, default: "Your City, Country" },
      email: { type: String, default: "you@example.com" },
      phone: { type: String, default: "" },
      summary: { type: String, default: "Write a concise introduction about your experience, strengths and the value you bring to a team." },
      availability: { type: String, default: "Open to opportunities" },
      linkedin: { type: String, default: "" },
      github: { type: String, default: "" },
      website: { type: String, default: "" },
      resumeUrl: { type: String, default: "" },
      photoUrl: { type: String, default: "" }
    },
    skills: [{ category: String, items: [String] }],
    experience: [{
      role: String,
      company: String,
      location: String,
      startDate: String,
      endDate: String,
      current: { type: Boolean, default: false },
      summary: String,
      highlights: [String]
    }],
    projects: [{
      title: String,
      description: String,
      role: String,
      techStack: [String],
      highlights: [String],
      liveUrl: String,
      repoUrl: String,
      featured: { type: Boolean, default: false }
    }],
    achievements: [{ title: String, issuer: String, date: String, description: String }],
    education: [{ degree: String, institution: String, year: String, details: String }],
    certifications: [{ name: String, issuer: String, date: String, url: String }]
  },
  { timestamps: true, minimize: false }
);

export default mongoose.model("Portfolio", portfolioSchema);
