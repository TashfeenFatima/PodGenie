"use client"

import { GeneratePodcastProps } from '@/types'
import React, { useState } from 'react'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { Loader } from 'lucide-react'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { v4 as uuidv4 } from 'uuid'
import { useToast } from "@/components/ui/use-toast"
import { useUploadFiles } from '@xixixao/uploadstuff/react'

const useGeneratePodcast = ({
  setAudio,
  voiceType,
  voicePrompt,
  setAudioStorageId
}: GeneratePodcastProps) => {
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const generateUploadUrl = useMutation(api.files.generateUploadUrl)
  const getAudioUrl = useMutation(api.podcasts.getUrl)
  const { startUpload } = useUploadFiles(generateUploadUrl)

  const generatePodcast = async () => {
    setIsGenerating(true)
    setAudio('')

    if (!voicePrompt || !voiceType) {
      toast({
        title: "Please provide a voice and prompt to generate a podcast",
      })
      setIsGenerating(false)
      return
    }

    const elevenApiKey = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY

    if (!elevenApiKey) {
      toast({
        title: "Missing ElevenLabs API Key",
        description: "Please set NEXT_PUBLIC_ELEVENLABS_API_KEY in your .env.local file",
        variant: 'destructive'
      })
      setIsGenerating(false)
      return
    }

    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceType}`, {
        method: 'POST',
        headers: {
          'xi-api-key': elevenApiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: voicePrompt,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.4,
            similarity_boost: 0.8
          }
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('ElevenLabs response error:', errorText)
        throw new Error('Failed to generate audio from ElevenLabs')
      }

      const audioBuffer = await response.arrayBuffer()
      const blob = new Blob([audioBuffer], { type: 'audio/mpeg' })
      const fileName = `podcast-${uuidv4()}.mp3`
      const file = new File([blob], fileName, { type: 'audio/mpeg' })

      const uploaded = await startUpload([file])
      const storageId = (uploaded[0].response as any).storageId
      setAudioStorageId(storageId)

      const audioUrl = await getAudioUrl({ storageId })
      setAudio(audioUrl!)

      toast({
        title: "Podcast generated successfully",
      })
    } catch (error: any) {
      console.error('Error generating podcast', error)
      toast({
        title: "Error creating a podcast",
        description: error.message || "Something went wrong",
        variant: 'destructive',
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return { isGenerating, generatePodcast }
}


const GeneratePodcast = (props: GeneratePodcastProps) => {
  const { isGenerating, generatePodcast } = useGeneratePodcast(props)

  return (
    <div>
      <div className="flex flex-col gap-2.5">
        <Label className="text-16 font-bold text-white-1">
          AI Prompt to generate Podcast
        </Label>
        <Textarea
          className="input-class font-light focus-visible:ring-offset-orange-1"
          placeholder='Provide text to generate audio'
          rows={5}
          value={props.voicePrompt}
          onChange={(e) => props.setVoicePrompt(e.target.value)}
        />
      </div>

      <div className="mt-5 w-full max-w-[200px]">
        <Button
          type="button"
          className="text-16 bg-orange-1 py-4 font-bold text-white-1"
          onClick={generatePodcast}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              Generating
              <Loader size={20} className="animate-spin ml-2" />
            </>
          ) : (
            'Generate'
          )}
        </Button>
      </div>

      {props.audio && (
        <audio
          controls
          src={props.audio}
          autoPlay
          className="mt-5"
          onLoadedMetadata={(e) =>
            props.setAudioDuration(e.currentTarget.duration)
          }
        />
      )}
    </div>
  )
}

export default GeneratePodcast
