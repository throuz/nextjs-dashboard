'use client';

import { useForm } from 'react-hook-form';
import {
  authenticate,
  AuthenticateParams,
} from '@/app/lib/actions/authenticate/authenticate';
import { authenticateSchema } from '@/app/lib/actions/authenticate/schema';
import { ActionStatus } from '@/app/lib/actions/definitions';
import { lusitana } from '@/app/ui/fonts';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import {
  AtSymbolIcon,
  ExclamationCircleIcon,
  KeyIcon,
} from '@heroicons/react/24/outline';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from './button';

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<AuthenticateParams>({
    resolver: zodResolver(authenticateSchema),
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(data: AuthenticateParams) {
    const response = await authenticate(data);
    if (response && response.status === ActionStatus.Error) {
      setError('root', { message: response.message });
    }
  }

  return (
    <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>
          Please log in to continue.
        </h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                placeholder="Enter your email address"
                {...register('email')}
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            {errors.email && (
              <div className="mt-2 flex gap-1">
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                <span className="text-sm text-red-500">
                  {errors.email.message}
                </span>
              </div>
            )}
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                placeholder="Enter password"
                {...register('password')}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            {errors.password && (
              <div className="mt-2 flex gap-1">
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                <span className="text-sm text-red-500">
                  {errors.password.message}
                </span>
              </div>
            )}
          </div>
        </div>
        <Button
          className="mx-auto mt-4"
          disabled={isSubmitting}
          aria-disabled={isSubmitting}
        >
          {isSubmitting ? (
            'Loging...'
          ) : (
            <>
              Log in
              <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
            </>
          )}
        </Button>
        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {errors.root && (
            <div className="mt-2 flex gap-1">
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <span className="text-sm text-red-500">
                {errors.root.message}
              </span>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
