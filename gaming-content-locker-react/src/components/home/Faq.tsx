import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQ_ITEMS = [
  {
    question: "What makes GameVault different from other Android game sites?",
    answer: "GameVault is more than just a game download site. We specialize in exclusive content—hidden gems, early-access releases, and top-rated games—all verified for safety and quality. Our secure platform ensures every download is malware-free and optimized for your device, so you can play with confidence and discover titles you won’t find in the mainstream app stores."
  },
  {
    question: "Are all games on GameVault free and safe to download?",
    answer: "Yes! We guarantee every game is tested, 100% free, and safe for your Android device. Our curation process ensures every title is high-quality and officially sourced, so you’ll never worry about spam, viruses, or fake downloads."
  },
  {
    question: "How often is the GameVault library updated?",
    answer: "We add new Android games and exclusive releases every week! Our team works with developers and gaming networks to keep GameVault fresh, so you always have something new and exciting to download and play."
  },
  {
    question: "Do I need to create an account or pay a subscription?",
    answer: "No registration or subscription is needed. Just visit GameVault, browse our categories, and start downloading the best Android games instantly—always free, always secure."
  }
];

export function Faq() {
  return (
    <section id="faq" className="py-16 bg-card/10">
      <div className="container-custom">
        <h2 className="section-title mb-12">
          Frequently Asked <span className="highlight">Questions</span>
        </h2>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {FAQ_ITEMS.map((item, index) => (
              <AccordionItem key={`faq-${index}`} value={`item-${index}`} className="border-b border-[#00f7ff]/10">
                <AccordionTrigger className="text-left hover:text-[#00f7ff] transition-colors py-4 text-lg font-medium">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Can't find an answer to your question?{" "}
            <a href="mailto:support@gamevault.com" className="text-[#00f7ff] hover:underline">
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
