export async function getRiskById(taskId: number) {
  const resp = await fetch(`/api/RiskService/GetRiskById?taskId=${taskId}`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  const ct = resp.headers.get("content-type") || "";
  const bodyText = await resp.text(); // read once

  if (!resp.ok || !ct.includes("application/json")) {
    // surface the actual response so you can see HTML / error text
    throw new Error(
      `Request failed: ${resp.status} ${resp.statusText}\n` +
        `URL: ${resp.url}\n` +
        `Body (first 300): ${bodyText.slice(0, 300)}`
    );
  }

  return JSON.parse(bodyText);
}

type ValueTextObj = {
  Value: number;
  Text: string;
};

async function fetchUserNames(): Promise<ValueTextObj[]> {
  const resp = await fetch(`/api/RiskService/GetUserNames`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  const ct = resp.headers.get("content-type") || "";
  const bodyText = await resp.text();

  if (!resp.ok || !ct.includes("application/json")) {
    throw new Error(
      `Request failed: ${resp.status} ${resp.statusText}\n` +
        `URL: ${resp.url}\n` +
        `Body (first 300): ${bodyText.slice(0, 300)}`
    );
  }

  return JSON.parse(bodyText) as ValueTextObj[];
}

export async function getUserNames() {
  return fetchUserNames();
}

export async function getUserNamesAsStringList() {
  const values = await fetchUserNames();
  return values.map((x) => x.Text);
}

