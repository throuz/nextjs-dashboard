'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { ActionResponse, ActionStatus } from '../../definitions';

export async function deleteInvoice(id: string): Promise<ActionResponse> {
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
    return {
      status: ActionStatus.Success,
      message: 'Delete Invoice Success.',
    };
  } catch (error) {
    return {
      status: ActionStatus.Error,
      message: 'Database Error: Failed to Delete Invoice.',
    };
  }
}
