'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { ActionResponse, ActionStatus } from '../../definitions';
import { updateInvoicesSchema } from './schema';

export type UpdateInvoicesParams = z.infer<typeof updateInvoicesSchema>;

export async function updateInvoice(
  id: string,
  params: UpdateInvoicesParams,
): Promise<ActionResponse> {
  try {
    const validatedParams = updateInvoicesSchema.parse(params);
    const { customerId, amount, status } = validatedParams;
    const amountInCents = amount * 100;
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
      `;
    revalidatePath('/dashboard/invoices');
    return {
      status: ActionStatus.Success,
      message: 'Update Invoice Success.',
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        status: ActionStatus.Error,
        message: 'Invalid input data for updating invoice.',
      };
    }
    return {
      status: ActionStatus.Error,
      message: 'Database Error: Failed to Update Invoice.',
    };
  }
}
