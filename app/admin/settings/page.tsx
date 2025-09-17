"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Clock, Server, Bell, Plus, Trash2, Edit, Check, X, AlertCircle, Activity } from "lucide-react"
import AdminHeader from "@/components/admin-header"
import { useToast } from "@/hooks/use-toast"
import {
  resetToDemo,
  getCourts,
  addCourt,
  updateCourtStatus,
  type Court,
  type PeakHourPeriod,
  getGeneralSettings,
  getTerminalSettings,
  getNotificationSettings,
  setGeneralSettings,
  setTerminalSettings,
  setNotificationSettings,
  getStatusBadgeVariant,
  getStatusDisplayText,
  getAllSystemPlayers,
} from "@/lib/court-state"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// Importe o novo componente
import { CustomBadge } from "@/components/custom-badge"

export default function SettingsPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("general")

  // General settings
  const [generalSettings, setGeneralSettingsState] = useState(getGeneralSettings())

  // Court management
  const [courts, setCourts] = useState<Court[]>([])
  const [newCourtName, setNewCourtName] = useState("")
  const [editingCourtId, setEditingCourtId] = useState<string | null>(null)
  const [editingCourtStatus, setEditingCourtStatus] = useState<Court["status"]>("available")

  // Hikvision terminal settings
  const [terminalSettings, setTerminalSettingsState] = useState(getTerminalSettings())

  // Notification settings
  const [notificationSettings, setNotificationSettingsState] = useState(getNotificationSettings())

  // Load courts and settings on component mount
  useEffect(() => {
    setCourts(getCourts())
    setGeneralSettingsState(getGeneralSettings())
    setTerminalSettingsState(getTerminalSettings())
    setNotificationSettingsState(getNotificationSettings())
  }, [])

  const handleSaveGeneralSettings = () => {
    setGeneralSettings(generalSettings)
    toast({
      title: "Settings saved",
      description: "General settings have been updated",
    })
  }

  const handleSaveTerminalSettings = () => {
    setTerminalSettings(terminalSettings)
    toast({
      title: "Terminal settings saved",
      description: "Hikvision terminal settings have been updated",
    })
  }

  const handleSaveNotificationSettings = () => {
    setNotificationSettings(notificationSettings)
    toast({
      title: "Notification settings saved",
      description: "Notification preferences have been updated",
    })
  }

  const handleTestTerminalConnection = () => {
    toast({
      title: "Connection successful",
      description: "Successfully connected to the Hikvision terminal",
    })
  }

  const handleSyncNow = () => {
    toast({
      title: "Sync initiated",
      description: "Synchronizing player data with the terminal...",
    })

    // Simulate sync completion after 2 seconds
    setTimeout(() => {
      toast({
        title: "Sync complete",
        description: "Player data has been synchronized with the terminal",
      })
    }, 2000)
  }

  const addPeakHourPeriod = () => {
    if (generalSettings.peakHourPeriods.length >= 4) {
      toast({
        title: "Maximum reached",
        description: "You can only configure up to 4 peak hour periods",
        variant: "destructive",
      })
      return
    }

    const newId = (generalSettings.peakHourPeriods.length + 1).toString()
    const updatedPeakHours = [
      ...generalSettings.peakHourPeriods,
      { id: newId, dayOfWeek: "all", startTime: "16:00", endTime: "20:00" },
    ]

    setGeneralSettingsState({
      ...generalSettings,
      peakHourPeriods: updatedPeakHours,
    })
  }

  const removePeakHourPeriod = (id: string) => {
    const updatedPeakHours = generalSettings.peakHourPeriods.filter((period) => period.id !== id)
    setGeneralSettingsState({
      ...generalSettings,
      peakHourPeriods: updatedPeakHours,
    })
  }

  const updatePeakHourPeriod = (id: string, field: keyof PeakHourPeriod, value: string) => {
    const updatedPeakHours = generalSettings.peakHourPeriods.map((period) =>
      period.id === id ? { ...period, [field]: value } : period,
    )

    setGeneralSettingsState({
      ...generalSettings,
      peakHourPeriods: updatedPeakHours,
    })
  }

  const handleResetToDemo = () => {
    // Only reset player data, keep courts and settings as they are
    resetToDemo()

    toast({
      title: "Demo players restored",
      description: "The waiting list has been reset to the initial demo players",
    })
  }

  const handleAddCourt = () => {
    if (!newCourtName.trim()) {
      toast({
        title: "Court name required",
        description: "Please enter a name for the new court",
        variant: "destructive",
      })
      return
    }

    addCourt(newCourtName.trim())
    setCourts(getCourts())
    setNewCourtName("")

    toast({
      title: "Court added",
      description: `${newCourtName} has been added to the system`,
    })
  }

  const startEditingCourt = (court: Court) => {
    setEditingCourtId(court.id)
    setEditingCourtStatus(court.status)
  }

  const cancelEditingCourt = () => {
    setEditingCourtId(null)
  }

  const saveCourtStatus = (courtId: string) => {
    updateCourtStatus(courtId, editingCourtStatus)
    setCourts(getCourts())
    setEditingCourtId(null)

    toast({
      title: "Court updated",
      description: `Court status has been updated`,
    })
  }

  // Função para testar a integração com Make.com
  const handleTestMakeIntegration = async () => {
    if (!notificationSettings.makeComWebhookUrl) {
      toast({
        title: "Webhook URL missing",
        description: "Please enter a Make.com webhook URL",
        variant: "destructive",
      })
      return
    }

    try {
      // Obter todos os jogadores do sistema para enviar como teste
      const players = getAllSystemPlayers()

      // Selecionar um jogador de exemplo ou criar um objeto de teste
      const testData = {
        event: "test_integration",
        timestamp: new Date().toISOString(),
        players: players.slice(0, 5), // Enviar apenas os primeiros 5 jogadores como teste
        system_info: {
          version: "1.0.0",
          environment: "production",
          test: true,
        },
      }

      // Enviar dados para o webhook do Make.com
      const response = await fetch(notificationSettings.makeComWebhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testData),
      })

      if (response.ok) {
        toast({
          title: "Integration test successful",
          description: "Test data was successfully sent to Make.com",
        })
      } else {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    } catch (error) {
      console.error("Error testing Make.com integration:", error)
      toast({
        title: "Integration test failed",
        description: "Failed to send data to Make.com. Check the webhook URL and try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AdminHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">System Settings</h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="terminal">Hikvision Terminal</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="activity">Activity Log</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Court & Time Settings
                </CardTitle>
                <CardDescription>Configure court usage rules and time-related settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="courtSessionTime">Default Court Session Time (minutes)</Label>
                    <Select
                      value={generalSettings.courtSessionTime}
                      onValueChange={(value) =>
                        setGeneralSettingsState({ ...generalSettings, courtSessionTime: value })
                      }
                    >
                      <SelectTrigger id="courtSessionTime">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="60">60 minutes</SelectItem>
                        <SelectItem value="90">90 minutes</SelectItem>
                        <SelectItem value="120">120 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="checkInGracePeriod">Check-in Grace Period (minutes)</Label>
                    <Select
                      value={generalSettings.checkInGracePeriod}
                      onValueChange={(value) =>
                        setGeneralSettingsState({ ...generalSettings, checkInGracePeriod: value })
                      }
                    >
                      <SelectTrigger id="checkInGracePeriod">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 minutes</SelectItem>
                        <SelectItem value="10">10 minutes</SelectItem>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="20">20 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Peak Hours (up to 4 periods)</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addPeakHourPeriod}
                      disabled={generalSettings.peakHourPeriods.length >= 4}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Period
                    </Button>
                  </div>

                  {generalSettings.peakHourPeriods.map((period, index) => (
                    <div key={period.id} className="mb-4 p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Period {index + 1}</h4>
                        {generalSettings.peakHourPeriods.length > 1 && (
                          <Button variant="ghost" size="sm" onClick={() => removePeakHourPeriod(period.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                          <Label htmlFor={`dayOfWeek-${period.id}`}>Day of Week</Label>
                          <Select
                            value={period.dayOfWeek}
                            onValueChange={(value) => updatePeakHourPeriod(period.id, "dayOfWeek", value)}
                          >
                            <SelectTrigger id={`dayOfWeek-${period.id}`}>
                              <SelectValue placeholder="Select day" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Days</SelectItem>
                              <SelectItem value="weekdays">Weekdays</SelectItem>
                              <SelectItem value="weekends">Weekends</SelectItem>
                              <SelectItem value="monday">Monday</SelectItem>
                              <SelectItem value="tuesday">Tuesday</SelectItem>
                              <SelectItem value="wednesday">Wednesday</SelectItem>
                              <SelectItem value="thursday">Thursday</SelectItem>
                              <SelectItem value="friday">Friday</SelectItem>
                              <SelectItem value="saturday">Saturday</SelectItem>
                              <SelectItem value="sunday">Sunday</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`startTime-${period.id}`}>Start Time</Label>
                          <Input
                            id={`startTime-${period.id}`}
                            type="time"
                            value={period.startTime}
                            onChange={(e) => updatePeakHourPeriod(period.id, "startTime", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`endTime-${period.id}`}>End Time</Label>
                          <Input
                            id={`endTime-${period.id}`}
                            type="time"
                            value={period.endTime}
                            onChange={(e) => updatePeakHourPeriod(period.id, "endTime", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enforceDoublesInPeakHours">Enforce Doubles During Peak Hours</Label>
                      <p className="text-sm text-muted-foreground">Only allow doubles matches during peak hours</p>
                    </div>
                    <Switch
                      id="enforceDoublesInPeakHours"
                      checked={generalSettings.enforceDoublesInPeakHours}
                      onCheckedChange={(checked) =>
                        setGeneralSettingsState({ ...generalSettings, enforceDoublesInPeakHours: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="allowRenewalIfNoQueue">Allow Session Renewal If No Queue</Label>
                      <p className="text-sm text-muted-foreground">
                        Players can extend their time if no one is waiting
                      </p>
                    </div>
                    <Switch
                      id="allowRenewalIfNoQueue"
                      checked={generalSettings.allowRenewalIfNoQueue}
                      onCheckedChange={(checked) =>
                        setGeneralSettingsState({ ...generalSettings, allowRenewalIfNoQueue: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="autoAssignCourts">Auto-assign Courts</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically assign players to courts when possible
                      </p>
                    </div>
                    <Switch
                      id="autoAssignCourts"
                      checked={generalSettings.autoAssignCourts}
                      onCheckedChange={(checked) =>
                        setGeneralSettingsState({ ...generalSettings, autoAssignCourts: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="autoAllocateGroups">Auto-allocate Ready Groups to Courts</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically allocate ready groups to available courts
                      </p>
                    </div>
                    <Switch
                      id="autoAllocateGroups"
                      checked={generalSettings.autoAllocateGroups}
                      onCheckedChange={(checked) =>
                        setGeneralSettingsState({ ...generalSettings, autoAllocateGroups: checked })
                      }
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveGeneralSettings}>Save Changes</Button>
              </CardFooter>
            </Card>

            {/* Court Management */}
            <Card>
              <CardHeader>
                <CardTitle>Court Management</CardTitle>
                <CardDescription>Add new courts and manage court status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-end gap-4">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="newCourtName">New Court Name</Label>
                    <Input
                      id="newCourtName"
                      placeholder="e.g. Court 9"
                      value={newCourtName}
                      onChange={(e) => setNewCourtName(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleAddCourt}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Court
                  </Button>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Existing Courts</h3>

                  {courts.length === 0 ? (
                    <div className="flex items-center justify-center p-6 border rounded-lg">
                      <div className="text-center">
                        <AlertCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-muted-foreground">No courts found</p>
                      </div>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Court Name</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {courts.map((court) => (
                          <TableRow key={court.id}>
                            <TableCell className="font-medium">{court.name}</TableCell>
                            <TableCell>
                              {editingCourtId === court.id ? (
                                <Select value={editingCourtStatus} onValueChange={setEditingCourtStatus}>
                                  <SelectTrigger className="w-[180px]">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="available">Available</SelectItem>
                                    <SelectItem value="in-use">In Use</SelectItem>
                                    <SelectItem value="maintenance">Maintenance</SelectItem>
                                    <SelectItem value="classes">Classes</SelectItem>
                                    <SelectItem value="tournament">Tournament</SelectItem>
                                  </SelectContent>
                                </Select>
                              ) : (
                                <CustomBadge variant={getStatusBadgeVariant(court.status)}>
                                  {getStatusDisplayText(court.status)}
                                </CustomBadge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              {editingCourtId === court.id ? (
                                <div className="flex justify-end space-x-2">
                                  <Button variant="ghost" size="icon" onClick={() => saveCourtStatus(court.id)}>
                                    <Check className="h-4 w-4 text-green-500" />
                                  </Button>
                                  <Button variant="ghost" size="icon" onClick={cancelEditingCourt}>
                                    <X className="h-4 w-4 text-destructive" />
                                  </Button>
                                </div>
                              ) : (
                                <Button variant="ghost" size="icon" onClick={() => startEditingCourt(court)}>
                                  <Edit className="h-4 w-4 text-muted-foreground" />
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Demo Mode */}
            <Card>
              <CardHeader>
                <CardTitle>Demo Mode</CardTitle>
                <CardDescription>Reset the player waiting list to the initial demo state</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 border rounded-lg bg-muted/20">
                  <div className="flex flex-col space-y-4">
                    <div>
                      <p className="mb-2">
                        Reset the player waiting list to the initial demo state for demonstration purposes.
                      </p>
                      <p className="text-sm text-muted-foreground mb-4">
                        This will restore the initial demo players to the waiting list. All custom players added to the
                        system will be preserved but removed from the waiting list. Court configurations and settings
                        will remain unchanged.
                      </p>
                      <ConfirmDialog
                        title="Restore Demo Players"
                        description="This will reset the waiting list to its original demo state. Any custom players will be preserved in the system but removed from the waiting list. Court configurations and settings will remain unchanged. Are you sure you want to continue?"
                        confirmText="Yes, Restore Demo Players"
                        cancelText="Cancel"
                        onConfirm={handleResetToDemo}
                        variant="outline"
                        className="border-dashed"
                      >
                        Restore Demo Players
                      </ConfirmDialog>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Hikvision Terminal Settings */}
          <TabsContent value="terminal" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Server className="h-5 w-5 mr-2" />
                  Hikvision Terminal Configuration
                </CardTitle>
                <CardDescription>
                  Configure the connection to the Hikvision DS-K1T673DX facial recognition terminal
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Terminal Status - Moved from Dashboard */}
                <Card className="border-dashed">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Terminal Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span>Online - DS-K1T673DX</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Last sync: Today at 10:45 AM</p>
                  </CardContent>
                </Card>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="terminalIp">Terminal IP Address</Label>
                    <Input
                      id="terminalIp"
                      value={terminalSettings.terminalIp}
                      onChange={(e) => setTerminalSettingsState({ ...terminalSettings, terminalIp: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="terminalPort">Terminal Port</Label>
                    <Input
                      id="terminalPort"
                      value={terminalSettings.terminalPort}
                      onChange={(e) => setTerminalSettingsState({ ...terminalSettings, terminalPort: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="terminalUsername">Terminal Username</Label>
                    <Input
                      id="terminalUsername"
                      value={terminalSettings.terminalUsername}
                      onChange={(e) =>
                        setTerminalSettingsState({ ...terminalSettings, terminalUsername: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="terminalPassword">Terminal Password</Label>
                    <Input
                      id="terminalPassword"
                      type="password"
                      value={terminalSettings.terminalPassword}
                      onChange={(e) =>
                        setTerminalSettingsState({ ...terminalSettings, terminalPassword: e.target.value })
                      }
                    />
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-4">Synchronization Settings</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="syncFrequency">Sync Frequency (minutes)</Label>
                      <Select
                        value={terminalSettings.syncFrequency}
                        onValueChange={(value) =>
                          setTerminalSettingsState({ ...terminalSettings, syncFrequency: value })
                        }
                      >
                        <SelectTrigger id="syncFrequency">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 minute</SelectItem>
                          <SelectItem value="5">5 minutes</SelectItem>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">60 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2 pt-8">
                      <Switch
                        id="autoSync"
                        checked={terminalSettings.autoSync}
                        onCheckedChange={(checked) =>
                          setTerminalSettingsState({ ...terminalSettings, autoSync: checked })
                        }
                      />
                      <Label htmlFor="autoSync">Enable automatic synchronization</Label>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                  <Button variant="outline" onClick={handleTestTerminalConnection}>
                    Test Connection
                  </Button>
                  <Button variant="outline" onClick={handleSyncNow}>
                    Sync Now
                  </Button>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveTerminalSettings}>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Notification Settings
                </CardTitle>
                <CardDescription>Configure how and when notifications are sent</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enableEmailNotifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Send notifications via email</p>
                    </div>
                    <Switch
                      id="enableEmailNotifications"
                      checked={notificationSettings.enableEmailNotifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettingsState({ ...notificationSettings, enableEmailNotifications: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enableSmsNotifications">SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">Send notifications via SMS</p>
                    </div>
                    <Switch
                      id="enableSmsNotifications"
                      checked={notificationSettings.enableSmsNotifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettingsState({ ...notificationSettings, enableSmsNotifications: checked })
                      }
                    />
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-4">Notification Events</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notifyOnCheckIn">Player Check-in</Label>
                      <Switch
                        id="notifyOnCheckIn"
                        checked={notificationSettings.notifyOnCheckIn}
                        onCheckedChange={(checked) =>
                          setNotificationSettingsState({ ...notificationSettings, notifyOnCheckIn: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="notifyOnCourtAssignment">Court Assignment</Label>
                      <Switch
                        id="notifyOnCourtAssignment"
                        checked={notificationSettings.notifyOnCourtAssignment}
                        onCheckedChange={(checked) =>
                          setNotificationSettingsState({ ...notificationSettings, notifyOnCourtAssignment: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="notifyBeforeSessionEnd">Session Ending Soon</Label>
                        {notificationSettings.notifyBeforeSessionEnd && (
                          <Select
                            value={notificationSettings.minutesBeforeEnd}
                            onValueChange={(value) =>
                              setNotificationSettingsState({ ...notificationSettings, minutesBeforeEnd: value })
                            }
                          >
                            <SelectTrigger className="w-24 h-8">
                              <SelectValue placeholder="Minutes" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="5">5 minutes</SelectItem>
                              <SelectItem value="10">10 minutes</SelectItem>
                              <SelectItem value="15">15 minutes</SelectItem>
                              <SelectItem value="20">20 minutes</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                      <Switch
                        id="notifyBeforeSessionEnd"
                        checked={notificationSettings.notifyBeforeSessionEnd}
                        onCheckedChange={(checked) =>
                          setNotificationSettingsState({ ...notificationSettings, notifyBeforeSessionEnd: checked })
                        }
                      />
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div>
                  <h3 className="text-lg font-medium mb-4">Make.com Integration</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Configure integration with Make.com to export player data
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="enableDataExport">Enable Data Export</Label>
                        <p className="text-sm text-muted-foreground">Export player data to Make.com</p>
                      </div>
                      <Switch
                        id="enableDataExport"
                        checked={notificationSettings.enableDataExport}
                        onCheckedChange={(checked) =>
                          setNotificationSettingsState({ ...notificationSettings, enableDataExport: checked })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="makeComWebhookUrl">Make.com Webhook URL</Label>
                      <Input
                        id="makeComWebhookUrl"
                        value={notificationSettings.makeComWebhookUrl}
                        onChange={(e) =>
                          setNotificationSettingsState({ ...notificationSettings, makeComWebhookUrl: e.target.value })
                        }
                        placeholder="https://hook.make.com/..."
                        disabled={!notificationSettings.enableDataExport}
                      />
                      <p className="text-xs text-muted-foreground">
                        Enter your Make.com webhook URL to send player data to your scenarios
                      </p>
                    </div>

                    <div className="mt-4">
                      <Button
                        variant="outline"
                        onClick={handleTestMakeIntegration}
                        disabled={!notificationSettings.enableDataExport || !notificationSettings.makeComWebhookUrl}
                      >
                        Test Integration
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveNotificationSettings}>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Activity Log - New Tab */}
          <TabsContent value="activity" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Activity Log
                </CardTitle>
                <CardDescription>Recent system activity and events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { time: "10:45 AM", event: "Court 3 allocated to Group: Martinez, Silva, Johnson, Lee" },
                    { time: "10:32 AM", event: "Player check-in: Maria Silva" },
                    { time: "10:30 AM", event: "Player check-in: John Martinez" },
                    { time: "10:15 AM", event: "Court 5 session ended" },
                    { time: "09:45 AM", event: "System settings updated by Admin" },
                    { time: "09:30 AM", event: "Terminal sync completed successfully" },
                    { time: "09:15 AM", event: "Player registered: Benjamin Cohen" },
                    { time: "09:00 AM", event: "System startup" },
                    { time: "08:45 AM", event: "Database backup completed" },
                    { time: "Yesterday", event: "Court maintenance scheduled for Court 2" },
                    { time: "Yesterday", event: "Player status updated: Emma Wilson (inactive → active)" },
                    { time: "Yesterday", event: "New court added: Court 8" },
                    { time: "Yesterday", event: "Peak hours settings updated" },
                    { time: "2 days ago", event: "System update installed" },
                    { time: "2 days ago", event: "Terminal firmware updated to v2.3.1" },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-start pb-4 border-b last:border-0 last:pb-0">
                      <div className="w-24 flex-shrink-0 text-sm text-muted-foreground">{activity.time}</div>
                      <div>{activity.event}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Export Log</Button>
                <Button variant="outline">Clear Log</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
