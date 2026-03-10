"use client";
import { useState } from "react";
import { X } from "lucide-react";

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div className="relative z-50 flex flex-col items-center justify-center gap-1 bg-[var(--brand-navy)] px-4 py-1.5 text-center text-xs text-white sm:flex-row sm:gap-8">
      <span>
        Đánh giá sản phẩm trên website để nhận được ưu đãi lên đến{" "}
        <strong>10%</strong>
      </span>
      <span className="hidden sm:block">|</span>
      <span className="rounded-full bg-teal-600 px-3 py-0.5 text-white">
        Theo dõi fanpage <strong>CardgameCenter</strong> để săn deal độc quyền mỗi ngày!
      </span>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
        aria-label="Đóng thông báo"
      >
        <X size={14} />
      </button>
    </div>
  );
}
