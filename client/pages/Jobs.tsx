import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Users,
  MapPin,
  Calendar,
  Upload,
  Edit,
  Eye,
  Copy,
  Trash2,
  Share
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Jobs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const jobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      department: "Engineering",
      location: "San Francisco, CA",
      type: "Full-time",
      applicants: 45,
      status: "Active",
      priority: "High",
      posted: "2 days ago",
      salary: "$120k - $150k"
    },
    {
      id: 2,
      title: "Product Manager",
      department: "Product",
      location: "Remote",
      type: "Full-time",
      applicants: 32,
      status: "Active",
      priority: "Medium",
      posted: "5 days ago",
      salary: "$110k - $140k"
    },
    {
      id: 3,
      title: "UX Designer",
      department: "Design",
      location: "New York, NY",
      type: "Full-time",
      applicants: 28,
      status: "Draft",
      priority: "Low",
      posted: "1 week ago",
      salary: "$95k - $120k"
    },
    {
      id: 4,
      title: "Data Scientist",
      department: "Analytics",
      location: "Boston, MA",
      type: "Full-time",
      applicants: 19,
      status: "Active",
      priority: "High",
      posted: "3 days ago",
      salary: "$130k - $160k"
    },
    {
      id: 5,
      title: "Marketing Specialist",
      department: "Marketing",
      location: "Los Angeles, CA",
      type: "Part-time",
      applicants: 15,
      status: "Paused",
      priority: "Medium",
      posted: "1 week ago",
      salary: "$60k - $80k"
    },
    {
      id: 6,
      title: "DevOps Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      applicants: 22,
      status: "Active",
      priority: "High",
      posted: "4 days ago",
      salary: "$115k - $145k"
    }
  ];

  // Filter jobs based on search and filters
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment = departmentFilter === "all" || job.department.toLowerCase() === departmentFilter.toLowerCase();
    const matchesStatus = statusFilter === "all" || job.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Jobs</h1>
          <p className="text-slate-600 mt-1">Manage all your job postings and track their performance.</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Import CSV/JSON
          </Button>
          <Button size="sm" asChild>
            <Link to="/jobs/create">
              <Plus className="w-4 h-4 mr-2" />
              Create Job
            </Link>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search jobs by title, department, or location..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="product">Product</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="analytics">Analytics</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
          <Card key={job.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <Link to={`/jobs/${job.id}`}>
                    <CardTitle className="text-lg hover:text-blue-600 transition-colors">
                      {job.title}
                    </CardTitle>
                  </Link>
                  <div className="flex items-center mt-2 text-sm text-slate-600">
                    <span>{job.department}</span>
                    <span className="mx-2">•</span>
                    <span>{job.type}</span>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Job
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="w-4 h-4 mr-2" />
                      Duplicate Job
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Share className="w-4 h-4 mr-2" />
                      Share Job
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Job
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-slate-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  {job.location}
                </div>
                
                <div className="flex items-center text-sm text-slate-600">
                  <Users className="w-4 h-4 mr-2" />
                  {job.applicants} applicants
                </div>

                <div className="flex items-center text-sm text-slate-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  Posted {job.posted}
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <Badge 
                        variant={
                          job.status === "Active" ? "default" : 
                          job.status === "Draft" ? "secondary" : 
                          job.status === "Paused" ? "outline" : "destructive"
                        }
                      >
                        {job.status}
                      </Badge>
                      <Badge 
                        variant={
                          job.priority === "High" ? "destructive" : 
                          job.priority === "Medium" ? "default" : "secondary"
                        }
                      >
                        {job.priority}
                      </Badge>
                    </div>
                    <span className="text-sm font-medium text-slate-900">
                      {job.salary}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Briefcase className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No jobs found</h3>
            <p className="text-slate-600">Try adjusting your search or filters to find jobs.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" className="bg-blue-50 text-blue-600">
            1
          </Button>
          <Button variant="outline" size="sm">
            2
          </Button>
          <Button variant="outline" size="sm">
            3
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
