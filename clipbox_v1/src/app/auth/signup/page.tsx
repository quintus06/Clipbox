// src/app/auth/signup/page.tsx

import { Metadata } from "next";
import Link from "next/link";
import { SignupForm } from "@/components/auth/signup-form";
import { OAuthButtons } from "@/components/auth/oauth-buttons";

export const metadata: Metadata = {
  title: "Inscription - Clipbox",
  description: "Créez votre compte Clipbox",
};

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const params = await searchParams;
  // Note: La vérification de session est maintenant gérée côté client dans SignupForm

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
          {/* OAuth Buttons */}
          <div className="mb-6">
            <OAuthButtons callbackUrl={params.callbackUrl || "/dashboard"} />
          </div>

          {/* Signup Form */}
          <SignupForm />
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