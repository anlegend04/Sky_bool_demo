import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowLeft,
  Upload,
  Download,
  Plus,
  X,
  FileText,
  Save,
  Eye,
  Send,
  GripVertical,
  Trash,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";

export default function JobCreate() {
  const [skills, setSkills] = useState<string[]>([]);
  const [benefits, setBenefits] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [newBenefit, setNewBenefit] = useState("");
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [recruitmentStages, setRecruitmentStages] = useState([
    { id: "1", name: "Applied", duration: "" },
    { id: "2", name: "Screening", duration: "" },
    { id: "3", name: "Interview", duration: "" },
    { id: "4", name: "Offer", duration: "" },
    { id: "5", name: "Hired", duration: "" },
  ]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (active.id !== over?.id) {
      setRecruitmentStages((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);
        
        const newItems = [...items];
        const [movedItem] = newItems.splice(oldIndex, 1);
        newItems.splice(newIndex, 0, movedItem);
        return newItems;
      });
    }
  };

  const updateStage = (index: number, field: string, value: string) => {
    setRecruitmentStages((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addStage = () => {
    setRecruitmentStages((prev) => [
      ...prev,
      { id: Date.now().toString(), name: "", duration: "" },
    ]);
  };

  const removeStage = (index: number) => {
    setRecruitmentStages((prev) => prev.filter((_, i) => i !== index));
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const addBenefit = () => {
    if (newBenefit.trim() && !benefits.includes(newBenefit.trim())) {
      setBenefits([...benefits, newBenefit.trim()]);
      setNewBenefit("");
    }
  };

  const removeBenefit = (benefit: string) => {
    setBenefits(benefits.filter((b) => b !== benefit));
  };

  const predefinedSkills = [
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "Python",
    "Java",
    "AWS",
    "Docker",
    "Kubernetes",
    "SQL",
    "MongoDB",
    "GraphQL",
    "REST APIs",
    "Git",
    "Agile",
    "Scrum",
    "Product Management",
    "UX Design",
    "Figma",
    "Adobe Creative Suite",
  ];

  const predefinedBenefits = [
    "Health Insurance",
    "Dental Insurance",
    "Vision Insurance",
    "401(k) Matching",
    "Unlimited PTO",
    "Flexible Work Hours",
    "Remote Work",
    "Professional Development Budget",
    "Gym Membership",
    "Wellness Programs",
    "Stock Options",
    "Commuter Benefits",
    "Free Meals",
    "Coffee and Snacks",
    "Parental Leave",
    "Life Insurance",
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/jobs">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Jobs
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Create New Job
            </h1>
            <p className="text-slate-600 mt-1">
              Fill in the details below to create a new job posting.
            </p>
          </div>
        </div>
        {/* <div className="flex space-x-3">
          <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Import from File
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Import Job Details</DialogTitle>
                <DialogDescription>
                  Upload a CSV or JSON file to import job information.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-600 mb-2">
                    Drop your file here or click to browse
                  </p>
                  <Button variant="outline" size="sm">
                    Choose File
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Download Template
                  </Button>
                  <Button size="sm" className="flex-1">
                    Import
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div> */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="details">Job Details</TabsTrigger>
              <TabsTrigger value="requirements">Requirements</TabsTrigger>
              <TabsTrigger value="benefits">Benefits</TabsTrigger>
              <TabsTrigger value="stages">Recruitment Stages</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Job Title *</Label>
                      <Input
                        id="title"
                        placeholder="e.g. Senior Frontend Developer"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="department">Department *</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="engineering">
                            Engineering
                          </SelectItem>
                          <SelectItem value="product">Product</SelectItem>
                          <SelectItem value="design">Design</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="sales">Sales</SelectItem>
                          <SelectItem value="operations">Operations</SelectItem>
                          <SelectItem value="hr">Human Resources</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="type">Employment Type *</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full-time">Full-time</SelectItem>
                          <SelectItem value="part-time">Part-time</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem>
                          <SelectItem value="freelance">Freelance</SelectItem>
                          <SelectItem value="internship">Internship</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="level">Experience Level *</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="entry">
                            Entry Level (0-2 years)
                          </SelectItem>
                          <SelectItem value="mid">
                            Mid Level (3-5 years)
                          </SelectItem>
                          <SelectItem value="senior">
                            Senior Level (5-8 years)
                          </SelectItem>
                          <SelectItem value="lead">
                            Lead/Principal (8+ years)
                          </SelectItem>
                          <SelectItem value="executive">Executive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="location">Location *</Label>
                      <Input
                        id="location"
                        placeholder="e.g. San Francisco, CA or Remote"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="salary-min">Salary Range</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Input
                          id="salary-min"
                          placeholder="Min (e.g. 80000)"
                          type="number"
                        />
                        <span className="text-slate-500">to</span>
                        <Input placeholder="Max (e.g. 120000)" type="number" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="openings">Number of Openings</Label>
                      <Input
                        id="openings"
                        placeholder="e.g. 2"
                        type="number"
                        min="1"
                        defaultValue="1"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Job Description</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="summary">Job Summary *</Label>
                    <Textarea
                      id="summary"
                      placeholder="Brief overview of the role and its importance to the company..."
                      className="mt-1 min-h-[100px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Detailed Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Detailed description of the role, responsibilities, and what the candidate will be working on..."
                      className="mt-1 min-h-[200px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="responsibilities">
                      Key Responsibilities
                    </Label>
                    <Textarea
                      id="responsibilities"
                      placeholder="• Develop and maintain web applications&#10;• Collaborate with cross-functional teams&#10;• Write clean, maintainable code..."
                      className="mt-1 min-h-[150px]"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="requirements" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Requirements & Skills</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="education">Education Requirements</Label>
                    <Select>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select education level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high-school">High School</SelectItem>
                        <SelectItem value="associate">
                          Associate Degree
                        </SelectItem>
                        <SelectItem value="bachelor">
                          Bachelor's Degree
                        </SelectItem>
                        <SelectItem value="master">Master's Degree</SelectItem>
                        <SelectItem value="phd">PhD</SelectItem>
                        <SelectItem value="bootcamp">
                          Bootcamp/Certification
                        </SelectItem>
                        <SelectItem value="none">
                          No formal requirement
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Required Skills</Label>
                    <div className="mt-2 space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill) => (
                          <Badge
                            key={skill}
                            variant="default"
                            className="flex items-center gap-1"
                          >
                            {skill}
                            <X
                              className="w-3 h-3 cursor-pointer hover:text-red-500"
                              onClick={() => removeSkill(skill)}
                            />
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a skill (e.g. React, JavaScript)"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && addSkill()}
                        />
                        <Button type="button" onClick={addSkill} size="sm">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <p className="text-sm text-slate-600 w-full">
                          Quick add:
                        </p>
                        {predefinedSkills.map((skill) => (
                          <Badge
                            key={skill}
                            variant="outline"
                            className="cursor-pointer hover:bg-slate-100"
                            onClick={() =>
                              !skills.includes(skill) &&
                              setSkills([...skills, skill])
                            }
                          >
                            + {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="qualifications">
                      Additional Qualifications
                    </Label>
                    <Textarea
                      id="qualifications"
                      placeholder="• 5+ years of experience in React development&#10;• Experience with cloud platforms (AWS, GCP)&#10;• Strong problem-solving skills..."
                      className="mt-1 min-h-[120px]"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="benefits" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Benefits & Perks</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Company Benefits</Label>
                    <div className="mt-2 space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {benefits.map((benefit) => (
                          <Badge
                            key={benefit}
                            variant="default"
                            className="flex items-center gap-1"
                          >
                            {benefit}
                            <X
                              className="w-3 h-3 cursor-pointer hover:text-red-500"
                              onClick={() => removeBenefit(benefit)}
                            />
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a benefit (e.g. Health Insurance)"
                          value={newBenefit}
                          onChange={(e) => setNewBenefit(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && addBenefit()}
                        />
                        <Button type="button" onClick={addBenefit} size="sm">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <p className="text-sm text-slate-600 w-full">
                          Quick add:
                        </p>
                        {predefinedBenefits.map((benefit) => (
                          <Badge
                            key={benefit}
                            variant="outline"
                            className="cursor-pointer hover:bg-slate-100"
                            onClick={() =>
                              !benefits.includes(benefit) &&
                              setBenefits([...benefits, benefit])
                            }
                          >
                            + {benefit}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="additional-benefits">
                      Additional Benefits Description
                    </Label>
                    <Textarea
                      id="additional-benefits"
                      placeholder="Describe any additional perks, company culture benefits, or unique offerings..."
                      className="mt-1 min-h-[100px]"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stages" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recruitment Stages</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-slate-600">
                    Define the stages that candidates will go through during the recruitment process. 
                    You can drag and drop to reorder stages.
                  </p>
                  
                  <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <div className="space-y-2">
                      {recruitmentStages.map((stage, index) => (
                        <div
                          key={stage.id}
                          className="flex items-center gap-2 p-3 border border-slate-200 rounded-lg bg-slate-50"
                        >
                          <GripVertical className="w-4 h-4 text-slate-400 cursor-move" />
                          <Input
                            value={stage.name}
                            onChange={(e) => updateStage(index, "name", e.target.value)}
                            placeholder="Stage name"
                            className="flex-1"
                          />
                          <Input
                            type="number"
                            value={stage.duration}
                            onChange={(e) => updateStage(index, "duration", e.target.value)}
                            placeholder="Duration (days)"
                            className="w-32"
                          />
                          {!["Applied", "Screening", "Interview", "Offer", "Hired"].includes(stage.name) && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeStage(index)}
                              className="text-red-500"
                            >
                              <Trash className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </DndContext>
                  
                  <Button variant="outline" onClick={addStage} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Stage
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Publishing Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="status">Job Status</Label>
                <Select defaultValue="draft">
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Application Deadline</Label>
                <Input type="date" className="mt-1" />
              </div>

              <div className="space-y-2">
                <Label>Application Settings</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="auto-response" />
                    <Label htmlFor="auto-response" className="text-sm">
                      Send auto-response to applicants
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="screening" />
                    <Label htmlFor="screening" className="text-sm">
                      Require screening questions
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="cover-letter" />
                    <Label htmlFor="cover-letter" className="text-sm">
                      Require cover letter
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Save as Draft
              </Button>
              <Button variant="outline" className="w-full">
                <Eye className="w-4 h-4 mr-2" />
                Preview Job
              </Button>
              <Button
                variant="default"
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <Send className="w-4 h-4 mr-2" />
                Publish Job
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Job Posting Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-slate-600 space-y-2">
                <p>• Write clear, specific job titles</p>
                <p>• Include salary range for better applications</p>
                <p>• Be specific about required vs nice-to-have skills</p>
                <p>• Highlight company culture and benefits</p>
                <p>• Use inclusive language</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
