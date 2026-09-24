import type { Localized } from "@/lib/i18n";

export type AboutContent = {
  hero: { eyebrow: string; headline: string };
  statement: string;
  intro: { kicker: string; title: string; body: string };
  whyqn: {
    kicker: string;
    statement: string;
    points: { label: string; desc: string }[];
  };
  expertise: {
    kicker: string;
    title: string;
    points: { title: string; desc: string }[];
  };
  values: {
    kicker: string;
    title: string;
    items: { name: string; desc: string }[];
  };
  team: {
    kicker: string;
    title: string;
    body: string;
    services: { num: string; title: string; desc: string }[];
  };
  cta: { title: string; sub: string; callNow: string };
};

export const ABOUT_CONTENT: Localized<AboutContent> = {
  vi: {
    hero: {
      eyebrow: "Giới thiệu",
      headline: "Base Land Quy Nhơn",
    },
    statement: "Am hiểu thị trường. Hiểu khách hàng. [[Chọn đúng giá trị.]]",
    intro: {
      kicker: "Về chúng tôi",
      title: "Tư vấn bất động sản ngay tại Quy Nhơn",
      body: "Base Land Quy Nhơn là đơn vị phân phối và tư vấn bất động sản hoạt động trực tiếp tại Quy Nhơn, tập trung vào các dự án phục vụ nhu cầu an cư, kinh doanh và đầu tư.",
    },
    whyqn: {
      kicker: "Tại sao Quy Nhơn",
      statement: "Một thành phố biển đang [[mở rộng không gian sống]] và phát triển.",
      points: [
        { label: "Biển", desc: "Sống gần biển, với nhịp sống đặc trưng của một thành phố ven biển." },
        { label: "Đô thị", desc: "Hạ tầng và các khu đô thị mới đang mở rộng không gian của thành phố." },
        { label: "Thị trường", desc: "Nhu cầu an cư, kinh doanh và lưu trú tạo ra những lựa chọn khác nhau." },
      ],
    },
    expertise: {
      kicker: "Lợi thế của Base Land Quy Nhơn",
      title: "Làm việc [[ngay tại thị trường]] này.",
      points: [
        { title: "Hiểu khu vực", desc: "Theo sát từng khu vực, từ trung tâm thành phố đến các khu đô thị mới." },
        { title: "Hiểu dự án", desc: "Làm việc với thông tin dự án đã được xác nhận, từ pháp lý đến sản phẩm." },
        { title: "Hiểu nhu cầu", desc: "Lắng nghe mục tiêu của từng khách hàng trước khi đề xuất sản phẩm." },
        { title: "Kết nối hệ sinh thái", desc: "Là một phần của Base Land, kết nối nguồn lực phân phối và tư vấn." },
      ],
    },
    values: {
      kicker: "Cách chúng tôi làm việc",
      title: "[[Minh bạch]] để khách hàng dễ quyết định.",
      items: [
        { name: "Thông tin rõ ràng", desc: "Ưu tiên dữ liệu và tài liệu đã được xác nhận." },
        { name: "Tư vấn thực tế", desc: "Đề xuất sản phẩm phù hợp với nhu cầu, không phải sản phẩm dễ bán nhất." },
        { name: "Theo sát thị trường", desc: "Cập nhật dự án, chính sách và thay đổi đáng chú ý tại Quy Nhơn." },
        { name: "Nói rõ điều chưa chắc chắn", desc: "Thông tin nào đang chờ xác nhận, chúng tôi ghi rõ là đang chờ." },
        { name: "Đồng hành dài hạn", desc: "Hỗ trợ từ lúc tìm hiểu đến khi hoàn tất giao dịch." },
      ],
    },
    team: {
      kicker: "Dịch vụ",
      title: "Chúng tôi hỗ trợ bạn ở đâu",
      body: "Đội ngũ Base Land Quy Nhơn làm việc trực tiếp tại thành phố, đi thực địa cùng khách hàng và theo sát từng dự án đang phân phối.",
      services: [
        {
          num: "01",
          title: "Phân phối dự án",
          desc: "Giới thiệu các dự án được chọn lọc tại Quy Nhơn, kèm thông tin và tài liệu chính thức.",
        },
        {
          num: "02",
          title: "Tư vấn chọn sản phẩm",
          desc: "So sánh vị trí, loại hình và mục đích sử dụng để chọn căn hoặc lô phù hợp.",
        },
        {
          num: "03",
          title: "Hỗ trợ chủ đầu tư",
          desc: "Bán hàng và tiếp thị dự án tại thị trường Quy Nhơn cho chủ đầu tư và đối tác.",
        },
      ],
    },
    cta: {
      title: "Bạn đang tìm bất động sản tại Quy Nhơn?",
      sub: "Cho chúng tôi biết bạn đang tìm căn hộ, nhà phố, shophouse hay cơ hội đầu tư.",
      callNow: "Gọi",
    },
  },
  en: {
    hero: {
      eyebrow: "About us",
      headline: "Base Land Quy Nhon",
    },
    statement: "Know the market. Know the client. [[Choose the right value.]]",
    intro: {
      kicker: "Who we are",
      title: "Property advice, based in Quy Nhon",
      body: "Base Land Quy Nhon distributes and advises on real estate right here in Quy Nhon, focusing on projects for living, business and investment.",
    },
    whyqn: {
      kicker: "Why Quy Nhon",
      statement: "A coastal city where [[lifestyle, growth and demand]] meet.",
      points: [
        { label: "Coast", desc: "Life close to the sea, at the pace of a coastal city." },
        { label: "City", desc: "New infrastructure and urban areas are giving the city room to grow." },
        { label: "Market", desc: "Demand for homes, business space and stays creates different options." },
      ],
    },
    expertise: {
      kicker: "Why Base Land Quy Nhon",
      title: "We work [[right here]], in this market.",
      points: [
        { title: "We know the area", desc: "From the city center to the new urban districts, we follow each area closely." },
        { title: "We know the projects", desc: "We work with verified project information, from legal status to product." },
        { title: "We know your needs", desc: "We listen to what you want to achieve before recommending anything." },
        { title: "Connected ecosystem", desc: "As part of Base Land, we connect distribution and advisory resources." },
      ],
    },
    values: {
      kicker: "How we work",
      title: "[[Clear information]] makes decisions easier.",
      items: [
        { name: "Clear information", desc: "We prioritize verified data and documents." },
        { name: "Practical advice", desc: "We recommend what fits your needs, not what is easiest to sell." },
        { name: "Market awareness", desc: "We track projects, policies and changes that matter in Quy Nhon." },
        { name: "Honest about gaps", desc: "If something is still unconfirmed, we say so." },
        { name: "Long-term support", desc: "From your first question to the finished transaction." },
      ],
    },
    team: {
      kicker: "Services",
      title: "How we can help",
      body: "The Base Land Quy Nhon team works on the ground in the city, visits sites with clients and follows every project we distribute.",
      services: [
        {
          num: "01",
          title: "Project distribution",
          desc: "Selected projects in Quy Nhon, presented with official information and documents.",
        },
        {
          num: "02",
          title: "Product advice",
          desc: "Compare location, property type and purpose to choose the right unit or plot.",
        },
        {
          num: "03",
          title: "Developer support",
          desc: "Sales and marketing in the Quy Nhon market for developers and partners.",
        },
      ],
    },
    cta: {
      title: "Looking for property in Quy Nhon?",
      sub: "Tell us what you are looking for — an apartment, townhouse, shophouse or investment opportunity.",
      callNow: "Call",
    },
  },
};
