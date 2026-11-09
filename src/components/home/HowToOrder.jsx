import Reveal from "@/components/common/Reveal";

const STEPS = [
  { title: "Explore designs", text: "Browse the collections and find the sets that speak to you." },
  { title: "Choose your favourite set", text: "Open a design to see its shapes, sizes and details." },
  { title: "Customise your preferences", text: "Pick your shape, size and any personal requests." },
  { title: "Add to your basket", text: "Keep every set you love in one place." },
  { title: "Enter your delivery details", text: "Your name, phone and address anywhere in Algeria." },
  { title: "Submit your order", text: "We receive your request and confirm it with you." },
];

export default function HowToOrder() {
  return (
    <section id="how-to-order" className="bg-brand-cream py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-6 sm:px-8">
        <Reveal className="max-w-xl">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-brand-gold/60" />
            <p className="eyebrow text-brand-blue/55">How to order</p>
          </div>
          <h2 className="mt-5 font-heading text-[2.3rem] font-light leading-tight text-brand-blue sm:text-[3rem]">
            Six Steps to <span className="serif-italic">Your Set</span>
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((step, index) => (
            <Reveal
              key={step.title}
              delay={(index % 3) * 80}
              className="border-t border-brand-gold/30 pt-6 lg:pr-10"
            >
              <p className="font-body text-[0.65rem] tracking-[0.2em] text-brand-gold">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-3 font-heading text-xl text-brand-blue">{step.title}</h3>
              <p className="mt-2 max-w-[17rem] font-body text-sm leading-relaxed text-brand-blue/60">
                {step.text}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}