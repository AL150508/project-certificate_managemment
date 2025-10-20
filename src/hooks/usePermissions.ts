import { useRole } from "@/context/RoleContext"

export function usePermissions() {
  const { role } = useRole()

  return {
    // Admin can do everything
    canCreate: true,
    canRead: true,
    canUpdate: true,
    canDelete: role === "admin", // Only admin can delete
    
    // Specific permissions
    canDeleteCertificate: role === "admin",
    canDeleteTemplate: role === "admin",
    canDeleteMember: role === "admin",
    canDeleteCategory: role === "admin",
    
    // Role info
    isAdmin: role === "admin",
    isTeam: role === "team",
    isPublic: role === "public",
  }
}
