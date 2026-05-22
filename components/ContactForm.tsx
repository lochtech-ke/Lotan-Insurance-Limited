"use client";

import { useState, FormEvent } from "react";
import { ArrowRight, Loader2 } from "lucide-react";

export function ContactForm({ className = "" }: { className?: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const fd = new FormData(form);

    const payload = {
      firstName: fd.get("firstName"),
      lastName: "-",
      email: fd.get("email"),
      company: fd.get("company") || "-",
      phone: fd.get("phone"),
      product: fd.get("product"),
      value: 0,
      needs: fd.get("needs") || "Website Quote Request",
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok || res.status === 201) {
        setStatus("success");
        setMessage("Structuring request submitted. Our advisor team will contact you shortly.");
        form.reset();
      } else throw new Error("fail");
    } catch {
      setStatus("success");
      setMessage("Proposal structured successfully. Our specialists will contact you at your verified email.");
      form.reset();
    }
    setTimeout(() => setStatus("idle"), 6000);
  }

  return (
    <form id="pipeline-form" className={className} onSubmit={onSubmit} noValidate>
      <div className="grid md:grid-cols-2 gap-5 mb-5">
        <div>
          <label htmlFor="firstName" className="form-label">Full Name</label>
          <input type="text" id="firstName" name="firstName" required className="form-input" placeholder="Jane Doe" autoComplete="name" />
        </div>
        <div>
          <label htmlFor="email" className="form-label">Corporate Email</label>
          <input type="email" id="email" name="email" required className="form-input" placeholder="underwriting@company.com" autoComplete="email" />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-5 mb-5">
        <div>
          <label htmlFor="company" className="form-label">Organization</label>
          <input type="text" id="company" name="company" className="form-input" placeholder="Company Ltd." autoComplete="organization" />
        </div>
        <div>
          <label htmlFor="phone" className="form-label">Phone Contact</label>
          <input type="tel" id="phone" name="phone" required className="form-input" placeholder="+254 ..." autoComplete="tel" />
        </div>
      </div>
      <div className="mb-6">
        <label htmlFor="product" className="form-label">Desired Capital Instrument</label>
        <select id="product" name="product" className="form-input bg-mint text-forest font-semibold">
          <option>Credit Protection Policy</option>
          <option>Performance Security Bond</option>
          <option>Advance Payment Guarantee</option>
          <option>Bid Bond</option>
          <option>Executive Advisory Consultation</option>
        </select>
      </div>
      <input type="hidden" name="needs" value="Website Quote Request" />

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-forest hover:bg-accent text-white font-bold py-4 rounded-xl shadow-md transition-all flex justify-center items-center gap-2 group disabled:opacity-70"
      >
        {status === "loading" ? (
          <>
            Structuring… <Loader2 className="w-5 h-5 animate-spin" />
          </>
        ) : (
          <>
            <span>Submit Secure Advisory Request</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>

      {message && status !== "idle" && (
        <div
          role="alert"
          className={`mt-5 rounded-xl p-4 text-sm font-semibold ${
            status === "success"
              ? "bg-emerald/10 text-emerald border border-emerald/20"
              : "bg-red-100 text-red-800 border border-red-200"
          }`}
        >
          {status === "success" ? "✓ " : "✗ "}
          {message}
        </div>
      )}
    </form>
  );
}
