import * as React from "react"
import { AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

const Alert = React.forwardRef(({ className, ...props }: any, ref: any) => (
  <div ref={ref} className={cn("border-l-4 p-4 bg-red-50 border-red-400", className)} {...props} />
))
Alert.displayName = "Alert"

const AlertTitle = ({ children }: { children: React.ReactNode }) => (
  <h5 className="font-bold text-red-700">{children}</h5>
)

const AlertDescription = ({ children }: { children: React.ReactNode }) => (
  <p className="text-sm text-red-600">{children}</p>
)

export { Alert, AlertTitle, AlertDescription }
