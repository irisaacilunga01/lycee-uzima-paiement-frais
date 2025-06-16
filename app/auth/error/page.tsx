"use client"; // Ce composant doit être un Client Component pour utiliser les toasts

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react"; // Importez useEffect
import { toast } from "sonner"; // Importez toast de sonner

export default function Page({
  searchParams,
}: {
  searchParams: { error?: string }; // searchParams sont passés comme un objet
}) {
  const errorMessage = searchParams?.error;

  useEffect(() => {
    // Affiche un toast d'erreur si un message d'erreur est présent dans les paramètres de recherche
    if (errorMessage) {
      toast.error("Une erreur est survenue", {
        description: `Détails de l'erreur : ${errorMessage}`,
      });
    }
  }, [errorMessage]); // Le toast est déclenché lorsque errorMessage change

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                Désolé, une erreur est survenue.
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Nous rencontrons un problème technique. Veuillez réessayer plus
                tard.
              </p>
              {/* Le message d'erreur est maintenant affiché via un toast, mais vous pouvez conserver ceci pour le débogage si nécessaire */}
              {/* {errorMessage && (
                <p className="text-sm text-red-500 mt-2">
                  Code d'erreur: {errorMessage}
                </p>
              )} */}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// export default async function Page({
//   searchParams,
// }: {
//   searchParams: Promise<{ error: string }>;
// }) {
//   const params = await searchParams;

//   return (
//     <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
//       <div className="w-full max-w-sm">
//         <div className="flex flex-col gap-6">
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-2xl">
//                 Sorry, something went wrong.
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               {params?.error ? (
//                 <p className="text-sm text-muted-foreground">
//                   Code error: {params.error}
//                 </p>
//               ) : (
//                 <p className="text-sm text-muted-foreground">
//                   An unspecified error occurred.
//                 </p>
//               )}
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }
