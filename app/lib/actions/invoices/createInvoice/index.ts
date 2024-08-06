'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { ActionResponse, ActionStatus } from '../../definitions';
import { createInvoicesSchema } from './schema';

export type CreateInvoicesParams = z.infer<typeof createInvoicesSchema>;

export async function createInvoice(
  params: CreateInvoicesParams,
): Promise<ActionResponse> {
  try {
    const validatedParams = createInvoicesSchema.parse(params);
    const { customerId, amount, status } = validatedParams;
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];
    await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
      `;
    revalidatePath('/dashboard/invoices');
    return {
      status: ActionStatus.Success,
      message: 'Create Invoice Success.',
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        status: ActionStatus.Error,
        message: 'Invalid email or password',
      };
    }
    return {
      status: ActionStatus.Error,
      message: 'Database Error: Failed to Create Invoice.',
    };
  }
}
