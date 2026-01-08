'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Heart,
  UploadCloud,
  X,
  Sparkles,
  Loader2,
  ThumbsDown,
  ChevronRight,
} from 'lucide-react';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { createConversationStarters } from '../actions';
import { CrushAssistantFormSchema, type CrushAssistantFormValues, type CrushAssistantResults } from '@/lib/types';
import { cn } from '@/lib/utils';


const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export default function CrushAssistantPage() {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<CrushAssistantResults | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const form = useForm<CrushAssistantFormValues>({
    resolver: zodResolver(CrushAssistantFormSchema),
    defaultValues: {
      photo: undefined,
      naijaVibe: false,
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setFileError(null);
    form.clearErrors('photo');

    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setFileError('File is too large. Max 5MB.');
        clearFile();
        return;
      }
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        setFileError('Invalid file type. Only JPEG, PNG, or WEBP are allowed.');
        clearFile();
        return;
      }
      form.setValue('photo', file);
      setPreview(URL.createObjectURL(file));
      setResults(null);
    }
  };

  const clearFile = () => {
    form.setValue('photo', undefined);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const fileToDataUri = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const onSubmit = async (values: CrushAssistantFormValues) => {
    setIsLoading(true);
    setResults(null);

    let photoDataUri: string | undefined = undefined;
    if (values.photo) {
      try {
        photoDataUri = await fileToDataUri(values.photo);
      } catch (err) {
        toast({
          title: 'Error',
          description: 'Could not process the uploaded image. Please try again.',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }
    } else {
        // This should not happen due to form validation, but as a safeguard.
        toast({
          title: 'No Photo',
          description: 'Please upload a photo to get started.',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
    }


    try {
      const response = await createConversationStarters({
        photoDataUri,
        naijaVibe: values.naijaVibe,
      });
      if (response) {
        setResults(response);
      } else {
        throw new Error('Received an empty response from the server.');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      toast({
        title: 'Generation Failed',
        description: "Sorry, we couldn't generate suggestions. Please try again.",
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 animate-in fade-in-0 duration-500">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Crush Assistant</h1>
        <p className="text-muted-foreground">Slide into the DMs with confidence.</p>
      </div>
      <Card>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="photo"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-lg">Upload a photo of your crush</FormLabel>
                    <FormControl>
                       <div
                        className={cn(
                          'relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors',
                          { 'border-destructive': fileError || form.formState.errors.photo }
                        )}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {preview ? (
                          <>
                            <Image
                              src={preview}
                              alt="Crush photo preview"
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
                                setResults(null);
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="naijaVibe"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Add "Naija Vibe" 🇳🇬
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full text-lg py-6" size="lg" disabled={isLoading || !preview}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                   <>
                    <Sparkles className="mr-2" />
                    Get Conversation Starters
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {results && (
        <Card className="animate-in fade-in-0 duration-500">
          <CardHeader>
            <CardTitle className="text-2xl">Your Conversation Openers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-lg">
            <div className="space-y-2">
              <h3 className="font-semibold text-primary flex items-center"><Heart className="w-5 h-5 mr-2"/>Friendly Starter</h3>
              <p className="pl-7">{results.starter1}</p>
            </div>
             <div className="space-y-2">
              <h3 className="font-semibold text-primary flex items-center"><Sparkles className="w-5 h-5 mr-2"/>Playful/Confident Starter</h3>
              <p className="pl-7">{results.starter2}</p>
            </div>
             <div className="space-y-2">
              <h3 className="font-semibold text-primary flex items-center"><ChevronRight className="w-5 h-5 mr-2"/>Safe & Polite Starter</h3>
              <p className="pl-7">{results.starter3}</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <h3 className="font-semibold text-accent">Tone Advice</h3>
                <p className="text-base">{results.toneAdvice}</p>
            </div>
            <div className="p-4 bg-destructive/10 text-destructive-foreground rounded-lg flex items-start space-x-2">
                <ThumbsDown className="w-8 h-8 flex-shrink-0 text-destructive"/>
                <div>
                  <h3 className="font-semibold">Avoid This</h3>
                  <p className="text-base">{results.avoidThis}</p>
                </div>
            </div>
          </CardContent>
        </Card>
      )}

       <p className="text-xs text-center text-muted-foreground">
          AI suggestions only. Always be respectful and use your best judgment.
      </p>
    </div>
  );
}