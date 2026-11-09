import Reveal from "@/components/common/Reveal";

const BENEFITS = [
  {
    title: "Custom designs",
    text: "Nail sets designed around your personal style.",
    icon: "/assets/icons/nail-polish.png",
  },
  {
    title: "Reusable nails",
    text: "Beautiful nails you can enjoy again and again.",
    icon: "/assets/icons/manicure-hand.png",
  },
  {
    title: "Made to measure",
    text: "Personalised sizing for a better, more comfortable fit.",
    icon: "/assets/icons/nail-file.png",
  },
  {
    title: "Delivery throughout Algeria",
    text: "Delivery available to all 69 wilayas.",
    icon: "/assets/icons/uv-lamp.png",
  },
];

export default function BenefitsRow() {
  return (
    <section className="border-y border-brand-gold/25 bg-brand-cream">
      <div className="mx-auto grid max-w-[1400px] gap-px px-6 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
        {BENEFITS.map((benefit, index) => (
          <Reveal
            key={benefit.title}
            delay={index * 80}
            className="flex flex-col items-start px-0 py-10 sm:px-8 lg:py-14 lg:[&:not(:first-child)]:border-l lg:[&:not(:first-child)]:border-brand-gold/25"
          >
            <img
              src={benefit.icon}
              alt=""
              aria-hidden="true"
              className="h-9 w-auto object-contain opacity-85"
            />
            <h3 className="mt-5 eyebrow text-[0.66rem] text-brand-blue">{benefit.title}</h3>
            <p className="mt-2 max-w-[15rem] font-body text-[0.85rem] leading-relaxed text-brand-blue/60">
              {benefit.text}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}