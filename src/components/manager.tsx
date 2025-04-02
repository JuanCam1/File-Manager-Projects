import { Code, FolderOpen, Laptop, Server, Smartphone } from "lucide-react"
import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Badge } from "./ui/badge"
import { Tabs, TabsList, TabsContent, TabsTrigger } from "./ui/tabs"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"

const projectsData = [
  {
    id: 1,
    name: "E-commerce Website",
    path: "/Users/dev/projects/ecommerce-site",
    type: "frontend",
    lastOpened: "2023-10-15",
    tech: ["React", "Next.js", "Tailwind CSS"],
  },
  {
    id: 2,
    name: "API Service",
    path: "/Users/dev/projects/api-service",
    type: "backend",
    lastOpened: "2023-10-12",
    tech: ["Node.js", "Express", "MongoDB"],
  },
  {
    id: 3,
    name: "Shopping App",
    path: "/Users/dev/projects/shopping-app",
    type: "mobile",
    lastOpened: "2023-10-10",
    tech: ["React Native", "Redux"],
  },
  {
    id: 4,
    name: "Admin Dashboard",
    path: "/Users/dev/projects/admin-dashboard",
    type: "frontend",
    lastOpened: "2023-10-08",
    tech: ["Vue.js", "Vuetify"],
  },
  {
    id: 5,
    name: "Authentication Service",
    path: "/Users/dev/projects/auth-service",
    type: "backend",
    lastOpened: "2023-10-05",
    tech: ["Python", "FastAPI", "PostgreSQL"],
  },
  {
    id: 6,
    name: "Delivery Tracker",
    path: "/Users/dev/projects/delivery-app",
    type: "mobile",
    lastOpened: "2023-10-01",
    tech: ["Flutter", "Firebase"],
  },
]

function Manager() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [viewMode, setViewMode] = useState("grid")

  // Filter projects based on search term and selected type
  const filteredProjects = projectsData.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === "all" || project.type === selectedType
    return matchesSearch && matchesType
  })

  // Function to open project in VSCode (this would need to be implemented with a backend service)
  const openInVSCode = (projectPath: string) => {
    console.log(`Opening project at ${projectPath} in VSCode`)
    // In a real app, you would make an API call to a local service or use Electron to open VSCode
    alert(`Opening project at ${projectPath} in VSCode`)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "frontend":
        return <Laptop className="w-4 h-4" />
      case "backend":
        return <Server className="w-4 h-4" />
      case "mobile":
        return <Smartphone className="w-4 h-4" />
      default:
        return <Code className="w-4 h-4" />
    }
  }

  return (
    <div className="flex bg-background h-screen">
      {/* Sidebar */}
      <div className="flex flex-col p-4 border-r w-64">
        <div className="flex items-center gap-2 mb-6">
          <FolderOpen className="w-6 h-6" />
          <h1 className="font-bold text-xl">Project Manager</h1>
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="mb-2 font-medium text-sm">Project Types</h2>
            <div className="space-y-1">
              <Button
                variant={selectedType === "all" ? "default" : "ghost"}
                className="justify-start w-full"
                onClick={() => setSelectedType("all")}
              >
                <Code className="mr-2 w-4 h-4" />
                All Projects
              </Button>
              <Button
                variant={selectedType === "frontend" ? "default" : "ghost"}
                className="justify-start w-full"
                onClick={() => setSelectedType("frontend")}
              >
                <Laptop className="mr-2 w-4 h-4" />
                Frontend
              </Button>
              <Button
                variant={selectedType === "backend" ? "default" : "ghost"}
                className="justify-start w-full"
                onClick={() => setSelectedType("backend")}
              >
                <Server className="mr-2 w-4 h-4" />
                Backend
              </Button>
              <Button
                variant={selectedType === "mobile" ? "default" : "ghost"}
                className="justify-start w-full"
                onClick={() => setSelectedType("mobile")}
              >
                <Smartphone className="mr-2 w-4 h-4" />
                Mobile
              </Button>
            </div>
          </div>

          <div>
            <h2 className="mb-2 font-medium text-sm">Recent Projects</h2>
            <div className="space-y-1">
              {projectsData.slice(0, 3).map((project) => (
                <Button
                  key={project.id}
                  variant="ghost"
                  className="justify-start w-full text-xs"
                  onClick={() => openInVSCode(project.path)}
                >
                  {getTypeIcon(project.type)}
                  <span className="ml-2 truncate">{project.name}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-bold text-2xl">
            {selectedType === "all"
              ? "All Projects"
              : selectedType === "frontend"
                ? "Frontend Projects"
                : selectedType === "backend"
                  ? "Backend Projects"
                  : "Mobile Projects"}
          </h1>

          <div className="flex items-center gap-4">
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />

            <Tabs value={viewMode} onValueChange={setViewMode} className="w-[200px]">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="grid">Grid</TabsTrigger>
                <TabsTrigger value="list">List</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-[400px] text-muted-foreground">
            <FolderOpen className="mb-4 w-16 h-16" />
            <h2 className="font-medium text-xl">No projects found</h2>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          <Tabs value={viewMode} className="w-full">
            <TabsContent value="grid" className="mt-0">
              <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {filteredProjects.map((project) => (
                  <Card key={project.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                        <Badge variant="outline" className="flex items-center gap-1">
                          {getTypeIcon(project.type)}
                          <span>{project.type}</span>
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-muted-foreground text-sm truncate">{project.path}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {project.tech.map((tech) => (
                          <Badge key={tech} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-2">
                      <p className="text-muted-foreground text-xs">Last opened: {project.lastOpened}</p>
                      <Button size="sm" onClick={() => openInVSCode(project.path)}>
                        Open in VSCode
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="list" className="mt-0">
              <div className="border rounded-md overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="p-3 font-medium text-left">Name</th>
                      <th className="p-3 font-medium text-left">Type</th>
                      <th className="hidden md:table-cell p-3 font-medium text-left">Path</th>
                      <th className="hidden lg:table-cell p-3 font-medium text-left">Technologies</th>
                      <th className="p-3 font-medium text-left">Last Opened</th>
                      <th className="p-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProjects.map((project) => (
                      <tr key={project.id} className="hover:bg-muted/50 border-t">
                        <td className="p-3 font-medium">{project.name}</td>
                        <td className="p-3">
                          <Badge variant="outline" className="flex items-center gap-1">
                            {getTypeIcon(project.type)}
                            <span>{project.type}</span>
                          </Badge>
                        </td>
                        <td className="hidden md:table-cell p-3 max-w-[200px] text-muted-foreground text-sm truncate">
                          {project.path}
                        </td>
                        <td className="hidden lg:table-cell p-3">
                          <div className="flex flex-wrap gap-1">
                            {project.tech.map((tech) => (
                              <Badge key={tech} variant="secondary" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </td>
                        <td className="p-3 text-muted-foreground text-sm">{project.lastOpened}</td>
                        <td className="p-3 text-right">
                          <Button size="sm" onClick={() => openInVSCode(project.path)}>
                            Open in VSCode
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}


export default Manager;