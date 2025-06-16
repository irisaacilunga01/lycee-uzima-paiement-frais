import { AuthButton } from "@/components/auth-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center bg-background text-foreground">
      <div className="flex-1 w-full flex flex-col items-center">
        {/* Barre de navigation */}
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 shadow-sm">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <Link href={"/"} className="text-lg font-bold text-primary-dark">
                Lycée UZIMA
              </Link>
            </div>
            {/* Bouton d'authentification et avertissement */}
            <div className="flex items-center gap-4">
              {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
              <ThemeSwitcher />
            </div>
          </div>
        </nav>

        {/* Contenu principal de la page d'accueil */}
        <div className="flex-1 flex flex-col gap-10 max-w-5xl w-full p-5 md:p-10 lg:p-12">
          {/* Titre principal */}
          <h1 className="text-4xl md:text-5xl font-extrabold text-center text-primary mb-8 leading-tight">
            Bienvenue au Lycée UZIMA
          </h1>

          {/* Section: Description du domaine */}
          <section className="mb-12 border-l-4 border-primary-light pl-4 md:pl-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
              Description du Domaine
            </h2>
            <p className="mb-4 text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Le domaine concerné est celui de l’éducation chrétienne assurée
              par les sœurs bénédictines. Leur mission principale est la
              formation intellectuelle, morale et spirituelle des jeunes, à
              travers la gestion d’établissements scolaires tels que le lycée
              UZIMA. Cette mission repose sur les valeurs de la foi catholique,
              la discipline, le respect et l’ouverture culturelle, dans le but
              de former des citoyens responsables et enracinés dans les
              principes chrétiens.
            </p>
          </section>

          {/* Section: Historique */}
          <section className="mb-12 border-l-4 border-secondary-light pl-4 md:pl-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
              Historique
            </h2>
            <p className="mb-4 text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Le père bénédiction Théodore Nève fonda le monastère de Bethanie
              avec les premières sœurs formées en France, à Angers, Maison Saint
              Sauveur, chez les servantes des pauvres, oblates de Saint Benoit
              depuis 1919. Mère M. Paul BLOMME (première Mère générale des sœurs
              bénédictines) envoya la première équipe de trois sœurs dont : Sœur
              Monique COUSSEMENT, sœur Scholastique DEFRAINE et sœur Bénédicta
              WEILLER qui quittèrent Belgique le 02-11-1922 pour le Katanga.
            </p>
            <p className="mb-4 text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Le 22 novembre 1922 la première équipe débarqua sur la terre
              katangaise. En foulant le sol katangais, les moines bénédictins
              furent accueillis avec joie par les dames de l’union minière, qui
              avaient déjà préparé pour elles un humble logis : deux classes et
              deux toutes petites chambres, dans un bâtiment qui existe
              toujours, pour leur permettre de bien encadrer leurs enfants.
            </p>
            <p className="mb-4 text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Quelques jours après (le 1er Décembre), les religieuses exercèrent
              leur apostolat dans la cité Panda de Likasi qui comptait 500
              blancs dont les enfants se trouvaient privés d’instruction. Elles
              commencèrent par diriger une école pour jeunes filles européennes.
            </p>
            <p className="mb-4 text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Cependant, la tâche n’était pas facile car les enfants enseignés
              venaient de différentes familles avec des confessions religieuses
              différentes. Entre temps les sœurs se trouvaient dans l’obligation
              de donner le cours de religion pour atteindre leur but de relever
              la foi chrétienne.
            </p>
            <p className="mb-4 text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Les élèves n’acceptaient pas la leçon de religion catholique et
              rejetaient la doctrine enseignée. Un début difficile donne
              toujours le meilleur fruit que les générations postérieures
              récolteront.
            </p>
            <p className="mb-4 text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Au fait, la plupart parlaient l’anglais, le grec et l’italien. Les
              sœurs ont commencé d’abord par unifier la langue de
              l’enseignement. Dans les classes, elles essayaient d’enseigner une
              partie en anglais et une autre en français jusqu’à ce qu’elles
              aient une seule langue : le français.
            </p>
            <p className="mb-4 text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              La mission bénédictine au Katanga n’était pas uniquement
              d’instruire les enfants des colons, mais d’étendre leur œuvre en
              éduquant aussi les filles congolaises et surtout de donner aux
              enfants blancs « le véritable esprit colonial, basé sur l’estime
              de Noir et sur la responsabilité de tout colon vis-à-vis de la
              population autochtone qui est encore au premier stade de
              civilisation ». C’est-à-dire, apprendre aux blancs le respect de
              l’homme noir à l’image de Dieu.
            </p>
            <p className="mb-4 text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              En 1998, le chapitre conventuel des sœurs bénédictines africaines
              décida de reprendre leur monastère de Saint Sauveur à Likasi. Les
              mondiales s’occupèrent de l’internat des filles et en 2004, les
              sœurs récupérèrent l’école « le complexe USIMA » dont elles
              assurent jusqu’aujourd’hui la responsabilité.
            </p>
          </section>

          {/* Section: Présentation de l’organisation (Laissée avec un placeholder comme le contenu était vide) */}
          <section className="mb-12 border-l-4 border-accent-light pl-4 md:pl-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
              Présentation de l’Organisation
            </h2>
            <p className="mb-4 text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Cette section est dédiée à la présentation de l&apos;organisation
              actuelle duLycée UZIMA, incluant sa structure, ses valeurs
              fondamentales, et ses objectifs éducatifs et spirituels. Des
              détails sur l&apos;équipe de direction, les programmes
              d&apos;études et les activités parascolaires seront ajoutés ici.
            </p>
          </section>

          {/* Section: Situation géographique */}
          <section className="mb-12 border-l-4 border-teal-light pl-4 md:pl-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
              Situation Géographique
            </h2>
            <p className="mb-4 text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Le Lycée UZIMA est implanté dans l’enceinte du Monastère
              Saint-Sauveur (cf. Chapelle Saint-Sauveur), situé au 108 Bd
              Mobutu, commune de LIKASI, ville de LIKASI, Province du Haut
              Katanga, R.D.C.
            </p>
          </section>
        </div>

        {/* Pied de page */}
        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16 text-muted-foreground">
          <p>
            Propulsé par{" "}
            <a
              href="#"
              target="_blank"
              className="font-bold hover:underline text-primary"
              rel="noreferrer"
            >
              saacTech
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
