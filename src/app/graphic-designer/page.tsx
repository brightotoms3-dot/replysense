'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { ImageIcon, Wand2, Loader2, Download, RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { createGraphicDesign } from '../actions';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const FormSchema = z.object({
  prompt: z.string().min(10, 'Please describe the design in at least 10 characters.'),
});

type FormValues = z.infer<typeof FormSchema>;

type View = 'input' | 'loading' | 'results';

export default function GraphicDesignerPage() {
  const [view, setView] = useState<View>('input');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [lastPrompt, setLastPrompt] = useState<string>('');
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: { prompt: '' },
  });

  const { isSubmitting } = form.formState;

  const handleSubmit = async (values: FormValues) => {
    setView('loading');
    setLastPrompt(values.prompt);
    try {
      const result = await createGraphicDesign({ prompt: values.prompt });
      setImageUrl(result.imageUrl);
      setView('results');
    } catch (error) {
      console.error(error);
      toast({
        title: 'Design Generation Failed',
        description: 'Sorry, we couldn’t create your design. Please try again.',
        variant: 'destructive',
      });
      setView('input');
    }
  };

  const handleRegenerate = () => {
    if (lastPrompt) {
      handleSubmit({ prompt: lastPrompt });
    }
  };

  const handleDownload = () => {
    if (imageUrl) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = 'graphic-design.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  const handleStartOver = () => {
    form.reset();
    setImageUrl(null);
    setLastPrompt('');
    setView('input');
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">AI Graphic Designer</h1>
        <p className="text-muted-foreground">Describe the design you want, and let AI bring it to life.</p>
      </div>

      {view === 'input' && (
        <Card>
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="prompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg">Design Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., A logo for a coffee shop named 'Stellar Beans', with a planet and a coffee cup."
                          className="min-h-[120px] resize-y text-base"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full text-lg py-6" size="lg" disabled={isSubmitting}>
                  <Wand2 className="mr-2" />
                  Generate Design
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {view === 'loading' && (
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center space-y-4">
               <div className="space-y-2 text-center">
                <h2 className="text-2xl font-semibold">Creating your masterpiece...</h2>
                <p className="text-muted-foreground">This can take a moment, good art needs time!</p>
              </div>
              <Skeleton className="w-full aspect-square rounded-lg" />
            </div>
          </CardContent>
        </Card>
      )}

      {view === 'results' && imageUrl && (
        <div className="space-y-6">
          <Card>
            <CardContent className="p-4">
              <div className="aspect-square relative w-full">
                <Image
                  src={imageUrl}
                  alt={lastPrompt}
                  fill
                  className="rounded-lg object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button variant="outline" onClick={handleStartOver} className="py-6 text-base">
                New Design
            </Button>
            <Button onClick={handleRegenerate} className="py-6 text-base" disabled={isSubmitting}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Regenerate
            </Button>
            <Button onClick={handleDownload} className="py-6 text-base">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
