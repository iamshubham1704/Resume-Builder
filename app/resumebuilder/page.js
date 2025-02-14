"use client";
import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import './resume.css';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ResumePDF from '../components/ResumePDF';

const ResumeBuilder = () => {
  const [formData, setFormData] = useState({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: ''
    },
    summary: '',
    experience: [],
    education: [],
    skills: ''
  });

  // Fix: Ensuring hydration consistency
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.length ? prev.experience : [{
        title: '', company: '', location: '', startDate: '', endDate: '', description: ''
      }],
      education: prev.education.length ? prev.education : [{
        degree: '', school: '', location: '', graduationDate: '', gpa: ''
      }]
    }));
  }, []);

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [name]: value }
    }));
  };

  const handleInputChange = (section, index, e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updatedSection = [...prev[section]];
      updatedSection[index] = { ...updatedSection[index], [name]: value };
      return { ...prev, [section]: updatedSection };
    });
  };

  const addSectionItem = (section, newItem) => {
    setFormData(prev => ({
      ...prev,
      [section]: [...prev[section], newItem]
    }));
  };

  const removeSectionItem = (section, index) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  const [aiContent, setAiContent] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to generate resume: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      setAiContent(data.content);
    } catch (error) {
      setError("Error generating resume. Please try again.");
      console.error('Error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

 
  const idRef = useRef(null);
  if (!idRef.current) idRef.current = Math.random().toString(36).substr(2, 5);
  const stableId = idRef.current;

  return (
    <div className='resume-builder'>
      <form onSubmit={handleSubmit} className="resume-form">
        <div className="form-section">
          <h2>Personal Information</h2>
          <div className="input-group">
            {Object.keys(formData.personalInfo).map(key => (
              <input
                key={key}
                type={key === "email" ? "email" : "text"}
                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                name={key}
                value={formData.personalInfo[key]}
                onChange={handlePersonalInfoChange}
              />
            ))}
          </div>
        </div>

        <div className="form-section">
          <h2>Professional Summary</h2>
          <textarea
            placeholder="Write a brief professional summary..."
            value={formData.summary}
            onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
          />
        </div>

        {['experience', 'education'].map(section => (
          <div className="form-section" key={section}>
            <div className="section-header">
              <h2>{section.charAt(0).toUpperCase() + section.slice(1)}</h2>
              <button
                type="button"
                className="add-button"
                onClick={() => addSectionItem(section, section === "experience"
                  ? { title: '', company: '', location: '', startDate: '', endDate: '', description: '' }
                  : { degree: '', school: '', location: '', graduationDate: '', gpa: '' })}
              >
                Add {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            </div>
            {formData[section].map((item, index) => (
              <div key={index} className="form-card">
                <button
                  type="button"
                  className="remove-button"
                  onClick={() => removeSectionItem(section, index)}
                >
                  ×
                </button>
                <div className="input-group">
                  {Object.keys(item).map(key => (
                    <input
                      key={key}
                      type={key.includes("Date") ? "month" : "text"}
                      placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                      name={key}
                      value={item[key]}
                      onChange={(e) => handleInputChange(section, index, e)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}

        <button type="submit" className="submit-button" disabled={isGenerating}>
          {isGenerating ? 'Generating resume...' : 'Generate Resume'}
        </button>
      </form>

      {error && <div className='error-message'>{error}</div>}

      {aiContent && (
        <div className='download-section'>
          <PDFDownloadLink
            document={<ResumePDF formData={formData} aiContent={aiContent} />}
            fileName={`${formData.personalInfo.fullName.replace(/\s+/g, '_')}_resume.pdf`}
            className='download-button'
          >
            {({ loading }) => loading ? 'Preparing PDF...' : 'Download Resume PDF'}
          </PDFDownloadLink>
        </div>
      )}
    </div>
  );
};

// Disable SSR for this component
export default dynamic(() => Promise.resolve(ResumeBuilder), { ssr: false });
