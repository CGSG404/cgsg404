import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/src/components/ui/accordion";

const faqItems = [
  {
    question: "Are the recommended casinos legal in Singapore?",
    answer:
      "We only list internationally licensed online casinos that accept Singaporean players and are regulated by trusted authorities." ,
  },
  {
    question: "How do we rate the casinos?",
    answer:
      "CGSG experts evaluate license, security, game variety, bonuses, and player reviews before assigning a rating.",
  },
  {
    question: "Do I have to pay to join?",
    answer:
      "No. Our guides, reviews, and forum are 100% free for all users.",
  },
  {
    question: "How do I claim the welcome bonus?",
    answer:
      "Click the 'Claim Bonus' button on the casino page and follow the sign-up instructions on the partner site.",
  },
];

export default function FaqSection() {
  return (
    <section id="faq" className="mt-16 max-w-4xl mx-auto px-4">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
        Frequently Asked Questions
      </h2>
      <Accordion type="single" collapsible className="space-y-2">
        {faqItems.map((item, i) => (
          <AccordionItem key={i} value={`item-${i}`} className="bg-gray-800/40 border border-gray-700/50 rounded-md">
            <AccordionTrigger className="w-full px-4 py-3 text-left text-white hover:no-underline">
              {item.question}
            </AccordionTrigger>
              
            <AccordionContent className="px-4 pb-4 text-gray-300">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
