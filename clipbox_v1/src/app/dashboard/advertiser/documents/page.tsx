'use client';

import { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Eye,
  Filter,
  Calendar,
  Search,
  File,
  FileSpreadsheet,
  Receipt,
  TrendingUp,
  ChevronDown,
  ExternalLink,
  AlertCircle,
  X
} from 'lucide-react';

interface Document {
  id: string;
  type: 'INVOICE' | 'REPORT' | 'CONTRACT' | 'RECEIPT';
  name: string;
  description: string;
  date: Date;
  size: string;
  status: 'AVAILABLE' | 'PROCESSING' | 'EXPIRED';
  downloadUrl: string;
  campaignId?: string;
  campaignName?: string;
  amount?: number;
}

// Mock data
const mockDocuments: Document[] = [
  {
    id: '1',
    type: 'INVOICE',
    name: 'Facture-2025-01-001.pdf',
    description: 'Facture mensuelle - Janvier 2025',
    date: new Date('2025-01-31'),
    size: '245 KB',
    status: 'AVAILABLE',
    downloadUrl: '#',
    amount: 1250.00
  },
  {
    id: '2',
    type: 'REPORT',
    name: 'Rapport-Campagne-Tech2025.pdf',
    description: 'Rapport de performance',
    date: new Date('2025-01-15'),
    size: '1.2 MB',
    status: 'AVAILABLE',
    downloadUrl: '#',
    campaignId: '1',
    campaignName: 'Lancement Produit Tech 2025'
  },
  {
    id: '3',
    type: 'CONTRACT',
    name: 'CGV-Clipbox-2025.pdf',
    description: 'Conditions Générales de Vente',
    date: new Date('2025-01-01'),
    size: '456 KB',
    status: 'AVAILABLE',
    downloadUrl: '#'
  },
  {
    id: '4',
    type: 'RECEIPT',
    name: 'Recu-Paiement-2025-01-08.pdf',
    description: 'Reçu de paiement - Recharge balance',
    date: new Date('2025-01-08'),
    size: '123 KB',
    status: 'AVAILABLE',
    downloadUrl: '#',
    amount: 1000.00
  },
  {
    id: '5',
    type: 'INVOICE',
    name: 'Facture-2024-12-001.pdf',
    description: 'Facture mensuelle - Décembre 2024',
    date: new Date('2024-12-31'),
    size: '234 KB',
    status: 'AVAILABLE',
    downloadUrl: '#',
    amount: 2500.00
  },
  {
    id: '6',
    type: 'REPORT',
    name: 'Rapport-Annuel-2024.pdf',
    description: 'Rapport annuel des campagnes 2024',
    date: new Date('2024-12-31'),
    size: '3.5 MB',
    status: 'PROCESSING',
    downloadUrl: '#'
  }
];

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>(mockDocuments);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('ALL');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  const filterDocuments = () => {
    let filtered = [...documents];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(doc =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doc.campaignName && doc.campaignName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Type filter
    if (typeFilter !== 'ALL') {
      filtered = filtered.filter(doc => doc.type === typeFilter);
    }

    // Date filter
    if (dateFilter !== 'ALL') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'MONTH':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case 'QUARTER':
          filterDate.setMonth(now.getMonth() - 3);
          break;
        case 'YEAR':
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filtered = filtered.filter(doc => doc.date >= filterDate);
    }

    // Sort by date (most recent first)
    filtered.sort((a, b) => b.date.getTime() - a.date.getTime());

    setFilteredDocuments(filtered);
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'INVOICE':
        return <Receipt className="h-5 w-5 text-blue-500" />;
      case 'REPORT':
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      case 'CONTRACT':
        return <FileText className="h-5 w-5 text-purple-500" />;
      case 'RECEIPT':
        return <File className="h-5 w-5 text-orange-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getDocumentTypeName = (type: string) => {
    switch (type) {
      case 'INVOICE':
        return 'Facture';
      case 'REPORT':
        return 'Rapport';
      case 'CONTRACT':
        return 'Contrat';
      case 'RECEIPT':
        return 'Reçu';
      default:
        return 'Document';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const handleDownload = (document: Document) => {
    // Mock download
    console.log('Downloading:', document.name);
  };

  const handlePreview = (document: Document) => {
    setSelectedDocument(document);
  };

  // Apply filters when dependencies change
  useEffect(() => {
    filterDocuments();
  }, [searchTerm, typeFilter, dateFilter]);

  // Calculate stats
  const stats = {
    total: documents.length,
    invoices: documents.filter(d => d.type === 'INVOICE').length,
    reports: documents.filter(d => d.type === 'REPORT').length,
    totalAmount: documents
      .filter(d => d.type === 'INVOICE' && d.amount)
      .reduce((sum, d) => sum + (d.amount || 0), 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Documents
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Téléchargez vos factures, rapports et documents contractuels
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
            <FileSpreadsheet className="h-5 w-5 mr-2" />
            Exporter tout
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Documents</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
            <FileText className="h-8 w-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Factures</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.invoices}</p>
            </div>
            <Receipt className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Rapports</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.reports}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Facturé</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(stats.totalAmount)}
              </p>
            </div>
            <FileText className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un document..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <Filter className="h-5 w-5 mr-2" />
              Filtres
              <ChevronDown className={`h-4 w-4 ml-2 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type de document
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="ALL">Tous</option>
                <option value="INVOICE">Factures</option>
                <option value="REPORT">Rapports</option>
                <option value="CONTRACT">Contrats</option>
                <option value="RECEIPT">Reçus</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Période
              </label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="ALL">Toutes</option>
                <option value="MONTH">Dernier mois</option>
                <option value="QUARTER">3 derniers mois</option>
                <option value="YEAR">Dernière année</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setTypeFilter('ALL');
                  setDateFilter('ALL');
                  setSearchTerm('');
                }}
                className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                Réinitialiser les filtres
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Documents List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {filteredDocuments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Document
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Taille
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredDocuments.map((document) => (
                  <tr key={document.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getDocumentIcon(document.type)}
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {document.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {document.description}
                          </div>
                          {document.campaignName && (
                            <div className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                              {document.campaignName}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${document.type === 'INVOICE' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' : ''}
                        ${document.type === 'REPORT' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : ''}
                        ${document.type === 'CONTRACT' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400' : ''}
                        ${document.type === 'RECEIPT' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400' : ''}
                      `}>
                        {getDocumentTypeName(document.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(document.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {document.size}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {document.amount ? formatCurrency(document.amount) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {document.status === 'PROCESSING' ? (
                          <span className="inline-flex items-center px-2 py-1 text-xs text-yellow-600 dark:text-yellow-400">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            En cours
                          </span>
                        ) : (
                          <>
                            <button
                              onClick={() => handlePreview(document)}
                              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                              title="Aperçu"
                            >
                              <Eye className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDownload(document)}
                              className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300"
                              title="Télécharger"
                            >
                              <Download className="h-5 w-5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Aucun document trouvé
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm || typeFilter !== 'ALL' || dateFilter !== 'ALL'
                ? "Essayez de modifier vos filtres de recherche"
                : "Vos documents apparaîtront ici"}
            </p>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black opacity-50" onClick={() => setSelectedDocument(null)}></div>
            <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-3xl w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Aperçu du document
                </h3>
                <button
                  onClick={() => setSelectedDocument(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-8 text-center">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Aperçu non disponible pour ce type de document
                </p>
                <div className="flex justify-center space-x-3">
                  <button
                    onClick={() => handleDownload(selectedDocument)}
                    className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Télécharger
                  </button>
                  <a
                    href={selectedDocument.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <ExternalLink className="h-5 w-5 mr-2" />
                    Ouvrir dans un nouvel onglet
                  </a>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Nom du fichier</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedDocument.name}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Type</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {getDocumentTypeName(selectedDocument.type)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Date</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatDate(selectedDocument.date)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Taille</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedDocument.size}</p>
                </div>
                {selectedDocument.amount && (
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Montant</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(selectedDocument.amount)}
                    </p>
                  </div>
                )}
                {selectedDocument.campaignName && (
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Campagne</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {selectedDocument.campaignName}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}