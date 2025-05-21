// "use client"
// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import GenericCard from "@/components/GeneriComponents/GenericCard"
// export default function Login  ()  {
//   return (
//     <div className="flex min-h-screen items-center justify-center">
//         <GenericCard 
//           ClassName="w-full max-w-md"
//           Title="Administration"
//           Description="Connectez-vous à votre espace administrateur"
//           HeaderClassName="space-y-1"
//           TitleClassName="text-2xl font-bold text-center"
//           DescriptionClassName="text-center"
//           Content={

//           }
//         />
//     </div>
//   )
// }



// "use client"

// import type React from "react"
// import { z } from "zod";
// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { AlertCircle } from "lucide-react"
// import { Alert, AlertDescription } from "@/components/ui/alert"


// const userSchema = z.object({
//   username : z.string(),
//   password : z.string()
// });



// export default function LoginPage() {
//   const router = useRouter()
//   const [username, setUsername] = useState("")
//   const [password, setPassword] = useState("")
//   const [error, setError] = useState("")
//   const [isLoading, setIsLoading] = useState(false)

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsLoading(true)
//     setError("")

//     // Simuler une vérification d'authentification
//     // Dans un cas réel, vous feriez un appel API ici
//     setTimeout(() => {
//       if (username === "admin" && password === "admin123") {
//         router.push("/dashboard")
//       } else {
//         setError("Identifiants incorrects. Veuillez réessayer.")
//       }
//       setIsLoading(false)
//     }, 1000)
//   }

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-background p-4">
//       <Card className="w-full max-w-md">
//         <CardHeader className="space-y-1">
//           <CardTitle className="text-2xl font-bold text-center">Administration</CardTitle>
//           <CardDescription className="text-center">Connectez-vous à votre espace administrateur</CardDescription>
//         </CardHeader>
//         <form onSubmit={handleSubmit}>
//           <CardContent className="space-y-4">
//             {error && (
//               <Alert variant="destructive">
//                 <AlertCircle className="h-4 w-4" />
//                 <AlertDescription>{error}</AlertDescription>
//               </Alert>
//             )}
//             <div className="space-y-2">
//               <Label htmlFor="username">Nom d'utilisateur</Label>
//               <Input
//                 id="username"
//                 type="text"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 required
//                 autoComplete="username"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="password">Mot de passe</Label>
//               <Input
//                 id="password"
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//                 autoComplete="current-password"
//               />
//             </div>
//           </CardContent>
//           <CardFooter>
//             <Button type="submit" className="w-full bg-primary hover:bg-hover" disabled={isLoading}>
//               {isLoading ? "Connexion en cours..." : "Connexion"}
//             </Button>
//           </CardFooter>
//         </form>
//       </Card>
//     </div>
//   )
// }

"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Schéma de validation
const formSchema = z.object({
  username: z.string()
    .min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères")
    .max(20, "Le nom d'utilisateur ne peut pas dépasser 20 caractères")
    .regex(/^[a-zA-Z0-9_]+$/, "Seuls les lettres, chiffres et underscores sont autorisés"),
  password: z.string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .max(50, "Le mot de passe ne peut pas dépasser 50 caractères")
});

type FormValues = z.infer<typeof formSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: ""
    }
  });

  // Soumission du formulaire
  const onSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);
      setApiError("");

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Échec de la connexion");
      }

      // Redirection après connexion réussie
      router.push("/overview");
    } catch (error) {
      setIsLoading(false);
      if (error instanceof Error) {
        setApiError(error.message);
      } else {
        setApiError("Une erreur inconnue est survenue");
      }
    }
  };
    
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Administration</CardTitle>
          <CardDescription className="text-center">
            Sign in to your admin area
          </CardDescription>
        </CardHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <CardContent className="space-y-4">
              {apiError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{apiError}</AlertDescription>
                </Alert>
              )}
              
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your username"
                        {...field}
                        autoComplete="username"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                        autoComplete="current-password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            
            <CardFooter>
              <Button type="submit" className="w-full hover:bg-red-600" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  "Connexion"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
