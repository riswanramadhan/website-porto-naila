"use client";

import { useActionState, useState } from "react";
import { ArrowRight, Eye, EyeOff, LockKeyhole, ShieldCheck, UserRound } from "lucide-react";
import { loginAdmin } from "./actions";

const initialState = { status: "idle", message: "" };

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAdmin, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form className="admin-login-form" action={formAction}>
      <div className="admin-login-heading">
        <span className="admin-login-lock" aria-hidden="true">
          <ShieldCheck />
        </span>
        <p className="eyebrow">has been secured by Riswan</p>
        <h1>Selamat datang, Alay.</h1>
        <p>Tolong itu password diingat baik baik nah, nd bisa diubah soalnya. ribet.</p>
      </div>

      <label className="admin-login-field">
        <span>Username yang alay</span>
        <div className="admin-login-input">
          <UserRound aria-hidden="true" />
          <input name="username" autoComplete="username" placeholder="Ketikmi usernameta" required autoFocus />
        </div>
      </label>

      <label className="admin-login-field">
        <span>Password Muingatji?</span>
        <div className="admin-login-input">
          <LockKeyhole aria-hidden="true" />
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Ketikmi passwordnya dek"
            required
          />
          <button
            className="admin-password-toggle"
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            aria-label={showPassword ? "Sembunyikan password" : "Lihat password"}
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>
      </label>

      {state.message ? (
        <p className="admin-login-error" role="alert">
          {state.message}
        </p>
      ) : null}

      <button className="button button-primary admin-login-submit" type="submit" disabled={pending}>
        <span>{pending ? "Memeriksa..." : "Masuk ke dashboard"}</span>
        <ArrowRight aria-hidden="true" />
      </button>
    </form>
  );
}
