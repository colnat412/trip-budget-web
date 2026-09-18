import { NextResponse, type NextRequest } from 'next/server';

export interface DestinationItem {
  id: string;
  name: string;
  region?: string;
  country: string;
  label: string;
  isPopular?: boolean;
}

const CURATED_DESTINATIONS: DestinationItem[] = [
  // --- Việt Nam: Các điểm du lịch hàng đầu ---
  {
    id: 'vn-danang',
    name: 'Đà Nẵng',
    region: 'Nam Trung Bộ',
    country: 'Việt Nam',
    label: 'Đà Nẵng, Việt Nam',
    isPopular: true,
  },
  {
    id: 'vn-dalat',
    name: 'Đà Lạt',
    region: 'Lâm Đồng',
    country: 'Việt Nam',
    label: 'Đà Lạt, Lâm Đồng, Việt Nam',
    isPopular: true,
  },
  {
    id: 'vn-phuquoc',
    name: 'Phú Quốc',
    region: 'Kiên Giang',
    country: 'Việt Nam',
    label: 'Phú Quốc, Kiên Giang, Việt Nam',
    isPopular: true,
  },
  {
    id: 'vn-nhatrang',
    name: 'Nha Trang',
    region: 'Khánh Hòa',
    country: 'Việt Nam',
    label: 'Nha Trang, Khánh Hòa, Việt Nam',
    isPopular: true,
  },
  {
    id: 'vn-hanoi',
    name: 'Hà Nội',
    region: 'Đồng bằng sông Hồng',
    country: 'Việt Nam',
    label: 'Hà Nội, Việt Nam',
    isPopular: true,
  },
  {
    id: 'vn-hcm',
    name: 'TP. Hồ Chí Minh',
    region: 'Đông Nam Bộ',
    country: 'Việt Nam',
    label: 'TP. Hồ Chí Minh, Việt Nam',
    isPopular: true,
  },
  {
    id: 'vn-hoian',
    name: 'Hội An',
    region: 'Quảng Nam',
    country: 'Việt Nam',
    label: 'Hội An, Quảng Nam, Việt Nam',
    isPopular: true,
  },
  {
    id: 'vn-sapa',
    name: 'Sa Pa',
    region: 'Lào Cai',
    country: 'Việt Nam',
    label: 'Sa Pa, Lào Cai, Việt Nam',
    isPopular: true,
  },
  {
    id: 'vn-halong',
    name: 'Hạ Long',
    region: 'Quảng Ninh',
    country: 'Việt Nam',
    label: 'Hạ Long, Quảng Ninh, Việt Nam',
    isPopular: true,
  },
  {
    id: 'vn-hue',
    name: 'Huế',
    region: 'Thừa Thiên Huế',
    country: 'Việt Nam',
    label: 'Huế, Thừa Thiên Huế, Việt Nam',
    isPopular: true,
  },
  {
    id: 'vn-quynhon',
    name: 'Quy Nhơn',
    region: 'Bình Định',
    country: 'Việt Nam',
    label: 'Quy Nhơn, Bình Định, Việt Nam',
    isPopular: true,
  },
  {
    id: 'vn-vungtau',
    name: 'Vũng Tàu',
    region: 'Bà Rịa - Vũng Tàu',
    country: 'Việt Nam',
    label: 'Vũng Tàu, Bà Rịa - Vũng Tàu, Việt Nam',
    isPopular: true,
  },
  {
    id: 'vn-phanthiet',
    name: 'Phan Thiết (Mũi Né)',
    region: 'Bình Thuận',
    country: 'Việt Nam',
    label: 'Phan Thiết, Bình Thuận, Việt Nam',
    isPopular: true,
  },
  {
    id: 'vn-ninhbinh',
    name: 'Ninh Bình',
    region: 'Đồng bằng sông Hồng',
    country: 'Việt Nam',
    label: 'Ninh Bình, Việt Nam',
    isPopular: true,
  },
  {
    id: 'vn-condao',
    name: 'Côn Đảo',
    region: 'Bà Rịa - Vũng Tàu',
    country: 'Việt Nam',
    label: 'Côn Đảo, Bà Rịa - Vũng Tàu, Việt Nam',
    isPopular: true,
  },
  {
    id: 'vn-phuyen',
    name: 'Tuy Hòa',
    region: 'Phú Yên',
    country: 'Việt Nam',
    label: 'Tuy Hòa, Phú Yên, Việt Nam',
  },
  {
    id: 'vn-cantho',
    name: 'Cần Thơ',
    region: 'Đồng bằng sông Cửu Long',
    country: 'Việt Nam',
    label: 'Cần Thơ, Việt Nam',
  },
  {
    id: 'vn-quangbinh',
    name: 'Đồng Hới (Phong Nha)',
    region: 'Quảng Bình',
    country: 'Việt Nam',
    label: 'Đồng Hới, Quảng Bình, Việt Nam',
  },
  {
    id: 'vn-hagiang',
    name: 'Hà Giang',
    region: 'Đông Bắc Bộ',
    country: 'Việt Nam',
    label: 'Hà Giang, Việt Nam',
  },
  {
    id: 'vn-caobang',
    name: 'Cao Bằng',
    region: 'Đông Bắc Bộ',
    country: 'Việt Nam',
    label: 'Cao Bằng, Việt Nam',
  },
  {
    id: 'vn-buonmathuot',
    name: 'Buôn Ma Thuột',
    region: 'Đắk Lắk',
    country: 'Việt Nam',
    label: 'Buôn Ma Thuột, Đắk Lắk, Việt Nam',
  },
  {
    id: 'vn-haiphong',
    name: 'Hải Phòng',
    region: 'Đồng bằng sông Hồng',
    country: 'Việt Nam',
    label: 'Hải Phòng, Việt Nam',
  },
  {
    id: 'vn-angiang',
    name: 'Châu Đốc',
    region: 'An Giang',
    country: 'Việt Nam',
    label: 'Châu Đốc, An Giang, Việt Nam',
  },
  {
    id: 'vn-tayninh',
    name: 'Tây Ninh',
    region: 'Đông Nam Bộ',
    country: 'Việt Nam',
    label: 'Tây Ninh, Việt Nam',
  },
  {
    id: 'vn-dongnai',
    name: 'Biên Hòa',
    region: 'Đồng Nai',
    country: 'Việt Nam',
    label: 'Biên Hòa, Đồng Nai, Việt Nam',
  },
  {
    id: 'vn-binhduong',
    name: 'Thủ Dầu Một',
    region: 'Bình Dương',
    country: 'Việt Nam',
    label: 'Thủ Dầu Một, Bình Dương, Việt Nam',
  },
  {
    id: 'vn-tiengiang',
    name: 'Mỹ Tho',
    region: 'Tiền Giang',
    country: 'Việt Nam',
    label: 'Mỹ Tho, Tiền Giang, Việt Nam',
  },
  {
    id: 'vn-bentre',
    name: 'Bến Tre',
    region: 'Đồng bằng sông Cửu Long',
    country: 'Việt Nam',
    label: 'Bến Tre, Việt Nam',
  },

  // --- Quốc tế: Các điểm đến thịnh hành ---
  {
    id: 'intl-bangkok',
    name: 'Bangkok',
    region: 'Trung tâm',
    country: 'Thái Lan',
    label: 'Bangkok, Thái Lan',
    isPopular: true,
  },
  {
    id: 'intl-tokyo',
    name: 'Tokyo',
    region: 'Kanto',
    country: 'Nhật Bản',
    label: 'Tokyo, Nhật Bản',
    isPopular: true,
  },
  {
    id: 'intl-seoul',
    name: 'Seoul',
    region: 'Thủ đô',
    country: 'Hàn Quốc',
    label: 'Seoul, Hàn Quốc',
    isPopular: true,
  },
  {
    id: 'intl-singapore',
    name: 'Singapore',
    region: 'Singapore',
    country: 'Singapore',
    label: 'Singapore, Singapore',
    isPopular: true,
  },
  {
    id: 'intl-bali',
    name: 'Bali',
    region: 'Quần đảo Sunda Nhỏ',
    country: 'Indonesia',
    label: 'Bali, Indonesia',
    isPopular: true,
  },
  {
    id: 'intl-taipei',
    name: 'Đài Bắc (Taipei)',
    region: 'Đài Bắc',
    country: 'Đài Loan',
    label: 'Đài Bắc, Đài Loan',
    isPopular: true,
  },
  {
    id: 'intl-kl',
    name: 'Kuala Lumpur',
    region: 'Lãnh thổ Liên bang',
    country: 'Malaysia',
    label: 'Kuala Lumpur, Malaysia',
    isPopular: true,
  },
  {
    id: 'intl-chiangmai',
    name: 'Chiang Mai',
    region: 'Miền Bắc',
    country: 'Thái Lan',
    label: 'Chiang Mai, Thái Lan',
  },
  {
    id: 'intl-osaka',
    name: 'Osaka',
    region: 'Kansai',
    country: 'Nhật Bản',
    label: 'Osaka, Nhật Bản',
  },
  {
    id: 'intl-busan',
    name: 'Busan',
    region: 'Yeongnam',
    country: 'Hàn Quốc',
    label: 'Busan, Hàn Quốc',
  },
  {
    id: 'intl-paris',
    name: 'Paris',
    region: 'Île-de-France',
    country: 'Pháp',
    label: 'Paris, Pháp',
    isPopular: true,
  },
  {
    id: 'intl-london',
    name: 'London',
    region: 'Greater London',
    country: 'Vương quốc Anh',
    label: 'London, Vương quốc Anh',
  },
  {
    id: 'intl-rome',
    name: 'Rome',
    region: 'Lazio',
    country: 'Ý',
    label: 'Rome, Ý',
  },
  {
    id: 'intl-sydney',
    name: 'Sydney',
    region: 'New South Wales',
    country: 'Úc',
    label: 'Sydney, Úc',
  },
  {
    id: 'intl-dubai',
    name: 'Dubai',
    region: 'Tiểu vương quốc Dubai',
    country: 'UAE',
    label: 'Dubai, Các Tiểu vương quốc Ả Rập Thống nhất',
  },
];

const removeDiacritics = (str: string): string => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
};

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const rawQuery = searchParams.get('q')?.trim() || '';

    if (!rawQuery) {
      const popular = CURATED_DESTINATIONS.filter((d) => d.isPopular);
      return NextResponse.json({
        status: 200,
        destinations: popular,
      });
    }

    const normalizedQuery = removeDiacritics(rawQuery);

    const curatedMatches = CURATED_DESTINATIONS.filter((item) => {
      const normName = removeDiacritics(item.name);
      const normRegion = item.region ? removeDiacritics(item.region) : '';
      const normCountry = removeDiacritics(item.country);
      const normLabel = removeDiacritics(item.label);

      return (
        normName.includes(normalizedQuery) ||
        normRegion.includes(normalizedQuery) ||
        normCountry.includes(normalizedQuery) ||
        normLabel.includes(normalizedQuery)
      );
    });

    let apiResults: DestinationItem[] = [];
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const apiUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        rawQuery,
      )}&count=8&language=vi&format=json`;

      const response = await fetch(apiUrl, {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data?.results)) {
          apiResults = data.results.map(
            (res: {
              id: number | string;
              name: string;
              admin1?: string;
              country?: string;
            }) => {
              const name = res.name;
              const region = res.admin1 || '';
              const country = res.country || '';
              const parts = [name];
              if (region && region !== name) parts.push(region);
              if (country) parts.push(country);

              return {
                id: `geo-${res.id}`,
                name,
                region,
                country,
                label: parts.join(', '),
              };
            },
          );
        }
      }
    } catch {}

    const combined: DestinationItem[] = [];
    const seenLabels = new Set<string>();

    for (const item of [...curatedMatches, ...apiResults]) {
      const lowerLabel = item.label.toLowerCase();
      if (!seenLabels.has(lowerLabel)) {
        seenLabels.add(lowerLabel);
        combined.push(item);
      }
    }

    return NextResponse.json({
      status: 200,
      destinations: combined.slice(0, 15),
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 500,
        message:
          error instanceof Error ? error.message : 'Internal Server Error',
        destinations: [],
      },
      { status: 500 },
    );
  }
};
