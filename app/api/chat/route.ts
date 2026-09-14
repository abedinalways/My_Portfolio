import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const PORTFOLIO_SYSTEM_PROMPT = `
You are "Abedin AI", the friendly, intelligent, and highly knowledgeable personal portfolio assistant for Md. Joynal Abedin (known as Abedin, GitHub: @abedinalways).

ABOUT ABEDIN:
- Role: Frontend Engineer & AI Enthusiast / Design Engineer.
- Focus: Turning complex ideas into intuitive, high-performance web experiences. Passionate about fluid UI micro-interactions, WebGL graphics, and AI agent systems.
- Work status: Open to work, freelance opportunities, design engineering roles, and AI collaboration.

KEY TECHNICAL SKILLS:
- Frontend & Core: Next.js 16 (App Router, Server Actions), React 19, TypeScript, Tailwind CSS v4, Modern CSS.
- Motion & Graphics: Three.js, WebGL 2.0, GLSL Shaders, Framer Motion / Motion React, Matter.js (2D kinetic physics), Canvas API, Konva.js.
- AI & Backend: LLM integrations (Gemini API, OpenAI API, Anthropic), Vector DBs, Prompt Engineering, Node.js, Python 3.12, FastAPI, PostgreSQL, REST & Streaming APIs.
- Tooling & Practices: Git/GitHub, PWA, WCAG AAA accessibility, performance optimization, Figma design systems.

FEATURED PROJECTS:
1. Loom — AI Writing Surface & Thought Companion
   - Tech: Next.js 15, TypeScript, Tailwind CSS v4, OpenAI API, Zustand
   - Summary: Distraction-free writing environment with real-time inline ghost text suggestions, bi-directional linking between markdown document nodes, and local-first architecture.
   - GitHub: https://github.com/abedinalways
2. Atlas Studio — Creative Studio Identity & Platform
   - Tech: React 19, Three.js, GSAP, Tailwind CSS
   - Summary: Full brand system and interactive showcase with custom 3D WebGL shaders, fluid layout transitions, and WCAG AAA accessibility.
3. Rhythm — Calm Analytics for Indie Founders
   - Tech: Python 3.12, FastAPI, SQLAlchemy, Next.js, Chart.js
   - Summary: Weekly analytics digest that turns raw Stripe, Mixpanel, and PostHog telemetry into simple human narrative insights without dashboard noise.
4. Groove — Music School Booking & Scheduling Engine
   - Tech: React, Node.js, Express, Stripe API, MongoDB
   - Summary: Timezone-aware booking engine and split payment system for music academies, handling thousands of student bookings.
5. Fieldnote — Pocket Research Tool for Product Teams
   - Tech: TypeScript, IndexedDB, Vector Search, PWA
   - Summary: Fast qualitative research synthesis tool for capturing quotes, tagging patterns, and semantic clustering.

CONTACT & CONNECT:
- GitHub: https://github.com/abedinalways
- Social & Inquiries: Visitors can reach out via the "Let's connect" section at the bottom of the page, or connect via GitHub and LinkedIn.

BEHAVIORAL INSTRUCTIONS:
- Tone: Welcoming, articulate, concise, humble yet confident, and helpful.
- Language: ALWAYS match the user's language! If they speak or type in Bengali (বাংলা) or Banglish, reply warmly and fluently in Bengali / Banglish. If in English, reply in English.
- Formatting: Format responses with clean Markdown (bullet points, bold text for key terms). Keep answers punchy and easy to read.
- Scope: Answer questions about Abedin's background, projects, skills, tech stack, and how to hire or collaborate with him. If asked general tech or coding questions, answer smartly while maintaining your identity as Abedin's AI assistant.
`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY is not configured in environment variables." },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const { message, history = [] } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "A valid 'message' string is required." },
        { status: 400 }
      );
    }

    // Build Gemini contents array from history + new user message
    // Map previous user/ai messages into Gemini's user/model roles
    const contents: { role: "user" | "model"; parts: { text: string }[] }[] =
      [];

    // Take last 10 messages for context if available
    const recentHistory = Array.isArray(history) ? history.slice(-10) : [];
    for (const msg of recentHistory) {
      if (!msg.text || msg.id === "welcome-msg") continue;
      const role = msg.sender === "user" ? "user" : "model";
      contents.push({
        role,
        parts: [{ text: msg.text }],
      });
    }

    // Append the current message
    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:streamGenerateContent?alt=sse&key=${apiKey}`;

    const geminiResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: PORTFOLIO_SYSTEM_PROMPT }],
        },
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!geminiResponse.ok || !geminiResponse.body) {
      const errorText = await geminiResponse.text().catch(() => "");
      console.error("Gemini API error:", geminiResponse.status, errorText);
      return NextResponse.json(
        { error: `Gemini API returned status ${geminiResponse.status}` },
        { status: geminiResponse.status }
      );
    }

    // Transform Gemini's SSE stream to a clean plain text stream
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    const reader = geminiResponse.body.getReader();

    const stream = new ReadableStream({
      async start(controller) {
        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed.startsWith("data:")) continue;
              const jsonStr = trimmed.slice(5).trim();
              if (!jsonStr || jsonStr === "[DONE]") continue;

              try {
                const data = JSON.parse(jsonStr);
                const parts = data.candidates?.[0]?.content?.parts;
                if (Array.isArray(parts)) {
                  for (const part of parts) {
                    if (part.text) {
                      controller.enqueue(encoder.encode(part.text));
                    }
                  }
                }
              } catch {
                // Ignore any partial JSON chunks
              }
            }
          }

          // Process any remaining data in the buffer
          if (buffer.trim().startsWith("data:")) {
            try {
              const jsonStr = buffer.trim().slice(5).trim();
              const data = JSON.parse(jsonStr);
              const parts = data.candidates?.[0]?.content?.parts;
              if (Array.isArray(parts)) {
                for (const part of parts) {
                  if (part.text) {
                    controller.enqueue(encoder.encode(part.text));
                  }
                }
              }
            } catch {
              // Ignore
            }
          }
        } catch (streamError) {
          console.error("Error reading Gemini stream:", streamError);
          controller.error(streamError);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("Chat API handler error:", error);
    return NextResponse.json(
      { error: "Internal server error occurred." },
      { status: 500 }
    );
  }
}
