// app/api/generate-resume/route.js
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req) {
    try {
        const { formData } = await req.json();
        
        // Construct prompt for Gemini API
        const prompt = `
        Create a professional resume with the following details:
        
        **Personal Information**:
        - Name: ${formData.personalInfo.fullName}
        - Email: ${formData.personalInfo.email}
        - Phone: ${formData.personalInfo.phone}
        - Location: ${formData.personalInfo.location}
        - LinkedIn: ${formData.personalInfo.linkedin}
        
        **Professional Summary**:
        ${formData.summary}

        **Work Experience**:
        ${formData.experience.map(exp => `
          - **Position**: ${exp.title}
          - **Company**: ${exp.company}
          - **Location**: ${exp.location}
          - **Duration**: ${exp.startDate} to ${exp.endDate}
          - **Responsibilities**: ${exp.description}
        `).join('\n')}

        **Education**:
        ${formData.education.map(edu => `
          - **Degree**: ${edu.degree}
          - **School**: ${edu.school}
          - **Location**: ${edu.location}
          - **Graduation**: ${edu.graduationDate}
          ${edu.gpa ? `- **GPA**: ${edu.gpa}` : ''}
        `).join('\n')}

        **Skills**:
        ${formData.skills}

        Please format this into a well-structured and professional resume.
        `;

        // Make request to Google Gemini API
        const response = await axios.post(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
            {
                contents: [{ role: "user", parts: [{ text: prompt }] }]
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.OPEN_API_KEY}`
                }
            }
        );

        // Extract response from Gemini API
        const aiContent = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "Failed to generate content.";

        return NextResponse.json({ content: aiContent });
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
        return NextResponse.json({ error: 'Failed to generate resume' }, { status: 500 });
    }
}
