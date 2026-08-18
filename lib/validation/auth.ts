import { z } from "zod";

export const registerSchema = z.object({
  displayName: z.string().trim().min(2, "Le nom doit contenir au moins 2 caractères").max(80),
  email: z.string().trim().email("Adresse e-mail invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères").max(200),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Adresse e-mail invalide"),
  password: z.string().min(1, "Mot de passe requis"),
  remember: z.boolean().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
