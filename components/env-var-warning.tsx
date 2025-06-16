// import { Badge } from "./ui/badge";
// import { Button } from "./ui/button";

// export function EnvVarWarning() {
//   return (
//     <div className="flex gap-4 items-center">
//       <Badge variant={"outline"} className="font-normal">
//         Supabase environment variables required
//       </Badge>
//       <div className="flex gap-2">
//         <Button size="sm" variant={"outline"} disabled>
//           Sign in
//         </Button>
//         <Button size="sm" variant={"default"} disabled>
//           Sign up
//         </Button>
//       </div>
//     </div>
//   );
// }
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export function EnvVarWarning() {
  return (
    <div className="flex gap-4 items-center">
      <Badge variant={"outline"} className="font-normal">
        Les variables d’environnement Supabase sont requises
      </Badge>
      <div className="flex gap-2">
        <Button size="sm" variant={"outline"} disabled>
          Se connecter
        </Button>
        <Button size="sm" variant={"default"} disabled>
          S&apos;inscrire
        </Button>
      </div>
    </div>
  );
}
