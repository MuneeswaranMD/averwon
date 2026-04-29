import React, { useState } from 'react';
import { Box, Button, Text, Input, Label, Icon, DropZone, DropZoneItem } from '@adminjs/design-system';

const LeadImport = (props) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/leads/import', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setResult({ error: 'Failed to upload file' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box p="lg" bg="white" m="lg" borderRadius="lg" variant="card">
      <Box mb="xl">
        <Text fontWeight="bold" fontSize="h3" mb="md">Import Leads</Text>
        <Text color="grey60">Upload a CSV or JSON file to import multiple leads at once.</Text>
      </Box>

      <Box mb="xl">
        <Label>Select File</Label>
        <DropZone 
          onChange={(files) => setFile(files[0])}
          multiple={false}
          validate={{
            maxSize: 5 * 1024 * 1024,
          }}
        />
        {file && <DropZoneItem fileName={file.name} onRemove={() => setFile(null)} />}
      </Box>

      <Button variant="contained" onClick={handleUpload} disabled={uploading || !file}>
        {uploading ? 'Importing...' : 'Start Import'}
      </Button>

      {result && (
        <Box mt="xl" p="md" bg={result.error ? 'danger20' : 'success20'} borderRadius="md">
          {result.error ? (
            <Text color="danger">{result.error}</Text>
          ) : (
            <Text color="success">Successfully imported {result.count} leads!</Text>
          )}
        </Box>
      )}

      <Box mt="xl">
        <Text variant="sm" color="grey60">
          Format: JSON array or CSV with headers (dealName, clientName, dealValue, status).
        </Text>
      </Box>
    </Box>
  );
};

export default LeadImport;
