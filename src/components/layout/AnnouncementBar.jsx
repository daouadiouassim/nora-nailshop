export default function AnnouncementBar({ text }) {
  return (
    <div className="bg-brand-blue text-white">
      <div className="mx-auto flex max-w-[1400px] items-center justify-center px-4 py-2.5">
        <p className="eyebrow text-center text-[0.6rem] leading-relaxed text-white/90 sm:text-[0.65rem]">
          {text || "Orders are open ✦ Delivery available to all 69 wilayas"}
        </p>
      </div>
    </div>
  );
}