/**
 * Multi-Language Types
 * Defines types for i18n (internationalization) system
 */

export type LanguageCode = 'en' | 'id'

export interface LanguageOption {
  code: LanguageCode
  name: string
  flag: string
  nativeName: string
}

export interface TranslationKeys {
  // Common
  common: {
    save: string
    cancel: string
    delete: string
    edit: string
    create: string
    update: string
    search: string
    filter: string
    loading: string
    error: string
    success: string
    confirm: string
    yes: string
    no: string
    close: string
    back: string
    next: string
    previous: string
    submit: string
    reset: string
  }
  
  // Auth
  auth: {
    login: string
    logout: string
    loginTitle: string
    loginSubtitle: string
    email: string
    password: string
    loginAs: string
    continueAsGuest: string
    noAccount: string
    contactAdmin: string
    loginError: string
    loginSuccess: string
    loginRegister: string
  }
  
  // Landing Page
  landing: {
    heroTitle: string
    heroSubtitle: string
    checkCertificate: string
    inputPlaceholder: string
    faq: string
    about: string
    aboutTitle: string
    aboutDescription: string
    contactUs: string
  }
  
  // Dashboard
  dashboard: {
    title: string
    welcome: string
    overview: string
    statistics: string
    recentActivity: string
    quickActions: string
    adminDashboard: string
    manageDigitalCertificates: string
    manageDescription: string
    createCertificate: string
    manageMembers: string
    totalCertificates: string
    totalMembers: string
    activeCategories: string
    certificatesIssued: string
    registeredParticipants: string
    trainingCategories: string
    certificateTemplates: string
    templatesStored: string
    certificatesThisMonth: string
    issuedThisMonth: string
    emailsSent: string
    totalEmailsSent: string
  }
  
  // Certificates
  certificates: {
    title: string
    subtitle: string
    newCertificate: string
    quickAdd: string
    certificateNumber: string
    member: string
    category: string
    status: string
    issueDate: string
    actions: string
    preview: string
    download: string
    sendEmail: string
    verify: string
    edit: string
    delete: string
    bulkEmail: string
    refresh: string
    searchPlaceholder: string
    filterCategory: string
    filterStatus: string
    allCategories: string
    allStatuses: string
    issued: string
    draft: string
    revoked: string
    noData: string
  }
  
  // Certificate Editor
  editor: {
    title: string
    subtitle: string
    selectTemplate: string
    editElements: string
    elementProperties: string
    orientation: string
    portrait: string
    landscape: string
    saveTemplate: string
    saving: string
    addElement: string
    position: string
    alignment: string
    fontSize: string
    fontFamily: string
    color: string
    value: string
    left: string
    center: string
    right: string
  }
  
  // Templates
  templates: {
    title: string
    subtitle: string
    newTemplate: string
    templateName: string
    category: string
    orientation: string
    preview: string
    edit: string
    delete: string
    duplicate: string
    useTemplate: string
    noTemplates: string
  }
  
  // Members
  members: {
    title: string
    subtitle: string
    newMember: string
    memberName: string
    email: string
    phone: string
    organization: string
    actions: string
  }
  
  // Categories
  categories: {
    title: string
    subtitle: string
    newCategory: string
    categoryName: string
    description: string
    actions: string
  }
  
  // Settings
  settings: {
    title: string
    language: string
    selectLanguage: string
    theme: string
    notifications: string
    profile: string
    account: string
  }
  
  // Errors
  errors: {
    generic: string
    notFound: string
    unauthorized: string
    forbidden: string
    serverError: string
    networkError: string
    validationError: string
    requiredField: string
    invalidEmail: string
    invalidFormat: string
  }
  
  // Success Messages
  success: {
    saved: string
    created: string
    updated: string
    deleted: string
    sent: string
    copied: string
  }
}

export type TranslationDictionary = Record<LanguageCode, TranslationKeys>

export interface TranslationCache {
  [key: string]: {
    [lang: string]: string
  }
}
