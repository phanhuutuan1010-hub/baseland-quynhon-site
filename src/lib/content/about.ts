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
      headline: "Base Land Quy Nhơn",
    },
    statement:
      "Uy tín, minh bạch và am hiểu sâu sắc thị trường địa phương — nền tảng cho một quyết định an tâm tại Quy Nhơn.",
    intro: {
      kicker: "Base Land Quy Nhơn",
      title: "Chi nhánh tại thành phố biển",
      body: "Là chi nhánh của Base Land tại thành phố biển Quy Nhơn, chúng tôi mang đến dịch vụ phân phối và tư vấn bất động sản chuyên nghiệp, xây dựng trên nền tảng uy tín, minh bạch và am hiểu sâu sắc thị trường địa phương. Mỗi khách hàng được đồng hành từ bước đầu tiên đến khi hoàn tất giao dịch, với sự tận tâm và trách nhiệm dài hạn.",
    },
    whyqn: {
      kicker: "Tại sao Quy Nhơn",
      statement:
        "Một thành phố biển đang bước vào giai đoạn phát triển mới — nơi cảnh quan tự nhiên, đô thị hiện đại và tiềm năng đầu tư gặp nhau.",
      points: [
        { label: "Biển", desc: "Bờ biển dài, vịnh nước trong, khí hậu ôn hoà quanh năm." },
        { label: "Đô thị", desc: "Hạ tầng mở rộng nhanh, quy hoạch bài bản, kết nối thuận tiện." },
        {
          label: "Du lịch & đầu tư",
          desc: "Lượng khách du lịch tăng trưởng liên tục, kéo theo nhu cầu bất động sản nghỉ dưỡng và an cư.",
        },
      ],
    },
    expertise: {
      kicker: "Am hiểu địa phương",
      title: "Lợi thế của một đội ngũ làm việc ngay tại thị trường này",
      points: [
        {
          title: "Am hiểu thị trường",
          desc: "Bám sát diễn biến bất động sản Quy Nhơn và khu vực lân cận theo từng giai đoạn phát triển.",
        },
        {
          title: "Am hiểu dự án",
          desc: "Làm việc trực tiếp với thông tin dự án đã được xác minh, từ pháp lý đến tiến độ triển khai.",
        },
        {
          title: "Am hiểu khách hàng",
          desc: "Mỗi khách hàng được đồng hành từ bước đầu tiên đến khi hoàn tất giao dịch.",
        },
        {
          title: "Kết nối hệ sinh thái",
          desc: "Là một phần của hệ sinh thái Base Land, kết nối nguồn lực phân phối, tư vấn và phát triển dự án.",
        },
      ],
    },
    values: {
      kicker: "Giá trị cốt lõi",
      title: "Nền tảng cho một quyết định an tâm",
      items: [
        { name: "Uy tín", desc: "Thương hiệu được xây dựng từ lòng tin của khách hàng và đối tác." },
        { name: "Minh bạch", desc: "Thông tin dự án và quy trình giao dịch rõ ràng ở mọi bước." },
        { name: "Chuyên nghiệp", desc: "Đội ngũ tư vấn được đào tạo bài bản, am hiểu sản phẩm và thị trường." },
        { name: "Am hiểu thị trường", desc: "Bám sát diễn biến bất động sản Quy Nhơn và khu vực lân cận." },
        {
          name: "Đồng hành dài hạn",
          desc: "Hỗ trợ khách hàng không chỉ ở giao dịch mà xuyên suốt quá trình sở hữu.",
        },
      ],
    },
    team: {
      kicker: "Đội ngũ & Tổ chức",
      title: "Một đội ngũ được đào tạo bài bản",
      body: "Base Land Quy Nhơn vận hành bởi đội ngũ tư vấn được đào tạo bài bản, am hiểu sản phẩm và thị trường, làm việc trực tiếp tại thành phố biển này trên một hệ sinh thái dịch vụ toàn diện.",
      services: [
        {
          num: "01",
          title: "Phân phối & Tiếp thị dự án",
          desc: "Kết nối khách hàng với những dự án chất lượng từ các chủ đầu tư uy tín, cung cấp thông tin minh bạch và tư vấn chuyên sâu.",
        },
        {
          num: "02",
          title: "Tư vấn & Kinh doanh bất động sản",
          desc: "Đồng hành cùng khách hàng phân tích thị trường, đánh giá tiềm năng và xây dựng chiến lược đầu tư hiệu quả.",
        },
        {
          num: "03",
          title: "Đầu tư & Phát triển dự án",
          desc: "Giải pháp bán hàng, marketing và phát triển thị trường cho chủ đầu tư, đối tác tại khu vực Quy Nhơn.",
        },
      ],
    },
    cta: {
      title: "Bạn đang tìm bất động sản tại Quy Nhơn?",
      sub: "Để lại thông tin, chuyên viên Base Land Quy Nhơn sẽ liên hệ tư vấn trong thời gian sớm nhất.",
      callNow: "Gọi ngay 0965 273 179",
    },
  },
  en: {
    hero: {
      eyebrow: "About Us",
      headline: "Base Land Quy Nhon",
    },
    statement:
      "Trust, transparency and deep local market knowledge — a foundation for peace of mind in Quy Nhon.",
    intro: {
      kicker: "Base Land Quy Nhon",
      title: "A branch in the coastal city",
      body: "As Base Land's branch in the coastal city of Quy Nhon, we bring professional real estate distribution and advisory services built on trust, transparency and deep local market knowledge. Every client is guided from the first conversation through to closing, with genuine care and long-term commitment.",
    },
    whyqn: {
      kicker: "Why Quy Nhon",
      statement:
        "A coastal city entering a new stage of growth — where natural landscape, modern urban living and investment potential meet.",
      points: [
        { label: "Sea", desc: "A long coastline, clear bays and a mild climate year-round." },
        { label: "Urban growth", desc: "Fast-expanding infrastructure, coherent planning and easy connectivity." },
        {
          label: "Tourism & investment",
          desc: "Steadily growing tourism driving demand for resort and residential real estate.",
        },
      ],
    },
    expertise: {
      kicker: "Local Expertise",
      title: "The advantage of a team working right in this market",
      points: [
        {
          title: "Market insight",
          desc: "Close attention to real estate trends in Quy Nhon and beyond, at every stage of the market.",
        },
        {
          title: "Project insight",
          desc: "Working directly with verified project information, from legal status to construction progress.",
        },
        {
          title: "Client insight",
          desc: "Every client is guided from the first conversation through to closing.",
        },
        {
          title: "Ecosystem connection",
          desc: "Part of the Base Land ecosystem, connecting distribution, advisory and project development resources.",
        },
      ],
    },
    values: {
      kicker: "Core Values",
      title: "A foundation for peace of mind",
      items: [
        { name: "Trust", desc: "A brand built on the trust of clients and partners alike." },
        { name: "Transparency", desc: "Clear project information and process at every step." },
        { name: "Professionalism", desc: "A well-trained team with deep product and market knowledge." },
        { name: "Market insight", desc: "Close attention to real estate trends in Quy Nhon and beyond." },
        {
          name: "Long-term partnership",
          desc: "Support that continues well beyond the transaction itself.",
        },
      ],
    },
    team: {
      kicker: "Team & Organization",
      title: "A well-trained team",
      body: "Base Land Quy Nhon is run by a well-trained advisory team with deep product and market knowledge, working directly in this coastal city across a full ecosystem of services.",
      services: [
        {
          num: "01",
          title: "Project Distribution & Marketing",
          desc: "Connecting clients with quality projects from reputable developers, with transparent information and in-depth advice.",
        },
        {
          num: "02",
          title: "Real Estate Advisory & Brokerage",
          desc: "Helping clients analyze the market, assess potential and build effective investment strategies.",
        },
        {
          num: "03",
          title: "Investment & Project Development",
          desc: "Sales, marketing and market development solutions for developers and partners across Quy Nhon.",
        },
      ],
    },
    cta: {
      title: "Looking for real estate in Quy Nhon?",
      sub: "Leave your details and a Base Land Quy Nhon advisor will be in touch shortly.",
      callNow: "Call now 0965 273 179",
    },
  },
};
