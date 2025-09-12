// src/components/auth/signup-form.tsx

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";

const signupSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  confirmPassword: z.string(),
  role: z.enum(["CLIPPER", "ADVERTISER"]).refine((val) => val !== undefined, {
    message: "Veuillez sélectionner un type de compte",
  }),
  company: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

export function SignupForm() {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<"CLIPPER" | "ADVERTISER" | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const watchRole = watch("role");

  const onSubmit = async (data: SignupFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        company: data.company,
      });
      
      // La redirection est gérée dans le contexte d'authentification
    } catch (error: any) {
      console.error("Signup error:", error);
      setError(error.message || "Une erreur est survenue lors de l'inscription");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg">
          {error}
        </div>
      )}

      {/* Role Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Type de compte
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              setValue("role", "CLIPPER");
              setSelectedRole("CLIPPER");
            }}
            className={`p-4 border-2 rounded-lg text-center transition-all ${
              watchRole === "CLIPPER"
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
            onClick={() => {
              setValue("role", "ADVERTISER");
              setSelectedRole("ADVERTISER");
            }}
            className={`p-4 border-2 rounded-lg text-center transition-all ${
              watchRole === "ADVERTISER"
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
        {errors.role && (
          <p className="text-sm text-red-600 dark:text-red-400">{errors.role.message}</p>
        )}
      </div>

      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Nom complet
        </label>
        <input
          {...register("name")}
          type="text"
          id="name"
          autoComplete="name"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          placeholder="Jean Dupont"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
        )}
      </div>

      {/* Company Field (for Advertisers) */}
      {watchRole === "ADVERTISER" && (
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Entreprise (optionnel)
          </label>
          <input
            {...register("company")}
            type="text"
            id="company"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            placeholder="Nom de votre entreprise"
          />
        </div>
      )}

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Email
        </label>
        <input
          {...register("email")}
          type="email"
          id="email"
          autoComplete="email"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          placeholder="vous@exemple.com"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Mot de passe
        </label>
        <input
          {...register("password")}
          type="password"
          id="password"
          autoComplete="new-password"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          placeholder="••••••••"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password Field */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Confirmer le mot de passe
        </label>
        <input
          {...register("confirmPassword")}
          type="password"
          id="confirmPassword"
          autoComplete="new-password"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          placeholder="••••••••"
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword.message}</p>
        )}
      </div>

      {/* Terms and Conditions */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        En créant un compte, vous acceptez nos{" "}
        <Link href="/terms" className="text-blue-600 hover:text-blue-500 dark:text-blue-400">
          conditions d'utilisation
        </Link>{" "}
        et notre{" "}
        <Link href="/privacy" className="text-blue-600 hover:text-blue-500 dark:text-blue-400">
          politique de confidentialité
        </Link>
        .
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Création du compte..." : "Créer mon compte"}
      </button>

      {/* Sign In Link */}
      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        Déjà un compte ?{" "}
        <Link href="/auth/signin" className="text-blue-600 hover:text-blue-500 dark:text-blue-400 font-medium">
          Se connecter
        </Link>
      </div>
    </form>
  );
}