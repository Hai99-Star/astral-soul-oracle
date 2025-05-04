import React, { ReactNode } from 'react';
import { Label } from '@/components/ui/label';
import { FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';

interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  description?: string;
  required?: boolean;
  children: ReactNode;
}

/**
 * Reusable form field component to standardize form layouts
 */
const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  error,
  description,
  required = false,
  children
}) => {
  return (
    <div className="mb-4">
      <FormItem>
        <FormLabel htmlFor={id} className={required ? 'after:content-["*"] after:ml-0.5 after:text-red-500' : ''}>
          {label}
        </FormLabel>
        <FormControl>
          {children}
        </FormControl>
        {description && (
          <FormDescription>
            {description}
          </FormDescription>
        )}
        {error && (
          <FormMessage>
            {error}
          </FormMessage>
        )}
      </FormItem>
    </div>
  );
};

export default FormField; 