// /functions/delhiveryTrack.js
// UrbanCults → Delhivery tracking proxy (Netlify Function)

export default async (req, res) => {
  const awb = req.query.awb;
  if (!awb) return res.status(400).json({ error: "Missing AWB" });

  // Call Delhivery’s public tracking endpoint
  const r = await fetch(
    `https://track.delhivery.com/api/v1/packages/json/?tracking_numbers=${awb}`,
    { headers: { Authorization: `Bearer ${process.env.DELHIVERY_TOKEN}` } }
  );

  if (!r.ok) {
    return res
      .status(502)
      .json({ error: "Delhivery responded with " + r.status });
  }

  const payload = await r.json();

  // Allow Shopify front-end domain to call this (CORS)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  return res.json(payload);
};
