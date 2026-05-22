import fs from "fs";
import path from "path";

const FAQ_FILE = path.join(process.cwd(), "lotan_faq.txt");

function loadChunks(): string[] {
  if (!fs.existsSync(FAQ_FILE)) {
    return [
      "Lotan Insurance Agency Limited provides credit protection policies, performance bonds, advance payment guarantees, and bid bonds.",
      "Contact info@lia.insure for structured risk advisory.",
    ];
  }
  const text = fs.readFileSync(FAQ_FILE, "utf8");
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 40);
}

function scoreChunk(query: string, chunk: string): number {
  const q = query.toLowerCase().split(/\W+/).filter(Boolean);
  const c = chunk.toLowerCase();
  return q.reduce((s, w) => s + (c.includes(w) ? 1 : 0), 0);
}

export function generateChatResponse(query: string): string {
  const chunks = loadChunks();
  if (!query.trim()) {
    return "Please ask a question about credit protection, performance bonds, or our advisory services.";
  }

  const ranked = chunks
    .map((chunk) => ({ chunk, score: scoreChunk(query, chunk) }))
    .sort((a, b) => b.score - a.score);

  if (ranked[0]?.score > 0) {
    const excerpt = ranked[0].chunk.slice(0, 480);
    return excerpt.length < ranked[0].chunk.length ? `${excerpt}…` : excerpt;
  }

  return "For detailed underwriting guidance, please contact our advisory desk at info@lia.insure or submit a consultation request via the contact page.";
}
