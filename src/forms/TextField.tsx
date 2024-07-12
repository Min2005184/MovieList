import React from 'react';
import { Field, ErrorMessage } from 'formik';
import { FormGroup, Label, Input } from 'reactstrap';

interface TextFieldProps {
  field: string;
  displayName: string;
  type?: any;
}

const TextField: React.FC<TextFieldProps> = ({ field, displayName, type = 'text' }) => (
  <FormGroup>
    <Label for={field}>{displayName}</Label>
    <Field name={field}>
      {({ field }: { field: any }) => (
        <Input type={type} {...field} id={field.name} />
      )}
    </Field>
    <ErrorMessage name={field} component="div" className="text-danger" />
  </FormGroup>
);

export default TextField;
