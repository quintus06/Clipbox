// src/app/auth/signup/page.tsx

"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { SignupForm } from "@/components/auth/signup-form";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { useSearchParams } from "next/navigation";

function SignUpContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [selectedRole, setSelectedRole] = useState<"CLIPPER" | "ADVERTISER" | null>(null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Title */}
        <div className="text-center">
          <Link href="/" className="inline-block">
            <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400">
              Clipbox
            </h1>
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Créer votre compte
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Ou{" "}
            <Link
              href="/auth/signin"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              connectez-vous à votre compte existant
            </Link>
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          {/* Role Selection */}
          <div className="mb-6 space-y-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Choisissez votre type de compte
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedRole("CLIPPER")}
                className={`p-4 border-2 rounded-lg text-center transition-all ${
                  selectedRole === "CLIPPER"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-300 dark:border-gray-600 hover:border-gray-400"
                }`}
              >
                <div className="text-2xl mb-2">🎬</div>
                <div className="font-medium text-gray-900 dark:text-white">Clipper</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Je crée des clips vidéo
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole("ADVERTISER")}
                className={`p-4 border-2 rounded-lg text-center transition-all ${
                  selectedRole === "ADVERTISER"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-300 dark:border-gray-600 hover:border-gray-400"
                }`}
              >
                <div className="text-2xl mb-2">📢</div>
                <div className="font-medium text-gray-900 dark:text-white">Annonceur</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Je cherche des clippers
                </div>
              </button>
            </div>
          </div>

          {/* OAuth Buttons */}
          <div className="mb-6">
            <OAuthButtons
              callbackUrl={callbackUrl}
              role={selectedRole}
            />
          </div>

          {/* Signup Form */}
          <SignupForm selectedRole={selectedRole} />
        </div>

        {/* Benefits Section */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Pourquoi rejoindre Clipbox ?
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Pour les Clippers</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Monétisez vos compétences en créant des clips viraux
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Pour les Annonceurs</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Trouvez les meilleurs clippers pour vos contenus YouTube
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Paiements sécurisés</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Transactions sécurisées via Stripe
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Chargement...</p>
        </div>
      </div>
    }>
      <SignUpContent />
    </Suspense>
  );
}