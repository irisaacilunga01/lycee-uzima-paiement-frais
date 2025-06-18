import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                Merci de votre inscription !
              </CardTitle>
              <CardDescription>
                Vérifiez votre e-mail pour confirmer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Vous vous êtes inscrit(e) avec succès. Veuillez vérifier votre
                boite e-mail pour confirmer votre compte avant de vous
                connecter, en appuyant sur{" "}
                <Link
                  href="https://mail.google.com/"
                  className="text-blue-600 hover:text-blue-400 hover:underline"
                >
                  confirm email
                </Link>{" "}
                depuis supabase
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
