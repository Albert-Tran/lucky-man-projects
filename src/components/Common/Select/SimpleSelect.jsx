import React from 'react';
import Select from 'react-select';

const SimpleSelect = ({
  options,
  value,
  onChange,
  placeholder,
  isDisabled = false,
  formErrors,
}) => {
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: isDisabled ? '#eef7ff' : '#fff',
      borderColor: formErrors ? 'red' : (state.isFocused ? '#80bdff' : '#ced4da'),
      boxShadow: state.isFocused ? '0 0 0 0.2rem rgba(0, 123, 255, 0.25)' : 'none',
      '&:hover': {
        borderColor: formErrors ? 'red' : (state.isFocused ? '#80bdff' : '#a7a9ac')
      },
      minHeight: '38px',
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 1000,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#e0f2fe' : state.isFocused ? '#e9ecef' : null,
      color: state.isSelected ? '007bff' : 'black',
    }),
  };

  return (
    <Select
      value={options.find(option => option.value === value) || null}
      onChange={(selectedOption) => onChange(selectedOption ? selectedOption.value : '')}
      options={options}
      placeholder={placeholder}
      isDisabled={isDisabled}
      isClearable={true}
      isSearchable={false} // Không cần tìm kiếm cho số lượng ít options
      styles={customStyles}
    />
  );
};

export default SimpleSelect;