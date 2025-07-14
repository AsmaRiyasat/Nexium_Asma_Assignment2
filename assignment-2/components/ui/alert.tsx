// import * as React from "react"

// import { cn } from "@/lib/utils"

// const Alert = React.forwardRef(({ className, ...props }: any, ref: any) => (
//   <div ref={ref} className={cn("border-l-4 p-4 bg-red-50 border-red-400", className)} {...props} />
// ))
// Alert.displayName = "Alert"

// const AlertTitle = ({ children }: { children: React.ReactNode }) => (
//   <h5 className="font-bold text-red-700">{children}</h5>
// )

// const AlertDescription = ({ children }: { children: React.ReactNode }) => (
//   <p className="text-sm text-red-600">{children}</p>
// )

// export { Alert, AlertTitle, AlertDescription }
import * as React from "react"
import { cn } from "@/lib/utils"

type AlertProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: "destructive" | "default"
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variantClass =
      variant === "destructive"
        ? "border-l-4 bg-red-50 border-red-400"
        : "border-l-4 bg-blue-50 border-blue-400"

    return (
      <div
        ref={ref}
        className={cn("p-4", variantClass, className)}
        {...props}
      />
    )
  }
)
Alert.displayName = "Alert"

const AlertTitle = ({ children }: { children: React.ReactNode }) => (
  <h5 className="font-bold text-red-700">{children}</h5>
)

const AlertDescription = ({ children }: { children: React.ReactNode }) => (
  <p className="text-sm text-red-600">{children}</p>
)

export { Alert, AlertTitle, AlertDescription }
