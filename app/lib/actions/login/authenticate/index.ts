'use server';

import { AuthError } from 'next-auth';
import { z } from 'zod';
import { objectToFormData } from '@/app/lib/utils';
import { signIn } from '@/auth';
import { ActionStatus, ActionResponse } from '../../definitions';
import { authenticateSchema } from './schema';

export type AuthenticateParams = z.infer<typeof authenticateSchema>;

export async function authenticate(
  params: AuthenticateParams,
): Promise<ActionResponse | undefined> {
  try {
    const validatedParams = authenticateSchema.parse(params);
    const formData = objectToFormData(validatedParams);
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        status: ActionStatus.Error,
        message: 'Invalid email or password',
      };
    }
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return {
            status: ActionStatus.Error,
            message: 'Invalid credentials.',
          };
        default:
          return {
            status: ActionStatus.Error,
            message: 'Something went wrong.',
          };
      }
    }
    throw error;
  }
}
