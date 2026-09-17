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
      eyebrow: "Danh mục dự án",
      headline: "Khám phá Quy Nhơn",
      sub: "Các dự án bất động sản tại Quy Nhơn được Base Land phân phối và tư vấn — chọn lọc, xác thực và cập nhật liên tục.",
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
        { value: "quynhon", label: "Quy Nhơn" },
      ],
      typeOptions: [
        { value: "all", label: "Tất cả loại hình" },
        { value: "apartment", label: "Căn hộ" },
        { value: "condotel", label: "Condotel" },
        { value: "townhouse", label: "Nhà phố & Biệt thự" },
      ],
      purposeOptions: [
        { value: "all", label: "Tất cả mục đích" },
        { value: "live", label: "An cư" },
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
      name: "Q'Terra Quy Nhơn",
      teaser:
        "Tổ hợp 864 căn hộ tại 01 Ngô Mây — ngay trung tâm thành phố biển Quy Nhơn, nơi đất, đá, nắng và biển gặp nhau trong một công trình.",
      locationLabel: "Vị trí",
      scaleLabel: "Quy mô",
      statusLabel: "Trạng thái",
      location: "01 Ngô Mây, Quy Nhơn",
      scale: "864 căn hộ",
      status: "Đang triển khai",
      cta: "Khám phá Q'Terra",
    },
    grid: {
      kicker: "Dự án khác tại Quy Nhơn",
      title: "Tìm dự án phù hợp với bạn",
      cardCta: "Nhận tư vấn →",
      emptyMsg: "Không tìm thấy dự án phù hợp với bộ lọc hiện tại.",
      emptyReset: "Xem tất cả dự án",
    },
    projects: [
      {
        key: "sailing",
        slotId: "local-project-sailing",
        slug: "the-sailing",
        name: "The Sailing Quy Nhơn",
        location: "Lê Duẩn · Vũ Bảo · Nguyễn Tư",
        area: "quynhon",
        type: "apartment",
        typeLabel: "Căn hộ",
        purpose: ["invest"],
        status: "inprogress",
        statusLabel: "Đang triển khai",
        blurb: "Tổ hợp hai tòa tháp hướng biển tại trung tâm Quy Nhơn — thông tin quy mô đang được xác minh.",
      },
      {
        key: "simona",
        slotId: "local-project-simona",
        slug: "simona-heights",
        name: "Simona Heights",
        location: "Quy Nhơn",
        area: "quynhon",
        type: "apartment",
        typeLabel: "Căn hộ",
        purpose: ["live"],
        status: "inprogress",
        statusLabel: "Đang triển khai",
        blurb: "Căn hộ an cư trong khu đô thị đang phát triển của Quy Nhơn.",
      },
      {
        key: "phugia",
        slotId: "local-project-phugia",
        slug: "phu-gia-royal-park",
        name: "Phú Gia Royal Park Quy Nhơn",
        location: "Quy Nhơn",
        area: "quynhon",
        type: "townhouse",
        typeLabel: "Nhà phố & Biệt thự",
        purpose: ["live", "invest"],
        status: "inprogress",
        statusLabel: "Đang triển khai",
        blurb: "Khu nhà phố & biệt thự thấp tầng tại Quy Nhơn.",
      },
    ],
    location: {
      kicker: "Base Land tại Quy Nhơn",
      title: "Chúng tôi hiểu từng khu vực đang phát triển",
      body: "Từ trung tâm thành phố đến các khu đô thị mới, Base Land Quy Nhơn theo sát từng giai đoạn phát triển của thị trường bất động sản địa phương.",
      coverageItems: [
        { n: "01", name: "Q'Terra Quy Nhơn", location: "01 Ngô Mây, Quy Nhơn" },
        { n: "02", name: "The Sailing Quy Nhơn", location: "Lê Duẩn · Vũ Bảo · Nguyễn Tư" },
        { n: "03", name: "Simona Heights", location: "Quy Nhơn" },
        { n: "04", name: "Phú Gia Royal Park Quy Nhơn", location: "Quy Nhơn" },
      ],
    },
  },
  en: {
    hero: {
      eyebrow: "Project Portfolio",
      headline: "Explore Quy Nhon",
      sub: "Real estate projects in Quy Nhon marketed and advised by Base Land — curated, verified and continually updated.",
    },
    filters: {
      areaLabel: "Area",
      typeLabel: "Property Type",
      purposeLabel: "Purpose",
      statusLabel: "Status",
      filterBtn: "Filter",
      resetBtn: "Reset",
      areaOptions: [
        { value: "all", label: "All areas" },
        { value: "center", label: "City center" },
        { value: "quynhon", label: "Quy Nhon" },
      ],
      typeOptions: [
        { value: "all", label: "All types" },
        { value: "apartment", label: "Apartments" },
        { value: "condotel", label: "Condotel" },
        { value: "townhouse", label: "Townhouses & Villas" },
      ],
      purposeOptions: [
        { value: "all", label: "All purposes" },
        { value: "live", label: "For living" },
        { value: "invest", label: "Investment" },
      ],
      statusOptions: [
        { value: "all", label: "All statuses" },
        { value: "inprogress", label: "In progress" },
        { value: "upcoming", label: "Coming soon" },
        { value: "handedover", label: "Handed over" },
      ],
      resultsSingular: "project",
      resultsPlural: "projects",
    },
    featured: {
      kicker: "Featured Project",
      name: "Q'Terra Quy Nhon",
      teaser:
        "An 864-unit residence at 01 Ngo May — in the heart of coastal Quy Nhon, where earth, stone, sun and sea meet in a single address.",
      locationLabel: "Location",
      scaleLabel: "Scale",
      statusLabel: "Status",
      location: "01 Ngo May, Quy Nhon",
      scale: "864 units",
      status: "In progress",
      cta: "Explore Q'Terra",
    },
    grid: {
      kicker: "More Projects in Quy Nhon",
      title: "Find the right project for you",
      cardCta: "Request info →",
      emptyMsg: "No projects match the selected filters.",
      emptyReset: "View all projects",
    },
    projects: [
      {
        key: "sailing",
        slotId: "local-project-sailing",
        slug: "the-sailing",
        name: "The Sailing Quy Nhon",
        location: "Lê Duẩn · Vũ Bảo · Nguyễn Tư",
        area: "quynhon",
        type: "apartment",
        typeLabel: "Apartments",
        purpose: ["invest"],
        status: "inprogress",
        statusLabel: "In progress",
        blurb: "A two-tower, sea-facing complex at the heart of Quy Nhon — scale details are being verified.",
      },
      {
        key: "simona",
        slotId: "local-project-simona",
        slug: "simona-heights",
        name: "Simona Heights",
        location: "Quy Nhon",
        area: "quynhon",
        type: "apartment",
        typeLabel: "Apartments",
        purpose: ["live"],
        status: "inprogress",
        statusLabel: "In progress",
        blurb: "Residential apartments within one of Quy Nhon's developing urban areas.",
      },
      {
        key: "phugia",
        slotId: "local-project-phugia",
        slug: "phu-gia-royal-park",
        name: "Phu Gia Royal Park Quy Nhon",
        location: "Quy Nhon",
        area: "quynhon",
        type: "townhouse",
        typeLabel: "Townhouses & Villas",
        purpose: ["live", "invest"],
        status: "inprogress",
        statusLabel: "In progress",
        blurb: "A low-rise townhouse & villa development in Quy Nhon.",
      },
    ],
    location: {
      kicker: "Base Land in Quy Nhon",
      title: "We know every growing corner of this city",
      body: "From the city center to new urban areas, Base Land Quy Nhon tracks every stage of the local real estate market's growth.",
      coverageItems: [
        { n: "01", name: "Q'Terra Quy Nhon", location: "01 Ngo May, Quy Nhon" },
        { n: "02", name: "The Sailing Quy Nhon", location: "Lê Duẩn · Vũ Bảo · Nguyễn Tư" },
        { n: "03", name: "Simona Heights", location: "Quy Nhon" },
        { n: "04", name: "Phu Gia Royal Park Quy Nhon", location: "Quy Nhon" },
      ],
    },
  },
};
