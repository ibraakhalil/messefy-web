import { z } from 'zod';

interface LoginValidationMessages {
  emailRequired: string;
  emailInvalid: string;
  passwordRequired: string;
  passwordMin: string;
}

interface SignupValidationMessages extends LoginValidationMessages {
  nameRequired: string;
  nameMax: string;
  passwordUppercase: string;
  passwordLowercase: string;
  passwordNumber: string;
  confirmPasswordRequired: string;
  termsRequired: string;
  passwordMismatch: string;
}

export const createLoginSchema = (messages: LoginValidationMessages) =>
  z.object({
    email: z
      .string()
      .min(1, { message: messages.emailRequired })
      .email({ message: messages.emailInvalid }),
    password: z
      .string()
      .min(1, { message: messages.passwordRequired })
      .min(8, { message: messages.passwordMin }),
    rememberMe: z.boolean().optional(),
  });

export const createSignupSchema = (messages: SignupValidationMessages) =>
  z
    .object({
      name: z
        .string()
        .min(1, { message: messages.nameRequired })
        .max(50, { message: messages.nameMax }),
      email: z
        .string()
        .min(1, { message: messages.emailRequired })
        .email({ message: messages.emailInvalid }),
      password: z
        .string()
        .min(1, { message: messages.passwordRequired })
        .min(8, { message: messages.passwordMin })
        .regex(/[A-Z]/, { message: messages.passwordUppercase })
        .regex(/[a-z]/, { message: messages.passwordLowercase })
        .regex(/[0-9]/, { message: messages.passwordNumber }),
      confirmPassword: z.string().min(1, { message: messages.confirmPasswordRequired }),
      terms: z.literal(true, {
        errorMap: () => ({ message: messages.termsRequired }),
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: messages.passwordMismatch,
      path: ['confirmPassword'],
    });

export type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>;
export type SignupFormValues = z.infer<ReturnType<typeof createSignupSchema>>;
