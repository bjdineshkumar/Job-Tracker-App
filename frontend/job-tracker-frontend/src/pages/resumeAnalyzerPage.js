import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material/index.js";
import axios from "axios";

const ResumeAnalyzer = () => {
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  const handleAnalyze = async () => {
    if (!resume || !jobDescription) {
      setError("Please upload a resume and enter a job description.");
      return;
    }

    setError("");
    setLoading(true);

    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("jd", jobDescription);

    try {
      const response = await axios.post("http://localhost:5000/resume-analyze", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setAnalysisResult(response.data);
    } catch (err) {
      setError("An error occurred while analyzing the resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Resume and Job Description Analyzer
      </Typography>

      <Box sx={{ my: 2 }}>
        <Button variant="contained" component="label">
          Upload Resume
          <input type="file" hidden accept=".pdf,.docx,.txt" onChange={handleFileChange} />
        </Button>
        {resume && <Typography sx={{ mt: 1 }}>{resume.name}</Typography>}
      </Box>

      <Box sx={{ my: 2 }}>
        <TextField
          label="Job Description"
          multiline
          rows={4}
          fullWidth
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
      </Box>

      <Button variant="contained" color="primary" onClick={handleAnalyze} disabled={loading}>
        {loading ? <CircularProgress size={24} /> : "Analyze"}
      </Button>

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      {analysisResult && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Analysis Result</Typography>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Keyword</TableCell>
                  <TableCell>Found in Resume</TableCell>
                  <TableCell>Found in Job Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {analysisResult["Matched Keywords"].map((keyword, index) => (
                  <TableRow key={index}>
                    <TableCell>{keyword}</TableCell>
                    <TableCell>✅</TableCell>
                    <TableCell>✅</TableCell>
                  </TableRow>
                ))}
                {analysisResult["Missing Keywords"].map((keyword, index) => (
                  <TableRow key={index}>
                    <TableCell>{keyword}</TableCell>
                    <TableCell>❌</TableCell>
                    <TableCell>✅</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  );
};

export default ResumeAnalyzer;
