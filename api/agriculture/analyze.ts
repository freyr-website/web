type InsightRequest = { location?: string; crop?: string; [key: string]: unknown }

export default async function analyze(request: Request): Promise<Response> {
  if (request.method !== 'POST') return Response.json({ error: 'Method not allowed' }, { status: 405 })
  const input = await request.json() as InsightRequest
  if (!input.location || !input.crop) return Response.json({ error: 'location and crop are required' }, { status: 400 })
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return Response.json({ error: 'Gemini is not configured' }, { status: 503 })
  const model = process.env.GEMINI_MODEL ?? 'gemini-2.0-flash'
  const prompt = `Return JSON only matching this schema: {"summary":string,"risks":{"water":"low|medium|high","flood":"low|medium|high","heat":"low|medium|high","disease":"low|medium|high"},"recommendations":[{"title":string,"description":string,"priority":"low|medium|high"}],"reasoning":string,"confidence":"low|medium|high"}. Explain the provided structured weather data for crop ${input.crop} in ${input.location}. Never invent weather measurements; use only the JSON input.`
  const upstream = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: `${prompt}\nDATA:\n${JSON.stringify(input)}` }] }], generationConfig: { responseMimeType: 'application/json' } }) })
  if (!upstream.ok) return new Response(await upstream.text(), { status: 502, headers: { 'Content-Type': 'application/json' } })
  const payload = await upstream.json() as { candidates?: { content?: { parts?: { text?: string }[] } }[] }
  const text = payload.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) return Response.json({ error: 'Gemini returned no insight' }, { status: 502 })
  return new Response(text, { headers: { 'Content-Type': 'application/json' } })
}
