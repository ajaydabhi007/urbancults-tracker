// Netlify Function (CommonJS) — UrbanCults ➜ Delhivery proxy
// If your site is on Node 18+ you already have fetch globally.

exports.handler = async (event) => {
  // Grab ?awb=123... from the query-string
  const awb = event.queryStringParameters && event.queryStringParameters.awb;

  if (!awb) {
    return {
      statusCode: 400,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Missing awb query parameter" }),
    };
  }

  // Call Delhivery’s tracking API
  const apiRes = await fetch(
    `https://track.delhivery.com/api/v1/packages/json/?waybill=${awb}`,
    { headers: { Authorization: `Bearer ${process.env.DELHIVERY_TOKEN}` } }
  );

  if (!apiRes.ok) {
    return {
      statusCode: 502,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Delhivery error", status: apiRes.status }),
    };
  }

  const data = await apiRes.json();

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
};
