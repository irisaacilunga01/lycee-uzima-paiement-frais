// app/anneescolaire/add/page.tsx
import { AnneescolaireForm } from "@/components/anneescolaire-form"; // Assurez-vous que ce chemin est correct

export default function AddAnneescolairePage() {
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">
        Ajouter une nouvelle Année Scolaire
      </h2>
      <AnneescolaireForm />
    </div>
  );
}
