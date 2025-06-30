import { AssemblyAI } from 'assemblyai';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY,
});

console.log('Using API key:', process.env.ASSEMBLYAI_API_KEY);

async function testTranscription() {
  try {
    const audioBuffer = fs.readFileSync('./sample.m4a');
    console.log('Uploading sample.m4a...');

    // Upload the audio file and get the URL directly
    const uploadUrl = await client.files.upload(audioBuffer);
    console.log('Uploaded file URL:', uploadUrl);

    // Transcribe using the uploaded URL
    const transcript = await client.transcripts.transcribe({
      audio: uploadUrl, // Use the URL directly
    });

    if (transcript.text) {
      console.log('Transcription successful:', transcript.text.substring(0, 100) + '...');
    } else {
      console.error('Transcription failed or text is missing:', transcript);
    }
  } catch (error) {
    console.error('Transcription failed with error:', error);
  }
}

testTranscription();