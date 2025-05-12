import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQ_ITEMS = [
  {
    question: "What is GameVault?",
    answer: "GameVault is a premium platform that provides access to high-quality mobile games. Our service allows you to download games for Android and iOS devices quickly and easily."
  },
  {
    question: "How do I download games from GameVault?",
    answer: "Browse our collection of games, select the one you want to download, complete a short offer, and the game will be immediately available for download to your device."
  },
  {
    question: "Are the games on GameVault free?",
    answer: "Yes, all games on GameVault are free to download. We use a sponsored offer system instead of charging money to maintain our service and provide you with premium gaming content."
  },
  {
    question: "Why do I need to complete offers?",
    answer: "The sponsored offers help us maintain our servers, support game developers, and ensure we can continue to provide high-quality games. It typically takes only a few minutes to complete."
  },
  {
    question: "Are the games on GameVault safe to download?",
    answer: "Yes, all games are scanned for viruses and malware before being added to our platform. We prioritize the safety and security of our users and their devices."
  },
  {
    question: "Do the games include in-app purchases or ads?",
    answer: "This varies depending on the game. Most games maintain their original monetization model, which may include optional in-app purchases or advertisements. We clearly indicate this information on each game's details page."
  },
  {
    question: "Can I request a specific game to be added to GameVault?",
    answer: "Yes! We welcome game requests and regularly update our library based on user feedback. Contact us with the game details, and we'll consider adding it to our collection."
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
