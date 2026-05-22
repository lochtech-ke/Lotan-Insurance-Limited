import fs from "fs";
import path from "path";

const leadsFile = path.join(process.cwd(), "data", "leads.json");

export async function insertLead(data: {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  phone: string;
  product: string;
  value: number;
  needs: string;
}): Promise<void> {
  const leadsDir = path.dirname(leadsFile);
  if (!fs.existsSync(leadsDir)) {
    fs.mkdirSync(leadsDir, { recursive: true });
  }

  let leads: Record<string, unknown>[] = [];
  if (fs.existsSync(leadsFile)) {
    try {
      leads = JSON.parse(fs.readFileSync(leadsFile, "utf8"));
    } catch {
      leads = [];
    }
  }

  leads.unshift({
    ...data,
    date_submitted: new Date().toISOString(),
  });

  fs.writeFileSync(leadsFile, JSON.stringify(leads, null, 2));
}
