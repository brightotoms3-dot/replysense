'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CalendarHeart,
  Loader2,
  Sparkles,
  Lightbulb,
  ThumbsUp,
  RotateCcw,
} from 'lucide-react';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import {
  DATE_VIBES,
  DATE_BUDGETS,
  DATE_TIMES,
  DatePlannerFormSchema,
  type DatePlannerFormValues,
  type DatePlannerResults,
} from '@/lib/types';
import { createDateIdeas } from '../actions';
import { useToast } from '@/hooks/use-toast';

export default function DatePlannerPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<DatePlannerResults | null>(null);
  const { toast } = useToast();

  const form = useForm<DatePlannerFormValues>({
    resolver: zodResolver(DatePlannerFormSchema),
    defaultValues: {
      vibe: 'Romantic',
      budget: 'Cheap',
      timeOfDay: 'Night',
    },
  });

  const onSubmit = async (values: DatePlannerFormValues) => {
    setIsLoading(true);
    setResults(null);

    try {
      const response = await createDateIdeas(values);
      if (response) {
        setResults(response);
      } else {
        throw new Error('Received an empty response from the server.');
      }
    } catch (err) {
      toast({
        title: 'Generation Failed',
        description: "Sorry, we couldn't generate date ideas. Please try again.",
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartOver = () => {
    setResults(null);
    form.reset();
  };

  return (
    <>
      <div className="w-full max-w-2xl mx-auto space-y-8 animate-in fade-in-0 duration-500">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Date Planner</h1>
          <p className="text-muted-foreground">
            Generate creative date ideas in seconds.
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="vibe"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vibe</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a vibe" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {DATE_VIBES.map(vibe => (
                              <SelectItem key={vibe} value={vibe}>
                                {vibe}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Budget</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a budget" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {DATE_BUDGETS.map(budget => (
                              <SelectItem key={budget} value={budget}>
                                {budget}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="timeOfDay"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time of Day</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a time" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {DATE_TIMES.map(time => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full text-lg py-6"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2" />
                      Generate Date Ideas
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {isLoading && (
            <div className="flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in-0 duration-500">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <div className="space-y-2">
                    <h2 className="text-2xl font-semibold">Dreaming up dates...</h2>
                    <p className="text-muted-foreground">This should only take a moment.</p>
                </div>
            </div>
        )}

        {results && (
          <div className="space-y-6">
            <Card className="animate-in fade-in-0 duration-500">
                <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                    <CalendarHeart /> Your Date Ideas
                </CardTitle>
                </CardHeader>
                <CardContent>
                <Accordion type="single" collapsible defaultValue="item-0">
                    {results.ideas.map((idea, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                            {idea.title}
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-2 text-base">
                        <p className="text-muted-foreground">{idea.description}</p>
                        <ul className="space-y-2 pl-5 list-disc">
                            {idea.details.map((detail, i) => (
                            <li key={i}>{detail}</li>
                            ))}
                        </ul>
                        </AccordionContent>
                    </AccordionItem>
                    ))}
                </Accordion>
                </CardContent>
            </Card>
            <Button variant="outline" onClick={handleStartOver} className="w-full">
                <RotateCcw className="mr-2" />
                Start Over
            </Button>
          </div>
        )}

        <p className="text-xs text-center text-muted-foreground">
          AI suggestions only. Always prioritize safety and comfort.
        </p>
      </div>
    </>
  );
}
