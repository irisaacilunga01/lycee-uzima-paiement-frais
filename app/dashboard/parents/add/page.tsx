// app/parents/add/page.tsx
import { ParentForm } from "@/components/parent-form"; // Assurez-vous que ce chemin est correct

export default function AddParentPage() {
  return (
    <div className="container mx-auto pt-4">
      <h2 className="text-2xl font-bold mb-6">Ajouter un nouveau Parent</h2>
      <ParentForm />
    </div>
  );
}
