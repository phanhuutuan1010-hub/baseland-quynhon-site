import type { Localized } from "@/lib/i18n";

export type ProjectArea = "center" | "quynhon";
export type ProjectType = "apartment" | "condotel" | "townhouse";
export type ProjectPurpose = "live" | "invest";
export type ProjectStatus = "inprogress" | "upcoming" | "handedover";

export type ProjectItem = {
  key: string;
  slotId: string;
  /** Route slug under /projects/[slug] — see lib/project-detail/registry.ts. */
  slug: string;
  name: string;
  location: string;
  area: ProjectArea;
  type: ProjectType;
  typeLabel: string;
  purpose: ProjectPurpose[];
  status: ProjectStatus;
  statusLabel: string;
  blurb: string;
};

export type ProjectsContent = {
  hero: { eyebrow: string; headline: string; sub: string };
  filters: {
    areaLabel: string;
    typeLabel: string;
    purposeLabel: string;
    statusLabel: string;
    filterBtn: string;
    resetBtn: string;
    areaOptions: { value: string; label: string }[];
    typeOptions: { value: string; label: string }[];
    purposeOptions: { value: string; label: string }[];
    statusOptions: { value: string; label: string }[];
    resultsSingular: string;
    resultsPlural: string;
  };
  featured: {
    kicker: string;
    name: string;
    teaser: string;
    locationLabel: string;
    scaleLabel: string;
    statusLabel: string;
    location: string;
    scale: string;
    status: string;
    cta: string;
  };
  grid: {
    kicker: string;
    title: string;
    cardCta: string;
    emptyMsg: string;
    emptyReset: string;
  };
  projects: ProjectItem[];
  location: {
    kicker: string;
    title: string;
    body: string;
    coverageItems: { n: string; name: string; location: string }[];
  };
};

export const PROJECTS_CONTENT: Localized<ProjectsContent> = {
  vi: {
    hero: {
      eyebrow: "Dự án",
      headline: "Dự án bất động sản Quy Nhơn",
      sub: "Các dự án Base Land Quy Nhơn phân phối và tư vấn — từ căn hộ trung tâm đến khu đô thị thấp tầng.",
    },
    filters: {
      areaLabel: "Khu vực",
      typeLabel: "Loại hình",
      purposeLabel: "Mục đích",
      statusLabel: "Trạng thái",
      filterBtn: "Bộ lọc",
      resetBtn: "Đặt lại",
      areaOptions: [
        { value: "all", label: "Tất cả khu vực" },
        { value: "center", label: "Trung tâm thành phố" },
        { value: "quynhon", label: "Phía Tây Quy Nhơn" },
      ],
      typeOptions: [
        { value: "all", label: "Tất cả loại hình" },
        { value: "apartment", label: "Căn hộ" },
        { value: "townhouse", label: "Nhà phố & Shophouse" },
      ],
      purposeOptions: [
        { value: "all", label: "Tất cả mục đích" },
        { value: "live", label: "Để ở" },
        { value: "invest", label: "Đầu tư" },
      ],
      statusOptions: [
        { value: "all", label: "Tất cả trạng thái" },
        { value: "inprogress", label: "Đang triển khai" },
        { value: "upcoming", label: "Sắp mở bán" },
        { value: "handedover", label: "Đã bàn giao" },
      ],
      resultsSingular: "dự án",
      resultsPlural: "dự án",
    },
    featured: {
      kicker: "Dự án nổi bật",
      name: "Q'Terra Quy Nhơn",
      teaser: "864 căn hộ tại 01 Ngô Mây — giữa trung tâm Quy Nhơn, vài phút đi bộ ra biển.",
      locationLabel: "Vị trí",
      scaleLabel: "Quy mô",
      statusLabel: "Trạng thái",
      location: "01 Ngô Mây, Quy Nhơn",
      scale: "864 căn hộ",
      status: "Đang triển khai",
      cta: "Khám phá Q'Terra",
    },
    grid: {
      kicker: "Tất cả dự án",
      title: "Chọn dự án theo nhu cầu của bạn",
      cardCta: "Xem dự án →",
      emptyMsg: "Chưa có dự án phù hợp với bộ lọc này.",
      emptyReset: "Xem tất cả dự án",
    },
    projects: [
      {
        key: "qterra",
        slotId: "local-project-qterra",
        slug: "qterra",
        name: "Q'Terra Quy Nhơn",
        location: "01 Ngô Mây · Trung tâm thành phố",
        area: "center",
        type: "apartment",
        typeLabel: "Căn hộ",
        purpose: ["live", "invest"],
        status: "inprogress",
        statusLabel: "Đang triển khai",
        blurb: "864 căn hộ giữa trung tâm Quy Nhơn, nơi nhịp sống thành phố và bờ biển gặp nhau.",
      },
      {
        key: "sailing",
        slotId: "local-project-sailing",
        slug: "the-sailing",
        name: "The Sailing Quy Nhơn",
        location: "Lê Duẩn · Vũ Bảo · Nguyễn Tư",
        area: "center",
        type: "apartment",
        typeLabel: "Căn hộ",
        purpose: ["invest"],
        status: "inprogress",
        statusLabel: "Đang triển khai",
        blurb: "Hai tòa tháp hướng biển tại trung tâm thành phố.",
      },
      {
        key: "simona",
        slotId: "local-project-simona",
        slug: "simona-heights",
        name: "Simona Heights",
        location: "145A Trần Hưng Đạo",
        area: "center",
        type: "apartment",
        typeLabel: "Căn hộ",
        purpose: ["live", "invest"],
        status: "inprogress",
        statusLabel: "Đang triển khai",
        blurb: "Căn hộ cao cấp bên Vịnh Quy Nhơn.",
      },
      {
        key: "phugia",
        slotId: "local-project-phugia",
        slug: "phu-gia-royal-park",
        name: "Phú Gia Royal Park",
        location: "Trục Tây Sơn · Quy Nhơn Nam",
        area: "quynhon",
        type: "townhouse",
        typeLabel: "Nhà phố & Shophouse",
        purpose: ["live", "invest"],
        status: "inprogress",
        statusLabel: "Đang triển khai",
        blurb: "Khu đô thị thấp tầng kết hợp ở – kinh doanh – giáo dục.",
      },
    ],
    location: {
      kicker: "Base Land tại Quy Nhơn",
      title: "Làm việc ngay tại thị trường này",
      body: "Từ trung tâm thành phố đến khu đô thị mới phía Tây, chúng tôi theo sát từng dự án để bạn có thông tin rõ ràng trước khi quyết định.",
      coverageItems: [
        { n: "01", name: "Q'Terra Quy Nhơn", location: "01 Ngô Mây" },
        { n: "02", name: "The Sailing Quy Nhơn", location: "Lê Duẩn · Vũ Bảo · Nguyễn Tư" },
        { n: "03", name: "Simona Heights", location: "145A Trần Hưng Đạo" },
        { n: "04", name: "Phú Gia Royal Park", location: "Trục Tây Sơn · Quy Nhơn Nam" },
      ],
    },
  },
  en: {
    hero: {
      eyebrow: "Projects",
      headline: "Real estate projects in Quy Nhon",
      sub: "Selected projects distributed and advised by Base Land Quy Nhon — from city-center apartments to a low-rise urban community.",
    },
    filters: {
      areaLabel: "Area",
      typeLabel: "Property type",
      purposeLabel: "Purpose",
      statusLabel: "Status",
      filterBtn: "Filter",
      resetBtn: "Reset",
      areaOptions: [
        { value: "all", label: "All areas" },
        { value: "center", label: "City center" },
        { value: "quynhon", label: "West Quy Nhon" },
      ],
      typeOptions: [
        { value: "all", label: "All types" },
        { value: "apartment", label: "Apartments" },
        { value: "townhouse", label: "Townhouses & Shophouses" },
      ],
      purposeOptions: [
        { value: "all", label: "Any purpose" },
        { value: "live", label: "To live in" },
        { value: "invest", label: "To invest" },
      ],
      statusOptions: [
        { value: "all", label: "Any status" },
        { value: "inprogress", label: "Under development" },
        { value: "upcoming", label: "Launching soon" },
        { value: "handedover", label: "Handed over" },
      ],
      resultsSingular: "project",
      resultsPlural: "projects",
    },
    featured: {
      kicker: "Featured project",
      name: "Q'Terra Quy Nhon",
      teaser: "864 apartments at 01 Ngo May — in the heart of Quy Nhon, a short walk from the beach.",
      locationLabel: "Location",
      scaleLabel: "Scale",
      statusLabel: "Status",
      location: "01 Ngo May, Quy Nhon",
      scale: "864 apartments",
      status: "Under development",
      cta: "Explore Q'Terra",
    },
    grid: {
      kicker: "All projects",
      title: "Find the project that fits your plans",
      cardCta: "View project →",
      emptyMsg: "No projects match these filters yet.",
      emptyReset: "View all projects",
    },
    projects: [
      {
        key: "qterra",
        slotId: "local-project-qterra",
        slug: "qterra",
        name: "Q'Terra Quy Nhon",
        location: "01 Ngo May · City center",
        area: "center",
        type: "apartment",
        typeLabel: "Apartments",
        purpose: ["live", "invest"],
        status: "inprogress",
        statusLabel: "Under development",
        blurb: "864 apartments in the heart of Quy Nhon, where city life meets the coast.",
      },
      {
        key: "sailing",
        slotId: "local-project-sailing",
        slug: "the-sailing",
        name: "The Sailing Quy Nhon",
        location: "Le Duan · Vu Bao · Nguyen Tu",
        area: "center",
        type: "apartment",
        typeLabel: "Apartments",
        purpose: ["invest"],
        status: "inprogress",
        statusLabel: "Under development",
        blurb: "Two sea-oriented towers in central Quy Nhon.",
      },
      {
        key: "simona",
        slotId: "local-project-simona",
        slug: "simona-heights",
        name: "Simona Heights",
        location: "145A Tran Hung Dao",
        area: "center",
        type: "apartment",
        typeLabel: "Apartments",
        purpose: ["live", "invest"],
        status: "inprogress",
        statusLabel: "Under development",
        blurb: "Premium apartments near Quy Nhon Bay.",
      },
      {
        key: "phugia",
        slotId: "local-project-phugia",
        slug: "phu-gia-royal-park",
        name: "Phu Gia Royal Park",
        location: "Tay Son Avenue · Quy Nhon Nam",
        area: "quynhon",
        type: "townhouse",
        typeLabel: "Townhouses & Shophouses",
        purpose: ["live", "invest"],
        status: "inprogress",
        statusLabel: "Under development",
        blurb: "A low-rise community combining living, business and education.",
      },
    ],
    location: {
      kicker: "Base Land in Quy Nhon",
      title: "We work right here, in this market",
      body: "From the city center to the new urban area in the west, we follow each project closely so you have clear information before you decide.",
      coverageItems: [
        { n: "01", name: "Q'Terra Quy Nhon", location: "01 Ngo May" },
        { n: "02", name: "The Sailing Quy Nhon", location: "Le Duan · Vu Bao · Nguyen Tu" },
        { n: "03", name: "Simona Heights", location: "145A Tran Hung Dao" },
        { n: "04", name: "Phu Gia Royal Park", location: "Tay Son Avenue · Quy Nhon Nam" },
      ],
    },
  },
};
