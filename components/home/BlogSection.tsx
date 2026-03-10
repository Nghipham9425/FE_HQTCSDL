"use client";
import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";
import { type BlogPost } from "@/data/mock/blogs";

interface BlogSectionProps {
  posts: BlogPost[];
}

export default function BlogSection({ posts }: BlogSectionProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start" });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section className="mx-auto max-w-screen-xl px-4 py-10">
      <SectionHeader
        title="Bài viết mới nhất"
        href="/news"
        onPrev={scrollPrev}
        onNext={scrollNext}
        className="mb-5"
      />

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/news/${post.slug}`}
              className="group min-w-[280px] flex-shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all sm:min-w-[300px]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.image}
                alt={post.title}
                className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="p-4">
                <span className="mb-2 inline-block rounded bg-[var(--brand-navy)]/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-[var(--brand-navy)]">
                  {post.category}
                </span>
                <h3 className="line-clamp-2 text-sm font-bold text-gray-800 group-hover:text-[var(--brand-red)]">
                  {post.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs text-gray-500">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
