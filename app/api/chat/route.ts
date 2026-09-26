import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";

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
1. TableRounds — Medical & Surgical Board Examination Platform
   - Tech: Next.js 16 (App Router), React 19, TypeScript, Redux Toolkit, Socket.io, Recharts
   - Summary: Clinician-built board examination platform featuring question banks, dynamic quiz runner, and global leaderboards.
   - Live: https://tablerounds.ai
2. ITBA Expo 2027 — Exhibition Stand Booking & Management Platform
   - Tech: Next.js 16, React 19, TypeScript, Stripe Elements, Socket.io, Recharts, SVG Canvas
   - Summary: Interactive SVG floor plan stand booking platform with Stripe checkout and organizer analytics dashboard.
   - Live: https://itbaexpo.ie
3. Kreatovate Project Suite — AI Marketing & Consulting Ecosystem
   - Tech: Next.js, React 19, TypeScript, GSAP, Tailwind CSS, Shadcn/UI
   - Summary: Multi-platform enterprise digital ecosystem for business consulting, workforce management, and innovation.
   - Live: https://kreatovate.com
4. Fleetos Pro — Multi-Tenant Freight & Dispatch Management Platform
   - Tech: Next.js 16.1, React 19, TypeScript, Redux Toolkit, Socket.io, Chart.js, Recharts
   - Summary: Supply chain platform with isolated workspaces for Dispatchers, Admins, and Super Admins, load dispatching, and live tracking.
   - Live: https://fleetos.pro
5. Waffless — Client & Video Editor Marketplace
   - Tech: Next.js 16.1, React 19, TypeScript, Redux Toolkit, RTK Query, TanStack Table, ApexCharts
   - Summary: Two-sided marketplace connecting clients and video editors with route-isolated workspaces and real-time messaging.
   - Live: https://affless-frontend.vercel.app
6. Apsu — Digital Health & Clinical Assessment Platform
   - Tech: Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui, Zod, React Hook Form
   - Summary: Digital telehealth platform supporting multi-step clinical assessment flows for weight loss, birth control, and sleep.
   - Live: https://liuentung-front-end.vercel.app
7. Bio-Identifier — AI Snake & Insect Recognition
   - Tech: Next.js 16, NestJS, TypeScript, Computer Vision, Prisma ORM
   - Summary: Intelligent platform powered by computer vision to identify snake and insect species, assess venomous risk, and explore biological taxonomy.
   - GitHub: https://github.com/abedinalways/bio-identifier-frontend
8. Loom — AI Writing Surface & Thought Companion
   - Tech: Next.js, TypeScript, Tailwind CSS v4, OpenAI API, Zustand
   - Summary: Distraction-free writing environment with real-time inline ghost text suggestions and local-first sync.


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
  const apiKey = env.GEMINI_API_KEY;

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
