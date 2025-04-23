
export default async function handler(req, res) {
  console.log("Request received");

  if (req.method !== 'POST') {
    console.log("Invalid method:", req.method);
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { prompt } = req.body || {};
  console.log("Prompt received:", prompt);

  if (!process.env.FAL_API_KEY) {
    console.error("Missing FAL_API_KEY");
    return res.status(500).json({ error: 'Missing FAL_API_KEY in environment variables' });
  }

  try {
    const response = await fetch('https://api.fal.ai/fal-serverless/sd-diffusion', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${process.env.FAL_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt })
    });

    console.log("FAL API Response Status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("FAL API Error:", errorText);
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();
    console.log("FAL API Success:", data);

    return res.status(200).json(data);
  } catch (err) {
    console.error("Request to FAL failed:", err.message);
    return res.status(500).json({ error: err.message });
  }
}
