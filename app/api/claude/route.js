export async function POST(req) {
  try {
    const { messages, system } = await req.json();
    const apiKey = req.headers.get('x-claude-key');

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-opus-4-6',
        max_tokens: 600,
        system,
        messages
      })
    });

    const data = await res.json();
    if (!res.ok) return Response.json({ error: data }, { status: res.status });
    return Response.json(data);
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
