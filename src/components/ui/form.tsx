import * as React from "react"
import { cn } from "../../lib/utils"

export interface FormProps extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  onSubmit: (data: Record<string, string>) => void
}

const Form = React.forwardRef<HTMLFormElement, FormProps>(
  ({ className, onSubmit, ...props }, ref) => {
    return (
      <form
        ref={ref}
        className={cn("space-y-4", className)}
        onSubmit={(e) => {
          e.preventDefault()
          const formData = new FormData(e.currentTarget)
          const data = Object.fromEntries(formData.entries()) as Record<string, string>
          onSubmit(data)
        }}
        {...props}
      />
    )
  }
)
Form.displayName = "Form"

export { Form } 