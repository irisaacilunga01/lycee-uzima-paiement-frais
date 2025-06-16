"use server";

import { revalidatePath } from "next/cache";

/**
 * Une fonction pour revalider les routes Next.js
 * lors des différentes opérations pour que
 * les données soient à jour
 */
export async function revalidate() {
  revalidatePath("/dashboard/anneescolaires");
  revalidatePath("/dashboard/classes");
  revalidatePath("/dashboard/eleves");
  revalidatePath("/dashboard/frais");
  revalidatePath("/dashboard/inscriptions");
  revalidatePath("/dashboard/notifications");
  revalidatePath("/dashboard/options");
  revalidatePath("/dashboard/paiements");
  revalidatePath("/dashboard/parents");
  revalidatePath("/dashboard");
  revalidatePath("/parents");
  revalidatePath("/parents/notifications");
  revalidatePath("/parents/paiements");
}
