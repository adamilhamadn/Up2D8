import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const message = body.message;

    if (!message || (!message.text && !message.caption)) {
      return new Response('ok', { headers: corsHeaders });
    }

    const text = message.text || message.caption;
    const chatId = message.chat.id;

    // Call OpenAI for extraction
    const openAiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAiKey) throw new Error('No OPENAI_API_KEY');

    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: "system",
            content: `Extract task details into this JSON structure:
{"title":"...","category":"Coursework"|"Exam"|"Project"|"Info","course_code":null,"due_date":"ISO8601 or null","description":null,"confidence_score":0.9}
Respond ONLY with raw JSON.`
          },
          { role: "user", content: text }
        ],
        temperature: 0.1,
        response_format: { type: "json_object" }
      }),
    });

    if (!openaiRes.ok) throw new Error('OpenAI fetch failed');
    const aiData = await openaiRes.json();
    const extracted = JSON.parse(aiData.choices[0].message.content);

    // Save to Supabase DB (using service role key)
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // We assume the user has linked their Telegram chat ID to their user ID.
    // For this MVP, we just insert it into a `cloud_tasks` table.
    const { error } = await supabase.from('cloud_tasks').insert({
      title: extracted.title,
      category: extracted.category,
      course_code: extracted.course_code,
      due_date: extracted.due_date,
      description: extracted.description,
      confidence_score: extracted.confidence_score,
      telegram_chat_id: chatId.toString(),
      status: 'draft'
    });

    if (error) throw error;

    // Send confirmation back to Telegram
    const telegramToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
    if (telegramToken) {
      await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: `Got it! Staged "${extracted.title}" in your Drafts.`
        })
      });
    }

    return new Response(JSON.stringify({ status: "ok" }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
