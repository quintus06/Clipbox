// src/app/auth/signin/page.tsx

import { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";
import { OAuthButtons } from "@/components/auth/oauth-buttons";

export const metadata: Metadata = {
  title: "Connexion - Clipbox",
  description: "Connectez-vous à votre compte Clipbox",
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string; registered?: string }>;
}) {
  const params = await searchParams;
  // Note: La vérification de session est maintenant gérée côté client dans LoginForm

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
            Connexion à votre compte
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Ou{" "}
            <Link
              href="/auth/signup"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              créez un nouveau compte
            </Link>
          </p>
        </div>

        {/* Success message for new registrations */}
        {params.registered === "true" && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-sm text-green-800 dark:text-green-400">
              Votre compte a été créé avec succès ! Vous pouvez maintenant vous connecter.
            </p>
          </div>
        )}

        {/* Error message */}
        {params.error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-800 dark:text-red-400">
              {params.error === "OAuthAccountNotLinked"
                ? "Un compte existe déjà avec cette adresse email. Veuillez vous connecter avec votre mot de passe."
                : params.error === "OAuthCreateAccount"
                ? "Impossible de créer le compte. Veuillez réessayer."
                : params.error === "EmailCreateAccount"
                ? "Impossible de créer le compte. Cette adresse email est peut-être déjà utilisée."
                : params.error === "Callback"
                ? "Une erreur est survenue lors de l'authentification."
                : params.error === "OAuthSignin"
                ? "Erreur lors de la connexion avec le fournisseur OAuth."
                : params.error === "EmailSignin"
                ? "Vérifiez votre adresse email."
                : params.error === "CredentialsSignin"
                ? "Email ou mot de passe incorrect."
                : params.error === "SessionRequired"
                ? "Veuillez vous connecter pour accéder à cette page."
                : "Une erreur est survenue lors de la connexion."}
            </p>
          </div>
        )}

        {/* OAuth Buttons */}
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          <OAuthButtons callbackUrl={params.callbackUrl} />
          
          {/* Login Form */}
          <div className="mt-6">
            <LoginForm callbackUrl={params.callbackUrl} />
          </div>
        </div>

        {/* Footer Links */}
        <div className="text-center space-y-2">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            En vous connectant, vous acceptez nos{" "}
            <Link href="/terms" className="underline hover:text-gray-700 dark:hover:text-gray-300">
              conditions d'utilisation
            </Link>{" "}
            et notre{" "}
            <Link href="/privacy" className="underline hover:text-gray-700 dark:hover:text-gray-300">
              politique de confidentialité
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}