import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
  const placeholderTask = {
    title: "Project Milestone 1",
    course_code: "SE300",
    due_date: new Date(Date.now() + 86400000 * 7).toISOString(),
    category: "Project",
    confidence_score: 0.85
  };

  return new Response(
    JSON.stringify(placeholderTask),
    { headers: { "Content-Type": "application/json" } }
  );
});
