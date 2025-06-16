-- Table: Parent
-- Stocke les informations des parents.
create table parent (
  idparent bigint primary key generated always as identity,
  nompere text not null,
  nommere text not null,
  adresse text,
  emailpere text,
  emailmere text,
  professionpere text,
  professionmere text,
  telephonepere text,
  telephonemere text
);

-- Active la sécurité au niveau des lignes (Row Level Security - RLS) pour la table parents.
alter table parent enable row level security;

-- Crée une politique permettant aux utilisateurs anonymes de lire les informations des parents.
create policy "public can read parent"
on public.parent
for select to anon
using (true);

---

-- Table: Option
-- Stocke les différentes options (filières) d'étude.
create table option (
  idoption bigint primary key generated always as identity,
  nomoption text not null,
  abreviation text 
);

-- Active la sécurité au niveau des lignes (RLS) pour la table options.
alter table option enable row level security;

-- Crée une politique permettant aux utilisateurs anonymes de lire les options.
create policy "public can read option"
on public.option
for select to anon
using (true);

---

-- Table: Anneescolaire
-- Stocke les informations sur les années scolaires.
create table anneescolaire (
  idanneescolaire bigint primary key generated always as identity,
  status text not null default 'en cours', -- Ajout d'un statut par défaut 'pending'
  libelle text not null,
  datedebut date not null,
  datefin date not null
);

-- Active la sécurité au niveau des lignes (RLS) pour la table anneescolaires.
alter table anneescolaire enable row level security;

-- Crée une politique permettant aux utilisateurs anonymes de lire les années scolaires.
create policy "public can read anneescolaire"
on public.anneescolaire
for select to anon
using (true);

---

-- Table: Notification
-- Stocke les notifications envoyées aux parents.
create table notification (
  idnotification bigint primary key generated always as identity,
  message text not null,
  dateenvoi timestamp with time zone default now() not null,
  idparent bigint references parent(idparent) on delete restrict
);

-- Active la sécurité au niveau des lignes (RLS) pour la table notifications.
alter table notification enable row level security;

-- Crée une politique permettant aux utilisateurs anonymes de lire les notifications.
create policy "public can read notification"
on public.notification
for select to anon
using (true);

---

-- Table: Eleve
-- Stocke les informations des élèves.
create table eleve (
  ideleve bigint primary key generated always as identity,
  nom text not null,
  postnom text not null,
  prenom text,
  datenaissance date,
  lieunaissance text,
  adresse text,
  moyentransport text,
  status text not null default 'en cours', -- Ajout d'un statut par défaut 'pending'
  photo text,
  idparent bigint references parent(idparent) on delete restrict
);

-- Active la sécurité au niveau des lignes (RLS) pour la table eleves.
alter table eleve enable row level security;

-- Crée une politique permettant aux utilisateurs anonymes de lire les informations des élèves.
create policy "public can read eleve"
on public.eleve
for select to anon
using (true);

---

-- Table: Classe
-- Stocke les informations sur les classes.
create table classe (
  idclasse bigint primary key generated always as identity,
  nomclasse text not null,
  niveau text,
  idoption bigint references option(idoption) on delete restrict
);

-- Active la sécurité au niveau des lignes (RLS) pour la table classe.
alter table classe enable row level security;

-- Crée une politique permettant aux utilisateurs anonymes de lire les classes.
create policy "public can read classe"
on public.classe
for select to anon
using (true);

---

-- Table: Frais
-- Stocke les informations sur les différents frais (scolaires, etc.).
create table frais (
  idfrais bigint primary key generated always as identity,
  description text not null,
  montanttotal numeric(10, 2) not null,
  dateecheance date,
  idanneescolaire bigint references anneescolaire(idanneescolaire) on delete restrict
);

-- Active la sécurité au niveau des lignes (RLS) pour la table frais.
alter table frais enable row level security;

-- Crée une politique permettant aux utilisateurs anonymes de lire les frais.
create policy "public can read frais"
on public.frais
for select to anon
using (true);

---

-- Table: Inscription
-- Table de jonction pour les inscriptions des élèves à une classe pour une année scolaire donnée.
create table inscription (
  ideleve bigint references eleve(ideleve) on delete cascade,
  idclasse bigint references classe(idclasse) on delete cascade,
  idanneescolaire bigint references anneescolaire(idanneescolaire) on delete cascade,
  dateinscription timestamp with time zone default now() not null,
  primary key (ideleve, idclasse, idanneescolaire) -- Clé primaire composite
);

-- Active la sécurité au niveau des lignes (RLS) pour la table inscriptions.
alter table inscription enable row level security;

-- Crée une politique permettant aux utilisateurs anonymes de lire les inscriptions.
create policy "public can read inscription"
on public.inscription
for select to anon
using (true);

---

-- Table: Paiement
-- Stocke les paiements effectués par les élèves (ou leurs parents) pour les frais.
create table paiement (
  idpaiement bigint primary key generated always as identity,
  montantpayer numeric(10, 2) not null,
  datepaiement timestamp with time zone default now() not null,
  status text not null default 'pending', -- Ajout d'un statut par défaut 'pending'
  ideleve bigint references eleve(ideleve) on delete restrict,
  idfrais bigint references frais(idfrais) on delete restrict
);

-- Active la sécurité au niveau des lignes (RLS) pour la table paiements.
alter table paiement enable row level security;

-- Crée une politique permettant aux utilisateurs anonymes de lire les paiements.
create policy "public can read paiement"
on public.paiement
for select to anon
using (true);