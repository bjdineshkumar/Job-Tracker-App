import React, { useState, useEffect } from 'react';
import apiClient from '../services/axiosConfig.js';
import TableCell, { tableCellClasses } from '@mui/material/TableCell/index.js';
import { styled } from '@mui/material/styles/index.js';
import { Table, TableBody, TableContainer, TableHead, TableRow, Paper, Button, CircularProgress, Typography, Box, 
  Pagination, Chip
} from '@mui/material';
import './jobTable.css'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: theme.palette.common.black,
    fontSize: 14,
    fontWeight: 700
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

// Helper function to format date
const formatDate = (dateString) => {
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
};

const JobTable = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLinked, setIsLinked] = useState(false);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    apiClient
      .get('http://localhost:8080/start-oauth')
      .then((response) => {
        setIsLinked(response.data.isLinked);
        if (response.data.isLinked) {
          fetchEmails();
        } else {
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));
  }, []);

  const fetchEmails = () => {
    apiClient
      .get('http://localhost:8080/api/get-session-data')
      .then((response) => {
        setEmails(response.data.emails || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleLinkAccount = () => {
    apiClient.get('http://localhost:8080/start-oauth').then((response) => {
      window.location.href = response.data.authUrl;
    });
  };

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const getStatusChip = (status) => {
    if (status.toLowerCase() === 'rejected') {
      return <Chip label="Rejected" className="status-rejected" />;
    } else if (status.toLowerCase() === 'completed') {
      return <Chip label="Completed" className="status-completed" />;
    }
    return <Chip label="Processing" className="status-processing" />;
  };

  if (loading) return <CircularProgress className="loading-spinner" />;

  return (
    <Box className="table-container">
      {!isLinked ? (
        <Box className="link-account-box">
          <Typography variant="h6">Google account not linked</Typography>
          <Button variant="contained" color="primary" onClick={handleLinkAccount}>
            Link Google Account
          </Button>
        </Box>
      ) : (
        <>
          <TableContainer component={Paper} className="table-paper">
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell className="table-header">ID</StyledTableCell>
                  <StyledTableCell className="table-header">Company</StyledTableCell>
                  <StyledTableCell className="table-header">Role</StyledTableCell>
                  <StyledTableCell className="table-header">Last Update</StyledTableCell>
                  <StyledTableCell className="table-header">Career Page</StyledTableCell>
                  <StyledTableCell className="table-header">STATUS</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {emails.slice((page - 1) * rowsPerPage, page * rowsPerPage).map((email, index) => (
                  <TableRow key={index}>
                    <TableCell align="left">{String(index + 1).padStart(5, '0')}</TableCell>
                    <TableCell>{email.company}</TableCell>
                    <TableCell>{email.role}</TableCell>
                    <TableCell>{formatDate(email.date)}</TableCell>
                    <TableCell>
                      <a href={email.careerPage} target="_blank" rel="noopener noreferrer">
                        Link
                      </a>
                    </TableCell>
                    <TableCell align="left">{getStatusChip(email.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box className="pagination-container">
            <Pagination
              count={Math.ceil(emails.length / rowsPerPage)}
              page={page}
              onChange={handleChangePage}
              color="primary"
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default JobTable;