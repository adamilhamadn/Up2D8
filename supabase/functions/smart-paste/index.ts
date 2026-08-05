import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { text, imageBase64 } = await req.json();
    const openAiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openAiKey) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    let messages: any[] = [
      {
        role: "system",
        content: `You are an academic deadline extractor. Extract task details into this JSON structure:
{
  "title": "Short concise title",
  "category": "Coursework" | "Exam" | "Project" | "Info",
  "course_code": "Optional (e.g. CS101) or null",
  "due_date": "ISO8601 string if found, else null",
  "description": "Any remaining context or null",
  "confidence_score": 0.0 to 1.0 (1.0 if highly certain, <0.8 if guessing)
}
Respond ONLY with raw JSON.`
      }
    ];

    if (text) {
      messages.push({ role: "user", content: text });
    } else if (imageBase64) {
      messages.push({
        role: "user",
        content: [
          { type: "text", text: "Extract the deadlines from this image." },
          { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageBase64}` } }
        ]
      });
    } else {
      throw new Error("No text or image provided");
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.1,
        response_format: { type: "json_object" }
      }),
    });

    const aiData = await response.json();
    if (!response.ok) throw new Error(`OpenAI Error: ${aiData.error?.message || 'Unknown'}`);

    const extracted = JSON.parse(aiData.choices[0].message.content);

    return new Response(JSON.stringify(extracted), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
