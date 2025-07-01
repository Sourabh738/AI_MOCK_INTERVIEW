import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { getRandomInterviewCover } from "@/lib/utils";
import { db } from "@/Firebase/admin";

export async function POST(request: Request) {
  console.log("🔥 /api/vapi/generate hit!");

  const { type, role, level, techstack, amount, userid } = await request.json();
  console.log("Received payload:", { type, role, level, techstack, amount, userid });

  if (!type || !role || !level || !techstack || !amount) {
    return Response.json({ success: false, error: "Missing required fields" }, { status: 400 });
  }

  try {
    const { text: rawQuestions } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]

        Thank you! <3`,
    });

    console.log("📝 Raw generated questions:", rawQuestions);

    // 🧼 Clean Gemini's Markdown formatting like ```json ... ```
    const cleanQuestions = rawQuestions
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    const parsedQuestions = JSON.parse(cleanQuestions);
    console.log("✅ Parsed questions:", parsedQuestions);

    const interview = {
      role,
      type,
      level,
      techstack: techstack.split(','),
      questions: parsedQuestions,
      userid,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    await db.collection("interview").add(interview);
    console.log("✅ Interview saved to Firestore");

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("❌ Error while generating or saving interview:", error);
    return Response.json({ success: false, error: error instanceof Error ? error.message : error }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({ success: true, data: 'THANK YOU!' }, { status: 200 });
}
