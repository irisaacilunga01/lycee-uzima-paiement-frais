// types.ts

/**
 * Type pour la table 'Parent'.
 */
export type Parent = {
  idparent: number;
  nompere: string;
  nommere: string;
  adresse?: string;
  emailpere?: string;
  emailmere?: string;
  professionpere?: string;
  professionmere?: string;
  telephonepere?: string;
  telephonemere?: string;
};

/**
 * Type pour la table 'Notification'.
 * dateenvoi est une chaîne de caractères au format ISO 8601 (ex: "2023-10-26T10:00:00Z").
 */
export type Notification = {
  idnotification: number;
  message: string;
  dateenvoi: string; // Représente un timestamp avec fuseau horaire
  idparent: number | null;
};

/**
 * Type pour la table 'Eleve'.
 * datenaissance est une chaîne de caractères au format 'YYYY-MM-DD'.
 */
export type Eleve = {
  ideleve: number;
  nom: string;
  postnom: string;
  prenom?: string;
  datenaissance?: string; // Représente une date (YYYY-MM-DD)
  lieunaissance?: string;
  adresse?: string;
  moyentransport?: string;
  status: "en cours" | "terminé" | "suspendu" | "renvoyé";
  photo?: string;
  idparent?: number; // Peut être null si le parent est supprimé avec ON DELETE SET NULL, ou undefined si pas encore défini.
};

/**
 * Type pour la table 'Classe'.
 */
export type Classe = {
  idclasse: number;
  nomclasse: string;
  niveau?: string;
  idoption: number;
};

/**
 * Type pour la table 'Option'.
 */
export type Option = {
  idoption: number;
  nomoption: string;
  abreviation: string;
};

/**
 * Type pour la table 'Inscription'.
 * Cette table a une clé primaire composite.
 * dateinscription est une chaîne de caractères au format ISO 8601.
 */
export type Inscription = {
  ideleve: number;
  idclasse: number;
  idanneescolaire: number;
  dateinscription: string; // Représente un timestamp avec fuseau horaire
};

/**
 * Type pour la table 'Anneescolaire'.
 * datedebut et datefin sont des chaînes de caractères au format 'YYYY-MM-DD'.
 */
export type Anneescolaire = {
  idanneescolaire: number;
  status: "en cours" | "terminé";
  libelle: string;
  datedebut: string; // Représente une date (YYYY-MM-DD)
  datefin: string; // Représente une date (YYYY-MM-DD)
};

/**
 * Type pour la table 'Paiement'.
 * montantpayer est un nombre décimal.
 * datepaiement est une chaîne de caractères au format ISO 8601.
 * Le statut suit l'exemple fourni par l'utilisateur.
 */
export type Paiement = {
  idpaiement: number;
  montantpayer: number;
  datepaiement: string; // Représente un timestamp avec fuseau horaire
  status: "pending" | "processing" | "success" | "failed"; // « en attente » | « en cours de traitement » | « réussite » | « échec »
  ideleve?: number;
  idfrais?: number;
};

/**
 * Type pour la table 'Frais'.
 * montanttotal est un nombre décimal.
 * dateecheance est une chaîne de caractères au format 'YYYY-MM-DD'.
 */
export type Frais = {
  idfrais: number;
  description: string;
  montanttotal: number;
  dateecheance?: string; // Représente une date (YYYY-MM-DD)
  idanneescolaire?: number;
};
