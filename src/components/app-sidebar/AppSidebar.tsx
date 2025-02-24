'use client'

import { useState } from "react";
import { FileText, MessageSquare, Upload, Briefcase, User, List, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { PlusCircle } from "react-feather";

interface SidebarProps {
  onSelect: (section: string) => void;
  userType: string;
}

export function AppSidebar({ onSelect, userType }: SidebarProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const router = useRouter();

  const candidateFeatures = [
    { title: "Resume & JD Matching", icon: FileText, key: "resume-jd" },
    // { title: "Resume Feedback", icon: MessageSquare, key: "resume-feedback" },
    { title: "Mock Test", icon: Upload, key: "mock-test" },
    { title: "Battle Listings", icon: List, key: "battle-listings" },
  ];

  const recruiterFeatures = [
    { title: "Job Description Analysis", icon: Briefcase, key: "jd-analysis" },
    // { title: "Mock Questions", icon: User, key: "mock-questions" },
    { title: "Create Battle", icon: PlusCircle, key: "create-battle" },
    { title: "Your Battles", icon: List, key: "your-battles" },
  ];

  const features = userType === "candidate" ? candidateFeatures : recruiterFeatures;

  const handleSelect = (key: string) => {
    setActiveSection(key);
    onSelect(key);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="h-[calc(100vh-48px)] w-64 bg-gray-800 rounded-xl shadow-lg border border-gray-700 ml-6 p-4 flex flex-col justify-between">
      <div>
        {/* Sidebar Header */}
        <button className="text-xl font-bold text-white mb-4" onClick={() => router.push("/")}>
          HustleHub 🚀💼
        </button>

        {/* Sidebar Menu */}
        <div className="space-y-2">
          <p className="text-gray-400">Features</p>
          {features.map((feature) => (
            <button
              key={feature.key}
              onClick={() => handleSelect(feature.key)}
              className={`flex items-center py-3 w-full rounded-lg transition-colors ${
                activeSection === feature.key
                  ? "bg-gray-700 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              <feature.icon className="mr-3 h-5 w-5" />
              <span>{feature.title}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Log Out Button */}
      <div className="mt-6 pt-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center w-full py-3 rounded-lg transition-colors bg-gray-800 text-gray-400 hover:bg-gray-700"
        >
          <LogOut className="mr-3 h-5 w-5" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
}
