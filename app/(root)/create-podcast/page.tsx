"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import OpenAI from "openai";

import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";

import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import GeneratePodcast from "@/components/GeneratePodcast";
import GenerateThumbnail from "@/components/GenerateThumbnail";
import { cn } from "@/lib/utils";

// ✅ OpenAI config (only for test/dev; avoid exposing API keys in production)
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!,
  dangerouslyAllowBrowser: true,
});

const voiceCategories = [
  { id: "21m00Tcm4TlvDq8ikWAM", name: "Rachel" },
  { id: "Xb7hH8MSUJpSbSDYk0k2", name: "Alice" },
  { id: "nPczCjzI2devNBz1zQrb", name: "Brian" },
  { id: "NOpBlnGInO9m6vDvFkFC", name: "Mark" },
  { id: "56AoDkrOh6qfVPDXZ7Pt", name: "Classidy" },
  { id: "tnSpp4vdxKPjI9w0GnoV", name: "Hope" },
  { id: "EXAVITQu4vr4xnSDxMaL", name: "Sarah" },
  { id: "knrPHWnBmmDHMoiMeP3l", name: "Santa Claus" },
  { id: "U5GB7U7vpCnfBjzCQteB", name: "Rajveer" },
  { id: "648Ei7uQJOUMPaz1Tdpc", name: "Aryaveer" },
];

const formSchema = z.object({
  podcastTitle: z.string().min(2),
  podcastDescription: z.string().min(10),
});

const CreatePodcast = () => {
  const router = useRouter();
  const { toast } = useToast();
  const createPodcast = useMutation(api.podcasts.createPodcast);

  const [voiceType, setVoiceType] = useState<string | null>(null);
  const [voicePrompt, setVoicePrompt] = useState("");
  const [imagePrompt, setImagePrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [audioDuration, setAudioDuration] = useState(0);
  const [imageStorageId, setImageStorageId] = useState<Id<"_storage"> | null>(null);
  const [audioStorageId, setAudioStorageId] = useState<Id<"_storage"> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      podcastTitle: "",
      podcastDescription: "",
    },
  });

  const podcastDescription = form.watch("podcastDescription");

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!podcastDescription || podcastDescription.length < 10 || voicePrompt) return;

      (async () => {
        try {
          const res = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: "You are a professional podcast script writer. Generate an engaging podcast script based on the description provided in",
              },
              {
                role: "user",
                content: `Podcast Topic: ${podcastDescription}`,
              },
            ],
          });

          const script = res.choices?.[0]?.message?.content?.trim();
          if (script) setVoicePrompt(script);
        } catch (err) {
          console.error("Script generation failed", err);
        }
      })();
    }, 1000); // debounce

    return () => clearTimeout(timeout);
  }, [podcastDescription, voicePrompt]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);

      // if (!audioUrl || !imageUrl || !voiceType) {
      //   toast({ title: "Please generate audio and image" });
      //   return;
      // }

      await createPodcast({
        podcastTitle: data.podcastTitle,
        podcastDescription: data.podcastDescription,
        audioUrl,
        imageUrl,
        voiceType,
        imagePrompt,
        voicePrompt,
        views: 0,
        audioDuration,
        audioStorageId: audioStorageId!,
        imageStorageId: imageStorageId!,
      });

      toast({ title: "Podcast created" });
      router.push("/");
    } catch (err) {
      console.error(err);
      toast({ title: "Error", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mt-10 flex flex-col">
      <h1 className="text-3xl font-semibold text-white-1 ">Create Podcast</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-12 flex w-full flex-col">
          <div className="flex flex-col gap-[30px] border-b border-black-5 pb-10">
            <FormField
              control={form.control}
              name="podcastTitle"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2.5">
                  <FormLabel className="text-16 font-bold text-white-1">Title</FormLabel>
                  <FormControl>
                    <Input className="input-class focus-visible:ring-offset-orange-1" placeholder="Provide a podcast title" {...field} />
                  </FormControl>
                  <FormMessage className="text-white-1" />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-2.5">
              <Label className="text-16 font-bold text-white-1">Select AI Voice</Label>
              <Select onValueChange={(value) => setVoiceType(value)}>
                <SelectTrigger className={cn("text-16 bg-black-1 text-gray-1 focus-visible:ring-offset-orange-1")}>
                  <SelectValue placeholder="Select AI Voice" className="placeholder:text-gray-1 " />
                </SelectTrigger>
                <SelectContent className="text-16 border-none bg-black-1 font-bold text-white-1 focus:ring-orange-1">
                  {voiceCategories.map((voice) => (
                    <SelectItem key={voice.id} value={voice.id} className="capitalize focus:bg-orange-1">
                      {voice.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <FormField
              control={form.control}
              name="podcastDescription"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2.5">
                  <FormLabel className="text-16 font-bold text-white-1">Description</FormLabel>
                  <FormControl>
                    <Textarea className="input-class focus-visible:ring-offset-orange-1" placeholder="Write a short podcast description" {...field} />
                  </FormControl>
                  <FormMessage className="text-white-1"  />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col pt-10">
            <GeneratePodcast
              setAudioStorageId={setAudioStorageId}
              setAudio={setAudioUrl}
              voiceType={voiceType!}
              audio={audioUrl}
              voicePrompt={voicePrompt}
              setVoicePrompt={setVoicePrompt}
              setAudioDuration={setAudioDuration}
            />

            <GenerateThumbnail
              setImage={setImageUrl}
              setImageStorageId={setImageStorageId}
              image={imageUrl}
              imagePrompt={imagePrompt}
              setImagePrompt={setImagePrompt}
            />

            <div className="mt-10 w-full">
              <Button type="submit" className=" text-white-1 w-full bg-orange-1 py-4 font-extrabold transition-all duration-500 hover:bg-black-1">
                {isSubmitting ? (
                  <>
                    Submitting <Loader size={20} className="animate-spin ml-2" />
                  </>
                ) : (
                  "Submit & Publish Podcast"
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </section>
  );
};

export default CreatePodcast;
