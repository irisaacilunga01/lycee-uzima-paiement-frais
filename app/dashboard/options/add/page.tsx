// app/options/add/page.tsx
import { OptionForm } from "@/components/option-form"; // Assurez-vous que ce chemin est correct

export default function AddOptionPage() {
  return (
    <div className="container mx-auto pt-4">
      <h2 className="text-2xl font-bold mb-6">Ajouter une nouvelle Option</h2>
      <OptionForm />
    </div>
  );
}
