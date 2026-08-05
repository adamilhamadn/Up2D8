import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
  const placeholderTask = {
    title: "Final Exam",
    course_code: "CS101",
    due_date: new Date("2024-12-15T09:00:00Z").toISOString(),
    category: "Exam",
    confidence_score: 0.95
  };

  return new Response(
    JSON.stringify(placeholderTask),
    { headers: { "Content-Type": "application/json" } }
  );
});
