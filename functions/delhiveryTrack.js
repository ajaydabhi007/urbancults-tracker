// Netlify Edge/Request style function — UrbanCults Delhivery proxy
export default async (request) => {
  // 1️⃣ grab ?awb= from the URL
  const { searchParams } = new URL(request.url);
  const awb = searchParams.get("awb");

  if (!awb) {
    return new Response(JSON.stringify({ error: "Missing AWB" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 2️⃣ call Delhivery Tracking API
  const apiRes = await fetch(
    `https://track.delhivery.com/api/v1/packages/json/?waybill=${awb}`,,
    {
      headers: { Authorization: `Bearer ${process.env.DELHIVERY_TOKEN}` },
    }
  );

  if (!apiRes.ok) {
    return new Response(
      JSON.stringify({ error: "Delhivery error", status: apiRes.status }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }

  const data = await apiRes.json();

  // 3️⃣ return JSON + basic CORS so Shopify can call it
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
  });
};
