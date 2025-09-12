'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Headphones, FileText } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implémenter l'envoi du formulaire
    console.log('Form submitted:', formData);
    alert('Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactMethods = [
    {
      icon: Mail,
      title: "Email",
      description: "Notre équipe répond sous 24h",
      value: "contact@clipbox.com",
      action: "mailto:contact@clipbox.com",
      color: "blue"
    },
    {
      icon: Phone,
      title: "Téléphone",
      description: "Lun-Ven, 9h-18h",
      value: "+33 1 23 45 67 89",
      action: "tel:+33123456789",
      color: "green"
    },
    {
      icon: MessageCircle,
      title: "Chat en direct",
      description: "Support instantané",
      value: "Démarrer une conversation",
      action: "#",
      color: "purple"
    },
    {
      icon: Headphones,
      title: "Centre d'aide",
      description: "FAQ et guides",
      value: "Consulter l'aide",
      action: "/help",
      color: "orange"
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Contactez-nous
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Notre équipe est là pour répondre à toutes vos questions
            </p>
          </div>
        </div>
      </section>

      {/* Méthodes de contact */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {contactMethods.map((method, index) => {
                const Icon = method.icon;
                const colorClasses = {
                  blue: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400',
                  green: 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400',
                  purple: 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400',
                  orange: 'bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400'
                };
                const bgColor = colorClasses[method.color as keyof typeof colorClasses];
                
                return (
                  <a
                    key={index}
                    href={method.action}
                    className="group p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all"
                  >
                    <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {method.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      {method.description}
                    </p>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:underline">
                      {method.value}
                    </p>
                  </a>
                );
              })}
            </div>

            {/* Formulaire de contact et informations */}
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Formulaire */}
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Envoyez-nous un message
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Nom complet *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Catégorie *
                      </label>
                      <select
                        id="category"
                        name="category"
                        required
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="general">Question générale</option>
                        <option value="support">Support technique</option>
                        <option value="billing">Facturation</option>
                        <option value="partnership">Partenariat</option>
                        <option value="press">Presse</option>
                        <option value="other">Autre</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Sujet *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        placeholder="Décrivez votre demande en détail..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Send className="w-5 h-5" />
                      Envoyer le message
                    </button>
                  </form>
                </div>
              </div>

              {/* Informations de contact */}
              <div className="space-y-6">
                {/* Horaires */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    Horaires d'ouverture
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Lundi - Vendredi</span>
                      <span className="font-medium text-gray-900 dark:text-white">9h00 - 18h00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Samedi</span>
                      <span className="font-medium text-gray-900 dark:text-white">10h00 - 16h00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Dimanche</span>
                      <span className="font-medium text-gray-900 dark:text-white">Fermé</span>
                    </div>
                  </div>
                </div>

                {/* Adresse */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    Notre adresse
                  </h3>
                  <address className="text-sm text-gray-600 dark:text-gray-400 not-italic">
                    Clipbox SAS<br />
                    123 Avenue des Champs-Élysées<br />
                    75008 Paris<br />
                    France
                  </address>
                </div>

                {/* Temps de réponse */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Temps de réponse moyen
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Notre équipe s'engage à vous répondre rapidement :
                  </p>
                  <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <li>• Email : sous 24h</li>
                    <li>• Chat : quelques minutes</li>
                    <li>• Téléphone : immédiat</li>
                  </ul>
                </div>

                {/* Liens utiles */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    Liens utiles
                  </h3>
                  <ul className="space-y-2">
                    <li>
                      <a href="/faq" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                        → Foire aux questions
                      </a>
                    </li>
                    <li>
                      <a href="/help" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                        → Centre d'aide
                      </a>
                    </li>
                    <li>
                      <a href="/terms" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                        → Conditions d'utilisation
                      </a>
                    </li>
                    <li>
                      <a href="/privacy" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                        → Politique de confidentialité
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}