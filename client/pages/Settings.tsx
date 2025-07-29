import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Mail,
  Bell,
  Shield,
  Database,
  Palette,
  Globe,
  Key,
  Users,
  Building,
  CreditCard,
  Download,
  Upload,
  Trash2,
  Plus,
  Settings as SettingsIcon,
  Moon,
  Sun,
  Monitor,
} from "lucide-react";
import { useLanguage, SUPPORTED_LANGUAGES } from "@/hooks/use-language";

export default function Settings() {
  const { t, currentLanguage, setLanguage, getCurrentLanguageInfo } =
    useLanguage();

  const integrations = [
    {
      name: "Google Calendar",
      status: "connected",
      description: "Sync interviews and meetings",
      icon: "📅",
    },
    {
      name: "Slack",
      status: "connected",
      description: "Team notifications and updates",
      icon: "💬",
    },
    {
      name: "Zoom",
      status: "connected",
      description: "Video interview integration",
      icon: "📹",
    },
    {
      name: "LinkedIn",
      status: "disconnected",
      description: "Import candidate profiles",
      icon: "💼",
    },
    {
      name: "GitHub",
      status: "disconnected",
      description: "Technical assessment integration",
      icon: "🔧",
    },
    {
      name: "Microsoft Teams",
      status: "disconnected",
      description: "Alternative video meeting platform",
      icon: "👥",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {t("settings.title")}
          </h1>
          <p className="text-slate-600 mt-1">{t("settings.subtitle")}</p>
        </div>
        <div className="flex space-x-3">
          {/* <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            {t("settings.exportSettings")}
          </Button> */}
          {/* <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            {t("settings.importSettings")}
          </Button> */}
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">{t("settings.profile")}</TabsTrigger>
          {/* <TabsTrigger value="notifications">
            {t("settings.notifications")}
          </TabsTrigger> */}
          <TabsTrigger value="appearance">
            {t("settings.appearance")}
          </TabsTrigger>
          <TabsTrigger value="security">{t("settings.security")}</TabsTrigger>
          {/* <TabsTrigger value="integrations">
            {t("settings.integrations")}
          </TabsTrigger> */}
          <TabsTrigger value="organization">
            {t("settings.organization")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src="" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button size="sm">Change Photo</Button>
                    <Button variant="outline" size="sm">
                      Remove
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>First Name</Label>
                    <Input defaultValue="John" className="mt-1" />
                  </div>
                  <div>
                    <Label>Last Name</Label>
                    <Input defaultValue="Doe" className="mt-1" />
                  </div>
                </div>
                <div>
                  <Label>Email Address</Label>
                  <Input defaultValue="john.doe@company.com" className="mt-1" />
                </div>
                <div>
                  <Label>Phone Number</Label>
                  <Input defaultValue="+1 (555) 123-4567" className="mt-1" />
                </div>
                <div>
                  <Label>Job Title</Label>
                  <Input defaultValue="HR Manager" className="mt-1" />
                </div>
                <div>
                  <Label>Department</Label>
                  <Select defaultValue="hr">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hr">Human Resources</SelectItem>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="product">Product</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button>Save Changes</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>{t("settings.language")}</Label>
                  <Select value={currentLanguage} onValueChange={setLanguage}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SUPPORTED_LANGUAGES.map((language) => (
                        <SelectItem key={language.code} value={language.code}>
                          <div className="flex items-center space-x-2">
                            <span>{language.flag}</span>
                            <span>{language.nativeName}</span>
                            <span className="text-sm text-muted-foreground">
                              ({language.name})
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Timezone</Label>
                  <Select defaultValue="pst">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pst">Pacific Standard Time</SelectItem>
                      <SelectItem value="est">Eastern Standard Time</SelectItem>
                      <SelectItem value="cst">Central Standard Time</SelectItem>
                      <SelectItem value="mst">
                        Mountain Standard Time
                      </SelectItem>
                      <SelectItem value="utc">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Date Format</Label>
                  <Select defaultValue="mm-dd-yyyy">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mm-dd-yyyy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="dd-mm-yyyy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Currency</Label>
                  <Select defaultValue="usd">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD ($)</SelectItem>
                      <SelectItem value="eur">EUR (€)</SelectItem>
                      <SelectItem value="gbp">GBP (£)</SelectItem>
                      <SelectItem value="jpy">JPY (¥)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-save drafts</Label>
                    <p className="text-sm text-slate-600">
                      Automatically save form drafts
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Button>Save Preferences</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium text-slate-900">
                  Email Notifications
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>New Applications</Label>
                      <p className="text-sm text-slate-600">
                        Get notified when candidates apply
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Interview Reminders</Label>
                      <p className="text-sm text-slate-600">
                        Reminders 24 hours before interviews
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Status Updates</Label>
                      <p className="text-sm text-slate-600">
                        When candidate status changes
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Weekly Reports</Label>
                      <p className="text-sm text-slate-600">
                        Summary of recruitment activities
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-slate-900">
                  Push Notifications
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Urgent Updates</Label>
                      <p className="text-sm text-slate-600">
                        Critical system alerts and updates
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Calendar Events</Label>
                      <p className="text-sm text-slate-600">
                        Upcoming interviews and meetings
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Team Messages</Label>
                      <p className="text-sm text-slate-600">
                        Messages from team members
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-slate-900">
                  Notification Frequency
                </h3>
                <div>
                  <Label>Email Digest</Label>
                  <Select defaultValue="daily">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realtime">Real-time</SelectItem>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="w-5 h-5 mr-2" />
                Appearance & Theme
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium text-slate-900">Theme</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4 cursor-pointer hover:border-blue-500">
                    <div className="flex items-center space-x-2 mb-2">
                      <Sun className="w-4 h-4" />
                      <span className="font-medium">Light</span>
                    </div>
                    <div className="w-full h-16 bg-white border rounded"></div>
                  </div>
                  <div className="border rounded-lg p-4 cursor-pointer hover:border-blue-500 border-blue-500 bg-blue-50">
                    <div className="flex items-center space-x-2 mb-2">
                      <Moon className="w-4 h-4" />
                      <span className="font-medium">Dark</span>
                    </div>
                    <div className="w-full h-16 bg-slate-900 border rounded"></div>
                  </div>
                  <div className="border rounded-lg p-4 cursor-pointer hover:border-blue-500">
                    <div className="flex items-center space-x-2 mb-2">
                      <Monitor className="w-4 h-4" />
                      <span className="font-medium">System</span>
                    </div>
                    <div className="w-full h-16 bg-gradient-to-r from-white to-slate-900 border rounded"></div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-slate-900">Layout</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Compact Mode</Label>
                    <p className="text-sm text-slate-600">
                      Reduce spacing for more content
                    </p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Show Sidebar</Label>
                    <p className="text-sm text-slate-600">
                      Always show navigation sidebar
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-slate-900">Font Settings</h3>
                <div>
                  <Label>Font Size</Label>
                  <Select defaultValue="medium">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Current Password</Label>
                  <Input type="password" className="mt-1" />
                </div>
                <div>
                  <Label>New Password</Label>
                  <Input type="password" className="mt-1" />
                </div>
                <div>
                  <Label>Confirm New Password</Label>
                  <Input type="password" className="mt-1" />
                </div>
                <Button>Update Password</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Key className="w-5 h-5 mr-2" />
                  Two-Factor Authentication
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>2FA Status</Label>
                    <p className="text-sm text-slate-600">
                      Enhance account security
                    </p>
                  </div>
                  <Badge variant="outline" className="text-red-600">
                    Disabled
                  </Badge>
                </div>
                <Button>Enable 2FA</Button>
                <div className="space-y-2">
                  <Label>Active Sessions</Label>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 border rounded">
                      <div>
                        <p className="font-medium">Current Session</p>
                        <p className="text-sm text-slate-600">
                          Chrome on macOS
                        </p>
                      </div>
                      <Badge variant="outline" className="text-green-600">
                        Active
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="w-5 h-5 mr-2" />
                Third-Party Integrations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {integrations.map((integration) => (
                  <div key={integration.name} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{integration.icon}</span>
                        <div>
                          <h3 className="font-medium text-slate-900">
                            {integration.name}
                          </h3>
                          <p className="text-sm text-slate-600">
                            {integration.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={
                            integration.status === "connected"
                              ? "default"
                              : "outline"
                          }
                        >
                          {integration.status}
                        </Badge>
                        <Button
                          size="sm"
                          variant={
                            integration.status === "connected"
                              ? "outline"
                              : "default"
                          }
                        >
                          {integration.status === "connected"
                            ? "Disconnect"
                            : "Connect"}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="organization" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="w-5 h-5 mr-2" />
                  Organization Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Company Name</Label>
                  <Input defaultValue="TalentFlow Inc." className="mt-1" />
                </div>
                <div>
                  <Label>Company Website</Label>
                  <Input
                    defaultValue="https://talentflow.com"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Company Size</Label>
                  <Select defaultValue="50-200">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10 employees</SelectItem>
                      <SelectItem value="11-50">11-50 employees</SelectItem>
                      <SelectItem value="50-200">50-200 employees</SelectItem>
                      <SelectItem value="200-1000">
                        200-1000 employees
                      </SelectItem>
                      <SelectItem value="1000+">1000+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Industry</Label>
                  <Select defaultValue="technology">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button>Save Organization Settings</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Team Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <Label>Team Members</Label>
                    <p className="text-sm text-slate-600">
                      Manage user access and permissions
                    </p>
                  </div>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Invite Member
                  </Button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">John Doe</p>
                        <p className="text-sm text-slate-600">Admin</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <SettingsIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
