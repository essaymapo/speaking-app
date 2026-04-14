export async function POST(req) {
  try {
    const { messages, system } = await req.json();
    const apiKey = req.headers.get('x-gpt-key');

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        max_tokens: 600,
        messages: [
          { role: 'system', content: system },
          ...messages
        ]
      })
    });

    const data = await res.json();
    if (!res.ok) return Response.json({ error: data }, { status: res.status });
    return Response.json(data);
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
