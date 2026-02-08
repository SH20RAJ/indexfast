import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function FAQ() {
  return (
    <section id="faq" className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-zinc-950 transition-colors duration-300">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="font-handwritten text-4xl md:text-5xl font-bold mb-4 text-zinc-900 dark:text-zinc-50">Frequently Asked Questions</h2>
          <p className="font-handwritten text-xl text-zinc-600 dark:text-zinc-400">Got questions? We've got answers.</p>
        </div>
        <div className="max-w-3xl mx-auto font-handwritten">
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                    <AccordionTrigger className="text-xl font-bold">Does this guarantee #1 ranking?</AccordionTrigger>
                    <AccordionContent className="text-lg text-zinc-600 dark:text-zinc-300">
                    No. IndexFast ensures your pages are *found* and *crawled* by search engines almost instantly. Ranking depends on your content quality and other SEO factors.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger className="text-xl font-bold">Is this safe for my site?</AccordionTrigger>
                    <AccordionContent className="text-lg text-zinc-600 dark:text-zinc-300">
                    Yes! We use the official API endpoints provided by Google Search Console and IndexNow (Bing/Yandex). This is the recommended way to notify search engines of new content.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                    <AccordionTrigger className="text-xl font-bold">How many sites can I add?</AccordionTrigger>
                    <AccordionContent className="text-lg text-zinc-600 dark:text-zinc-300">
                    The Free plan allows 1 verified site. The Pro plan allows unlimited sites.
                    </AccordionContent>
                </AccordionItem>
                 <AccordionItem value="item-4">
                    <AccordionTrigger className="text-xl font-bold">Do I need to be a developer?</AccordionTrigger>
                    <AccordionContent className="text-lg text-zinc-600 dark:text-zinc-300">
                    Not at all! You just sign in with Google, select your site, and we handle the rest.
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
      </div>
    </section>
  )
}
