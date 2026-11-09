import Reveal from "@/components/common/Reveal";
import { formatNumber } from "@/lib/format";

export default function SocialSection({ settings }) {
  const instagram = settings?.instagram_url || "https://www.instagram.com/nora_nailshop/";
  const tiktok = settings?.tiktok_url || "https://www.tiktok.com/@nora_nailshop";
  const followers = Number(settings?.instagram_followers ?? 7421);
  const posts = settings?.instagram_posts ?? 283;
  const username = settings?.instagram_username || "@nora_nailshop";

  const tiles = [
    "/assets/products/anime-star-set.jpg",
    "/assets/products/gem-stiletto-set.jpg",
    "/assets/products/other-one-set.jpg",
    "/assets/products/blue-lemon-set.jpg",
  ];

  return (
    <section className="bg-brand-cream pb-20 lg:pb-28">
      <div className="mx-auto max-w-[1400px] px-6 sm:px-8">
        <div className="border border-brand-gold/30 bg-white/50 px-7 py-12 sm:px-12 lg:py-16">
          <div className="grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <Reveal>
              <p className="eyebrow text-brand-gold">Social</p>
              <h2 className="mt-4 font-heading text-[2.1rem] font-light leading-tight text-brand-blue sm:text-[2.7rem]">
                Follow the <span className="serif-italic">Nail Inspiration</span>
              </h2>
              <p className="mt-4 max-w-sm font-body text-sm leading-relaxed text-brand-blue/65">
                New sets, behind the scenes and custom creations — first on Instagram.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-5">
                <a
                  href={instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-3"
                >
                  <img src="/assets/social/instagram.png" alt="" aria-hidden="true" className="h-6 w-6" />
                  <span>
                    <span className="block font-body text-sm text-brand-blue">{username}</span>
                    <span className="block font-body text-[0.7rem] uppercase tracking-[0.14em] text-brand-blue/50">
                      {formatNumber(followers)} followers · {posts} posts
                    </span>
                  </span>
                </a>
                <a href={tiktok} target="_blank" rel="noreferrer" className="flex items-center gap-3">
                  <img src="/assets/social/tiktok.png" alt="" aria-hidden="true" className="h-6 w-6" />
                  <span className="font-body text-sm text-brand-blue">TikTok</span>
                </a>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {tiles.map((tile, index) => (
                  <a
                    key={tile}
                    href={instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative block aspect-square overflow-hidden bg-brand-lavender/20"
                    aria-label="Nora Nailshop on Instagram"
                  >
                    <img
                      src={tile}
                      alt={`Nora Nailshop nail set ${index + 1}`}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </a>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}