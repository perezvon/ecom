import React, { useState } from "react";
import { TextInput } from "grommet";

const EditableText = ({ name, value, type, onClickOutside = () => {} }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const handleChange = e => setCurrentValue(e.target.value);
  const handleKeyPress = e => {
    if (e.charCode === 13) {
      onClickOutside(currentValue);
      e.target.blur();
    }
  };
  const handleBlur = e => {
    setIsEditing(false);
    onClickOutside(currentValue);
  };
  return isEditing ? (
    <TextInput
      name={name}
      value={currentValue}
      type={type}
      onChange={handleChange}
      onBlur={handleBlur}
      onKeyPress={handleKeyPress}
    />
  ) : (
    <p onClick={() => setIsEditing(true)}> {value}</p>
  );
};

export default EditableText;
