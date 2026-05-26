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

  const isMulti = property.name === 'participants' || property.name === 'teamMembers' || property.isArray;

  const handleChange = (selected) => {
    if (isMulti) {
      onChange(property.name, selected ? selected.map(s => s.value) : []);
    } else {
      onChange(property.name, selected ? selected.value : '');
    }
  };

  if (loading) return <Loader />;

  // Reconstruct arrays from either direct arrays or AdminJS flattened dotted keys (e.g. key.0, key.1)
  const getSelectedValue = () => {
    if (Array.isArray(value)) return value;
    
    const vals = [];
    let i = 0;
    while (record.params[`${property.name}.${i}`] !== undefined) {
      vals.push(record.params[`${property.name}.${i}`]);
      i++;
    }
    if (vals.length > 0) return vals;
    
    return value ? [value] : [];
  };

  // Transform current value to Select format
  let selectedValue = null;
  if (isMulti) {
    const vals = getSelectedValue();
    selectedValue = employees.filter(e => vals.includes(e.value));
  } else {
    selectedValue = employees.find(e => e.value === value) || null;
  }

  return (
    <Box mb="lg">
      <Label>{property.label}</Label>
      <Select
        isMulti={isMulti}
        value={selectedValue}
        options={employees}
        onChange={handleChange}
      />
    </Box>
  );
};

export default EmployeeSelect;
