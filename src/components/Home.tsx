"use client";

import { Faqs } from "@/components/Faqs";
import { motion } from "framer-motion";
import Link from "next/link";
import DotPattern from "./ui/dot-pattern";
import ShineButton from "./ShineButton ";
import BlurIn from "./ui/blur-in";
import SparklesText from "./ui/sparkles-text";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import AnimatedImage from "./AnimatedImage";

const Home = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
  };

  const itemVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const router = useRouter();

  const handleUserTypeSelection = (type: "candidate" | "recruiter") => {
    router.push(`/chat?type=${type}`);
  };

  return (
    <div>
      <main>
        <div className="z-0 relative min-h-screen w-full pb-40 overflow-hidden">
          <motion.div
            className="relative z-10 flex flex-col items-center justify-start min-h-screen space-y-6 px-4 pt-24"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <DotPattern
              className={cn(
                "absolute inset-0 z-0 [mask-image:radial-gradient(50vw_circle_at_center,white,transparent)]"
              )}
            />
            <ShineButton />
            <motion.div variants={itemVariants}>
              <BlurIn
                word={
                  <>
                    Welcome to{" "}
                    <SparklesText className="inline" text="HustleHub" />
                  </>
                }
                className="font-display text-center text-4xl font-bold w-full lg:w-auto max-w-4xl mx-auto -z-10"
                duration={1}
              />
            </motion.div>
            <motion.h2
              className="text-xl text-opacity-60 tracking-normal text-center max-w-2xl mx-auto z-10"
              variants={itemVariants}
            >
              Accelerate your career with HustleHub! Our AI-powered platform offers personalized resume feedback, 
              interview preparation, and job matching insights to help you hustle your way to success.
            </motion.h2>
            <motion.div variants={itemVariants} className="z-20 flex space-x-6">
              <Button
                onClick={() => handleUserTypeSelection("candidate")}
                className="bg-white text-purple-600 hover:bg-purple-100"
              >
                I'm a Candidate
              </Button>
              <Button
                onClick={() => handleUserTypeSelection("recruiter")}
                className="bg-white text-pink-600 hover:bg-pink-100"
              >
                I'm a Recruiter
              </Button>
            </motion.div>
            <motion.div variants={itemVariants}>
              <AnimatedImage
                src="/HomeRes.png"
                alt="HustleHub Preview"
                width={1200}
                height={900}
                className="w-full h-auto max-w-6xl mx-auto rounded-2xl shadow-lg"
              />
            </motion.div>
          </motion.div>
          <div className="w-[80%] sm:w-[50%] mx-auto mt-16 z-20">
            <Faqs />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
