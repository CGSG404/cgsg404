'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/src/components/ui/accordion";
import { useQuery } from '@tanstack/react-query';
import { fetchFaqItems, fallbackFaqData } from '@/src/lib/homepage-data';

export default function FaqSection() {
  const { data: faqItems = fallbackFaqData } = useQuery({
    queryKey: ['faqItems'],
    queryFn: fetchFaqItems,
    initialData: fallbackFaqData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  return (
    <section className="bg-black py-16 md:py-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-casino-neon-green to-emerald-400 bg-clip-text text-transparent">
              Frequently Asked Questions
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Get answers to the most common questions about our casino recommendations and services.
          </p>
        </div>
        
        <Accordion type="single" collapsible className="space-y-4">
          {faqItems.map((item, i) => (
            <AccordionItem 
              key={item.id || i} 
              value={`item-${item.id || i}`} 
              className="group bg-black border border-gray-700/50 hover:border-casino-neon-green/40 rounded-xl overflow-hidden transition-all duration-300 shadow-lg hover:shadow-casino-neon-green/10"
            >
              <AccordionTrigger className="w-full px-6 py-5 text-left text-white hover:no-underline font-semibold text-base md:text-lg group-hover:text-casino-neon-green transition-colors duration-300">
                {item.question}
              </AccordionTrigger>
                
              <AccordionContent className="px-6 pb-6 text-gray-300 text-base leading-relaxed border-t border-gray-700/30">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        
        {/* Additional CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 mb-4">Still have questions?</p>
          <a 
            href="/forum" 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-casino-neon-green to-emerald-400 hover:from-emerald-400 hover:to-casino-neon-green text-casino-dark font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-casino-neon-green/25"
          >
            <span>Join Our Forum</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
