'use client';

import { useState, useRef, useEffect } from 'react';
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
  Globe,
  Camera,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { createConversationStarters } from '../actions';
import {
  CrushAssistantFormSchema,
  VIBES,
  type CrushAssistantFormValues,
  type CrushAssistantResults,
} from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export default function CrushAssistantPage() {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<CrushAssistantResults | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Camera state
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const form = useForm<CrushAssistantFormValues>({
    resolver: zodResolver(CrushAssistantFormSchema),
    defaultValues: {
      photo: undefined,
      vibe: 'None',
    },
  });

  useEffect(() => {
    if (!isCameraOpen) {
      setHasCameraPermission(null);
      return;
    }

    let stream: MediaStream;

    const getCameraPermission = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please allow camera access to use this feature.',
        });
      }
    };

    getCameraPermission();

    // Cleanup function to stop the stream
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isCameraOpen, toast]);


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

  const fileToDataUri = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    const dataURLtoFile = (dataurl: string, filename: string): File | null => {
      const arr = dataurl.split(',');
      if (arr.length < 2) return null;
      const match = arr[0].match(/:(.*?);/);
      if (!match) return null;
      const mime = match[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    };
  
    const handleCapture = () => {
      if (!videoRef.current || !canvasRef.current) return;
  
      const video = videoRef.current;
      const canvas = canvasRef.current;
  
      const width = video.videoWidth;
      const height = video.videoHeight;
      canvas.width = width;
      canvas.height = height;
  
      const context = canvas.getContext('2d');
      context?.drawImage(video, 0, 0, width, height);
  
      const dataUri = canvas.toDataURL('image/jpeg');
      const file = dataURLtoFile(dataUri, 'crush-photo.jpeg');
  
      if (file) {
        setPreview(dataUri);
        form.setValue('photo', file);
        setResults(null);
        setFileError(null);
        form.clearErrors('photo');
        setIsCameraOpen(false);
      } else {
        toast({
          title: 'Capture Failed',
          description: 'Could not capture photo. Please try again.',
          variant: 'destructive',
        });
      }
    };

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
        vibe: values.vibe,
      });
      if (response) {
        setResults(response);
      } else {
        throw new Error('Received an empty response from the server.');
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unknown error occurred.';
      toast({
        title: 'Generation Failed',
        description:
          "Sorry, we couldn't generate suggestions. Please try again.",
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="w-full max-w-2xl mx-auto space-y-8 animate-in fade-in-0 duration-500">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Crush Assistant</h1>
          <p className="text-muted-foreground">
            Slide into the DMs with confidence.
          </p>
        </div>
        <Card>
          <CardContent className="p-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="photo"
                  render={() => (
                    <FormItem>
                      <FormLabel className="text-lg">
                        Upload a photo of your crush
                      </FormLabel>
                      <FormControl>
                        <div
                          className={cn(
                            'relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors',
                            {
                              'border-destructive':
                                fileError || form.formState.errors.photo,
                            }
                          )}
                          onClick={() => !preview && fileInputRef.current?.click()}
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
                                <span className="font-semibold">
                                  Click to upload
                                </span>{' '}
                                or drag and drop
                              </p>
                              <p className="text-xs">
                                PNG, JPG or WEBP (MAX. 5MB)
                              </p>
                              <div className="relative flex items-center my-4 w-full px-8">
                                <div className="flex-grow border-t border-border"></div>
                                <span className="flex-shrink mx-4 text-muted-foreground text-xs">
                                  OR
                                </span>
                                <div className="flex-grow border-t border-border"></div>
                              </div>
                              <Button
                                type="button"
                                variant="secondary"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsCameraOpen(true);
                                }}
                              >
                                <Camera className="mr-2" />
                                Use Camera
                              </Button>
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
                      {fileError && (
                        <p className="text-sm font-medium text-destructive">
                          {fileError}
                        </p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="vibe"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg">
                        Add a cultural vibe (optional)
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="text-base h-12">
                            <div className="flex items-center gap-3">
                              <Globe className="w-5 h-5 text-muted-foreground" />
                              <SelectValue placeholder="Select a vibe" />
                            </div>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {VIBES.map((vibe) => (
                            <SelectItem
                              key={vibe}
                              value={vibe}
                              className="text-base py-2"
                            >
                              {vibe}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full text-lg py-6"
                  size="lg"
                  disabled={isLoading || !preview}
                >
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
              <CardTitle className="text-2xl">
                Your Conversation Openers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-lg">
              <div className="space-y-2">
                <h3 className="font-semibold text-primary flex items-center">
                  <Heart className="w-5 h-5 mr-2" />
                  Friendly Starter
                </h3>
                <p className="pl-7">{results.starter1}</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-primary flex items-center">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Playful/Confident Starter
                </h3>
                <p className="pl-7">{results.starter2}</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-primary flex items-center">
                  <ChevronRight className="w-5 h-5 mr-2" />
                  Safe & Polite Starter
                </h3>
                <p className="pl-7">{results.starter3}</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <h3 className="font-semibold text-accent">Tone Advice</h3>
                <p className="text-base">{results.toneAdvice}</p>
              </div>
              <div className="p-4 bg-destructive rounded-lg flex items-start space-x-3 text-destructive-foreground">
                <ThumbsDown className="w-8 h-8 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold">Avoid This</h3>
                  <p className="text-base opacity-90">{results.avoidThis}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <p className="text-xs text-center text-muted-foreground">
          AI suggestions only. Always be respectful and use your best judgment.
        </p>
      </div>
      <Dialog open={isCameraOpen} onOpenChange={setIsCameraOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Take a photo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
             <video
              ref={videoRef}
              className="w-full aspect-video rounded-md bg-muted"
              autoPlay
              muted
              playsInline
            />

            {hasCameraPermission === null && (
              <div className="flex items-center justify-center h-10">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <p className="ml-2">Waiting for camera permission...</p>
              </div>
            )}
            
            {hasCameraPermission === false && (
              <Alert variant="destructive">
                <AlertTitle>Camera Access Required</AlertTitle>
                <AlertDescription>
                  Please allow camera access to use this feature.
                </AlertDescription>
              </Alert>
            )}

            {hasCameraPermission === true && (
              <Button
                onClick={handleCapture}
                className="w-full text-lg py-6"
                size="lg"
              >
                <Camera className="mr-2" /> Snap Photo
              </Button>
            )}
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </DialogContent>
      </Dialog>
    </>
  );
}
