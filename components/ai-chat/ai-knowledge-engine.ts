export type ChatMessage = {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  quickActions?: { label: string; action: string }[];
};

export const QUICK_PROMPTS = [
  "What are Abedin's top skills?",
  "Show me Abedin's best projects",
  "Is Abedin available for freelance?",
  "How can I contact Abedin?",
];

/**
 * Local fallback response generator if the AI API is offline or unavailable.
 */
function getLocalFallbackResponse(userQuery: string): string {
  const query = userQuery.toLowerCase().trim();

  if (
    query.includes("skill") ||
    query.includes("tech") ||
    query.includes("stack") ||
    query.includes("dokhoto") ||
    query.includes("দক্ষতা")
  ) {
    return (
      "Abedin is a Frontend Engineer & AI Enthusiast specializing in:\n\n" +
      "• **Core**: Next.js 16, React 19, TypeScript, Tailwind v4\n" +
      "• **Graphics & Motion**: Three.js, WebGL 2.0, GLSL Shaders, Framer Motion\n" +
      "• **AI & Backends**: LLM Agent Integration, Gemini & OpenAI API, Vector DBs, Node.js, Python\n\n" +
      "He focuses on building high-performance, polished, and intuitive digital experiences!"
    );
  } else if (
    query.includes("project") ||
    query.includes("work") ||
    query.includes("build") ||
    query.includes("portfolio") ||
    query.includes("প্রজেক্ট")
  ) {
    return (
      "Here are some of Abedin's top featured projects:\n\n" +
      "1. **TableRounds** — Medical & Surgical Board Examination Platform (Next.js 16, Redux Toolkit, Socket.io, Recharts) [Live: tablerounds.ai]\n" +
      "2. **ITBA Expo 2027** — Exhibition Stand Booking & Management Platform (Next.js 16, Stripe, Socket.io, Interactive SVG Floor Plan) [Live: itbaexpo.ie]\n" +
      "3. **Kreatovate Project Suite** — AI Marketing & Business Consulting Ecosystem (Next.js, GSAP, Tailwind, Shadcn/UI) [Live: kreatovate.com]\n" +
      "4. **Fleetos Pro** — Freight & Logistics Dispatch Management Platform (Next.js 16, React 19, Socket.io, RTK Query) [Live: fleetos.pro]\n" +
      "5. **Waffless** — Client & Video Editor Marketplace (Next.js 16, React 19, RTK Query, TanStack Table) [Live: affless-frontend.vercel.app]\n" +
      "6. **Apsu** — Digital Health & Clinical Assessment Platform (Next.js 16, React 19, Zod, React Hook Form) [Live: liuentung-front-end.vercel.app]\n" +
      "7. **Bio-Identifier** — AI Snake & Insect Taxonomy Classifier (Next.js 16, NestJS, Computer Vision)\n" +
      "8. **Loom AI Workspace** — AI writing companion surface (Next.js, TypeScript, OpenAI API)\n\n" +
      "You can explore case studies in the **Projects** section!"
    );
  } else if (
    query.includes("contact") ||
    query.includes("hire") ||
    query.includes("email") ||
    query.includes("reach") ||
    query.includes("freelance") ||
    query.includes("যোগাযোগ")
  ) {
    return (
      "Abedin is currently available for freelance projects, design engineering roles, and AI collaboration!\n\n" +
      "• **GitHub**: [github.com/abedinalways](https://github.com/abedinalways)\n" +
      "• **Status**: Open to work & new opportunities\n\n" +
      "You can also reach out through the 'Let's connect' section at the bottom of the page!"
    );
  } else if (
    query.includes("who") ||
    query.includes("about") ||
    query.includes("abedin") ||
    query.includes("name") ||
    query.includes("কে")
  ) {
    return (
      "I'm **Abedin AI**, the personal digital assistant for Md. Joynal Abedin's portfolio!\n\n" +
      "Abedin is a Frontend Engineer & AI Enthusiast who turns complex ideas into intuitive, high-performance web experiences. He loves crafting fluid UI micro-interactions, WebGL graphics, and AI-powered web tools.\n\n" +
      "Feel free to ask me anything about his skills, projects, or background!"
    );
  } else if (
    query.includes("hello") ||
    query.includes("hi") ||
    query.includes("hey") ||
    query.includes("salam") ||
    query.includes("সালাম")
  ) {
    return (
      "Hello! Welcome to Abedin's portfolio! 👋\n\n" +
      "I'm his AI assistant. How can I help you today? You can ask me about Abedin's projects, technical skills, or how to get in touch."
    );
  }

  return (
    `Thanks for your question regarding "${userQuery}"!\n\n` +
    "Abedin is a Frontend Engineer & AI Enthusiast passionate about Next.js, WebGL graphics, and AI agent systems.\n\n" +
    "You can explore his featured open-source work in the **Projects** section or ask me about his skills, background, or contact details!"
  );
}

/**
 * Stream AI responses in real-time from the Next.js API route (/api/chat)
 * with automatic fallback to the local knowledge engine.
 */
export async function* streamAIResponse(
  userQuery: string,
  history: ChatMessage[] = []
): AsyncGenerator<string, void, unknown> {
  let streamSuccessful = false;

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: userQuery,
        history,
      }),
    });

    if (response.ok && response.body) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const textChunk = decoder.decode(value, { stream: true });
        if (textChunk) {
          accumulated += textChunk;
          yield accumulated;
        }
      }

      if (accumulated.trim().length > 0) {
        streamSuccessful = true;
        return;
      }
    }
  } catch (error) {
    console.warn(
      "AI stream failed, falling back to local knowledge engine:",
      error
    );
  }

  // Fallback to local response generator if API fails or is unavailable
  if (!streamSuccessful) {
    const fallbackText = getLocalFallbackResponse(userQuery);
    const words = fallbackText.split(" ");
    let accumulated = "";

    for (let i = 0; i < words.length; i++) {
      accumulated += (i === 0 ? "" : " ") + words[i];
      yield accumulated;
      await new Promise((resolve) => setTimeout(resolve, 20));
    }
  }
}
