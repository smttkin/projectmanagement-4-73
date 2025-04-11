import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Mail, 
  Phone, 
  MoreHorizontal, 
  Search, 
  Filter, 
  UserRound,
  CheckCircle2,
  X,
  Database
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { teamMemberService } from '@/services/team/teamMemberService';
import { departmentService } from '@/services/team/departmentService';

// Mock team members data
const teamMembers = [
  {
    id: 1,
    name: 'Alex Johnson',
    role: 'Product Manager',
    email: 'alex@example.com',
    phone: '+1 (555) 123-4567',
    status: 'active',
    avatar: 'https://i.pravatar.cc/150?img=1',
    department: 'Product',
    projects: 4
  },
  {
    id: 2,
    name: 'Sarah Miller',
    role: 'UX Designer',
    email: 'sarah@example.com',
    phone: '+1 (555) 234-5678',
    status: 'active',
    avatar: 'https://i.pravatar.cc/150?img=5',
    department: 'Design',
    projects: 3
  },
  {
    id: 3,
    name: 'Michael Chen',
    role: 'Frontend Developer',
    email: 'michael@example.com',
    phone: '+1 (555) 345-6789',
    status: 'away',
    avatar: 'https://i.pravatar.cc/150?img=8',
    department: 'Engineering',
    projects: 5
  },
  {
    id: 4,
    name: 'Jessica Taylor',
    role: 'Backend Developer',
    email: 'jessica@example.com',
    phone: '+1 (555) 456-7890',
    status: 'active',
    avatar: 'https://i.pravatar.cc/150?img=9',
    department: 'Engineering',
    projects: 2
  },
  {
    id: 5,
    name: 'David Wilson',
    role: 'QA Engineer',
    email: 'david@example.com',
    phone: '+1 (555) 567-8901',
    status: 'offline',
    avatar: 'https://i.pravatar.cc/150?img=12',
    department: 'Quality Assurance',
    projects: 6
  },
];

// Mock department summary
const departmentSummary = [
  { name: 'Engineering', count: 12, color: 'bg-blue-500' },
  { name: 'Design', count: 5, color: 'bg-purple-500' },
  { name: 'Product', count: 3, color: 'bg-green-500' },
  { name: 'Marketing', count: 4, color: 'bg-yellow-500' },
  { name: 'Quality Assurance', count: 2, color: 'bg-red-500' },
];

const Team = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMembers, setFilteredMembers] = useState(teamMembers);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    role: '',
    department: 'Engineering'
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (!query) {
      setFilteredMembers(teamMembers);
      return;
    }
    
    const filtered = teamMembers.filter(
      member => 
        member.name.toLowerCase().includes(query) ||
        member.role.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query) ||
        member.department.toLowerCase().includes(query)
    );
    
    setFilteredMembers(filtered);
  };

  const handleAddMember = () => {
    // Validate form fields
    if (!newMember.name || !newMember.email || !newMember.role) {
      toast.error("Please fill all required fields");
      return;
    }

    // In a real app, this would make an API call to add the member to the database
    toast.success(`${newMember.name} has been added to the team`);
    setIsAddMemberModalOpen(false);
    
    // Reset form
    setNewMember({
      name: '',
      email: '',
      role: '',
      department: 'Engineering'
    });
  };

  const handleViewProfile = (memberId: number) => {
    // In a real app, this would navigate to the member's profile page
    toast.info("Viewing team member profile");
    navigate('/profile', { state: { memberId } });
  };

  const handleSendEmail = (email: string) => {
    toast.info(`Composing email to ${email}`);
    // In a real app, this might open a mail client or an in-app composer
    window.open(`mailto:${email}`);
  };

  const handleCall = (phone: string) => {
    toast.info(`Calling ${phone}`);
    // In a real app, this might trigger a call through a web interface or open a phone app
    window.open(`tel:${phone}`);
  };
  
  const navigateToDbSchema = () => {
    navigate('/database-schema');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto py-6 px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Team</h1>
            <p className="text-muted-foreground mt-1">Manage your team members and their access</p>
          </div>
          <div className="flex mt-4 md:mt-0 gap-2">
            <Button variant="outline" onClick={navigateToDbSchema}>
              <Database className="mr-2 h-4 w-4" />
              DB Schema
            </Button>
            <Button onClick={() => setIsAddMemberModalOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Team Member
            </Button>
          </div>
        </div>
        
        {/* Department summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {departmentSummary.map((dept) => (
            <Card key={dept.name} className="border shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{dept.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="font-bold text-2xl">{dept.count}</div>
                  <div className={`w-3 h-3 rounded-full ${dept.color}`}></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Team members</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Team members table with search */}
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>
              A list of all team members including their role, status, and contact information.
            </CardDescription>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search team members..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
              <Button variant="outline" className="sm:w-auto w-full">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Projects</TableHead>
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-xs text-muted-foreground">{member.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{member.role}</TableCell>
                    <TableCell>{member.department}</TableCell>
                    <TableCell>
                      <Badge variant={
                        member.status === 'active' ? 'default' : 
                        member.status === 'away' ? 'outline' : 'secondary'
                      } className="capitalize">
                        {member.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{member.projects}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">More</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewProfile(member.id)}>
                            <UserRound className="mr-2 h-4 w-4" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSendEmail(member.email)}>
                            <Mail className="mr-2 h-4 w-4" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCall(member.phone)}>
                            <Phone className="mr-2 h-4 w-4" />
                            Call
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>

      {/* Add Team Member Modal */}
      <Dialog open={isAddMemberModalOpen} onOpenChange={setIsAddMemberModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription>
              Add a new member to your team. They will receive an email invitation.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newMember.name}
                onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={newMember.email}
                onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Input
                id="role"
                value={newMember.role}
                onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="department" className="text-right">
                Department
              </Label>
              <select 
                id="department"
                value={newMember.department}
                onChange={(e) => setNewMember({...newMember, department: e.target.value})}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {departmentSummary.map((dept) => (
                  <option key={dept.name} value={dept.name}>{dept.name}</option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" onClick={handleAddMember}>Add Member</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Team;
