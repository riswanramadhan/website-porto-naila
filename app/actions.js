"use server";

import { revalidatePath } from "next/cache";
import { createContactMessage } from "@/lib/portfolio";

export async function submitContactMessage(previousState, formData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (name.length < 2 || !email.includes("@") || message.length < 5) {
    return { status: "error", message: "Please complete your name, email, and message." };
  }

  const result = await createContactMessage({ name, email, message });
  if (!result.ok) {
    return { status: "error", message: "Your message could not be sent right now." };
  }

  revalidatePath("/admin");
  return { status: "success", message: "Thank you. Your message has been sent." };
}
