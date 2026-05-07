import { Request, Response } from 'express';
import axios from 'axios';

// Helper function to call Gemini API via Axios
const generateAIContent = async (prompt: string): Promise<string> => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY is missing in your environment variables');
    }

    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await axios.post(GEMINI_API_URL, {
        contents: [{ parts: [{ text: prompt }] }],
    }, {
        headers: { 'Content-Type': 'application/json' }
    });

    if (response.data && response.data.candidates && response.data.candidates.length > 0) {
        return response.data.candidates[0].content.parts[0].text;
    }
    
    throw new Error('Failed to generate response from AI');
};

// @desc    Chatbot API (User message -> AI response)
// @route   POST /api/ai/chat
// @access  Public or Private (Adjust based on preference)
export const chat = async (req: Request, res: Response): Promise<void> => {
    try {
        const { message } = req.body;
        if (!message) {
            res.status(400).json({ message: 'Message is required' });
            return;
        }

        const reply = await generateAIContent(message);
        res.json({ reply });
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};

// @desc    Generate product description
// @route   POST /api/ai/generate-description
// @access  Private
export const generateDescription = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, category, keywords } = req.body;

        if (!title) {
            res.status(400).json({ message: 'Item title is required' });
            return;
        }

        const prompt = `Write an engaging, SEO-friendly, and professional product description for a ${category || 'product'} named "${title}". ${keywords ? 'Focus on these features/keywords: ' + keywords : ''}. Please keep it under 3 paragraphs.`;

        const description = await generateAIContent(prompt);
        res.json({ description });
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};

// @desc    Generate summary from multiple reviews
// @route   POST /api/ai/review-summary
// @access  Public
export const reviewSummary = async (req: Request, res: Response): Promise<void> => {
    try {
        const { reviews, itemName } = req.body;

        if (!reviews || !Array.isArray(reviews) || reviews.length === 0) {
            res.status(400).json({ message: 'A non-empty array of reviews is required' });
            return;
        }

        const reviewText = reviews.map((r: string, index: number) => `${index + 1}. ${r}`).join('\n');
        const prompt = `Analyze the following customer reviews for the product "${itemName || 'Unknown Item'}". Provide a brief professional summary of the overall sentiment, highlighting the key pros and cons mentioned by the users:\n\n${reviewText}`;

        const summary = await generateAIContent(prompt);
        res.json({ summary });
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};