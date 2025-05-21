import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';


    export type FormFieldType ={ 
        name: string;
        label: string;
        type: 'text' | 'email' | 'password' | 'number' | 'select' | 'checkbox' | 'textarea' | 'radio' | 'date';
        placeholder?: string;
        required?: boolean;
        options?: { value: string; label: string }[];
        defaultValue?: any;
        description?: string;
        validation?: any;
        className?: string;
    };

    export type GenericFormProps = {
        formSchema: z.ZodObject<any>;
        fields: FormFieldType[];
        onSubmit: (values: any) => void;
        defaultValues?: Record<string, any>;
        submitButtonText?: string;
        formClassName?: string;
        loading?: boolean;
    };
    

    export function GenericForm({
    formSchema,
    fields,
    onSubmit,
    defaultValues = {},
    submitButtonText = 'Submit',
    formClassName = '',
    loading = false,
    }: GenericFormProps) {

        const form = useForm<z.infer<typeof formSchema>>({
            resolver: zodResolver(formSchema),
            defaultValues,
        });

        const renderFormField = (field: FormFieldType) =>{
            switch (field.type){
                case "text":
                case "email":
                case "password":
                case "number":
                    return(
                        <FormControl>
                            <Input
                                type={field.type}
                                placeholder={field.placeholder}
                                className={field.className}
                            />
                        </FormControl>
                    );
                case "textarea":
                    return(
                        <FormControl>
                            <Textarea 
                                placeholder={field.placeholder}
                                className={field.className}
                            />
                        </FormControl>
                    );
                case "select":
                    return(
                        <Select
                            onValueChange={(value) => form.setValue(field.name, value)}
                            defaultValue={field.defaultValue}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder={field.placeholder} />   
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {field.options?.map((option) =>(
                                    <SelectItem
                                        key={option.value} value={option.value}
                                    >
                                        {option.label}
                                    </SelectItem>
                                ))
                                }
                            </SelectContent>
                        </Select>
                    );
                case "checkbox":
                    return(
                        <FormControl>
                            <Checkbox
                                checked={form.watch(field.name)}
                                onCheckedChange={(checked) => form.setValue(field.name, checked)}
                                className={field.className}
                            />
                        </FormControl>
                    );
                case 'date':
                    return (
                        <Popover>
                            <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                variant={'outline'}
                                className={cn(
                                    'w-full pl-3 text-left font-normal',
                                    !form.watch(field.name) && 'text-muted-foreground',
                                    field.className
                                )}
                                >
                                {form.watch(field.name) ? (
                                    format(new Date(form.watch(field.name)), 'PPP')
                                ) : (
                                    <span>{field.placeholder || 'Pick a date'}</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={form.watch(field.name) ? new Date(form.watch(field.name)) : undefined}
                                onSelect={(date) => form.setValue(field.name, date)}
                                disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                                initialFocus
                            />
                            </PopoverContent>
                        </Popover>
                    );
                }
    }

    return(
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={`space-y-6 ${formClassName}`}
            >
                {fields.map((field) => (
                <FormField
                    key={field.name}
                    control={form.control}
                    name={field.name}
                    render={({ field: formField }) => (
                    <FormItem>
                        <div className="flex flex-col space-y-2">
                        <FormLabel>
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                        </FormLabel>
                        {renderFormField(field)}
                        {field.description && (
                            <FormDescription>{field.description}</FormDescription>
                        )}
                        <FormMessage />
                        </div>
                    </FormItem>
                    )}
                />
                ))}
                <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                    <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                    </span>
                ) : (
                    submitButtonText
                )}
                </Button>
            </form>
        </Form>
    );
}