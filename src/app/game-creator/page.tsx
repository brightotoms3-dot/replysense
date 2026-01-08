'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Wand2, Loader2, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { generateGame } from '@/app/actions';
import type { GenerateGameConceptOutput } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const FormSchema = z.object({
  idea: z.string().min(10, 'Please describe your game idea in at least 10 characters.'),
});

type FormValues = z.infer<typeof FormSchema>;

export default function GameCreatorPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerateGameConceptOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      idea: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await generateGame(values);
      setResult(response);
    } catch (error) {
      toast({
        title: 'Error Generating Concept',
        description: 'There was an issue creating your game concept. Please try again.',
        variant: 'destructive',
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">AI Game Creator</h1>
        <p className="text-muted-foreground">Let's design your next 3D game concept.</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="idea"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Your Game Idea</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., A survival game set on a planet made of candy, or a puzzle game where you manipulate gravity..."
                        className="min-h-[120px] resize-y text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full text-lg py-6" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2" />
                    Generate Concept
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <Card className="animate-in fade-in-50 duration-500">
          <CardHeader>
             <Skeleton className="h-8 w-3/4" />
             <Skeleton className="h-5 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
             <Skeleton className="h-40 w-full" />
             <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
             </div>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card className="animate-in fade-in-50 duration-500 overflow-hidden">
          <CardHeader>
            <CardTitle>{result.title}</CardTitle>
            <CardDescription>{result.pitch}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {result.imageUrl && (
              <div className="aspect-video relative rounded-lg border bg-muted flex items-center justify-center">
                 <Image src={result.imageUrl} alt={`Concept art for ${result.title}`} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
              </div>
            )}
             <div>
              <h3 className="font-semibold text-lg mb-2">Game Description</h3>
              <p className="text-muted-foreground">{result.description}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
