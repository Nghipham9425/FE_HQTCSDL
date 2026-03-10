export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  image: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "blog-001",
    slug: "review-nioh-3-sung-sieu-pham-dau-nam-2026",
    title: "Review Nioh 3 | Phần súng siêu phẩm đầu năm 2026?",
    excerpt:
      "Nếu FromSoftware làm được kỳ tích với Elden Ring, thì Team Ninja tin rằng họ cũng có thể làm điều tương tự với Nioh 3. Liệu giấc mơ đó có thành hiện thực?",
    category: "Review Game",
    publishedAt: "2026-02-15",
    image: "https://picsum.photos/seed/nioh3/600/400",
  },
  {
    id: "blog-002",
    slug: "top-game-ps5-hay-nhat-nen-choi-nam-2026",
    title: "Top game PS5 hay nhất nên chơi năm 2026",
    excerpt:
      "Top game PS5 hay nhất nên chơi năm 2026 – Game thủ không thể bỏ lỡ trong năm 2026 ti...",
    category: "Top Game",
    publishedAt: "2026-01-30",
    image: "https://picsum.photos/seed/ps5top2026/600/400",
  },
  {
    id: "blog-003",
    slug: "gta-6-delayed-again-pushed-back-to-november-2026",
    title: "GTA 6 Delayed Again, Pushed Back to November 2026 – Rockstar",
    excerpt:
      "Mới đây, Rockstar vừa thông báo thời gian phát hành GTA VI đã bị dời sang ngày 26/05 sau nhiều tháng trì hoãn. Lý do được chưa rõ, nhưng dự kiến game được tối ưu thêm.",
    category: "Tin Game",
    publishedAt: "2026-03-01",
    image: "https://picsum.photos/seed/gta6delayed/600/400",
  },
  {
    id: "blog-004",
    slug: "resident-evil-requiem-pre-order-chinh-thuc-mo",
    title: "Resident Evil Requiem chính thức mở pre-order – Deluxe Edition hé lộ nội...",
    excerpt:
      "Capcom vừa 'thả thính' fan kinh dị khi chính thức công bố Resident Evil Requiem – phần tiếp theo trong series...",
    category: "Tin Game",
    publishedAt: "2026-03-05",
    image: "https://picsum.photos/seed/rerequiemnews/600/400",
  },
];
