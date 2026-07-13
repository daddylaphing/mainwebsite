"use client";

import { useState } from "react";
import { Shield, ShieldOff, User } from "lucide-react";
import { createBrowserClient } from "@/lib/supabase/client";
import type { Profile } from "@/types";

interface UsersTableProps {
  users: Profile[];
}

export function UsersTable({ users: initialUsers }: UsersTableProps) {
  const [users, setUsers] = useState(initialUsers);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const handleToggleAdmin = async (userId: string, currentRole: string) => {
    if (!confirm(`Are you sure you want to ${currentRole === 'admin' ? 'demote this admin' : 'make this user an admin'}?`)) {
      return;
    }

    setIsUpdating(userId);
    const supabase = createBrowserClient();
    
    const newRole = currentRole === 'admin' ? 'customer' : 'admin';
    
    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", userId);

    if (!error) {
      setUsers(users.map(u => 
        u.id === userId ? { ...u, role: newRole } : u
      ));
    } else {
      alert("Error updating user role");
    }
    
    setIsUpdating(null);
  };

  return (
    <div className="bg-white border border-[#E6DFD5] rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#F7F3EC]/50 border-b border-[#E6DFD5]">
            <tr>
              <th className="text-left p-4 text-sm font-semibold text-[#1A1A1A]" style={{ fontFamily: "'Inter', sans-serif" }}>
                User
              </th>
              <th className="text-left p-4 text-sm font-semibold text-[#1A1A1A]" style={{ fontFamily: "'Inter', sans-serif" }}>
                Email
              </th>
              <th className="text-left p-4 text-sm font-semibold text-[#1A1A1A]" style={{ fontFamily: "'Inter', sans-serif" }}>
                Phone
              </th>
              <th className="text-left p-4 text-sm font-semibold text-[#1A1A1A]" style={{ fontFamily: "'Inter', sans-serif" }}>
                Role
              </th>
              <th className="text-left p-4 text-sm font-semibold text-[#1A1A1A]" style={{ fontFamily: "'Inter', sans-serif" }}>
                Joined
              </th>
              <th className="text-right p-4 text-sm font-semibold text-[#1A1A1A]" style={{ fontFamily: "'Inter', sans-serif" }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-[#E6DFD5]/40 hover:bg-[#F7F3EC]/30 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#6E1D25]/10 rounded-full flex items-center justify-center shrink-0">
                      <User className="h-5 w-5 text-[#6E1D25]" />
                    </div>
                    <div>
                      <div className="font-semibold text-[#1A1A1A] text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                        {user.full_name || 'No name'}
                      </div>
                      <div className="text-xs text-[#7A7570] font-medium">{user.id.slice(0, 8)}...</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-sm text-[#1A1A1A]">
                    {/* Email not in profiles table, would need to join with auth.users */}
                    -
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-sm text-[#1A1A1A]">
                    {user.phone || '-'}
                  </div>
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${
                    user.role === 'admin' 
                      ? 'bg-[#6E1D25]/10 text-[#6E1D25]' 
                      : user.role === 'wholesale'
                      ? 'bg-blue-500/10 text-blue-800'
                      : 'bg-[#F7F3EC] text-[#7A7570] border border-[#E6DFD5]'
                  }`}>
                    {user.role === 'admin' && <Shield className="h-3 w-3" />}
                    {user.role === 'customer' && <User className="h-3 w-3" />}
                    <span className="capitalize">{user.role}</span>
                  </span>
                </td>
                <td className="p-4">
                  <div className="text-sm text-[#7A7570]">
                    {new Date(user.created_at).toLocaleDateString()}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleToggleAdmin(user.id, user.role)}
                      disabled={isUpdating === user.id}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50 ${
                        user.role === 'admin'
                          ? 'bg-red-500/10 text-red-700 hover:bg-red-500/20'
                          : 'bg-[#6E1D25]/10 text-[#6E1D25] hover:bg-[#6E1D25]/20'
                      }`}
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {user.role === 'admin' ? (
                        <>
                          <ShieldOff className="h-3 w-3" />
                          Demote
                        </>
                      ) : (
                        <>
                          <Shield className="h-3 w-3" />
                          Make Admin
                        </>
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {users.length === 0 && (
        <div className="text-center py-12">
          <div className="text-[#7A7570] text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
            No users found.
          </div>
        </div>
      )}
    </div>
  );
}
