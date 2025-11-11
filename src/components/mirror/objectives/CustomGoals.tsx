import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { SOSTACObjective, ObjectivesGenerator } from '@/services/mirror/objectives-generator'
import { Target, Trash2, Edit, Pause, Play } from 'lucide-react'

interface CustomGoalsProps {
  goals: SOSTACObjective[]
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onToggleStatus?: (id: string) => void
  className?: string
}

export const CustomGoals: React.FC<CustomGoalsProps> = ({
  goals,
  onEdit,
  onDelete,
  onToggleStatus,
  className,
}) => {
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            <CardTitle>Active Goals</CardTitle>
          </div>
          <Badge variant="secondary">{goals.length} goals</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {goals.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Target className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>No active goals yet</p>
            <p className="text-sm">Create a goal or accept a recommended one</p>
          </div>
        ) : (
          goals.map((goal) => {
            const progress = ObjectivesGenerator.calculateProgress(goal)
            return (
              <Card key={goal.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{goal.title}</h4>
                        <Badge variant={goal.status === 'active' ? 'default' : 'secondary'}>
                          {goal.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{goal.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <div>
                      <span className="font-medium">{goal.current_value}</span>
                      <span className="text-muted-foreground"> → </span>
                      <span className="font-medium text-green-600">{goal.target_value}</span>
                      <span className="text-muted-foreground"> {goal.unit}</span>
                    </div>
                    <Badge variant="outline">{ObjectivesGenerator.formatTimeline(goal.timeline)}</Badge>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t">
                    {onToggleStatus && (
                      <Button variant="ghost" size="sm" onClick={() => onToggleStatus(goal.id!)}>
                        {goal.status === 'active' ? (
                          <><Pause className="h-3 w-3 mr-1" /> Pause</>
                        ) : (
                          <><Play className="h-3 w-3 mr-1" /> Resume</>
                        )}
                      </Button>
                    )}
                    {onEdit && (
                      <Button variant="ghost" size="sm" onClick={() => onEdit(goal.id!)}>
                        <Edit className="h-3 w-3 mr-1" /> Edit
                      </Button>
                    )}
                    {onDelete && (
                      <Button variant="ghost" size="sm" onClick={() => onDelete(goal.id!)}>
                        <Trash2 className="h-3 w-3 mr-1" /> Delete
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
