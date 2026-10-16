// src/services/manifestService.js

const BASE_URL = "https://api.postcode.gov.ng/v1";

const NIPOST_DIRECTORY = {
  "LA-11-W06-TC-10": {
    postcode: "LA-11-W06-TC-10",
    valid: true,
    administrative_address: {
      state_name: "LAGOS",
      lga_name: "IKEJA",
      locality_name: "IKEJA GRA",
      zone: "SOUTH WEST",
    },
    recent_house_address: {
      recent: "14 ISAAC JOHN STREET, IKEJA GRA, LAGOS",
    },
    building_use_status: "residential",
  },
  "LA-11-W06-TC-18": {
    postcode: "LA-11-W06-TC-18",
    valid: true,
    administrative_address: {
      state_name: "LAGOS",
      lga_name: "IKEJA",
      locality_name: "IKEJA GRA",
      zone: "SOUTH WEST",
    },
    recent_house_address: {
      recent: "28 JOEL OGUNNAIKE STREET, IKEJA GRA, LAGOS",
    },
    building_use_status: "commercial",
  },
  "LA-11-W06-AB-04": {
    postcode: "LA-11-W06-AB-04",
    valid: true,
    administrative_address: {
      state_name: "LAGOS",
      lga_name: "IKEJA",
      locality_name: "IKEJA GRA",
      zone: "SOUTH WEST",
    },
    recent_house_address: {
      recent: "7 ODUDUWA CRESCENT, IKEJA GRA, LAGOS",
    },
    building_use_status: "residential",
  },
  "FC-01-A01-KP-27": {
    postcode: "FC-01-A01-KP-27",
    valid: true,
    administrative_address: {
      state_name: "FCT",
      lga_name: "ABUJA MUNICIPAL AREA COUNCIL",
      locality_name: "CENTRAL BUSINESS DISTRICT",
      zone: "NORTH CENTRAL",
    },
    recent_house_address: {
      recent: "NIPOST HEADQUARTERS, HERBERT MACAULAY WAY, GARKI, ABUJA",
    },
    building_use_status: "commercial",
  },
  "FC-01-A01-LR-01": {
    postcode: "FC-01-A01-LR-01",
    valid: true,
    administrative_address: {
      state_name: "FCT",
      lga_name: "ABUJA MUNICIPAL AREA COUNCIL",
      locality_name: "GARKI",
      zone: "NORTH CENTRAL",
    },
    recent_house_address: {
      recent: "PLOT 42 TAFAWA BALEWA WAY, AREA 11, GARKI, ABUJA",
    },
    building_use_status: "commercial",
  },
  "FC-01-A01-MH-01": {
    postcode: "FC-01-A01-MH-01",
    valid: true,
    administrative_address: {
      state_name: "FCT",
      lga_name: "ABUJA MUNICIPAL AREA COUNCIL",
      locality_name: "GARKI",
      zone: "NORTH CENTRAL",
    },
    recent_house_address: {
      recent: "12 OGBOMOSHO STREET, AREA 8, GARKI, ABUJA",
    },
    building_use_status: "residential",
  },
  "OG-14-T18-BN-16": {
    postcode: "OG-14-T18-BN-16",
    valid: true,
    administrative_address: {
      state_name: "OGUN",
      lga_name: "IFO",
      locality_name: "AKUTE",
      zone: "SOUTH WEST",
    },
    recent_house_address: {
      recent: "22 ALAGBOLE AKUTE ROAD, IFO, OGUN STATE",
    },
    building_use_status: "residential",
  },
  "EK-01-A03-FK-01": {
    postcode: "EK-01-A03-FK-01",
    valid: true,
    administrative_address: {
      state_name: "EKITI",
      lga_name: "ADO EKITI",
      locality_name: "ADO EKITI",
      zone: "SOUTH WEST",
    },
    recent_house_address: {
      recent: "NTA ROAD, BACK OF FABIAN HOTEL, ADO EKITI",
    },
    building_use_status: "residential",
  },
};

const RIDER_POOL = {
  "LA-11-W06": { name: "Tunde Bakare", bike: "LAG-402-XM" },
  "FC-01-A01": { name: "Ibrahim Musa", bike: "ABJ-819-KT" },
  "OG-14-T18": { name: "Segun Adeyemi", bike: "OGN-215-QA" },
  "EK-01-A03": { name: "Femi Daramola", bike: "EKT-109-ZR" },
};

export const SAMPLE_RAW_MANIFEST = [
  {
    order_id: "ORD-901",
    customer: "Amaka Obi",
    phone: "08031112201",
    raw_postcode: "la 11 w06 tc 18",
    package_weight: "2.4kg",
  },
  {
    order_id: "ORD-902",
    customer: "Bello Danjuma",
    phone: "08023334412",
    raw_postcode: "FC-01-A01-KP-27",
    package_weight: "1.1kg",
  },
  {
    order_id: "ORD-903",
    customer: "Kemi Adebayo",
    phone: "08095556677",
    raw_postcode: "LA11W06TC10",
    package_weight: "3.0kg",
  },
  {
    order_id: "ORD-904",
    customer: "Yusuf Garba",
    phone: "08057778899",
    raw_postcode: "FC-00-A01-LR-01",
    package_weight: "0.8kg",
  },
  {
    order_id: "ORD-905",
    customer: "Ngozi Eze",
    phone: "08134445566",
    raw_postcode: "fc-01-a01-lr-01",
    package_weight: "4.2kg",
  },
  {
    order_id: "ORD-906",
    customer: "Tosin Ajayi",
    phone: "07062223344",
    raw_postcode: "LA-11-W06-AB-04",
    package_weight: "1.5kg",
  },
  {
    order_id: "ORD-907",
    customer: "Sadiq Abubakar",
    phone: "08089990011",
    raw_postcode: "FC01A01MH01",
    package_weight: "2.0kg",
  },
  {
    order_id: "ORD-908",
    customer: "Biodun Oke",
    phone: "08161239876",
    raw_postcode: "OG-14-T18-BN-16",
    package_weight: "5.5kg",
  },
  {
    order_id: "ORD-909",
    customer: "Chidi Nwachukwu",
    phone: "08039876543",
    raw_postcode: "LA-11-W06-TC-00",
    package_weight: "1.9kg",
  },
];

export function normalizePostcode(rawInput = "") {
  const clean = rawInput.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  if (clean.length !== 11) {
    return clean;
  }
  return `${clean.slice(0, 2)}-${clean.slice(2, 4)}-${clean.slice(4, 7)}-${clean.slice(7, 9)}-${clean.slice(9, 11)}`;
}

export function disassemblePostcode(rawCode) {
  const canonical = normalizePostcode(rawCode);
  const pattern = /^([A-Z]{2})-(0[1-9]|[1-9][0-9])-([A-Z0-9]{3})-([A-Z]{2})-(0[1-9]|[1-9][0-9])$/;
  const match = canonical.match(pattern);

  if (!match) {
    return null;
  }

  return {
    canonical,
    clusterKey: `${match[1]}-${match[2]}-${match[3]}`,
    segments: {
      state: match[1],
      lga: match[2],
      district: match[3],
      area: match[4],
      unit: match[5],
    },
  };
}

export async function resolveManifestRow(row, apiKey = "") {
  const disassembled = disassemblePostcode(row.raw_postcode);

  if (!disassembled) {
    return {
      ...row,
      canonical_postcode: normalizePostcode(row.raw_postcode),
      status: "INVALID_FORMAT",
      error_reason:
        "Must be 11 characters (AA-99-A99-AA-99) with numeric segments 01 to 99.",
      segments: null,
      address_data: null,
    };
  }

  const { canonical, clusterKey, segments } = disassembled;
  const endpointUrl = `${BASE_URL}/lookup?code=${encodeURIComponent(canonical)}&level=3`;

  if (apiKey && apiKey.trim() !== "") {
    try {
      const response = await fetch(endpointUrl, {
        method: "GET",
        headers: {
          "X-API-Key": apiKey.trim(),
          Accept: "application/json",
        },
      });
      const result = await response.json();

      if (!response.ok || !result?.data?.valid) {
        return {
          ...row,
          canonical_postcode: canonical,
          status: "NOT_FOUND",
          error_reason:
            result?.error?.message || "Postcode not found in NIPOST registry.",
          segments,
          address_data: null,
        };
      }

      return {
        ...row,
        canonical_postcode: canonical,
        clusterKey,
        status: "VALID",
        error_reason: null,
        segments,
        address_data: result.data,
      };
    } catch (err) {
      return {
        ...row,
        canonical_postcode: canonical,
        status: "API_ERROR",
        error_reason: err.message,
        segments,
        address_data: null,
      };
    }
  }

  const record = NIPOST_DIRECTORY[canonical];
  if (!record) {
    return {
      ...row,
      canonical_postcode: canonical,
      status: "NOT_FOUND",
      error_reason:
        "Code format is valid, but building record is not in offline sample set.",
      segments,
      address_data: null,
    };
  }

  return {
    ...row,
    canonical_postcode: canonical,
    clusterKey,
    status: "VALID",
    error_reason: null,
    segments,
    address_data: record,
  };
}

export async function processManifestBatch(rows, apiKey = "") {
  const processedRows = await Promise.all(
    rows.map((row) => resolveManifestRow(row, apiKey))
  );

  const clustersMap = {};

  processedRows
    .filter((r) => r.status === "VALID")
    .forEach((row) => {
      const key = row.clusterKey;
      if (!clustersMap[key]) {
        const admin = row.address_data.administrative_address;
        const rider = RIDER_POOL[key] || {
          name: "Assigned Zone Rider",
          bike: `${row.segments.state}-900-RT`,
        };
        clustersMap[key] = {
          clusterKey: key,
          stateName: admin.state_name,
          lgaName: admin.lga_name,
          localityName: admin.locality_name,
          riderName: rider.name,
          riderBike: rider.bike,
          stops: [],
        };
      }
      clustersMap[key].stops.push(row);
    });

  const routeClusters = Object.values(clustersMap).map((cluster) => {
    cluster.stops.sort((a, b) => {
      const areaCompare = a.segments.area.localeCompare(b.segments.area);
      if (areaCompare !== 0) return areaCompare;
      return parseInt(a.segments.unit, 10) - parseInt(b.segments.unit, 10);
    });
    return cluster;
  });

  return {
    processedRows,
    routeClusters,
  };
}

export function parseUploadedCsv(csvText) {
  const lines = csvText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  return lines.slice(1).map((line, idx) => {
    const values = line.split(",").map((v) => v.trim());
    const entry = {};
    headers.forEach((h, i) => {
      entry[h] = values[i] || "";
    });
    return {
      order_id: entry.order_id || `CSV-${100 + idx}`,
      customer: entry.customer || "Customer",
      phone: entry.phone || "08000000000",
      raw_postcode: entry.raw_postcode || entry.postcode || "",
      package_weight: entry.package_weight || "1.0kg",
    };
  });
}

export function generateCleanRoutesCsv(routeClusters) {
  const headers = [
    "Route_Cluster",
    "Stop_Sequence",
    "Assigned_Rider",
    "Order_ID",
    "Customer",
    "Phone",
    "Canonical_Postcode",
    "Building_Type",
    "Verified_Street_Address",
    "LGA",
    "State",
  ];

  const rows = [];
  routeClusters.forEach((cluster) => {
    cluster.stops.forEach((stop, index) => {
      rows.push([
        cluster.clusterKey,
        index + 1,
        cluster.riderName,
        stop.order_id,
        `"${stop.customer}"`,
        stop.phone,
        stop.canonical_postcode,
        stop.address_data.building_use_status,
        `"${stop.address_data.recent_house_address.recent}"`,
        `"${cluster.lgaName}"`,
        cluster.stateName,
      ]);
    });
  });

  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}
