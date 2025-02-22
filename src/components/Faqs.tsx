import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion";
  
  export function Faqs() {
    return (
      <Accordion type="single" collapsible className="w-full">
        <h1 className="text-2xl font-bold mb-4">FAQs</h1>
        <AccordionItem value="item-1">
          <AccordionTrigger>What is HustleHub?</AccordionTrigger>
          <AccordionContent>
            HustleHub is a career acceleration platform that helps job seekers 
            with AI-powered resume feedback, interview preparation, and job-matching insights.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>How can I improve my resume with HustleHub?</AccordionTrigger>
          <AccordionContent>
            Simply upload your resume, and our AI will analyze it, providing 
            personalized suggestions to enhance your chances of landing your dream job.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Does HustleHub offer interview preparation?</AccordionTrigger>
          <AccordionContent>
            Yes! We offer AI-driven interview practice sessions, helping you 
            refine your responses and build confidence for real job interviews.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>Is HustleHub free to use?</AccordionTrigger>
          <AccordionContent>
            HustleHub offers both free and premium features. The free version 
            includes resume analysis and basic job insights, while premium plans 
            unlock advanced analytics and personalized coaching.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-5">
          <AccordionTrigger>Can I contribute to HustleHub?</AccordionTrigger>
          <AccordionContent>
            Yes! HustleHub is open-source. You can check out our GitHub 
            repository and contribute to improving the platform.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  }
  