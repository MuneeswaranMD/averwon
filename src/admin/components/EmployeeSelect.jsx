import React, { useState, useEffect } from 'react';
import { Box, Label, Select, Loader } from '@adminjs/design-system';

const EmployeeSelect = (props) => {
  const { property, record, onChange } = props;
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const value = record.params[property.name];

  useEffect(() => {
    fetch('/api/admin/employees/all')
      .then(r => r.json())
      .then(data => {
        setEmployees(data.map(e => ({ value: e.name, label: e.name })));
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching employees:', err);
        setLoading(false);
      });
  }, []);

  const handleChange = (selected) => {
    if (property.isArray) {
      // For arrays, AdminJS expects an array of values
      onChange(property.name, selected ? selected.map(s => s.value) : []);
    } else {
      onChange(property.name, selected ? selected.value : '');
    }
  };

  if (loading) return <Loader />;

  // Transform current value to Select format
  let selectedValue = null;
  if (property.isArray) {
    const vals = Array.isArray(value) ? value : (value ? [value] : []);
    selectedValue = employees.filter(e => vals.includes(e.value));
  } else {
    selectedValue = employees.find(e => e.value === value) || null;
  }

  return (
    <Box mb="lg">
      <Label>{property.label}</Label>
      <Select
        isMulti={property.isArray}
        value={selectedValue}
        options={employees}
        onChange={handleChange}
      />
    </Box>
  );
};

export default EmployeeSelect;
