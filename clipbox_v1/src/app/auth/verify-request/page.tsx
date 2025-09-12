// src/app/auth/verify-request/page.tsx

import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Vérifiez votre email - Clipbox",
  description: "Un email de vérification a été envoyé",
};

export default function VerifyRequestPage() {
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
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30">
              <svg
                className="h-8 w-8 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
              Vérifiez votre email
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Un lien de connexion a été envoyé à votre adresse email
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-blue-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                    Étapes suivantes
                  </h3>
                  <div className="mt-2 text-sm text-blue-700 dark:text-blue-400">
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Ouvrez votre boîte de réception</li>
                      <li>Cherchez un email de Clipbox</li>
                      <li>Cliquez sur le lien de connexion</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p className="font-medium mb-2">Vous n'avez pas reçu l'email ?</p>
              <ul className="space-y-1">
                <li>• Vérifiez votre dossier spam</li>
                <li>• Assurez-vous d'avoir saisi la bonne adresse</li>
                <li>• Attendez quelques minutes</li>
              </ul>
            </div>

            <div className="pt-4 space-y-3">
              <Link
                href="/auth/signin"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Retour à la connexion
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
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Le lien de connexion expire après 24 heures pour des raisons de sécurité.
            <br />
            Si vous rencontrez des problèmes,{" "}
            <Link
              href="/support"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              contactez le support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}