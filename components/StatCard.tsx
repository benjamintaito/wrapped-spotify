import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  accent?: boolean
  className?: string
}

export function StatCard({ label, value, sub, accent, className }: StatCardProps) {
  return (
    <Card className={cn("border-border bg-card", accent && "border-primary/30 bg-primary/5", className)}>
      <CardContent className="p-4 md:p-5">
        <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">{label}</p>
        <p className={cn("text-2xl md:text-3xl font-black truncate", accent && "text-primary")}>{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-1 truncate">{sub}</p>}
      </CardContent>
    </Card>
  )
}
