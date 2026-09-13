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

export async function* streamAIResponse(
  userQuery: string
): AsyncGenerator<string, void, unknown> {
  const query = userQuery.toLowerCase().trim();

  let fullResponse = "";

  if (query.includes("skill") || query.includes("tech") || query.includes("stack") || query.includes("dokhoto")) {
    fullResponse =
      "Abedin is a Frontend Engineer & AI Enthusiast specializing in:\n\n" +
      "• **Core**: Next.js 16, React 19, TypeScript, Tailwind v4\n" +
      "• **Graphics & Motion**: Three.js, WebGL 2.0, GLSL Shaders, Framer Motion\n" +
      "• **AI & Backends**: LLM Agent Integration, OpenAI API, Vector DBs, Node.js, Python\n\n" +
      "He focuses on building high-performance, polished, and intuitive digital experiences!";
  } else if (query.includes("project") || query.includes("work") || query.includes("build") || query.includes("portfolio")) {
    fullResponse =
      "Here are some of Abedin's top featured projects:\n\n" +
      "1. **Loom AI Workspace** — AI writing companion surface (Next.js 15, TypeScript, OpenAI API)\n" +
      "2. **Atlas Studio** — Creative studio platform with custom 3D WebGL shaders (React 19, Three.js)\n" +
      "3. **Rhythm Analytics** — Calm analytics digest for indie founders (Python, FastAPI, PostgreSQL)\n" +
      "4. **Fieldnote** — Pocket research tool with vector similarity search (TypeScript, PWA)\n" +
      "5. **Talkback** — Friendly chat interface for language models\n\n" +
      "You can click on the **Projects** tab in the navigation menu to explore interactive case studies!";
  } else if (query.includes("contact") || query.includes("hire") || query.includes("email") || query.includes("reach") || query.includes("freelance")) {
    fullResponse =
      "Abedin is currently available for freelance projects, design engineering roles, and AI collaboration!\n\n" +
      "• **GitHub**: [github.com/abedinalways](https://github.com/abedinalways)\n" +
      "• **Status**: Open to work & new opportunities\n\n" +
      "You can also use the contact form at the bottom of this page to send a direct message!";
  } else if (query.includes("who") || query.includes("about") || query.includes("abedin") || query.includes("name")) {
    fullResponse =
      "I'm **Abedin AI**, the digital assistant for Abedin's portfolio!\n\n" +
      "Abedin is a Frontend Engineer & AI Enthusiast who turns complex ideas into intuitive, high-performance web experiences. He loves crafting fluid UI micro-interactions, WebGL graphics, and AI-powered web tools.\n\n" +
      "Feel free to ask me anything about his skills, projects, or background!";
  } else if (query.includes("hello") || query.includes("hi") || query.includes("hey") || query.includes("salam")) {
    fullResponse =
      "Hello! Welcome to Abedin's portfolio! 👋\n\n" +
      "I'm his AI assistant. How can I help you today? You can ask me about Abedin's projects, technical skills, or how to get in touch.";
  } else {
    fullResponse =
      `Thanks for your question regarding "${userQuery}"!\n\n` +
      "Abedin is a Frontend Engineer & AI Enthusiast passionate about Next.js, WebGL graphics, and AI agent systems.\n\n" +
      "You can explore his featured open-source work in the **Projects** section or ask me about his skills, background, or contact details!";
  }

  // Stream words word-by-word with natural delay
  const words = fullResponse.split(" ");
  let accumulated = "";

  for (let i = 0; i < words.length; i++) {
    accumulated += (i === 0 ? "" : " ") + words[i];
    yield accumulated;
    await new Promise((resolve) => setTimeout(resolve, 25)); // 25ms per word streaming speed
  }
}
