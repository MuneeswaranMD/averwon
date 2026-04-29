import React, { useState, useEffect } from 'react';
import { Box, Button, Text, Input, Icon, Loader, Table, TableHead, TableBody, TableRow, TableCell, Label } from '@adminjs/design-system';
import { ApiClient } from 'adminjs';

const AdminProjectAssign = () => {
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  
  const api = new ApiClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pRes, eRes] = await Promise.all([
        fetch('/api/admin/projects').then(r => r.json()),
        fetch('/api/admin/tracking/employees').then(r => r.json())
      ]);
      setProjects(pRes);
      setEmployees(eRes.filter(e => e && e.employee).map(e => e.employee.name));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedProject || !selectedEmployee) return;
    setAssigning(true);
    try {
      const res = await fetch('/api/admin/projects/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: selectedProject, employeeName: selectedEmployee })
      });
      if (res.ok) {
        alert('Employee assigned successfully!');
        fetchData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAssigning(false);
    }
  };

  if (loading) return <Box p="xl" textAlign="center"><Loader /></Box>;

  return (
    <Box p="lg" bg="white" m="lg" borderRadius="lg" variant="card">
      <Box mb="xl">
        <Text fontWeight="bold" fontSize="h3" mb="md">Project Assignment</Text>
        <Text color="grey60">Quickly assign team members to active projects.</Text>
      </Box>

      <Box display="flex" flexDirection="row" gap="lg" mb="xl" alignItems="flex-end">
        <Box flex={1}>
          <Label>Select Project</Label>
          <select 
            value={selectedProject} 
            onChange={e => setSelectedProject(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            <option value="">-- Choose Project --</option>
            {projects.map(p => (
              <option key={p._id} value={p._id}>{p.name} ({p.client})</option>
            ))}
          </select>
        </Box>
        <Box flex={1}>
          <Label>Select Employee</Label>
          <select 
            value={selectedEmployee} 
            onChange={e => setSelectedEmployee(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            <option value="">-- Choose Employee --</option>
            {employees.map(e => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
        </Box>
        <Button variant="contained" onClick={handleAssign} disabled={assigning}>
          {assigning ? 'Assigning...' : 'Assign to Project'}
        </Button>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Project</TableCell>
            <TableCell>Client</TableCell>
            <TableCell>Team Members</TableCell>
            <TableCell>Progress</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {projects.map(p => (
            <TableRow key={p._id}>
              <TableCell fontWeight="bold">{p.name}</TableCell>
              <TableCell>{p.client}</TableCell>
              <TableCell>
                {p.teamMembers?.map(m => (
                  <Box key={m} display="inline-block" bg="grey20" px="sm" py="xs" borderRadius="sm" mr="xs" mb="xs" fontSize="xs">
                    {m}
                  </Box>
                )) || 'No members'}
              </TableCell>
              <TableCell>{p.progress}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default AdminProjectAssign;
