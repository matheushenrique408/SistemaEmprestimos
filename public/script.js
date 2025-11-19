const API = "http://localhost:3000/api";

async function api(endpoint, method = "GET", body = null) {
  const config = { method, headers: { "Content-Type": "application/json" } };

  if (body) config.body = JSON.stringify(body);

  const res = await fetch(API + endpoint, config);
  return res.json();
}
