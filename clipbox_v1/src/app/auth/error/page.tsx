// src/app/auth/error/page.tsx

import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Erreur d'authentification - Clipbox",
  description: "Une erreur est survenue lors de l'authentification",
};

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  
  const getErrorMessage = () => {
    switch (params.error) {
      case "Configuration":
        return "Il y a un problème avec la configuration du serveur.";
      case "AccessDenied":
        return "Vous n'avez pas l'autorisation d'accéder à cette ressource.";
      case "Verification":
        return "Le lien de vérification a expiré ou a déjà été utilisé.";
      case "OAuthSignin":
        return "Erreur lors de la connexion avec le fournisseur OAuth.";
      case "OAuthCallback":
        return "Erreur lors du traitement de la réponse OAuth.";
      case "OAuthCreateAccount":
        return "Impossible de créer le compte OAuth.";
      case "EmailCreateAccount":
        return "Impossible de créer le compte avec cette adresse email.";
      case "Callback":
        return "Erreur lors du traitement de la réponse d'authentification.";
      case "OAuthAccountNotLinked":
        return "Cette adresse email est déjà associée à un autre compte. Veuillez vous connecter avec votre méthode habituelle.";
      case "EmailSignin":
        return "L'envoi de l'email de connexion a échoué.";
      case "CredentialsSignin":
        return "Email ou mot de passe incorrect.";
      case "SessionRequired":
        return "Vous devez être connecté pour accéder à cette page.";
      default:
        return "Une erreur inattendue s'est produite lors de l'authentification.";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-block">
            <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400">
              Clipbox
            </h1>
          </Link>
          <div className="mt-8">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/30">
              <svg
                className="h-8 w-8 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
              Erreur d'authentification
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {getErrorMessage()}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          <div className="space-y-4">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Si le problème persiste, veuillez essayer les actions suivantes :
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>Vider le cache de votre navigateur</li>
              <li>Désactiver les extensions de navigateur</li>
              <li>Essayer avec un autre navigateur</li>
              <li>Vérifier votre connexion internet</li>
            </ul>
            <div className="pt-4 space-y-3">
              <Link
                href="/auth/signin"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Réessayer de se connecter
              </Link>
              <Link
                href="/"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Retour à l'accueil
              </Link>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Besoin d'aide ?{" "}
            <Link
              href="/support"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              Contactez le support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}