"use client";

import { useState, useRef } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import Image from 'next/image';
import {
  Heart,
  Briefcase,
  School,
  Users,
  Smile,
  UploadCloud,
  X,
  MessageSquareReply
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { CATEGORIES, type FormValues } from '@/lib/types';
import { cn } from '@/lib/utils';

interface InputScreenProps {
  form: UseFormReturn<FormValues>;
  onSubmit: (values: FormValues) => void;
}

const categoryIcons: Record<(typeof CATEGORIES)[number], React.ElementType> = {
  Relationship: Heart,
  'Work / Boss': Briefcase,
  School: School,
  Family: Users,
  Friends: Smile,
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export default function InputScreen({ form, onSubmit }: InputScreenProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setFileError(null);

    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setFileError('File is too large. Max 5MB.');
        clearFile();
        return;
      }
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        setFileError('Invalid file type. Only JPEG, PNG, WEBP are allowed.');
        clearFile();
        return;
      }
      form.setValue('screenshot', file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const clearFile = () => {
    form.setValue('screenshot', undefined);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const { isSubmitting } = form.formState;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 animate-in fade-in-0 duration-500">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">AI Reply Helper</h1>
        <p className="text-muted-foreground">Don’t reply yet. Ask the AI.</p>
      </div>
      <Card>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="inputText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">
                      Paste the message or describe the situation
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., My boss wants me to work on the weekend, but I have plans..."
                        className="min-h-[120px] resize-y text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem>
                <FormLabel className="text-lg">
                  Upload screenshot (optional)
                </FormLabel>
                <FormControl>
                  <div
                    className={cn(
                      'relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors',
                      { 'border-destructive': fileError }
                    )}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {preview ? (
                      <>
                        <Image
                          src={preview}
                          alt="Screenshot preview"
                          fill
                          className="object-contain rounded-lg p-2"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 bg-background/50 backdrop-blur-sm rounded-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            clearFile();
                          }}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove image</span>
                        </Button>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center text-muted-foreground">
                        <UploadCloud className="w-10 h-10 mb-3" />
                        <p className="mb-2 text-sm">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs">PNG, JPG or WEBP (MAX. 5MB)</p>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      id="file-upload"
                      type="file"
                      className="hidden"
                      accept={ACCEPTED_IMAGE_TYPES.join(',')}
                      onChange={handleFileChange}
                    />
                  </div>
                </FormControl>
                {fileError && <p className="text-sm font-medium text-destructive">{fileError}</p>}
              </FormItem>
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Select category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="text-base h-12">
                          <SelectValue placeholder="Which area of your life is this about?" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CATEGORIES.map((category) => {
                          const Icon = categoryIcons[category];
                          return (
                            <SelectItem key={category} value={category} className="text-base py-2">
                              <div className="flex items-center gap-3">
                                <Icon className="w-5 h-5 text-muted-foreground" />
                                <span>{category}</span>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full text-lg py-6" size="lg" disabled={isSubmitting}>
                <MessageSquareReply className="mr-2" />
                Generate Reply
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <p className="text-xs text-center text-muted-foreground">
        AI suggestions only. Use your judgment.
      </p>
    </div>
  );
}
