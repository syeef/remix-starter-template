import * as Form from "@radix-ui/react-form";
import { useField } from "remix-validated-form";

// import styles from "./Input.css";

// export const links = () => [{ rel: "stylesheet", href: styles }];

type MyInputProps = {
  name: string;
  label: string;
  placeholder?: string;
  type: "email" | "text" | "password";
  formId?: string;
};

export function Input({
  name,
  label,
  placeholder,
  type,
  formId,
}: MyInputProps) {
  const { error, getInputProps } = useField(name, { formId: formId });
  return (
    <Form.Field className="FormField" name={name}>
      <Form.Label className="FormLabel" htmlFor={name}>
        {label}
      </Form.Label>

      <Form.Control asChild>
        <input
          {...getInputProps({
            id: name,
            type: type,
            placeholder: placeholder,
            className: "Input",
          })}
        />
      </Form.Control>

      {error && <Form.Message className="FormMessage">{error}</Form.Message>}
    </Form.Field>
  );
}
