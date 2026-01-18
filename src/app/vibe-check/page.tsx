'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  VibeCheckFormSchema,
  type VibeCheckFormValues,
  type VibeCheckResults,
} from '@/lib/types';
import { analyzeVibe } from '../actions';

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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadCloud, X, Loader2, HeartPulse, Lightbulb, Forward, Sparkles, RotateCcw } from 'lucide-react';
import Image from 'next/image';

import LoadingScreen from '@/components/loading-screen';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';


const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export default function VibeCheckPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<VibeCheckResults | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();

  const form = useForm<VibeCheckFormValues>({
    resolver: zodResolver(VibeCheckFormSchema),
    defaultValues: {
      conversation: '',
      screenshot: undefined,
    },
  });

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

  const fileToDataUri = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const handleSubmit = async (values: VibeCheckFormValues) => {
    setIsLoading(true);
    setResults(null);

    let screenshotDataUri: string | undefined = undefined;
    if (values.screenshot) {
      try {
        screenshotDataUri = await fileToDataUri(values.screenshot);
      } catch (err) {
        toast({
          title: 'Error',
          description: 'Could not process the uploaded screenshot. Please try again.',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }
    }

    try {
      const response = await analyzeVibe({
        conversation: values.conversation,
        screenshotDataUri,
      });
      if (response) {
        setResults(response);
      } else {
        throw new Error("Received an empty response from the server.");
      }
    } catch (err) {
      toast({
        title: 'Analysis Failed',
        description: "Sorry, we couldn't analyze the vibe. Please try again.",
        variant: 'destructive',
      });
    } finally {
        setIsLoading(false);
    }
  };

  const handleStartOver = () => {
    form.reset();
    setResults(null);
    clearFile();
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (results) {
    return (
        <div className="w-full max-w-2xl mx-auto space-y-8 animate-in fade-in-0 duration-500">
            <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tight">Conversation Vibe</h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl text-center text-primary">{results.overallVibe}</CardTitle>
                </CardHeader>
            </Card>
             <Card>
                <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                    <Lightbulb className="h-6 w-6 text-primary" />
                    Analysis
                </CardTitle>
                </CardHeader>
                <CardContent>
                <p className="text-lg text-foreground/80">{results.analysis}</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                    <Forward className="h-6 w-6 text-primary" />
                    Next Step
                </CardTitle>
                </CardHeader>
                <CardContent>
                <p className="text-lg text-foreground/80">{results.nextStepSuggestion}</p>
                </CardContent>
            </Card>
            <Button variant="outline" onClick={handleStartOver} className="w-full text-lg py-6">
                <RotateCcw className="mr-2" />
                Analyze Another
            </Button>
        </div>
    )
  }

  return (
    <>
      <div className="w-full max-w-2xl mx-auto space-y-8 animate-in fade-in-0 duration-500">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Vibe Check</h1>
          <p className="text-muted-foreground">
            Paste your chat and get an instant vibe analysis.
          </p>
        </div>
        <Card>
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="conversation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg">
                        Paste the conversation
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., Her: lol you're funny | Him: thanks you too | Her: wyd"
                          className="min-h-[150px] resize-y text-base"
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

                <Button
                  type="submit"
                  className="w-full text-lg py-6"
                  size="lg"
                  disabled={form.formState.isSubmitting}
                >
                  <HeartPulse className="mr-2" />
                  Check Vibe
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        <p className="text-xs text-center text-muted-foreground">
          AI analysis is a guide, not a judgment.
        </p>
      </div>
    </>
  );
}
