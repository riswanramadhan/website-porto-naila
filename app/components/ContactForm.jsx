"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { submitContactMessage } from "@/actions";

const initialState = { status: "idle", message: "" };

function ContactSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button className="button button-primary" type="submit" disabled={pending}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 20 21 12 3 4v6l12 2-12 2v6Z" />
      </svg>
      <span data-i18n="sendMessage">{pending ? "Sending..." : "Send Message"}</span>
    </button>
  );
}

export default function ContactForm() {
  const [state, formAction] = useActionState(submitContactMessage, initialState);
  const formRef = useRef(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  return (
    <form ref={formRef} className="contact-form reveal" action={formAction}>
      <label htmlFor="name" data-i18n="formName">
        Name
      </label>
      <input
        id="name"
        name="name"
        type="text"
        placeholder="Your name"
        data-i18n-placeholder="formNamePlaceholder"
        required
      />

      <label htmlFor="email" data-i18n="formEmail">
        Email
      </label>
      <input
        id="email"
        name="email"
        type="email"
        placeholder="you@example.com"
        data-i18n-placeholder="formEmailPlaceholder"
        required
      />

      <label htmlFor="message" data-i18n="formMessage">
        Message
      </label>
      <textarea
        id="message"
        name="message"
        rows="5"
        placeholder="Tell me about your project"
        data-i18n-placeholder="formMessagePlaceholder"
        required
      ></textarea>

      <ContactSubmitButton />
      <p className={`form-note contact-feedback is-${state.status}`} aria-live="polite">
        {state.message}
      </p>
    </form>
  );
}
