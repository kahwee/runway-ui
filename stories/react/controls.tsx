import { useState } from "react";
import { Button, Field, Input } from "../../react/index.js";
import { bounded } from "../helpers.js";

export interface ButtonExampleProps {
  label: string;
  variant: "primary" | "secondary" | "danger";
  size: "sm" | "md" | "lg";
  disabled: boolean;
  width: number;
}
export function ButtonExample({ label, variant, size, disabled, width }: ButtonExampleProps) {
  const [clicks, setClicks] = useState(0);
  return (
    <section
      className="react-form-example"
      style={{ maxInlineSize: `${bounded(width, 220, 640, 420)}px` }}
    >
      <Button
        data-variant={variant}
        data-size={size}
        disabled={disabled}
        onClick={() => setClicks((value) => value + 1)}
      >
        {label}
      </Button>
      <p role="status">
        {clicks} activation{clicks === 1 ? "" : "s"}
      </p>
    </section>
  );
}
export interface InputExampleProps {
  label: string;
  value: string;
  placeholder: string;
  description: string;
  disabled: boolean;
  readOnly: boolean;
  required: boolean;
  type: "text" | "email" | "search" | "url";
  width: number;
}
export function InputExample({
  label,
  value: initialValue,
  placeholder,
  description,
  disabled,
  readOnly,
  required,
  type,
  width,
}: InputExampleProps) {
  const [value, setValue] = useState(initialValue);
  return (
    <section
      className="react-form-example"
      style={{ maxInlineSize: `${bounded(width, 220, 640, 420)}px` }}
    >
      <Field.Root className="rw-field" disabled={disabled}>
        <Field.Label>{label}</Field.Label>
        <Input
          value={value}
          onValueChange={setValue}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          type={type}
        />
        {description ? <Field.Description>{description}</Field.Description> : null}
      </Field.Root>
      <p className="rw-muted">Edit the preview directly. Args reset the initial value.</p>
    </section>
  );
}
