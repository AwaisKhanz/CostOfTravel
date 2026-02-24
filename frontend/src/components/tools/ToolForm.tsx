"use client";

import React from 'react';
import { FieldValues, useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { trackEvent } from '@/lib/tracking';

interface ToolFormProps<T extends z.ZodType<any, any, any>> {
  schema: T;
  onSubmit: (data: z.infer<T>) => void;
  isLoading: boolean;
  defaultValues: Partial<z.infer<T>>;
  buttonText: string;
  toolId: string;
  children: (form: UseFormReturn<z.infer<T>>) => React.ReactNode;
}

export function ToolForm<TSchema extends FieldValues>({ 
  schema, 
  onSubmit, 
  isLoading, 
  defaultValues,
  buttonText,
  toolId,
  children 
}: ToolFormProps<any>) {
  const form = useForm<TSchema>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as any
  });

  const handleSubmitWithTracking = (data: any) => {
    trackEvent('tool_submit', { toolId });
    onSubmit(data);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmitWithTracking)} className="space-y-4 bg-card p-8 rounded-card border border-border-subtle shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {children(form)}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-brand-primary text-on-brand-primary font-bold py-4 rounded-button hover:bg-brand-primary-hover disabled:bg-foreground/20 disabled:text-foreground/40 transition-all mt-6 shadow-premium active:scale-95"
      >
        {isLoading ? 'Calculating...' : buttonText}
      </button>
    </form>
  );
}
